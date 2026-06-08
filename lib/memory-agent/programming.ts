import type { Announcement } from '@/types/announcement'
import type { MemoryAgentMode } from '@/types/memory-agent'

import { createClient } from '@/lib/supabase/server'
import {
  fetchAirtableProgrammingForMemoryAgent,
} from '@/lib/memory-agent/airtable-programming'
import { programmingStatusLabel } from '@/lib/memory-agent/programming-display'
import { isAirtableProgrammingConfigured } from '@/lib/airtable/programming-config'
import type {
  KnowledgeRecord,
  KnowledgeRecordKind,
  KnowledgeRecordVisibility,
  MemoryIntent,
} from '@/lib/memory-agent/knowledge-record'
import {
  cosineSimilarity,
  keywordRetrieveScoreForKnowledgeRecord,
} from '@/lib/memory-agent/knowledge-retrieve'
import {
  getSohoDemoKnowledgeRecords,
  isSohoDemoOrg,
} from '@/lib/sohohouse/demo-knowledge-records'

export type FetchProgrammingOptions = {
  mode: MemoryAgentMode
  /** Include workshops with sessions in the next N days (default 14). */
  upcomingDays?: number
  /** Include announcements whose anchor ended within the last N days (default 30). */
  recentDays?: number
}

export type FetchProgrammingResult =
  | { ok: true; records: KnowledgeRecord[]; orgId: string }
  | { ok: false; reason: 'not_configured' | 'org_not_found' | 'supabase_error'; message?: string }

type AnnouncementRow = Announcement & {
  content?: string | null
  organization_id?: string | null
  is_active?: boolean | null
}

