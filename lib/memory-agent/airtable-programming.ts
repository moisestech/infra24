import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import {
  getProgrammingConnectionForOrg,
  type OrgProgrammingConnection,
  type ProgrammingFieldMap,
} from '@/lib/airtable/programming-config'
import { enrichProgrammingRecordsWithPeopleNames, fetchCrmPeopleNameMap } from '@/lib/memory-agent/linked-people-names'
import { getOoliteCrmPeopleConnection } from '@/lib/airtable/oolite-crm-people-config'
import type {
  KnowledgeRecord,
  KnowledgeRecordKind,
  ProgrammingRecordStatus,
  ProgrammingRecordVisibility,
} from '@/lib/memory-agent/knowledge-record'
import type { MemoryAgentMode } from '@/types/memory-agent'
import {
  buildProgrammingOrgFilterFormula,
  scopeProgrammingRowsByOrg,
} from '@/lib/oolite/programming-import'

export const DEFAULT_PROGRAMMING_FIELD_MAP: ProgrammingFieldMap = {
  title: 'Title',
  organization: 'Organization',
  recordType: 'Record Type',
  status: 'Status',
  visibility: 'Visibility',
  startDate: 'Start Date',
  endDate: 'End Date',
  locationName: 'Location Name',
  address: 'Address',
  summary: 'Summary',
  description: 'Description',
  curator: 'Curator',
  featuredArtists: 'Featured Artists',
  imageUrl: 'Image URL',
  publicUrl: 'Public URL',
  rsvpUrl: 'RSVP URL',
  bookable: 'Bookable',
  smartSignEligible: 'Smart Sign Eligible',
  publicAiApproved: 'Public AI Approved',
  priority: 'Priority',
  tags: 'Tags',
  sourceNotes: 'Source Notes',
  doNotUseInAi: 'Do Not Use In AI',
  instructor: 'Instructor',
  timeText: 'Time Text',
  durationText: 'Duration Text',
  costText: 'Cost Text',
  capacity: 'Capacity',
  ageRequirement: 'Age Requirement',
  language: 'Language',
  contactName: 'Contact Name',
  contactEmail: 'Contact Email',
  artists: 'Artists',
  curators: 'Curators',
  programStaff: 'Program Staff',
}

export type FetchAirtableProgrammingOptions = {
  mode: MemoryAgentMode
  recentDays?: number
  now?: Date
}

export type FetchAirtableProgrammingResult =
  | { ok: true; records: KnowledgeRecord[] }
  | { ok: false; reason: 'not_configured' | 'airtable_error'; message?: string }

function cellStr(fields: Record<string, unknown>, key: string): string | undefined {
  const raw = fields[key]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length ? t : undefined
  }
  if (typeof raw === 'number' && !Number.isNaN(raw)) return String(raw)
  return undefined
}

function cellBool(fields: Record<string, unknown>, key: string): boolean {
  const raw = fields[key]
  if (raw === true) return true
  if (typeof raw === 'string') {
    const t = raw.trim().toLowerCase()
    return ['yes', 'true', '1', 'y', 'checked'].includes(t)
  }
  return false
}

function cellBoolOptional(fields: Record<string, unknown>, key: string): boolean | undefined {
  if (!(key in fields) || fields[key] == null) return undefined
  return cellBool(fields, key)
}

