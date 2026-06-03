import {
  alumniDisplayName,
  alumniYearLabel,
  fetchAlumniFromAirtableDetailed,
} from '@/lib/airtable/alumni-service'
import { enrichAlumniWithDirectoryArtists } from '@/lib/organization/artist-alumni-bridge'
import { fetchDirectoryArtistsForOrgSlug } from '@/lib/organization/fetch-directory-artists'
import { isStaffOperatorMode } from '@/lib/memory-agent/mode'
import {
  type ArtistParticipation,
  buildRecognitionContextBlock,
  fetchOoliteRecognitionBundle,
  isOoliteRecognitionConfigured,
  rankRecognitionsForQuestion,
  summarizeRecognitionCounts,
  type RecognitionEvent,
} from '@/lib/oolite/airtable-recognitions'
import { alumniGalleryImageUrls, alumniImageForContext } from '@/lib/airtable/alumni-images'
import { badgesFromAlumniRow } from '@/lib/institutional-artist/card-model'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import { filterRowsForMemoryAgent, redactRowForPublicDisplay } from '@/lib/memory-agent/governance'
import {
  detectMemoryIntent,
  intentNeedsPeople,
  intentNeedsProgramming,
  intentNeedsRecognition,
  isActiveResidentsQuestion,
} from '@/lib/memory-agent/intent'
import { buildEmbeddingInputForKnowledgeRecord } from '@/lib/memory-agent/knowledge-retrieve'
import { chatJsonCompletion, embedTexts, getOpenAIClient } from '@/lib/memory-agent/openai-client'
import { attachSignageForAsk, parseTripleOutputs, toClientOutputs } from '@/lib/memory-agent/outputs'
import { buildMemoryAgentContextInspector } from '@/lib/memory-agent/context-inspector'
import { memoryAgentSystemPrompt, MEMORY_AGENT_JSON_INSTRUCTION } from '@/lib/memory-agent/prompts'
import {
  mergeEventCardsFromContext,
  parseModelEventsFromAskJson,
} from '@/lib/memory-agent/event-cards'
import {
  applyIntentTimeFilter,
  applyBookableQuestionFilter,
  buildProgrammingContextBlock,
  fetchProgrammingForMemoryAgent,
  rankProgrammingForQuestion,
  selectProgrammingContextRows,
  WEEK_UPCOMING_FALLBACK_ANSWER_PREFIX,
  WEEK_UPCOMING_FALLBACK_DATA_GAP,
  type IntentTimeFilterMeta,
} from '@/lib/memory-agent/programming'
import {
  buildEmbeddingInput,
  buildRetrievedContextBlock,
  rankAlumniForQuestion,
  selectContextRows,
} from '@/lib/memory-agent/retrieve'
import type {
  MemoryAgentAskError,
  MemoryAgentAskResult,
  MemoryAgentContextInspector,
  MemoryAgentMode,
  MemoryAgentTripleOutputs,
} from '@/types/memory-agent'
import {
  buildStructuredDataGaps,
  toClientStructuredDataGaps,
} from '@/lib/memory-agent/data-gap-actions'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import {
  isSohoDemoOrg,
  sohoDemoDomainPrimer,
} from '@/lib/sohohouse/demo-knowledge-records'
import { sohoHouseDomainPrimer } from '@/lib/sohohouse/knowledge-domain'

type ParsedAskJson = {
  answer: string
  artists: MemoryAgentAskResult['artists']
  events: MemoryAgentAskResult['events']
  followUps: string[]
  dataGaps: string[]
  outputs?: MemoryAgentTripleOutputs
  signageDraftRaw: unknown
}