type WorkshopRow = {
  id: string
  organization_id: string
  title: string
  description?: string | null
  content?: string | null
  category?: string | null
  type?: string | null
  status?: string | null
  location?: string | null
  tags?: string[] | null
  metadata?: Record<string, unknown> | null
  image_url?: string | null
  is_public?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

type WorkshopSessionRow = {
  id: string
  workshop_id: string
  session_date: string | null
  session_end_date?: string | null
  location?: string | null
  is_active?: boolean | null
}

const DEFAULT_UPCOMING_DAYS = 14
const DEFAULT_RECENT_DAYS = 30
const ORG_TZ = 'America/New_York'

function parseMs(iso?: string | null): number | null {
  if (!iso || !String(iso).trim()) return null
  const n = new Date(iso).getTime()
  return Number.isNaN(n) ? null : n
}

function recordAnchorStartMs(r: KnowledgeRecord): number | null {
  return parseMs(r.startsAt) ?? parseMs(r.publishedAt) ?? parseMs(r.endsAt)
}

function recordAnchorEndMs(r: KnowledgeRecord): number | null {
  return parseMs(r.endsAt) ?? parseMs(r.startsAt) ?? parseMs(r.expiresAt)
}

function startOfWeekLocal(now: Date): Date {
  const d = new Date(now.toLocaleString('en-US', { timeZone: ORG_TZ }))
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeekLocal(now: Date): Date {
  const start = startOfWeekLocal(now)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  end.setMilliseconds(-1)
  return end
}

function overlapsRange(
  r: KnowledgeRecord,
  rangeStartMs: number,
  rangeEndMs: number
): boolean {
  const start = recordAnchorStartMs(r)
  const end = recordAnchorEndMs(r) ?? start
  if (start == null && end == null) return false
  const s = start ?? end!
  const e = end ?? start!
  return s <= rangeEndMs && e >= rangeStartMs
}

function announcementVisibility(row: AnnouncementRow): KnowledgeRecordVisibility {
  const v = String(row.visibility || 'both').toLowerCase()
  if (v === 'internal') return 'internal'
  if (v === 'external' || v === 'public') return 'public'
  if (v === 'both') return 'both'
  return 'both'
}

function announcementRecordKind(row: AnnouncementRow): KnowledgeRecordKind {
  const t = String(row.type || '').toLowerCase()
  const st = String(row.sub_type || '').toLowerCase()
  if (st === 'exhibition') return 'exhibition'
  if (st === 'workshop' || t === 'event' && st === 'workshop') return 'workshop'
  if (t === 'cinematic') return 'screening'
  if (t === 'opportunity' || st === 'open_call') return 'opportunity'
  if (t === 'event') return 'event'
  return 'event'
}

function announcementSummary(row: AnnouncementRow): string | undefined {
  const body = (row.body || row.content || '').trim()
  if (!body) return undefined
  return body.slice(0, 600)
}

function resolveProgrammingImageUrl(
  imageUrl?: string | null,
  media?: unknown
): string | undefined {
  const direct = imageUrl?.trim()
  if (direct) return direct
  if (!Array.isArray(media)) return undefined
  for (const item of media) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const url =
      (typeof record.url === 'string' && record.url) ||
      (typeof record.file_url === 'string' && record.file_url) ||
      (typeof record.src === 'string' && record.src)
    if (url?.trim()) return url.trim()
  }
  return undefined
}

export function mapAnnouncementToKnowledgeRecord(
  row: AnnouncementRow,
  orgSlug: string
): KnowledgeRecord {
  const startsAt = row.starts_at || row.start_date || undefined
  const endsAt = row.ends_at || row.end_date || undefined
  const rsvp = row.rsvp_url?.trim()
  const primary = row.primary_link?.trim()
  const ctaUrl = rsvp || primary
  return {
    id: `announcement:${row.id}`,
    orgSlug,
    source: 'announcement',
    recordKind: announcementRecordKind(row),
    title: row.title?.trim() || 'Untitled',
    summary: announcementSummary(row),
    description: announcementSummary(row),
    startsAt,
    endsAt,
    publishedAt: row.published_at || row.scheduled_at || row.created_at,
    expiresAt: row.expires_at || undefined,
    eventState: row.event_state,
    visibility: announcementVisibility(row),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    location: row.location?.trim() || undefined,
    primaryLink: primary || undefined,
    rsvpUrl: rsvp || undefined,
    bookingCta: ctaUrl
      ? {
          label: row.rsvp_label?.trim() || (rsvp ? 'RSVP' : 'More info'),
          url: ctaUrl,
          grounded: true,
        }
      : undefined,
    imageUrl: resolveProgrammingImageUrl(row.image_url, row.media),
    publicPath: `/o/${orgSlug}/announcements/${row.id}`,
    sourceTable: 'announcements',
    sourceRecordId: row.id,
  }
}

export function mapWorkshopSessionToKnowledgeRecord(
  workshop: WorkshopRow,
  session: WorkshopSessionRow,
  orgSlug: string
): KnowledgeRecord {
  const tags = Array.isArray(workshop.tags) ? workshop.tags.map(String) : []
  const marketingSlug =
    typeof workshop.metadata?.slug === 'string' ? workshop.metadata.slug.trim() : ''
  return {
    id: `workshop:${workshop.id}:session:${session.id}`,
    orgSlug,
    source: 'workshop',
    recordKind: 'workshop',
    title: workshop.title?.trim() || 'Workshop',
    summary: (workshop.description || workshop.content || '')?.trim().slice(0, 600) || undefined,
    startsAt: session.session_date || undefined,
    endsAt: session.session_end_date || session.session_date || undefined,
    publishedAt: workshop.created_at || undefined,
    visibility: workshop.is_public === false ? 'internal' : 'public',
    tags,
    location: session.location?.trim() || workshop.location?.trim() || undefined,
    imageUrl: resolveProgrammingImageUrl(workshop.image_url, workshop.metadata?.media),
    publicPath: marketingSlug
      ? `/o/${orgSlug}/workshops/${encodeURIComponent(marketingSlug)}`
      : `/o/${orgSlug}/workshops`,
    sourceTable: 'workshop_sessions',
    sourceRecordId: session.id,
  }
}

export function dedupeProgrammingRecords(records: KnowledgeRecord[]): KnowledgeRecord[] {
  const SOURCE_RANK: Partial<Record<KnowledgeRecord['source'], number>> = {
    airtable_programming: 100,
    announcement: 50,
    workshop: 50,
    cms_story: 40,
    soho_record: 30,
  }

  const byCanonical = new Map<string, KnowledgeRecord>()

  for (const record of records) {
    const canonical = `${record.title.trim().toLowerCase()}::${(record.startsAt || '').slice(0, 10)}`
    const existing = byCanonical.get(canonical)
    if (!existing) {
      byCanonical.set(canonical, record)
      continue
    }
    const rankNew = SOURCE_RANK[record.source] ?? 0
    const rankOld = SOURCE_RANK[existing.source] ?? 0
    const priNew = record.priority ?? 0
    const priOld = existing.priority ?? 0
    if (rankNew > rankOld || (rankNew === rankOld && priNew > priOld)) {
      byCanonical.set(canonical, record)
    }
  }

  const byId = new Map<string, KnowledgeRecord>()
  for (const record of byCanonical.values()) {
    byId.set(record.id, record)
  }
  return [...byId.values()]
}

function overlapsSummerRange(
  r: KnowledgeRecord,
  year: number,
  now: Date = new Date()
): boolean {
  const start = recordAnchorStartMs(r)
  const end = recordAnchorEndMs(r) ?? start
  if (start == null) return false
  const anchorYear = new Date(start).getFullYear()
  const targetYear = anchorYear >= year - 1 ? anchorYear : now.getFullYear()
  const sStart = new Date(`${targetYear}-06-01T00:00:00`).getTime()
  const sEnd = new Date(`${targetYear}-09-01T00:00:00`).getTime()
  const s = start
  const e = end ?? start
  return s <= sEnd && e >= sStart
}

/** Question-aware boosts for smart-sign and seasonal programming queries. */
export function applyProgrammingQuestionFilters(
  records: KnowledgeRecord[],
  question: string,
  now: Date = new Date()
): KnowledgeRecord[] {
  let out = records
  const q = question.trim()

  if (/\bsummer\b/i.test(q)) {
    const year = now.getFullYear()
    const summer = out.filter((r) => overlapsSummerRange(r, year, now))
    if (summer.length) out = summer
  }

  if (/\b(smart\s*sign|signage|sign\s+today)\b/i.test(q)) {
    const eligible = out.filter((r) => r.smartSignEligible !== false)
    if (eligible.length) {
      out = [...eligible].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    }
  }

  if (/\b(exhibition|exhibitions|on\s+view)\b/i.test(q) && !/\bworkshop|workshops|class|classes\b/i.test(q)) {
    out = [...out].sort((a, b) => {
      const kindBoost = (r: KnowledgeRecord) => (r.recordKind === 'exhibition' ? 1 : 0)
      const kb = kindBoost(b) - kindBoost(a)
      if (kb !== 0) return kb
      return (b.priority ?? 0) - (a.priority ?? 0)
    })
  }

  if (/\b(workshop|workshops|class|classes)\b/i.test(q)) {
    out = [...out].sort((a, b) => {
      const kindBoost = (r: KnowledgeRecord) => (r.recordKind === 'workshop' ? 1 : 0)
      const kb = kindBoost(b) - kindBoost(a)
      if (kb !== 0) return kb
      return (b.priority ?? 0) - (a.priority ?? 0)
    })
  }

  if (/\b(register|registration|sign up|bookable|rsvp|what can i register)\b/i.test(q)) {
    const bookable = out.filter((r) => r.bookingCta?.grounded || r.rsvpUrl || r.bookable)
    if (bookable.length) {
      out = [...bookable].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    }
  }

  if (/\b(beginner|beginners|all levels|all skill|no experience|first[- ]time)\b/i.test(q)) {
    out = [...out].sort((a, b) => {
      const hay = (r: KnowledgeRecord) =>
        [r.summary, r.description, r.ageRequirement, ...(r.tags ?? [])].filter(Boolean).join(' ')
      const boost = (r: KnowledgeRecord) =>
        /\ball skill|all levels|beginner|welcome|no prior|no experience/i.test(hay(r)) ? 1 : 0
      return boost(b) - boost(a)
    })
  }

  if (/\b(curat(ed|or|ors|orship)|who curated)\b/i.test(q)) {
    out = [...out].sort((a, b) => {
      const boost = (r: KnowledgeRecord) => (r.curatorNames?.length || r.curator ? 1 : 0)
      return boost(b) - boost(a)
    })
  }

  if (/\b(manage[sd]?|program staff|exhibition director|director of programs)\b/i.test(q)) {
    out = [...out].sort((a, b) => {
      const boost = (r: KnowledgeRecord) => (r.programStaffNames?.length ? 1 : 0)
      return boost(b) - boost(a)
    })
  }

  if (/\b(exhibit|exhibiting|who is in|which artists)\b/i.test(q)) {
    out = [...out].sort((a, b) => {
      const boost = (r: KnowledgeRecord) =>
        (r.artistNames?.length ?? r.artistRecordIds?.length ?? 0) +
        (r.featuredArtists ? 0.5 : 0)
      return boost(b) - boost(a)
    })
  }

  return out
}

export function filterProgrammingForMemoryAgent(
  records: KnowledgeRecord[],
  mode: MemoryAgentMode,
  options: { recentDays: number; now?: Date }
): KnowledgeRecord[] {
  const now = options.now ?? new Date()
  const nowMs = now.getTime()
  const recentCutoff = nowMs - options.recentDays * 86400000

  return records.filter((r) => {
    if (r.doNotUseInAi === true) return false
    if (r.eventState === 'canceled') return false
    if (r.status === 'canceled' || r.status === 'archived') return false

    const expires = parseMs(r.expiresAt)
    if (expires != null && expires < nowMs) return false

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

export type IntentTimeFilterMeta = {
  /** Strict calendar-week filter had at least one overlapping record. */
  weekOverlap: boolean
  /** No week overlap; surfaced next-upcoming records within 14 days instead. */
  usedUpcomingFallback: boolean
}

export type IntentTimeFilterResult = {
  records: KnowledgeRecord[]
  meta: IntentTimeFilterMeta
}

export const WEEK_UPCOMING_FALLBACK_DATA_GAP =
  'No published programming overlaps this calendar week; showing the next upcoming items within 14 days.'

export const WEEK_UPCOMING_FALLBACK_ANSWER_PREFIX =
  "I don't see programming that overlaps this calendar week, so I'm showing the next upcoming items."

export function applyIntentTimeFilter(
  records: KnowledgeRecord[],
  intent: MemoryIntent,
  now: Date = new Date()
): IntentTimeFilterResult {
  const nowMs = now.getTime()
  const meta: IntentTimeFilterMeta = { weekOverlap: false, usedUpcomingFallback: false }

  if (intent === 'upcoming') {
    return {
      records: records.filter((r) => {
        const start = recordAnchorStartMs(r)
        if (start == null) return true
        return start >= nowMs - 86400000
      }),
      meta,
    }
  }

  if (intent === 'latest') {
    return {
      records: [...records].sort((a, b) => {
        const pa = parseMs(a.publishedAt) ?? recordAnchorStartMs(a) ?? 0
        const pb = parseMs(b.publishedAt) ?? recordAnchorStartMs(b) ?? 0
        return pb - pa
      }),
      meta,
    }
  }

  if (intent === 'time_bound' || intent === 'recommendation') {
    const weekStart = startOfWeekLocal(now).getTime()
    const weekEnd = endOfWeekLocal(now).getTime()
    const inWeek = records.filter((r) => overlapsRange(r, weekStart, weekEnd))
    if (inWeek.length > 0) {
      meta.weekOverlap = true
      return { records: inWeek, meta }
    }
    // Fallback: next 14 days if nothing overlaps this week
    const horizon = nowMs + DEFAULT_UPCOMING_DAYS * 86400000
    const fallback = records.filter((r) => {
      const start = recordAnchorStartMs(r)
      if (start == null) return false
      return start <= horizon && (recordAnchorEndMs(r) ?? start) >= nowMs
    })
    if (fallback.length > 0) meta.usedUpcomingFallback = true
    return { records: fallback, meta }
  }

  return { records, meta }
}

export type ScoredKnowledgeRecord = { record: KnowledgeRecord; score: number }

export function rankProgrammingForQuestion(
  records: KnowledgeRecord[],
  question: string,
  questionEmbedding: number[] | null,
  rowEmbeddings: Map<string, number[]>
): ScoredKnowledgeRecord[] {
  const scored: ScoredKnowledgeRecord[] = []
  for (const record of records) {
    const kw = keywordRetrieveScoreForKnowledgeRecord(question, record)
    let sem = 0
    if (questionEmbedding && rowEmbeddings.has(record.id)) {
      sem = cosineSimilarity(questionEmbedding, rowEmbeddings.get(record.id)!)
      sem = (sem + 1) / 2
    }
    const priorityBoost = Math.min((record.priority ?? 0) / 100, 0.12)
    const smartSignBoost = record.smartSignEligible ? 0.06 : 0
    const exhibitionBoost = record.recordKind === 'exhibition' ? 0.04 : 0
    const workshopBoost = record.recordKind === 'workshop' ? 0.05 : 0
    const airtableBoost = record.source === 'airtable_programming' ? 0.08 : 0
    const instructorBoost =
      record.instructor &&
      question.toLowerCase().includes(record.instructor.toLowerCase().split(/\s+/)[0] ?? '')
        ? 0.1
        : 0
    const curatorQuestion = /\b(curat(ed|or|ors|orship)|who curated)\b/i.test(question)
    const manageQuestion =
      /\b(manage[sd]?|program staff|exhibition director|director of programs)\b/i.test(question)
    const exhibitQuestion = /\b(exhibit|exhibiting|who is in|which artists)\b/i.test(question)
    const textileQuestion = /\b(textile|fabric|quilt|cyanotype|workshop|teaches|teaching)\b/i.test(
      question
    )
    const workshopQuestion = /\b(workshop|workshops|class|classes)\b/i.test(question)
    const registerQuestion =
      /\b(register|registration|sign up|bookable|rsvp|what can i register)\b/i.test(question)
    let relationBoost = 0
    if (curatorQuestion && (record.curatorNames?.length || record.curator)) relationBoost += 0.22
    if (manageQuestion && record.programStaffNames?.length) relationBoost += 0.22
    if (exhibitQuestion && (record.artistNames?.length || record.featuredArtists)) {
      relationBoost += 0.18
    }
    if (textileQuestion && record.recordKind === 'workshop' && record.instructor) {
      relationBoost += 0.2
    }
    if (workshopQuestion && record.recordKind === 'workshop') relationBoost += 0.16
    if (registerQuestion && (record.bookingCta?.grounded || record.bookable)) relationBoost += 0.18
    const score =
      (questionEmbedding ? kw * 0.35 + sem * 0.65 : kw) +
      priorityBoost +
      smartSignBoost +
      exhibitionBoost +
      workshopBoost +
      airtableBoost +
      instructorBoost +
      relationBoost
    scored.push({ record, score })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored
}

export function selectProgrammingContextRows(
  ranked: ScoredKnowledgeRecord[],
  maxRows: number
): KnowledgeRecord[] {
  return ranked.slice(0, maxRows).map((r) => r.record)
}

export function knowledgeRecordToContextText(r: KnowledgeRecord): string {
  const parts: string[] = []
  parts.push(`Kind: ${r.recordKind}`)
  parts.push(`Title: ${r.title}`)
  if (r.summary?.trim()) parts.push(`Summary: ${r.summary.trim().slice(0, 500)}`)
  if (r.description?.trim() && r.description !== r.summary) {
    parts.push(`Description: ${r.description.trim().slice(0, 800)}`)
  }
  if (r.startsAt) parts.push(`Starts: ${r.startsAt}`)
  if (r.endsAt) parts.push(`Ends: ${r.endsAt}`)
  if (r.status) {
    parts.push(`Status: ${programmingStatusLabel(r.status) ?? r.status}`)
  }
  if (r.location) parts.push(`Location: ${r.location}`)
  if (r.address && r.address !== r.location) parts.push(`Address: ${r.address}`)
  if (r.curator) parts.push(`Curator: ${r.curator}`)
  if (r.featuredArtists) parts.push(`Featured artists: ${r.featuredArtists}`)
  if (r.artistNames?.length) {
    parts.push(`Exhibiting artists: ${r.artistNames.join('; ')}`)
  } else if (r.artistRecordIds?.length || r.relatedPeopleIds?.length) {
    const count = r.artistRecordIds?.length ?? r.relatedPeopleIds?.length ?? 0
    parts.push(`Linked artist records: ${count}`)
  }
  if (r.curatorNames?.length) parts.push(`Curators: ${r.curatorNames.join('; ')}`)
  if (r.programStaffNames?.length) {
    parts.push(`Program staff: ${r.programStaffNames.join('; ')}`)
  }
  if (r.instructor) parts.push(`Instructor: ${r.instructor}`)
  if (r.timeText) parts.push(`Time: ${r.timeText}`)
  if (r.durationText) parts.push(`Duration: ${r.durationText}`)
  if (r.costText) parts.push(`Cost: ${r.costText}`)
  if (r.capacity != null) parts.push(`Capacity: ${r.capacity}`)
  if (r.ageRequirement) parts.push(`Age requirement: ${r.ageRequirement}`)
  if (r.language) parts.push(`Language: ${r.language}`)
  if (r.contactName || r.contactEmail) {
    parts.push(
      `Contact: ${[r.contactName, r.contactEmail].filter(Boolean).join(' · ')}`
    )
  }
  if (r.imageUrl) parts.push(`Image URL: ${r.imageUrl}`)
  if (r.eventState) parts.push(`Event state: ${r.eventState}`)
  if (r.tags?.length) parts.push(`Tags: ${r.tags.join(', ')}`)
  if (r.source === 'soho_record') parts.push('Demo record: yes (Soho pitch seed — not live CMS)')
  if (r.source === 'airtable_programming') parts.push('Editorial source: Airtable Programming')
  if (r.smartSignEligible) parts.push('Smart sign eligible: yes')
  if (r.bookingCta?.grounded) {
    parts.push(`CTA: ${r.bookingCta.label} (${r.bookingCta.url})`)
  }
  parts.push(`Source: ${r.source}`)
  parts.push(`Record id: ${r.id}`)
  return parts.join('\n')
}

export function buildProgrammingContextBlock(rows: KnowledgeRecord[]): string {
  return rows
    .map((row, i) => `--- Programming ${i + 1} ---\n${knowledgeRecordToContextText(row)}`)
    .join('\n\n')
}

export function applyBookableQuestionFilter(
  records: KnowledgeRecord[],
  question: string
): KnowledgeRecord[] {
  if (
    !/\b(bookable|book\s+now|what\s+can\s+i\s+book|what\s+is\s+bookable|register\s+for|what\s+can\s+i\s+register)\b/i.test(
      question
    )
  ) {
    return records
  }
  return records.filter(
    (r) => r.recordKind === 'bookable_event' || r.recordKind === 'workshop'
  )
}

export function applyWorkshopQuestionFilter(
  records: KnowledgeRecord[],
  question: string
): KnowledgeRecord[] {
  if (!/\b(workshop|workshops|class|classes|textile|quilting|cyanotype|instructor|teaches)\b/i.test(question)) {
    return records
  }
  const workshops = records.filter((r) => r.recordKind === 'workshop')
  return workshops.length ? workshops : records
}

async function fetchSupabaseProgrammingRecords(
  slug: string,
  options: FetchProgrammingOptions,
  now: Date
): Promise<
  | { ok: true; records: KnowledgeRecord[]; orgId: string }
  | { ok: false; reason: 'not_configured' | 'org_not_found' | 'supabase_error'; message?: string }
> {
  const upcomingDays = options.upcomingDays ?? DEFAULT_UPCOMING_DAYS
  const recentDays = options.recentDays ?? DEFAULT_RECENT_DAYS

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return { ok: false, reason: 'not_configured', message: 'Supabase is not configured.' }
  }

  const supabase = createClient()
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, slug')
    .eq('slug', slug)
    .single()

  if (orgError || !organization) {
    return { ok: false, reason: 'org_not_found', message: 'Organization not found.' }
  }

  const orgId = organization.id as string
  const windowStart = new Date(now.getTime() - recentDays * 86400000).toISOString()
  const sessionEnd = new Date(now.getTime() + upcomingDays * 86400000).toISOString()

  const { data: announcementRows, error: annError } = await supabase
    .from('announcements')
    .select(
      `
      id,
      title,
      content,
      body,
      type,
      sub_type,
      priority,
      visibility,
      start_date,
      end_date,
      starts_at,
      ends_at,
      scheduled_at,
      expires_at,
      published_at,
      location,
      tags,
      metadata,
      media,
      image_url,
      is_active,
      status,
      primary_link,
      rsvp_url,
      rsvp_label,
      event_state,
      created_at,
      org_id,
      organization_id
    `
    )
    .or(`organization_id.eq.${orgId},org_id.eq.${orgId}`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(200)

  if (annError) {
    return { ok: false, reason: 'supabase_error', message: annError.message }
  }

  const announcements = (announcementRows || []) as AnnouncementRow[]
  const records: KnowledgeRecord[] = announcements.map((a) =>
    mapAnnouncementToKnowledgeRecord(a, slug)
  )

  const { data: workshops, error: wsError } = await supabase
    .from('workshops')
    .select(
      'id, organization_id, title, description, content, category, type, status, location, tags, metadata, image_url, is_public, created_at, updated_at'
    )
    .eq('organization_id', orgId)
    .eq('status', 'published')
    .limit(80)

  if (!wsError && workshops?.length) {
    const wids = (workshops as WorkshopRow[]).map((w) => w.id)
    const { data: sessions } = await supabase
      .from('workshop_sessions')
      .select('id, workshop_id, session_date, session_end_date, location, is_active')
      .in('workshop_id', wids)
      .eq('is_active', true)
      .gte('session_date', windowStart)
      .lte('session_date', sessionEnd)
      .order('session_date', { ascending: true })

    const byWorkshop = new Map<string, WorkshopRow>()
    for (const w of workshops as WorkshopRow[]) byWorkshop.set(w.id, w)

    for (const sess of (sessions || []) as WorkshopSessionRow[]) {
      const w = byWorkshop.get(sess.workshop_id)
      if (!w) continue
      records.push(mapWorkshopSessionToKnowledgeRecord(w, sess, slug))
    }
  }

  const filtered = filterProgrammingForMemoryAgent(records, options.mode, {
    recentDays,
    now,
  })

  return { ok: true, records: filtered, orgId }
}

export async function fetchProgrammingForMemoryAgent(
  orgSlug: string,
  options: FetchProgrammingOptions
): Promise<FetchProgrammingResult> {
  const slug = orgSlug.trim().toLowerCase()
  const recentDays = options.recentDays ?? DEFAULT_RECENT_DAYS
  const now = new Date()

  if (isSohoDemoOrg(slug)) {
    const records = getSohoDemoKnowledgeRecords(slug, options.mode, now)
    const filtered = filterProgrammingForMemoryAgent(records, options.mode, {
      recentDays,
      now,
    })
    return { ok: true, records: filtered, orgId: 'soho-demo' }
  }

  const airtablePromise = isAirtableProgrammingConfigured(slug)
    ? fetchAirtableProgrammingForMemoryAgent(slug, { mode: options.mode, recentDays, now })
    : Promise.resolve({ ok: false as const, reason: 'not_configured' as const })

  const supabasePromise = fetchSupabaseProgrammingRecords(slug, options, now)

  const [airtableResult, supabaseResult] = await Promise.all([airtablePromise, supabasePromise])

  const merged: KnowledgeRecord[] = []
  if (airtableResult.ok) merged.push(...airtableResult.records)
  if (supabaseResult.ok) merged.push(...supabaseResult.records)

  if (merged.length === 0) {
    if (supabaseResult.ok === false && supabaseResult.reason === 'org_not_found') {
      return supabaseResult
    }
    if (airtableResult.ok === false && airtableResult.reason === 'airtable_error') {
      return {
        ok: false,
        reason: 'supabase_error',
        message: airtableResult.message || 'Programming sources unavailable.',
      }
    }
    return {
      ok: false,
      reason: 'not_configured',
      message:
        'Programming is not configured. Set Airtable Programming and/or Supabase announcements.',
    }
  }

  const deduped = dedupeProgrammingRecords(merged)
  const orgId = supabaseResult.ok ? supabaseResult.orgId : slug

  return { ok: true, records: deduped, orgId }
}
