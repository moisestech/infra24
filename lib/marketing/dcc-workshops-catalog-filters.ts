import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import type { WorkshopTrackId } from '@/lib/workshops/track-labels'

export const DCC_CATALOG_PAGE_SIZE = 24

export type DccCatalogSortMode = 'popular' | 'rated' | 'recent' | 'featured'

export type DccCatalogDurationBucketId = 'lt20' | '20to60' | 'gt60'

export type DccCatalogFilterState = {
  tracks: WorkshopTrackId[]
  formats: WorkshopMarketingMetadata['format'][]
  tags: string[]
  levels: Array<'beginner' | 'intermediate' | 'advanced'>
  prices: Array<'free' | 'paid'>
  durations: DccCatalogDurationBucketId[]
}

export function emptyDccCatalogFilterState(): DccCatalogFilterState {
  return {
    tracks: [],
    formats: [],
    tags: [],
    levels: [],
    prices: [],
    durations: [],
  }
}

const HOUR = 60

export function durationMinutesToBucket(
  minutes: number | null | undefined
): DccCatalogDurationBucketId | null {
  if (minutes == null || Number.isNaN(minutes) || minutes <= 0) return null
  const h = minutes / HOUR
  if (h < 20) return 'lt20'
  if (h <= 60) return '20to60'
  return 'gt60'
}

function workshopTags(w: WorkshopRow): string[] {
  const m = mergeWorkshopMetadata(w.metadata ?? undefined, {
    id: w.id,
    title: w.title,
  })
  const raw = m.tags ?? []
  return raw.map((t) => String(t).toLowerCase().trim()).filter(Boolean)
}

function workshopTrack(w: WorkshopRow): WorkshopTrackId | undefined {
  const m = mergeWorkshopMetadata(w.metadata ?? undefined, {
    id: w.id,
    title: w.title,
  })
  return m.track
}

function workshopLevel(w: WorkshopRow): 'beginner' | 'intermediate' | 'advanced' {
  const lv = (w.level ?? 'beginner').toLowerCase()
  if (lv === 'intermediate' || lv === 'advanced') return lv
  return 'beginner'
}

function workshopPriceBand(w: WorkshopRow): 'free' | 'paid' {
  const p = w.price ?? 0
  return p === 0 ? 'free' : 'paid'
}

/**
 * AND across filter groups; OR within each group when multiple values selected.
 * Empty group = no constraint.
 */
export function matchesDccCatalogFilters(w: WorkshopRow, state: DccCatalogFilterState): boolean {
  if (state.tracks.length > 0) {
    const t = workshopTrack(w)
    if (!t || !state.tracks.includes(t)) return false
  }

  if (state.formats.length > 0) {
    const m = mergeWorkshopMetadata(w.metadata ?? undefined, {
      id: w.id,
      title: w.title,
    })
    if (!state.formats.includes(m.format)) return false
  }

  if (state.tags.length > 0) {
    const tags = new Set(workshopTags(w))
    const any = state.tags.some((sel) => tags.has(sel.toLowerCase()))
    if (!any) return false
  }

  if (state.levels.length > 0) {
    if (!state.levels.includes(workshopLevel(w))) return false
  }

  if (state.prices.length > 0) {
    const band = workshopPriceBand(w)
    if (!state.prices.includes(band)) return false
  }

  if (state.durations.length > 0) {
    const bucket = durationMinutesToBucket(w.duration_minutes ?? 0)
    if (!bucket || !state.durations.includes(bucket)) return false
  }

  return true
}

export function sortDccCatalogWorkshops(
  list: WorkshopRow[],
  mode: DccCatalogSortMode
): WorkshopRow[] {
  const out = [...list]
  const num = (n: number | null | undefined) =>
    typeof n === 'number' && !Number.isNaN(n) ? n : 0
  const time = (s: string | null | undefined) => (s ? new Date(s).getTime() : 0)

  out.sort((a, b) => {
    if (mode === 'featured') {
      const fa = Boolean(a.featured)
      const fb = Boolean(b.featured)
      if (fa !== fb) return fa ? -1 : 1
      return (a.title ?? '').localeCompare(b.title ?? '')
    }
    if (mode === 'popular') {
      const d =
        num(b.total_bookings) - num(a.total_bookings) ||
        num(b.confirmed_bookings) - num(a.confirmed_bookings) ||
        num(b.average_rating) - num(a.average_rating)
      if (d !== 0) return d
      return (a.title ?? '').localeCompare(b.title ?? '')
    }
    if (mode === 'rated') {
      const d =
        num(b.average_rating) - num(a.average_rating) ||
        num(b.total_feedback) - num(a.total_feedback) ||
        num(b.total_bookings) - num(a.total_bookings)
      if (d !== 0) return d
      return (a.title ?? '').localeCompare(b.title ?? '')
    }
    /* recent */
    const d = time(b.updated_at) - time(a.updated_at)
    if (d !== 0) return d
    return (a.title ?? '').localeCompare(b.title ?? '')
  })

  return out
}

/** Tag counts for sidebar (lowercased keys). */
export function buildTagCounts(workshops: WorkshopRow[]): { tag: string; count: number }[] {
  const map = new Map<string, number>()
  for (const w of workshops) {
    for (const t of workshopTags(w)) {
      map.set(t, (map.get(t) ?? 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, 30)
}
