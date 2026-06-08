import type { KnowledgeRecord, KnowledgeRecordKind } from '@/lib/memory-agent/knowledge-record'
import {
  buildEventCardFields,
  toClientEventCards,
} from '@/lib/memory-agent/event-card-urls'
import type { MemoryAgentEventCard, MemoryAgentMode } from '@/types/memory-agent'

export type ParsedModelEvent = {
  id: string
  title?: string
  summary?: string
  startsAt?: string
  endsAt?: string
  location?: string
  ctaLabel?: string
  ctaUrl?: string
}

const CARD_RECORD_KINDS = new Set<MemoryAgentEventCard['recordKind']>([
  'event',
  'exhibition',
  'workshop',
  'announcement',
  'residency',
  'tour',
  'screening',
  'opportunity',
  'bookable_event',
  'editorial_story',
  'house_story',
  'member_route',
  'space',
])

function toEventCardRecordKind(
  kind: KnowledgeRecordKind
): MemoryAgentEventCard['recordKind'] {
  if (CARD_RECORD_KINDS.has(kind as MemoryAgentEventCard['recordKind'])) {
    return kind as MemoryAgentEventCard['recordKind']
  }
  if (kind === 'person' || kind === 'partner') return 'event'
  if (kind === 'member_route') return 'member_route'
  if (kind === 'space') return 'space'
  return 'event'
}

function toEventCardSource(
  source: KnowledgeRecord['source']
): MemoryAgentEventCard['source'] {
  if (source === 'announcement') return 'announcement'
  if (source === 'workshop') return 'workshop'
  if (source === 'cms_story') return 'cms_story'
  if (source === 'soho_record') return 'soho_record'
  if (source === 'airtable_programming') return 'announcement'
  return 'announcement'
}

export function mergeEventCardsFromContext(
  parsed: ParsedModelEvent[],
  contextRecords: KnowledgeRecord[],
  mode: MemoryAgentMode,
  orgSlug: string
): MemoryAgentEventCard[] {
  const byId = new Map(contextRecords.map((r) => [r.id, r]))
  const allowed = new Set(contextRecords.map((r) => r.id))

  const out: MemoryAgentEventCard[] = []
  for (const item of parsed) {
    if (!item.id || !allowed.has(item.id)) continue
    const record = byId.get(item.id)!
    const summary = item.summary?.trim() || record.summary?.slice(0, 280)
    out.push({
      id: record.id,
      title: record.title,
      recordKind: toEventCardRecordKind(record.recordKind),
      source: toEventCardSource(record.source),
      ...buildEventCardFields(record, mode, orgSlug, summary),
    })
  }
  return toClientEventCards(out, mode)
}

export function parseModelEventsFromAskJson(
  raw: unknown
): ParsedModelEvent[] {
  if (!Array.isArray(raw)) return []
  const out: ParsedModelEvent[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const id = typeof r.id === 'string' ? r.id : ''
    if (!id) continue
    out.push({
      id,
      title: typeof r.title === 'string' ? r.title : undefined,
      summary: typeof r.summary === 'string' ? r.summary : undefined,
      startsAt: typeof r.startsAt === 'string' ? r.startsAt : undefined,
      endsAt: typeof r.endsAt === 'string' ? r.endsAt : undefined,
      location: typeof r.location === 'string' ? r.location : undefined,
      ctaLabel: typeof r.ctaLabel === 'string' ? r.ctaLabel : undefined,
      ctaUrl: typeof r.ctaUrl === 'string' ? r.ctaUrl : undefined,
    })
  }
  return out
}

export { toClientEventCards } from '@/lib/memory-agent/event-card-urls'
