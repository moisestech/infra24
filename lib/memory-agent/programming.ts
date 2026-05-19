import type { Announcement } from '@/types/announcement'
import type { MemoryAgentMode } from '@/types/memory-agent'

import { createClient } from '@/lib/supabase/server'
import type { MemoryIntent } from '@/lib/memory-agent/intent'
import type {
  KnowledgeRecord,
  KnowledgeRecordKind,
  KnowledgeRecordVisibility,
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
      : undefined,
    sourceTable: 'workshop_sessions',
    sourceRecordId: session.id,
  }
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

    const expires = parseMs(r.expiresAt)
    if (expires != null && expires < nowMs) return false

    const end = recordAnchorEndMs(r)
    if (end != null && end < recentCutoff) return false

    if (mode === 'staff_operator') return true

    if (r.approvedForPublicAi === false) return false

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
    const score = questionEmbedding ? kw * 0.35 + sem * 0.65 : kw
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
  if (r.startsAt) parts.push(`Starts: ${r.startsAt}`)
  if (r.endsAt) parts.push(`Ends: ${r.endsAt}`)
  if (r.location) parts.push(`Location: ${r.location}`)
  if (r.eventState) parts.push(`Event state: ${r.eventState}`)
  if (r.tags?.length) parts.push(`Tags: ${r.tags.join(', ')}`)
  if (r.source === 'soho_record') parts.push('Demo record: yes (Soho pitch seed — not live CMS)')
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
  if (!/\b(bookable|book\s+now|what\s+can\s+i\s+book|what\s+is\s+bookable)\b/i.test(question)) {
    return records
  }
  return records.filter(
    (r) => r.recordKind === 'bookable_event' || r.recordKind === 'workshop'
  )
}

export async function fetchProgrammingForMemoryAgent(
  orgSlug: string,
  options: FetchProgrammingOptions
): Promise<FetchProgrammingResult> {
  const slug = orgSlug.trim().toLowerCase()
  const upcomingDays = options.upcomingDays ?? DEFAULT_UPCOMING_DAYS
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