function cellNum(fields: Record<string, unknown>, key: string): number | undefined {
  const raw = fields[key]
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw
  if (typeof raw === 'string') {
    const n = Number(raw.trim())
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

function cellLinkedIds(fields: Record<string, unknown>, key: string): string[] {
  const raw = fields[key]
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}

function cellTags(fields: Record<string, unknown>, key: string): string[] {
  const raw = fields[key]
  if (Array.isArray(raw)) {
    return raw
      .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
      .filter(Boolean)
  }
  const text = cellStr(fields, key)
  if (!text) return []
  return text
    .split(/[,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

function airtableDateToIso(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const d = new Date(value.trim())
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function normalizeRecordType(raw?: string): KnowledgeRecordKind {
  const t = (raw || '').trim().toLowerCase().replace(/\s+/g, '_')
  const map: Record<string, KnowledgeRecordKind> = {
    exhibition: 'exhibition',
    upcoming_exhibition: 'exhibition',
    event: 'event',
    workshop: 'workshop',
    announcement: 'announcement',
    public_announcement: 'announcement',
    screening: 'screening',
    residency: 'residency',
    residency_event: 'residency',
    tour: 'tour',
    artist_talk: 'event',
    open_studio: 'event',
    application_deadline: 'opportunity',
    editorial_story: 'editorial_story',
    space: 'space',
    bookable_event: 'bookable_event',
    house_story: 'house_story',
    member_route: 'member_route',
  }
  return map[t] || 'event'
}

function normalizeStatus(raw?: string): ProgrammingRecordStatus | undefined {
  const t = (raw || '').trim().toLowerCase().replace(/\s+/g, '_')
  const allowed: ProgrammingRecordStatus[] = [
    'draft',
    'coming_soon',
    'on_view',
    'published',
    'canceled',
    'archived',
  ]
  return allowed.includes(t as ProgrammingRecordStatus)
    ? (t as ProgrammingRecordStatus)
    : undefined
}

function normalizeProgrammingVisibility(
  raw?: string
): ProgrammingRecordVisibility | undefined {
  const t = (raw || '').trim().toLowerCase().replace(/\s+/g, '_')
  if (t === 'public') return 'public'
  if (t === 'internal') return 'internal'
  if (t === 'members_only' || t === 'members') return 'members_only'
  return undefined
}

function legacyVisibilityFromProgramming(
  programmingVisibility?: ProgrammingRecordVisibility
): KnowledgeRecord['visibility'] {
  if (programmingVisibility === 'internal') return 'internal'
  if (programmingVisibility === 'members_only') return 'both'
  return 'public'
}

function resolveFieldMap(fieldMap?: ProgrammingFieldMap): ProgrammingFieldMap {
  return fieldMap ?? DEFAULT_PROGRAMMING_FIELD_MAP
}

function readField(
  fields: Record<string, unknown>,
  fieldMap: ProgrammingFieldMap,
  key: keyof ProgrammingFieldMap
): unknown {
  return fields[fieldMap[key]]
}

export function mapAirtableProgrammingRow(
  record: AirtableRecord,
  orgSlug: string,
  fieldMap?: ProgrammingFieldMap
): KnowledgeRecord | null {
  const f = resolveFieldMap(fieldMap)
  const fields = record.fields
  const title = cellStr(fields, f.title)
  if (!title) return null

  const recordType = normalizeRecordType(cellStr(fields, f.recordType))
  const status = normalizeStatus(cellStr(fields, f.status))
  const programmingVisibility = normalizeProgrammingVisibility(cellStr(fields, f.visibility))
  const startsAt = airtableDateToIso(readField(fields, f, 'startDate'))
  const endsAt = airtableDateToIso(readField(fields, f, 'endDate'))
  const locationName = cellStr(fields, f.locationName)
  const address = cellStr(fields, f.address)
  const location =
    [locationName, address].filter(Boolean).join(locationName && address ? ' · ' : '') || undefined
  const summary = cellStr(fields, f.summary)
  const description = cellStr(fields, f.description)
  const curator = cellStr(fields, f.curator)
  const featuredArtists = cellStr(fields, f.featuredArtists)
  const imageUrl = cellStr(fields, f.imageUrl)
  const publicUrl = cellStr(fields, f.publicUrl)
  const rsvpUrl = cellStr(fields, f.rsvpUrl)
  const bookable = cellBool(fields, f.bookable)
  const smartSignEligible = cellBoolOptional(fields, f.smartSignEligible)
  const publicAiApproved = cellBoolOptional(fields, f.publicAiApproved)
  const doNotUseInAi = cellBoolOptional(fields, f.doNotUseInAi)
  const priority = cellNum(fields, f.priority)
  const tags = cellTags(fields, f.tags)
  const instructor = cellStr(fields, f.instructor)
  const timeText = cellStr(fields, f.timeText)
  const durationText = cellStr(fields, f.durationText)
  const costText = cellStr(fields, f.costText)
  const capacity = cellNum(fields, f.capacity)
  const ageRequirement = cellStr(fields, f.ageRequirement)
  const language = cellStr(fields, f.language)
  const contactName = cellStr(fields, f.contactName)
  const contactEmail = cellStr(fields, f.contactEmail)
  const artistRecordIds = cellLinkedIds(fields, f.artists)
  const curatorRecordIds = cellLinkedIds(fields, f.curators)
  const programStaffRecordIds = cellLinkedIds(fields, f.programStaff)

  const kind: KnowledgeRecordKind =
    bookable && recordType !== 'workshop' ? 'bookable_event' : recordType

  const registerUrl = rsvpUrl || publicUrl
  const ctaLabel =
    recordType === 'workshop' && bookable ? 'Register' : bookable ? 'RSVP' : 'More info'

  return {
    id: `airtable_programming:${record.id}`,
    orgSlug,
    source: 'airtable_programming',
    recordKind: kind,
    title,
    summary: summary || description?.slice(0, 600),
    description,
    startsAt,
    endsAt,
    visibility: legacyVisibilityFromProgramming(programmingVisibility),
    programmingVisibility,
    approvedForPublicAi: publicAiApproved ? true : publicAiApproved === false ? false : undefined,
    doNotUseInAi: doNotUseInAi === true ? true : undefined,
    status,
    curator,
    featuredArtists,
    instructor,
    timeText,
    durationText,
    costText,
    capacity,
    ageRequirement,
    language,
    contactName,
    contactEmail,
    artistRecordIds: artistRecordIds.length ? artistRecordIds : undefined,
    curatorRecordIds: curatorRecordIds.length ? curatorRecordIds : undefined,
    programStaffRecordIds: programStaffRecordIds.length ? programStaffRecordIds : undefined,
    relatedPeopleIds: artistRecordIds.length ? artistRecordIds : undefined,
    tags,
    location,
    address,
    imageUrl,
    primaryLink: publicUrl,
    rsvpUrl,
    bookingCta:
      bookable && registerUrl
        ? { label: ctaLabel, url: registerUrl, grounded: true }
        : publicUrl
          ? { label: 'More info', url: publicUrl, grounded: true }
          : undefined,
    priority,
    smartSignEligible,
    sourceTable: 'Programming',
    sourceRecordId: record.id,
    sourceUrl: publicUrl,
    publicPath: publicUrl?.startsWith('/') ? publicUrl : undefined,
  }
}

function parseMs(iso?: string | null): number | null {
  if (!iso || !String(iso).trim()) return null
  const n = new Date(iso).getTime()
  return Number.isNaN(n) ? null : n
}

function recordAnchorEndMs(r: KnowledgeRecord): number | null {
  return parseMs(r.endsAt) ?? parseMs(r.startsAt)
}

export function filterAirtableProgrammingForMemoryAgent(
  records: KnowledgeRecord[],
  mode: MemoryAgentMode,
  options: { recentDays: number; now?: Date }
): KnowledgeRecord[] {
  const now = options.now ?? new Date()
  const nowMs = now.getTime()
  const recentCutoff = nowMs - options.recentDays * 86400000

  return records.filter((r) => {
    if (r.doNotUseInAi === true) return false
    if (r.status === 'canceled' || r.status === 'archived') return false
    if (r.eventState === 'canceled') return false

    const end = recordAnchorEndMs(r)
    if (end != null && end < recentCutoff) return false

    if (mode === 'staff_operator') return true

    if (r.approvedForPublicAi === false) return false
    if (r.programmingVisibility === 'internal') return false
    if (r.status === 'draft') return false

    const vis = r.visibility
    if (vis === 'internal') return false
    return true
  })
}

export async function fetchAirtableProgrammingForMemoryAgent(
  orgSlug: string,
  options: FetchAirtableProgrammingOptions
): Promise<FetchAirtableProgrammingResult> {
  const slug = orgSlug.trim().toLowerCase()
  const conn = getProgrammingConnectionForOrg(slug)
  if (!conn) {
    return { ok: false, reason: 'not_configured', message: 'Airtable Programming is not configured.' }
  }

  const recentDays = options.recentDays ?? 30
  const now = options.now ?? new Date()

  try {
    const filterFormula = buildProgrammingOrgFilterFormula(conn)
    const records = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
      filterFormula,
      viewId: conn.viewId,
    })

    const scoped = scopeProgrammingRowsByOrg(records, conn)

    const mapped = scoped
      .map((row) => mapAirtableProgrammingRow(row, slug, conn.fieldMap))
      .filter(Boolean) as KnowledgeRecord[]

    const filtered = filterAirtableProgrammingForMemoryAgent(mapped, options.mode, {
      recentDays,
      now,
    })

    const peopleConn = getOoliteCrmPeopleConnection(slug)
    const linkedIds = filtered.flatMap((r) => [
      ...(r.artistRecordIds ?? r.relatedPeopleIds ?? []),
      ...(r.curatorRecordIds ?? []),
      ...(r.programStaffRecordIds ?? []),
    ])
    const nameMap =
      peopleConn && linkedIds.length
        ? await fetchCrmPeopleNameMap(peopleConn, linkedIds)
        : new Map<string, string>()
    const enriched = enrichProgrammingRecordsWithPeopleNames(filtered, nameMap)

    return { ok: true, records: enriched }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, reason: 'airtable_error', message }
  }
}

export async function getAirtableProgrammingStatusSummary(
  orgSlug: string
): Promise<{ configured: boolean; records: number; titles: string[] }> {
  const slug = orgSlug.trim().toLowerCase()
  const conn = getProgrammingConnectionForOrg(slug)
  if (!conn) {
    return { configured: false, records: 0, titles: [] }
  }

  try {
    const filterFormula = buildProgrammingOrgFilterFormula(conn)
    const rows = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
      filterFormula,
      viewId: conn.viewId,
    })
    const scoped = scopeProgrammingRowsByOrg(rows, conn)
    const titles = scoped
      .map((row) => cellStr(row.fields, conn.fieldMap.title))
      .filter(Boolean) as string[]
    return { configured: true, records: scoped.length, titles }
  } catch {
    return { configured: true, records: 0, titles: [] }
  }
}

export function mapAirtableProgrammingFixtures(
  records: AirtableRecord[],
  orgSlug: string,
  fieldMap?: ProgrammingFieldMap
): KnowledgeRecord[] {
  return records
    .map((row) => mapAirtableProgrammingRow(row, orgSlug, fieldMap))
    .filter(Boolean) as KnowledgeRecord[]
}
