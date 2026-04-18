import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { getWorkshopPublicPath } from '@/lib/workshops/workshop-routing'
import { workshopTrackLabel } from '@/lib/workshops/track-labels'
import type {
  CatalogFilterGroupId,
  CatalogSortMode,
} from '@/lib/workshops/digital-lab-catalog-constants'
import { labelForTrack } from '@/lib/workshops/digital-lab-catalog-constants'

export type ResolvedReleaseStatus = NonNullable<
  WorkshopMarketingMetadata['releaseStatus']
>

export type ResolvedMarketingLevel = NonNullable<
  WorkshopMarketingMetadata['marketingLevel']
>

export type ResolvedDurationBucket = NonNullable<
  WorkshopMarketingMetadata['durationBucket']
>

export type CatalogWorkshopView = {
  row: WorkshopRow
  marketing: WorkshopMarketingMetadata
  href: string
  trackId: NonNullable<WorkshopMarketingMetadata['track']>
  trackLabel: string
  releaseStatus: ResolvedReleaseStatus
  sessionFormat: WorkshopMarketingMetadata['sessionFormat']
  marketingLevel: ResolvedMarketingLevel
  durationBucket: ResolvedDurationBucket
  durationMinutes: number | null
  packetStatus: WorkshopMarketingMetadata['packetStatus']
  websiteReadiness: WorkshopMarketingMetadata['websiteReadiness']
  resourcesAvailability: WorkshopMarketingMetadata['resourcesAvailability']
  audienceTags: string[]
  featured: boolean
  buildPriority: number | null
  title: string
}

export type CatalogFiltersState = Record<CatalogFilterGroupId, Set<string>>

export function emptyCatalogFilters(): CatalogFiltersState {
  return {
    track: new Set(),
    level: new Set(),
    format: new Set(),
    duration: new Set(),
    audience: new Set(),
    status: new Set(),
    packet_status: new Set(),
    website: new Set(),
    resources: new Set(),
  }
}

export function cloneCatalogFilters(f: CatalogFiltersState): CatalogFiltersState {
  const n = emptyCatalogFilters()
  const keys = Object.keys(n) as CatalogFilterGroupId[]
  for (const k of keys) {
    n[k] = new Set(f[k])
  }
  return n
}

export function toggleFilterSelection(
  filters: CatalogFiltersState,
  group: CatalogFilterGroupId,
  id: string
): CatalogFiltersState {
  const next = cloneCatalogFilters(filters)
  const s = next[group]
  if (s.has(id)) s.delete(id)
  else s.add(id)
  return next
}

export function removeFilterSelection(
  filters: CatalogFiltersState,
  group: CatalogFilterGroupId,
  id: string
): CatalogFiltersState {
  const next = cloneCatalogFilters(filters)
  next[group].delete(id)
  return next
}

function isAdultStudioWorkshop(row: WorkshopRow): boolean {
  if (row.category === 'adult_studio_classes') return true
  const meta = row.metadata as Record<string, unknown> | null | undefined
  return meta?.program === 'adult_art_classes'
}

/** Digital Lab catalog rows: has roadmap track and is not adult studio series */
export function isDigitalLabCatalogWorkshop(row: WorkshopRow): boolean {
  if (isAdultStudioWorkshop(row)) return false
  const m = mergeWorkshopMetadata(row.metadata ?? undefined, {
    id: row.id ?? '',
    title: row.title ?? '',
  })
  if (m.catalog === 'digital_lab') return true
  return Boolean(m.track)
}

export function deriveDurationBucket(
  minutes: number | null | undefined,
  override?: WorkshopMarketingMetadata['durationBucket']
): ResolvedDurationBucket {
  if (override) return override
  const m = minutes ?? 0
  if (m <= 0) return 'three_h'
  if (m <= 120) return 'two_h'
  if (m <= 180) return 'two_to_three_h'
  if (m <= 210) return 'three_h'
  if (m <= 240) return 'three_to_four_h'
  return 'three_to_four_h'
}

function deriveMarketingLevel(
  row: WorkshopRow,
  override?: WorkshopMarketingMetadata['marketingLevel']
): ResolvedMarketingLevel {
  if (override) return override
  const lv = (row.level ?? 'beginner').toLowerCase()
  if (lv === 'beginner') return 'beginner'
  if (lv === 'intermediate') return 'intermediate'
  if (lv === 'advanced') return 'advanced_experimental'
  return 'beginner_intermediate'
}

function deriveReleaseStatus(
  row: WorkshopRow,
  override?: WorkshopMarketingMetadata['releaseStatus']
): ResolvedReleaseStatus {
  if (override) return override
  const st = (row.status ?? '').toLowerCase()
  if (st === 'published') return 'website_ready'
  if (st === 'draft') return 'in_development'
  return 'coming_soon'
}

