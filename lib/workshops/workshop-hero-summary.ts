import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import type { WorkshopRow } from '@/components/workshops/marketing/types'
import { formatMonthDayYearWithOrdinal } from '@/lib/dates/format-with-ordinal'

export function formatWorkshopLevelHeading(levelLabel: string): string {
  const s = levelLabel.trim() || 'beginner'
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() + ' course'
}

/** e.g. `3 hours` when whole hours; otherwise compact `2h 30m`. */
export function formatWorkshopDurationHeading(minutes?: number | null): string | null {
  if (minutes == null || minutes <= 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0 && h > 0) {
    return h === 1 ? '1 hour' : `${h} hours`
  }
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  return `${m} min`
}

export function workshopCatalogUpdatedIso(
  marketing: WorkshopMarketingMetadata,
  workshop: WorkshopRow
): string | null {
  const raw = marketing.catalogContentUpdatedAt?.trim()
  if (raw) return raw
  const u = workshop.updated_at?.trim()
  return u || null
}

export function formatWorkshopUpdatedHeading(
  marketing: WorkshopMarketingMetadata,
  workshop: WorkshopRow
): string | null {
  const iso = workshopCatalogUpdatedIso(marketing, workshop)
  if (!iso) return null
  const line = formatMonthDayYearWithOrdinal(iso)
  return line ? `Updated: ${line}` : null
}
