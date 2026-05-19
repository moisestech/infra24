import type { MemoryAgentDataGap } from '@/types/memory-agent'

const GAP_TYPES = new Set<MemoryAgentDataGap['gapType']>([
  'missing_person_data',
  'missing_programming_data',
  'missing_date',
  'missing_cta',
  'missing_visibility',
  'missing_public_approval',
  'empty_time_window',
  'ambiguous_event_type',
])

const GAP_SOURCES = new Set<MemoryAgentDataGap['source']>([
  'airtable_alumni',
  'supabase_announcements',
  'supabase_workshops',
  'memory_agent',
])

export function parseStructuredDataGapsFromApi(raw: unknown): MemoryAgentDataGap[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  const out: MemoryAgentDataGap[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const id = typeof r.id === 'string' ? r.id : ''
    const message = typeof r.message === 'string' ? r.message : ''
    const gapType = r.gapType
    const source = r.source
    if (!id || !message) continue
    if (typeof gapType !== 'string' || !GAP_TYPES.has(gapType as MemoryAgentDataGap['gapType'])) {
      continue
    }
    if (typeof source !== 'string' || !GAP_SOURCES.has(source as MemoryAgentDataGap['source'])) {
      continue
    }
    out.push({
      id,
      message,
      gapType: gapType as MemoryAgentDataGap['gapType'],
      source: source as MemoryAgentDataGap['source'],
      sourceRecordId: typeof r.sourceRecordId === 'string' ? r.sourceRecordId : undefined,
      action: typeof r.action === 'string' ? (r.action as MemoryAgentDataGap['action']) : undefined,
      actionLabel: typeof r.actionLabel === 'string' ? r.actionLabel : undefined,
      actionHref: typeof r.actionHref === 'string' ? r.actionHref : undefined,
    })
  }
  return out.length ? out : undefined
}
