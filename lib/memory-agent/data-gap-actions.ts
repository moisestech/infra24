import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import type { OrgAlumniConnection } from '@/lib/airtable/org-alumni-config'
import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'
import type { IntentTimeFilterMeta } from '@/lib/memory-agent/programming'
import { WEEK_UPCOMING_FALLBACK_DATA_GAP } from '@/lib/memory-agent/programming'
import type {
  MemoryAgentArtistCard,
  MemoryAgentDataGap,
  MemoryAgentEventCard,
  MemoryAgentMode,
} from '@/types/memory-agent'

export type BuildStructuredDataGapsParams = {
  orgSlug: string
  mode: MemoryAgentMode
  dataGaps: string[]
  programmingTimeMeta: IntentTimeFilterMeta
  programmingContextRows: KnowledgeRecord[]
  events: MemoryAgentEventCard[]
  alumniContextRows: AlumniAirtableRow[]
  matchedArtists: MemoryAgentArtistCard[]
  needsPeople: boolean
  needsProgramming: boolean
  programmingContextEmpty: boolean
  airtableConn: OrgAlumniConnection | null
}

/** Drop generic alumni-context gaps when a programming-only question already returned events. */
function shouldSuppressPersonContextGap(
  gap: MemoryAgentDataGap,
  needsPeople: boolean,
  needsProgramming: boolean,
  eventCount: number
): boolean {
  if (needsPeople || !needsProgramming || eventCount === 0) return false
  if (gap.gapType !== 'missing_person_data' || gap.source !== 'airtable_alumni') return false
  return /no artist records|none in context|not available in context|no alumni/i.test(gap.message)
}

function gapId(parts: string[]): string {
  return parts.filter(Boolean).join(':')
}

export function announcementEditHref(orgSlug: string, recordId: string): string {
  return `/o/${encodeURIComponent(orgSlug)}/announcements/${encodeURIComponent(recordId)}/edit`
}

export function announcementCreateHref(orgSlug: string): string {
  return `/o/${encodeURIComponent(orgSlug)}/announcements/create`
}

export function workshopAdminHref(orgSlug: string, workshopId: string): string {
  return `/o/${encodeURIComponent(orgSlug)}/admin/workshops/${encodeURIComponent(workshopId)}`
}

export function airtableRecordHref(
  baseId: string,
  tableId: string,
  recordId: string
): string {
  return `https://airtable.com/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}/${encodeURIComponent(recordId)}`
}

function programmingSource(
  record: KnowledgeRecord
): MemoryAgentDataGap['source'] {
  return record.source === 'workshop' ? 'supabase_workshops' : 'supabase_announcements'
}

function programmingEditHref(
  orgSlug: string,
  record: KnowledgeRecord
): string | undefined {
  if (record.source === 'announcement') {
    return announcementEditHref(orgSlug, record.sourceRecordId)
  }
  if (record.source === 'workshop') {
    const workshopId = record.id.split(':')[1]
    if (workshopId) return workshopAdminHref(orgSlug, workshopId)
  }
  return undefined
}

function pushGap(
  out: MemoryAgentDataGap[],
  seen: Set<string>,
  gap: MemoryAgentDataGap
): void {
  const key = `${gap.gapType}:${gap.sourceRecordId ?? gap.id}`
  if (seen.has(key)) return
  seen.add(key)
  out.push(gap)
}