export function normalizeCatalogWorkshop(
  orgSlug: string,
  row: WorkshopRow
): CatalogWorkshopView | null {
  if (!isDigitalLabCatalogWorkshop(row)) return null
  const marketing = mergeWorkshopMetadata(row.metadata ?? undefined, {
    id: row.id,
    title: row.title ?? '',
  })
  const track = marketing.track
  if (!track) return null

  const trackLabel = workshopTrackLabel(track) ?? labelForTrack(track)
  const durationBucket = deriveDurationBucket(
    row.duration_minutes,
    marketing.durationBucket
  )

  return {
    row,
    marketing,
    href: getWorkshopPublicPath(orgSlug, row),
    trackId: track,
    trackLabel,
    releaseStatus: deriveReleaseStatus(row, marketing.releaseStatus),
    sessionFormat: marketing.sessionFormat,
    marketingLevel: deriveMarketingLevel(row, marketing.marketingLevel),
    durationBucket,
    durationMinutes:
      row.duration_minutes != null ? row.duration_minutes : null,
    packetStatus: marketing.packetStatus,
    websiteReadiness: marketing.websiteReadiness,
    resourcesAvailability: marketing.resourcesAvailability,
    audienceTags: marketing.audienceTags ?? [],
    featured: Boolean(row.featured),
    buildPriority:
      marketing.buildPriority != null ? marketing.buildPriority : null,
    title: row.title ?? '',
  }
}

export function normalizeCatalogWorkshops(
  orgSlug: string,
  rows: WorkshopRow[]
): CatalogWorkshopView[] {
  const out: CatalogWorkshopView[] = []
  for (const row of rows) {
    const v = normalizeCatalogWorkshop(orgSlug, row)
    if (v) out.push(v)
  }
  return out
}

function marketingLevelRank(l: ResolvedMarketingLevel): number {
  const order: ResolvedMarketingLevel[] = [
    'beginner',
    'beginner_intermediate',
    'intermediate',
    'advanced_experimental',
  ]
  return order.indexOf(l)
}

function releaseStatusRank(r: ResolvedReleaseStatus): number {
  const order: ResolvedReleaseStatus[] = [
    'website_ready',
    'in_development',
    'coming_soon',
  ]
  return order.indexOf(r)
}

export function sortCatalogWorkshops(
  views: CatalogWorkshopView[],
  mode: CatalogSortMode
): CatalogWorkshopView[] {
  const copy = [...views]
  switch (mode) {
    case 'alphabetical':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case 'beginner_friendly':
      return copy.sort(
        (a, b) =>
          marketingLevelRank(a.marketingLevel) -
          marketingLevelRank(b.marketingLevel)
      )
    case 'duration_asc': {
      const dur = (v: CatalogWorkshopView) =>
        v.durationMinutes ?? Number.POSITIVE_INFINITY
      return copy.sort((a, b) => dur(a) - dur(b))
    }
    case 'website_ready_first':
      return copy.sort(
        (a, b) =>
          releaseStatusRank(a.releaseStatus) - releaseStatusRank(b.releaseStatus)
      )
    case 'featured':
    default:
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        const pa = a.buildPriority ?? 99
        const pb = b.buildPriority ?? 99
        if (pa !== pb) return pa - pb
        return a.title.localeCompare(b.title)
      })
  }
}

function setHasAny<T>(set: Set<T>, values: Iterable<T>): boolean {
  for (const v of Array.from(values)) {
    if (set.has(v)) return true
  }
  return false
}

/** OR within group, AND across groups. Empty set = no constraint for that group. */
export function filterCatalogWorkshops(
  views: CatalogWorkshopView[],
  filters: CatalogFiltersState
): CatalogWorkshopView[] {
  return views.filter((v) => {
    if (filters.track.size && !filters.track.has(v.trackId)) return false
    if (filters.level.size && !filters.level.has(v.marketingLevel)) {
      return false
    }
    if (filters.format.size) {
      const sf = v.sessionFormat
      if (!sf || !filters.format.has(sf)) return false
    }
    if (filters.duration.size && !filters.duration.has(v.durationBucket)) {
      return false
    }
    if (filters.audience.size) {
      const tags = new Set(v.audienceTags)
      if (!setHasAny(tags, filters.audience)) return false
    }
    if (filters.status.size && !filters.status.has(v.releaseStatus)) {
      return false
    }
    if (filters.packet_status.size) {
      const ps = v.packetStatus
      if (!ps || !filters.packet_status.has(ps)) return false
    }
    if (filters.website.size) {
      const w = v.websiteReadiness
      if (!w || !filters.website.has(w)) return false
    }
    if (filters.resources.size) {
      const r = v.resourcesAvailability
      if (!r || !filters.resources.has(r)) return false
    }
    return true
  })
}

export function distinctTrackCount(views: CatalogWorkshopView[]): number {
  return new Set(views.map((v) => v.trackId)).size
}
