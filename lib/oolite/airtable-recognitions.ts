import 'server-only'

import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'
import { isStaffOperatorMode } from '@/lib/memory-agent/mode'
import type { MemoryAgentMode } from '@/types/memory-agent'
import {
  FLORIDA_PRIZE_2026_EVENT_RECORD_ID,
  OOLITE_AIRTABLE_BASE_ID,
  OOLITE_ARTIST_PARTICIPATION_TABLE,
  OOLITE_PUBLIC_DIRECTORY_TABLE,
  OOLITE_RECOGNITIONS_TABLE,
} from '@/lib/oolite/airtable-recognitions-config'

export type RecognitionEvent = {
  id: string
  name: string
  type?: string
  institution?: string
  year?: number
  startDate?: string
  endDate?: string
  publicSummary?: string
  sourceUrl?: string
  publiclyApproved: boolean
  doNotUseInAi: boolean
  /** Rollup / formula from Airtable when present */
  participatingPracticesCount?: number
  /** Manually reviewed count from Airtable when present */
  namedIndividualsCount?: number
  /** staff_operator only — never sent to model in public mode */
  sourceNotes?: string
  approvalStatus: 'approved' | 'pending'
}

export type ArtistParticipation = {
  id: string
  label: string
  artistId?: string
  artistDisplayName?: string
  recognitionId?: string
  participationType?: string
  participationStatus?: string
  countAsPractice: number
  individualArtistCount: number
  publicNote?: string
  sourceUrl?: string
  publiclyApproved: boolean
  doNotUseInAi: boolean
  approvalStatus: 'approved' | 'pending'
}

export type RecognitionCountSummary = {
  practiceCount: number
  individualArtistCount: number
  participants: Array<{
    artistDisplayName: string
    participationType?: string
    artistId?: string
  }>
}

export type OoliteRecognitionBundle = {
  events: RecognitionEvent[]
  participations: ArtistParticipation[]
  artistNamesById: Map<string, string>
}

function cellStr(fields: Record<string, unknown>, fieldId: string): string | undefined {
  const raw = fields[fieldId]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length ? t : undefined
  }
  if (typeof raw === 'number' && !Number.isNaN(raw)) return String(raw)
  return undefined
}

function cellBool(fields: Record<string, unknown>, fieldId: string): boolean {
  const raw = fields[fieldId]
  if (raw === true) return true
  if (typeof raw === 'string') {
    const t = raw.trim().toLowerCase()
    return ['yes', 'true', '1', 'y', 'checked'].includes(t)
  }
  return false
}