function gapFromProgrammingRecord(
  orgSlug: string,
  record: KnowledgeRecord,
  mode: MemoryAgentMode
): MemoryAgentDataGap[] {
  const gaps: MemoryAgentDataGap[] = []
  const editHref = programmingEditHref(orgSlug, record)
  const source = programmingSource(record)

  const hasDate = Boolean(record.startsAt?.trim() || record.endsAt?.trim())
  if (!hasDate) {
    gaps.push({
      id: gapId(['missing_date', record.id]),
      message: `"${record.title}" has no event date in the source record.`,
      gapType: 'missing_date',
      source,
      sourceRecordId: record.sourceRecordId,
      action: 'add_event_date',
      actionLabel: 'Add event date',
      actionHref: editHref,
    })
  }

  const wantsCta =
    record.recordKind === 'bookable_event' ||
    record.recordKind === 'workshop' ||
    record.source === 'workshop'
  const hasCta = Boolean(
    record.bookingCta?.grounded ||
      record.rsvpUrl?.trim() ||
      record.primaryLink?.trim()
  )
  if (wantsCta && !hasCta) {
    gaps.push({
      id: gapId(['missing_cta', record.id]),
      message: `"${record.title}" has no public RSVP or booking link.`,
      gapType: 'missing_cta',
      source,
      sourceRecordId: record.sourceRecordId,
      action: 'add_rsvp_link',
      actionLabel: 'Add RSVP link',
      actionHref: editHref,
    })
  }

  if (mode === 'staff_operator' && record.visibility === 'internal') {
    gaps.push({
      id: gapId(['missing_visibility', record.id]),
      message: `"${record.title}" is internal-only and will not appear in public mode.`,
      gapType: 'missing_visibility',
      source,
      sourceRecordId: record.sourceRecordId,
      action: 'mark_public_safe',
      actionLabel: 'Mark public-safe',
      actionHref: editHref,
    })
  }

  if (record.eventState === 'canceled') {
    gaps.push({
      id: gapId(['review_event_state', record.id]),
      message: `"${record.title}" is marked canceled in Supabase.`,
      gapType: 'missing_programming_data',
      source,
      sourceRecordId: record.sourceRecordId,
      action: 'review_event_state',
      actionLabel: 'Review event state',
      actionHref: editHref,
    })
  }

  if (mode === 'staff_operator' && record.approvedForPublicAi === false) {
    gaps.push({
      id: gapId(['missing_public_approval', record.id]),
      message: `"${record.title}" is not approved for public AI use.`,
      gapType: 'missing_public_approval',
      source,
      sourceRecordId: record.sourceRecordId,
      action: 'review_visibility',
      actionLabel: 'Review visibility',
      actionHref: editHref,
    })
  }

  return gaps
}

function gapFromAlumniRow(
  orgSlug: string,
  row: AlumniAirtableRow,
  conn: OrgAlumniConnection | null,
  mode: MemoryAgentMode
): MemoryAgentDataGap[] {
  const gaps: MemoryAgentDataGap[] = []
  const editHref =
    conn != null
      ? airtableRecordHref(conn.baseId, conn.tableId, row.id)
      : undefined
  const name = row.artistName?.trim() || row.name

  if (mode === 'staff_operator' && row.doNotUseInAi === true) {
    gaps.push({
      id: gapId(['do_not_use', row.id]),
      message: `${name} is marked do-not-use in AI and was excluded from public answers.`,
      gapType: 'missing_public_approval',
      source: 'airtable_alumni',
      sourceRecordId: row.id,
      action: 'edit_airtable_row',
      actionLabel: 'Edit Airtable row',
      actionHref: editHref,
    })
    return gaps
  }

  const bio = row.publicBio?.trim() || row.artifacts?.trim()
  if (!bio || bio.length < 40) {
    gaps.push({
      id: gapId(['thin_bio', row.id]),
      message: `${name} has a thin or missing public bio for AI answers.`,
      gapType: 'missing_person_data',
      source: 'airtable_alumni',
      sourceRecordId: row.id,
      action: 'edit_airtable_row',
      actionLabel: 'Edit Airtable row',
      actionHref: editHref,
    })
  }

  if (!row.medium?.trim()) {
    gaps.push({
      id: gapId(['missing_medium', row.id]),
      message: `${name} is missing a medium/discipline in Airtable.`,
      gapType: 'missing_person_data',
      source: 'airtable_alumni',
      sourceRecordId: row.id,
      action: 'edit_airtable_row',
      actionLabel: 'Add medium',
      actionHref: editHref,
    })
  }

  if (
    mode === 'staff_operator' &&
    conn?.fieldMap.approvedForPublicAi &&
    row.approvedForPublicAi !== true
  ) {
    gaps.push({
      id: gapId(['approval', row.id]),
      message: `${name} is not marked approved for public AI.`,
      gapType: 'missing_public_approval',
      source: 'airtable_alumni',
      sourceRecordId: row.id,
      action: 'edit_airtable_row',
      actionLabel: 'Review public AI approval',
      actionHref: editHref,
    })
  }

  return gaps
}