function parseAskJson(raw: string): ParsedAskJson | null {
  try {
    const o = JSON.parse(raw) as Record<string, unknown>
    const answer = typeof o.answer === 'string' ? o.answer : ''
    const followUps = Array.isArray(o.followUps)
      ? o.followUps.filter((x): x is string => typeof x === 'string')
      : []
    const dataGaps = Array.isArray(o.dataGaps)
      ? o.dataGaps.filter((x): x is string => typeof x === 'string')
      : []
    const artistsRaw = Array.isArray(o.artists) ? o.artists : []
    const artists = artistsRaw
      .map((a) => {
        if (!a || typeof a !== 'object') return null
        const r = a as Record<string, unknown>
        const id = typeof r.id === 'string' ? r.id : ''
        const name = typeof r.name === 'string' ? r.name : ''
        if (!id || !name) return null
        const confidence =
          r.confidence === 'high' || r.confidence === 'medium' || r.confidence === 'low'
            ? r.confidence
            : 'medium'
        return {
          id,
          name,
          discipline: typeof r.discipline === 'string' ? r.discipline : undefined,
          programYear: typeof r.programYear === 'string' ? r.programYear : undefined,
          reason: typeof r.reason === 'string' ? r.reason : '',
          confidence,
          website: typeof r.website === 'string' ? r.website : undefined,
        }
      })
      .filter(Boolean) as MemoryAgentAskResult['artists']
    const events = parseModelEventsFromAskJson(o.events)
    const outputs = parseTripleOutputs(o.outputs)
    const signageDraftRaw = 'signageDraft' in o ? o.signageDraft : undefined
    return {
      answer,
      artists,
      events,
      followUps,
      dataGaps,
      ...(outputs ? { outputs } : {}),
      signageDraftRaw,
    }
  } catch {
    return null
  }
}