function cellNum(fields: Record<string, unknown>, fieldId: string): number {
  const raw = fields[fieldId]
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw
  if (typeof raw === 'string') {
    const n = Number(raw.trim())
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

function cellLinks(fields: Record<string, unknown>, fieldId: string): string[] {
  const raw = fields[fieldId]
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}

function approvalStatus(publiclyApproved: boolean): 'approved' | 'pending' {
  return publiclyApproved ? 'approved' : 'pending'
}

function passesGovernance(
  row: { publiclyApproved: boolean; doNotUseInAi: boolean },
  mode: MemoryAgentMode
): boolean {
  if (row.doNotUseInAi) return false
  if (isStaffOperatorMode(mode)) return true
  return row.publiclyApproved
}

function mapRecognitionEvent(record: AirtableRecord, mode: MemoryAgentMode): RecognitionEvent | null {
  const f = OOLITE_RECOGNITIONS_TABLE.fields
  const fields = record.fields
  const name = cellStr(fields, f.recognitionEventName)
  if (!name) return null

  const publiclyApproved = cellBool(fields, f.publiclyApproved)
  const doNotUseInAi = cellBool(fields, f.doNotUseInAi)
  if (!passesGovernance({ publiclyApproved, doNotUseInAi }, mode)) return null

  const yearRaw = cellNum(fields, f.year)
  const practicesCount = cellNum(fields, f.participatingPracticesCount)
  const individualsCount = cellNum(fields, f.namedIndividualsCount)
  const sourceNotes = isStaffOperatorMode(mode)
    ? cellStr(fields, f.sourceNotes)
    : undefined

  return {
    id: record.id,
    name,
    type: cellStr(fields, f.type),
    institution: cellStr(fields, f.institution),
    year: yearRaw || undefined,
    startDate: cellStr(fields, f.startDate),
    endDate: cellStr(fields, f.endDate),
    publicSummary: cellStr(fields, f.publicSummary),
    sourceUrl: cellStr(fields, f.sourceUrl),
    publiclyApproved,
    doNotUseInAi,
    ...(practicesCount > 0 ? { participatingPracticesCount: practicesCount } : {}),
    ...(individualsCount > 0 ? { namedIndividualsCount: individualsCount } : {}),
    ...(sourceNotes ? { sourceNotes } : {}),
    approvalStatus: approvalStatus(publiclyApproved),
  }
}

function mapParticipation(
  record: AirtableRecord,
  mode: MemoryAgentMode,
  artistNamesById: Map<string, string>
): ArtistParticipation | null {
  const f = OOLITE_ARTIST_PARTICIPATION_TABLE.fields
  const fields = record.fields
  const publiclyApproved = cellBool(fields, f.publiclyApproved)
  const doNotUseInAi = cellBool(fields, f.doNotUseInAi)
  if (!passesGovernance({ publiclyApproved, doNotUseInAi }, mode)) return null

  const artistIds = cellLinks(fields, f.artistCollective)
  const artistId = artistIds[0]
  const recognitionIds = cellLinks(fields, f.recognitionExhibition)
  const recognitionId = recognitionIds[0]

  const label =
    cellStr(fields, f.participationRecord) ||
    (artistId ? artistNamesById.get(artistId) : undefined) ||
    'Participation'

  const practice = cellNum(fields, f.countAsPractice) || 1
  const individuals = cellNum(fields, f.individualArtistCount) || 1

  return {
    id: record.id,
    label,
    artistId,
    artistDisplayName: artistId ? artistNamesById.get(artistId) : undefined,
    recognitionId,
    participationType: cellStr(fields, f.participationType),
    participationStatus: cellStr(fields, f.participationStatus),
    countAsPractice: practice,
    individualArtistCount: individuals,
    publicNote: cellStr(fields, f.publicNote),
    sourceUrl: cellStr(fields, f.sourceUrl),
    publiclyApproved,
    doNotUseInAi,
    approvalStatus: approvalStatus(publiclyApproved),
  }
}

async function fetchArtistNameMap(
  apiKey: string,
  artistIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (artistIds.length === 0) return map

  const f = OOLITE_PUBLIC_DIRECTORY_TABLE.fields
  const unique = Array.from(new Set(artistIds))
  const chunks: string[][] = []
  for (let i = 0; i < unique.length; i += 15) {
    chunks.push(unique.slice(i, i + 15))
  }

  for (const chunk of chunks) {
    const formula = `OR(${chunk.map((id) => `RECORD_ID()='${id}'`).join(',')})`
    const records = await fetchAllRecords(
      OOLITE_AIRTABLE_BASE_ID,
      OOLITE_PUBLIC_DIRECTORY_TABLE.id,
      apiKey,
      { filterFormula: formula, returnFieldsByFieldId: true }
    )
    for (const rec of records) {
      const display =
        cellStr(rec.fields, f.displayName) ||
        cellStr(rec.fields, f.nameKey) ||
        undefined
      if (display) map.set(rec.id, display)
    }
  }

  return map
}

export function isOoliteRecognitionConfigured(orgSlug: string): boolean {
  if (orgSlug.trim().toLowerCase() !== 'oolite') return false
  const conn = getAlumniConnectionForOrg(orgSlug)
  return Boolean(conn?.apiKey?.trim())
}

export async function fetchOoliteRecognitionBundle(
  mode: MemoryAgentMode
): Promise<
  | { ok: true; bundle: OoliteRecognitionBundle }
  | { ok: false; message: string }
> {
  const conn = getAlumniConnectionForOrg('oolite')
  if (!conn?.apiKey) {
    return { ok: false, message: 'Oolite Airtable is not configured.' }
  }

  const apiKey = conn.apiKey

  try {
    const [eventRecords, participationRecords] = await Promise.all([
      fetchAllRecords(
        OOLITE_AIRTABLE_BASE_ID,
        OOLITE_RECOGNITIONS_TABLE.id,
        apiKey,
        { returnFieldsByFieldId: true }
      ),
      fetchAllRecords(
        OOLITE_AIRTABLE_BASE_ID,
        OOLITE_ARTIST_PARTICIPATION_TABLE.id,
        apiKey,
        { returnFieldsByFieldId: true }
      ),
    ])

    const artistIds = new Set<string>()
    for (const rec of participationRecords) {
      for (const id of cellLinks(rec.fields, OOLITE_ARTIST_PARTICIPATION_TABLE.fields.artistCollective)) {
        artistIds.add(id)
      }
    }

    const artistNamesById = await fetchArtistNameMap(apiKey, Array.from(artistIds))

    const events = eventRecords
      .map((r) => mapRecognitionEvent(r, mode))
      .filter(Boolean) as RecognitionEvent[]

    const participations = participationRecords
      .map((r) => mapParticipation(r, mode, artistNamesById))
      .filter(Boolean) as ArtistParticipation[]

    return {
      ok: true,
      bundle: { events, participations, artistNamesById },
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, message }
  }
}

export function getRecognitionByName(
  events: RecognitionEvent[],
  nameQuery: string
): RecognitionEvent | undefined {
  const q = nameQuery.trim().toLowerCase()
  if (!q) return undefined
  return events.find((e) => e.name.toLowerCase().includes(q))
}

export function getRecognitionByYear(
  events: RecognitionEvent[],
  year: number
): RecognitionEvent[] {
  return events.filter((e) => e.year === year)
}

export function getParticipationForRecognition(
  participations: ArtistParticipation[],
  recognitionId: string
): ArtistParticipation[] {
  return participations.filter((p) => p.recognitionId === recognitionId)
}

export function getArtistsForRecognition(
  participations: ArtistParticipation[],
  recognitionId: string
): Array<{ artistId?: string; artistDisplayName: string; participationType?: string }> {
  return getParticipationForRecognition(participations, recognitionId)
    .map((p) => ({
      artistId: p.artistId,
      artistDisplayName: p.artistDisplayName || p.label,
      participationType: p.participationType,
    }))
    .filter((a) => a.artistDisplayName.trim().length > 0)
}

export function summarizeRecognitionCounts(
  participations: ArtistParticipation[],
  recognitionId: string,
  event?: Pick<RecognitionEvent, 'participatingPracticesCount' | 'namedIndividualsCount'>
): RecognitionCountSummary {
  const rows = getParticipationForRecognition(participations, recognitionId)
  let practiceCount = 0
  let individualArtistCount = 0
  const participants: RecognitionCountSummary['participants'] = []

  for (const row of rows) {
    practiceCount += row.countAsPractice || 1
    individualArtistCount += row.individualArtistCount || 1
    participants.push({
      artistDisplayName: row.artistDisplayName || row.label,
      participationType: row.participationType,
      artistId: row.artistId,
    })
  }

  if (event?.participatingPracticesCount && event.participatingPracticesCount > 0) {
    practiceCount = event.participatingPracticesCount
  }
  if (event?.namedIndividualsCount && event.namedIndividualsCount > 0) {
    individualArtistCount = event.namedIndividualsCount
  }

  return { practiceCount, individualArtistCount, participants }
}

/** Match recognition events relevant to a natural-language question. */
export function rankRecognitionsForQuestion(
  question: string,
  events: RecognitionEvent[]
): RecognitionEvent[] {
  const q = question.toLowerCase()
  const scored = events.map((event) => {
    let score = 0
    const hay = [
      event.name,
      event.institution,
      event.type,
      event.publicSummary,
      event.year ? String(event.year) : '',
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    if (/florida prize/i.test(q) && /florida prize/i.test(hay)) score += 10
    if (/orlando museum/i.test(q) && /orlando museum/i.test(hay)) score += 8
    if (/consortium/i.test(q) && /consortium/i.test(hay)) score += 8
    if (/ellies/i.test(q) && /ellies/i.test(hay)) score += 6
    if (/2026/.test(q) && event.year === 2026) score += 4
    if (/exhibition|recognition|award|invited|participat/i.test(q)) score += 1

    const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length > 3)
    for (const t of tokens) {
      if (hay.includes(t)) score += 1
    }

    return { event, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.event)
}

export function buildRecognitionContextBlock(args: {
  events: RecognitionEvent[]
  participations: ArtistParticipation[]
  mode: MemoryAgentMode
}): string {
  const { events, participations, mode } = args
  if (events.length === 0) return ''

  const blocks: string[] = []
  for (const event of events.slice(0, 6)) {
    const summary = summarizeRecognitionCounts(participations, event.id, event)
    const lines: string[] = [
      `Recognition / exhibition: ${event.name}`,
      `Record id: ${event.id}`,
    ]
    if (event.type) lines.push(`Type: ${event.type}`)
    if (event.institution) lines.push(`Institution: ${event.institution}`)
    if (event.year) lines.push(`Year: ${event.year}`)
    if (event.startDate) lines.push(`Start date: ${event.startDate}`)
    if (event.endDate) lines.push(`End date: ${event.endDate}`)
    if (event.publicSummary) lines.push(`Public summary: ${event.publicSummary}`)
    if (event.sourceUrl) lines.push(`Source URL: ${event.sourceUrl}`)
    lines.push(`Participating practices count: ${summary.practiceCount}`)
    lines.push(`Named individuals count: ${summary.individualArtistCount}`)
    if (summary.participants.length) {
      lines.push(
        `Participants: ${summary.participants
          .map((p) => {
            const type = p.participationType ? ` (${p.participationType})` : ''
            const id = p.artistId ? ` [artist id: ${p.artistId}]` : ''
            return `${p.artistDisplayName}${type}${id}`
          })
          .join('; ')}`
      )
    }
    if (event.approvalStatus === 'pending') {
      lines.push(
        isStaffOperatorMode(mode)
          ? 'Approval status: Pending review (internal demo — label clearly in answer; not yet public-safe).'
          : 'Approval status: Not publicly approved.'
      )
    } else {
      lines.push('Approval status: Publicly approved.')
    }
    blocks.push(lines.join('\n'))
  }

  return blocks.join('\n\n')
}

/** Known seeded Florida Prize counts for tests and demo validation. */
export function expectedFloridaPrize2026Counts(): RecognitionCountSummary {
  return {
    practiceCount: 6,
    individualArtistCount: 7,
    participants: [
      { artistDisplayName: 'Maria Theresa Barbist', participationType: 'Invited Artist' },
      { artistDisplayName: 'Rose Marie Cromwell', participationType: 'Invited Artist' },
      { artistDisplayName: 'Francisco Masó', participationType: 'Invited Artist' },
      { artistDisplayName: 'Charo Oquet', participationType: 'Invited Artist' },
      { artistDisplayName: 'Ema Ri', participationType: 'Invited Artist' },
      {
        artistDisplayName: "Nice'n Easy",
        participationType: 'Invited Artist Collective',
      },
    ],
  }
}

export function findFloridaPrize2026Event(events: RecognitionEvent[]): RecognitionEvent | undefined {
  return (
    events.find((e) => e.id === FLORIDA_PRIZE_2026_EVENT_RECORD_ID) ||
    getRecognitionByName(events, 'Florida Prize')
  )
}