function gapFromStringHint(text: string, orgSlug: string): MemoryAgentDataGap | null {
  const lower = text.toLowerCase()
  if (/calendar week|this week|no published programming|no announcements/.test(lower)) {
    return {
      id: gapId(['string', 'empty_time_window']),
      message: text,
      gapType: 'empty_time_window',
      source: 'supabase_announcements',
      action: 'create_announcement',
      actionLabel: 'Create announcement',
      actionHref: announcementCreateHref(orgSlug),
    }
  }
  if (/rsvp|booking|cta|register/.test(lower)) {
    return {
      id: gapId(['string', 'missing_cta']),
      message: text,
      gapType: 'missing_cta',
      source: 'supabase_announcements',
      action: 'add_rsvp_link',
      actionLabel: 'Add RSVP link',
      actionHref: announcementCreateHref(orgSlug),
    }
  }
  if (/date|schedule|when/.test(lower)) {
    return {
      id: gapId(['string', 'missing_date']),
      message: text,
      gapType: 'missing_date',
      source: 'supabase_announcements',
      action: 'add_event_date',
      actionLabel: 'Add event date',
      actionHref: announcementCreateHref(orgSlug),
    }
  }
  if (/bio|medium|alumni|artist|airtable|person/.test(lower)) {
    return {
      id: gapId(['string', 'missing_person_data']),
      message: text,
      gapType: 'missing_person_data',
      source: 'airtable_alumni',
      action: 'edit_airtable_row',
      actionLabel: 'Edit Airtable row',
    }
  }
  if (/visibility|internal|public-safe|public safe/.test(lower)) {
    return {
      id: gapId(['string', 'missing_visibility']),
      message: text,
      gapType: 'missing_visibility',
      source: 'supabase_announcements',
      action: 'mark_public_safe',
      actionLabel: 'Mark public-safe',
      actionHref: announcementCreateHref(orgSlug),
    }
  }
  return {
    id: gapId(['string', text.slice(0, 32)]),
    message: text,
    gapType: 'missing_programming_data',
    source: 'memory_agent',
    action: 'edit_announcement',
    actionLabel: 'Review source record',
    actionHref: announcementCreateHref(orgSlug),
  }
}

export function buildStructuredDataGaps(
  params: BuildStructuredDataGapsParams
): MemoryAgentDataGap[] {
  const {
    orgSlug,
    mode,
    dataGaps,
    programmingTimeMeta,
    programmingContextRows,
    events,
    alumniContextRows,
    matchedArtists,
    needsPeople,
    needsProgramming,
    programmingContextEmpty,
    airtableConn,
  } = params

  const out: MemoryAgentDataGap[] = []
  const seen = new Set<string>()

  if (programmingTimeMeta.usedUpcomingFallback) {
    pushGap(out, seen, {
      id: gapId(['empty_time_window', 'fallback']),
      message: WEEK_UPCOMING_FALLBACK_DATA_GAP,
      gapType: 'empty_time_window',
      source: 'supabase_announcements',
      action: 'create_announcement',
      actionLabel: 'Create announcement',
      actionHref: announcementCreateHref(orgSlug),
    })
  }

  if (needsProgramming && programmingContextEmpty) {
    pushGap(out, seen, {
      id: gapId(['empty_time_window', 'none']),
      message: 'No published programming records matched this question.',
      gapType: 'empty_time_window',
      source: 'supabase_announcements',
      action: 'create_announcement',
      actionLabel: 'Create announcement',
      actionHref: announcementCreateHref(orgSlug),
    })
  }

  const programmingById = new Map(programmingContextRows.map((r) => [r.id, r]))
  for (const ev of events) {
    const record = programmingById.get(ev.id)
    if (!record) continue
    for (const gap of gapFromProgrammingRecord(orgSlug, record, mode)) {
      pushGap(out, seen, gap)
    }
  }

  const alumniById = new Map(alumniContextRows.map((r) => [r.id, r]))
  for (const artist of matchedArtists.slice(0, 6)) {
    const row = alumniById.get(artist.id)
    if (!row) continue
    for (const gap of gapFromAlumniRow(orgSlug, row, airtableConn, mode)) {
      pushGap(out, seen, gap)
    }
  }

  for (const text of dataGaps) {
    const trimmed = text.trim()
    if (!trimmed) continue
    const inferred = gapFromStringHint(trimmed, orgSlug)
    if (inferred) pushGap(out, seen, inferred)
  }

  const filtered = out.filter(
    (gap) => !shouldSuppressPersonContextGap(gap, needsPeople, needsProgramming, events.length)
  )

  return filtered.slice(0, 8)
}

export function toClientStructuredDataGaps(
  gaps: MemoryAgentDataGap[],
  mode: MemoryAgentMode
): MemoryAgentDataGap[] {
  if (mode === 'staff_operator') return gaps
  return gaps.map((gap) => {
    const { actionHref, action, actionLabel, ...publicGap } = gap
    void actionHref
    void action
    void actionLabel
    return publicGap
  })
}

export const DATA_GAP_SOURCE_LABEL: Record<MemoryAgentDataGap['source'], string> = {
  airtable_alumni: 'Airtable alumni',
  supabase_announcements: 'Announcement',
  supabase_workshops: 'Workshop',
  memory_agent: 'Memory Agent',
}