export async function runMemoryAgentAsk(params: {
  orgSlug: string
  question: string
  mode: MemoryAgentMode
}): Promise<{ ok: true; data: MemoryAgentAskResult } | MemoryAgentAskError> {
  const { orgSlug, question, mode } = params
  const q = question.trim()
  if (!q) {
    return { ok: false, code: 'openai_error', message: 'Empty question' }
  }

  const intent = detectMemoryIntent(q)
  const needsPeople = intentNeedsPeople(intent)
  const needsProgramming = intentNeedsProgramming(intent)
  const needsRecognition = intentNeedsRecognition(intent)
  const sohoDemo = isSohoDemoOrg(orgSlug)

  const conn = getAlumniConnectionForOrg(orgSlug)
  if (needsPeople && !conn && !sohoDemo) {
    return { ok: false, code: 'not_configured', message: 'Alumni Airtable is not configured for this organization.' }
  }

  const openai = getOpenAIClient()
  if (!openai) {
    return { ok: false, code: 'openai_missing', message: 'OPENAI_API_KEY is not set.' }
  }

  const branding = getMemoryAgentBranding(orgSlug)

  let eligible: Awaited<ReturnType<typeof filterRowsForMemoryAgent>> = []
  let allAlumniRows: Awaited<ReturnType<typeof filterRowsForMemoryAgent>> = []
  let baseTotalCount = 0
  let contextRows: Awaited<ReturnType<typeof selectContextRows>> = []
  let ranked: ReturnType<typeof rankAlumniForQuestion> = []

  if (needsPeople && conn && !sohoDemo) {
    const fetched = await fetchAlumniFromAirtableDetailed(orgSlug)
    if (!fetched.ok) {
      if (fetched.reason === 'not_configured') {
        return { ok: false, code: 'not_configured', message: 'Alumni Airtable is not configured for this organization.' }
      }
      return {
        ok: false,
        code: 'airtable_error',
        message: fetched.message || 'Failed to load alumni from Airtable.',
      }
    }
    baseTotalCount = fetched.alumni.length
    const directoryArtists = await fetchDirectoryArtistsForOrgSlug(orgSlug)
    const enrichedAlumni = enrichAlumniWithDirectoryArtists(
      fetched.alumni,
      directoryArtists,
      orgSlug
    )
    allAlumniRows = enrichedAlumni
    eligible = filterRowsForMemoryAgent(enrichedAlumni, mode, conn.fieldMap)
    if (isActiveResidentsQuestion(q)) {
      eligible = eligible.filter((row) => {
        const program = (row.program || '').toLowerCase()
        const cohort = (row.cohort || '').toLowerCase()
        const year = (row.residencyYear || row.year || '').trim()
        const status = (row.currentAlumniStatus || '').toLowerCase()
        const is2026 =
          year === '2026' ||
          cohort.includes('2026') ||
          program.includes('2026') ||
          program.includes('studio resident')
        const active =
          !status ||
          status.includes('current') ||
          status.includes('active') ||
          status.includes('resident')
        return is2026 && active
      })
    }
  }

  let programmingPool: Awaited<ReturnType<typeof fetchProgrammingForMemoryAgent>> | null = null
  let programmingContextRows: ReturnType<typeof selectProgrammingContextRows> = []
  let programmingRanked: ReturnType<typeof rankProgrammingForQuestion> = []
  let programmingTimeMeta: IntentTimeFilterMeta = {
    weekOverlap: false,
    usedUpcomingFallback: false,
  }

  if (needsProgramming) {
    programmingPool = await fetchProgrammingForMemoryAgent(orgSlug, { mode })
    if (!programmingPool.ok) {
      if (!needsPeople) {
        return {
          ok: false,
          code: programmingPool.reason === 'not_configured' ? 'not_configured' : 'openai_error',
          message:
            programmingPool.message ||
            'Programming data (Supabase announcements/workshops) is not available.',
        }
      }
    } else {
      const timeFiltered = applyIntentTimeFilter(programmingPool.records, intent)
      programmingTimeMeta = timeFiltered.meta
      let records = timeFiltered.records
      records = applyBookableQuestionFilter(records, q)
      programmingPool = { ...programmingPool, records }
    }
  }

  let recognitionContextEvents: RecognitionEvent[] = []
  let recognitionParticipations: ArtistParticipation[] = []

  if (needsRecognition && isOoliteRecognitionConfigured(orgSlug)) {
    const recognitionFetched = await fetchOoliteRecognitionBundle(mode)
    if (recognitionFetched.ok) {
      recognitionContextEvents = rankRecognitionsForQuestion(
        q,
        recognitionFetched.bundle.events
      )
      recognitionParticipations = recognitionFetched.bundle.participations

      if (needsPeople && isStaffOperatorMode(mode) && recognitionContextEvents.length) {
        const linkedArtistIds = new Set<string>()
        for (const event of recognitionContextEvents.slice(0, 4)) {
          for (const p of recognitionParticipations) {
            if (p.recognitionId === event.id && p.artistId) {
              linkedArtistIds.add(p.artistId)
            }
          }
        }
        if (linkedArtistIds.size) {
          const byId = new Map(allAlumniRows.map((r) => [r.id, r]))
          for (const id of Array.from(linkedArtistIds)) {
            const row = byId.get(id)
            if (row && !eligible.some((e) => e.id === id)) {
              eligible = [...eligible, row]
            }
          }
        }
      }
    }
  }

  let questionEmbedding: number[] | null = null
  const rowEmbeddings = new Map<string, number[]>()

  try {
    const embedInputs: string[] = [q]
    if (needsPeople && eligible.length) {
      embedInputs.push(...eligible.map((r) => buildEmbeddingInput(r)))
    }
    if (needsProgramming && programmingPool?.ok && programmingPool.records.length) {
      embedInputs.push(...programmingPool.records.map((r) => buildEmbeddingInputForKnowledgeRecord(r)))
    }
    const vectors = await embedTexts(openai, embedInputs)
    questionEmbedding = vectors[0] ?? null
    let idx = 1
    if (needsPeople && eligible.length) {
      for (let i = 0; i < eligible.length; i++) {
        const row = eligible[i]
        const v = vectors[idx]
        idx += 1
        if (v) rowEmbeddings.set(row.id, v)
      }
    }
    if (needsProgramming && programmingPool?.ok) {
      for (const record of programmingPool.records) {
        const v = vectors[idx]
        idx += 1
        if (v) rowEmbeddings.set(record.id, v)
      }
    }
  } catch (e) {
    console.warn('Memory agent: embedding failed, keyword-only retrieval', e)
    questionEmbedding = null
    rowEmbeddings.clear()
  }

  if (needsPeople && eligible.length) {
    ranked = rankAlumniForQuestion(eligible, q, questionEmbedding, rowEmbeddings)
    contextRows = selectContextRows(ranked, needsProgramming ? 18 : 28)
  }

  if (needsProgramming && programmingPool?.ok) {
    programmingRanked = rankProgrammingForQuestion(
      programmingPool.records,
      q,
      questionEmbedding,
      rowEmbeddings
    )
    programmingContextRows = selectProgrammingContextRows(
      programmingRanked,
      needsPeople ? 12 : 24
    )
  }

  const artistBlock = buildRetrievedContextBlock(contextRows)
  const programmingBlock = buildProgrammingContextBlock(programmingContextRows)

  const contextSections: string[] = []
  if (artistBlock) {
    contextSections.push(
      `Artist / alumni records (${contextRows.length} of ${eligible.length} eligible; base ${baseTotalCount}):\n${artistBlock}`
    )
  }
  if (programmingBlock) {
    const totalProg = programmingPool?.ok ? programmingPool.records.length : 0
    contextSections.push(
      `Programming records (${programmingContextRows.length} of ${totalProg} after filters; intent: ${intent}):\n${programmingBlock}`
    )
  }

  const recognitionBlock =
    needsRecognition && recognitionContextEvents.length
      ? buildRecognitionContextBlock({
          events: recognitionContextEvents,
          participations: recognitionParticipations,
          mode,
        })
      : ''
  if (recognitionBlock) {
    contextSections.push(
      `Recognitions & exhibitions (${recognitionContextEvents.length} matched; intent: ${intent}):\n${recognitionBlock}`
    )
  }

  if (needsRecognition && !recognitionBlock) {
    contextSections.push(
      'Recognitions & exhibitions: (none in context — do not invent awards, exhibition participation, or artist-invitation counts. Explain what is missing in dataGaps.)'
    )
  }

  if (needsRecognition && recognitionContextEvents.length && isStaffOperatorMode(mode)) {
    const pending = recognitionContextEvents.some((e) => e.approvalStatus === 'pending')
    if (pending) {
      contextSections.push(
        'Recognition governance note: One or more recognition records are pending public approval. Mention this clearly in the answer (internal demo).'
      )
    }
    const top = recognitionContextEvents[0]
    const counts = summarizeRecognitionCounts(recognitionParticipations, top.id, top)
    if (/florida prize/i.test(q) && counts.practiceCount > 0) {
      contextSections.push(
        `Florida Prize count guidance: Report ${counts.practiceCount} participating alumni practices and ${counts.individualArtistCount} named individuals when Nice'n Easy or other collectives are included. Distinguish practices vs individuals clearly.`
      )
    }
  }

  if (needsProgramming && !programmingBlock) {
    contextSections.push(
      'Programming records: (none in context — do not invent exhibitions, dates, or workshops. Explain what is missing in dataGaps, e.g. no published announcements for this week.)'
    )
  }

  if (programmingTimeMeta.usedUpcomingFallback) {
    contextSections.push(
      `Time filter note: No programming overlaps the current calendar week. Retrieved records are the next upcoming items within 14 days. Your answer MUST begin by stating: "${WEEK_UPCOMING_FALLBACK_ANSWER_PREFIX}" Include "${WEEK_UPCOMING_FALLBACK_DATA_GAP}" in dataGaps.`
    )
  }

  if (needsProgramming && !programmingBlock && sohoDemo) {
    contextSections.push(
      'Programming records: (none matched — use demo House records only; do not invent programming.)'
    )
  }

  if (needsPeople && !artistBlock && sohoDemo) {
    contextSections.push(
      'Artist / alumni records: (Soho demo uses programming and House knowledge only — not private member matching or Oolite alumni.)'
    )
  }

  if (needsPeople && !artistBlock && !sohoDemo) {
    contextSections.push(
      'Artist / alumni records: (none in context — do not invent people. Explain in dataGaps.)'
    )
  }

  const system =
    memoryAgentSystemPrompt({
      agentName: branding.agentName,
      orgName: branding.orgName,
      personality: branding.personality,
      mode,
    }) +
    (sohoDemo ? `\n\n${sohoHouseDomainPrimer()}\n${sohoDemoDomainPrimer()}` : '')
  const user = `${MEMORY_AGENT_JSON_INSTRUCTION}

User question:
${q}

Retrieved context:
${contextSections.join('\n\n') || '(no records — say no matches and list dataGaps)'}`

  let raw: string
  try {
    raw = await chatJsonCompletion(openai, system, user)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, code: 'openai_error', message }
  }

  const parsed = parseAskJson(raw)
  if (!parsed) {
    return { ok: false, code: 'openai_error', message: 'Model returned invalid JSON.' }
  }

  const allowedIds = new Set(contextRows.map((r) => r.id))
  const byId = new Map(contextRows.map((r) => [r.id, r]))
  const artists = parsed.artists
    .filter((a) => allowedIds.has(a.id))
    .map((a) => {
      const row = byId.get(a.id)
      if (!row) return a
      const base = mode === 'public' ? redactRowForPublicDisplay(row) : row
      const bio =
        base.publicBio?.trim() ||
        base.artifacts?.trim()
      return {
        ...a,
        name: alumniDisplayName(base),
        photoUrl: alumniImageForContext(base, 'default'),
        galleryImageUrls: alumniGalleryImageUrls(base).slice(0, 4),
        website: a.website || base.website,
        medium: a.discipline || base.medium,
        program: base.program,
        cohort: base.cohort,
        location: base.location,
        topics: [...base.topics, ...base.themes].slice(0, 6),
        badges: badgesFromAlumniRow(base),
        bioSnippet: bio ? bio.slice(0, 220) : undefined,
        pronoun: base.pronoun,
        ethnicity: base.ethnicity,
        nationality: base.nationality,
        year: alumniYearLabel(base.residencyYear ?? base.year) || undefined,
      }
    })

  let events =
    intent === 'people' || intent === 'recognition'
      ? []
      : mergeEventCardsFromContext(parsed.events, programmingContextRows, mode, orgSlug)
  // Demo reliability: if model omits events[] but programming context exists, surface top ranked rows.
  if (
    intent !== 'people' &&
    events.length === 0 &&
    programmingContextRows.length > 0 &&
    intentNeedsProgramming(intent)
  ) {
    const fallbackPick = programmingContextRows.slice(0, 4).map((r) => ({
      id: r.id,
      title: r.title,
    }))
    events = mergeEventCardsFromContext(fallbackPick, programmingContextRows, mode, orgSlug)
  }

  const dataGaps = [...parsed.dataGaps]
  if (programmingTimeMeta.usedUpcomingFallback) {
    const hasWeekGap = dataGaps.some(
      (g) =>
        /calendar week/i.test(g) ||
        /next upcoming/i.test(g) ||
        /14 days/i.test(g)
    )
    if (!hasWeekGap) dataGaps.unshift(WEEK_UPCOMING_FALLBACK_DATA_GAP)
  }

  let answer = parsed.answer
  if (programmingTimeMeta.usedUpcomingFallback) {
    const mentionsFallback =
      /calendar week/i.test(answer) ||
      /next upcoming/i.test(answer) ||
      /14 days/i.test(answer)
    if (!mentionsFallback) {
      answer = `${WEEK_UPCOMING_FALLBACK_ANSWER_PREFIX}\n\n${answer}`
    }
  }

  const signageDraft = attachSignageForAsk({
    signageRaw: parsed.signageDraftRaw,
    tripleOutputs: parsed.outputs,
  })

  let contextInspector: MemoryAgentContextInspector | undefined
  if (mode === 'staff_operator') {
    contextInspector = buildMemoryAgentContextInspector({
      mode,
      organizationSlug: orgSlug,
      question: q,
      eligibleCount: eligible.length,
      baseTotalCount,
      questionEmbedding,
      ranked,
      contextRows,
      userPromptForModel: user,
      parsedArtists: parsed.artists,
      finalArtists: artists,
      tripleOutputs: parsed.outputs,
      signageDraft,
      signageDraftRaw: parsed.signageDraftRaw,
    })
  }

  const structuredDataGaps = toClientStructuredDataGaps(
    buildStructuredDataGaps({
      orgSlug,
      mode,
      dataGaps,
      programmingTimeMeta,
      programmingContextRows,
      events,
      alumniContextRows: contextRows,
      matchedArtists: artists,
      needsPeople,
      needsProgramming,
      programmingContextEmpty: !programmingBlock,
      airtableConn: conn,
    }),
    mode
  )

  return {
    ok: true,
    data: {
      answer,
      artists,
      ...(events.length > 0 ? { events } : {}),
      followUps: parsed.followUps.slice(0, 6),
      dataGaps: dataGaps.slice(0, 8),
      ...(structuredDataGaps.length > 0 ? { structuredDataGaps } : {}),
      outputs: toClientOutputs(parsed.outputs, mode),
      ...(signageDraft ? { signageDraft } : {}),
      ...(contextInspector ? { contextInspector } : {}),
    },
  }
}
