import { alumniDisplayName } from '@/lib/airtable/alumni-service'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { parseSignageDraft } from '@/lib/memory-agent/outputs'
import type { ScoredAlumni } from '@/lib/memory-agent/retrieve'
import type {
  MemoryAgentArtistCard,
  MemoryAgentContextInspector,
  MemoryAgentMode,
  MemoryAgentSignageDraft,
  MemoryAgentTripleOutputs,
} from '@/types/memory-agent'

export function buildMemoryAgentContextInspector(args: {
  mode: MemoryAgentMode
  organizationSlug: string
  question: string
  eligibleCount: number
  baseTotalCount: number
  questionEmbedding: number[] | null
  ranked: ScoredAlumni[]
  contextRows: AlumniAirtableRow[]
  userPromptForModel: string
  parsedArtists: MemoryAgentArtistCard[]
  finalArtists: MemoryAgentArtistCard[]
  tripleOutputs: MemoryAgentTripleOutputs | undefined
  signageDraft: MemoryAgentSignageDraft | undefined
  signageDraftRaw: unknown
}): MemoryAgentContextInspector {
  const allowedArtistIds = args.contextRows.map((r) => r.id)
  const allowedSet = new Set(allowedArtistIds)
  const scoreById = new Map(args.ranked.map((s) => [s.row.id, s.score]))

  const droppedModelArtistIds = args.parsedArtists
    .filter((a) => !allowedSet.has(a.id))
    .map((a) => a.id)

  const warnings: string[] = []
  if (!args.questionEmbedding) {
    warnings.push('Embeddings unavailable; retrieval used keyword-heavy blend.')
  }

  const droppedFields: string[] = []
  if (droppedModelArtistIds.length > 0) {
    droppedFields.push(`artist_cards_removed_not_in_context:${droppedModelArtistIds.join(',')}`)
  }

  const outputsAccepted = !!args.tripleOutputs

  const signageParseable =
    args.signageDraftRaw !== undefined &&
    args.signageDraftRaw !== null &&
    typeof args.signageDraftRaw === 'object'
  const signageParsed = parseSignageDraft(args.signageDraftRaw)
  const signageAccepted = !!args.signageDraft
  if (outputsAccepted && signageParseable && !signageParsed) {
    warnings.push('signageDraft present but failed parser validation.')
  }

  const selectedRecords = args.contextRows.map((row) => ({
    id: row.id,
    name: alumniDisplayName(row),
    title: [row.program, row.medium].filter(Boolean).join(' · ') || undefined,
    score: scoreById.get(row.id),
    source: 'airtable-alumni',
    reason: 'Top-ranked context row',
  }))

  return {
    mode: args.mode,
    organizationSlug: args.organizationSlug,
    question: args.question,
    retrieval: {
      totalCandidateCount: args.eligibleCount,
      baseTotalCount: args.baseTotalCount,
      selectedCount: args.contextRows.length,
      selectedRecords,
      allowedArtistIds,
    },
    contextPreview: {
      text: args.userPromptForModel,
      characterCount: args.userPromptForModel.length,
    },
    validation: {
      jsonParsed: true,
      artistsFiltered: droppedModelArtistIds.length > 0,
      outputsAccepted,
      signageAccepted,
      droppedFields: droppedFields.length ? droppedFields : undefined,
      warnings: warnings.length ? warnings : undefined,
    },
  }
}

export function parseContextInspectorFromApi(
  raw: unknown,
  clientMode: MemoryAgentMode
): MemoryAgentContextInspector | undefined {
  if (clientMode === 'public') return undefined
  if (!raw || typeof raw !== 'object') return undefined
  const o = raw as Record<string, unknown>
  if (typeof o.organizationSlug !== 'string' || typeof o.question !== 'string') return undefined
  if (o.mode !== 'staff_operator') return undefined
  return raw as MemoryAgentContextInspector
}
