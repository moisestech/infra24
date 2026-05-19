import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { alumniYearLabel } from '@/lib/airtable/alumni-service'
import {
  collectResidencyYearOptions,
  rowResidencyYearTokens,
} from '@/lib/airtable/alumni-residency-years'

export { collectResidencyYearOptions, rowResidencyYearTokens }

/** Residency year (dedicated column or legacy `year`). */
export function alumniResidencyYear(row: AlumniAirtableRow): string | undefined {
  const tokens = rowResidencyYearTokens(row)
  if (tokens.length === 0) return undefined
  const sorted = [...tokens].sort(
    (a, b) => (parseInt(b, 10) || 0) - (parseInt(a, 10) || 0)
  )
  return sorted[0]
}

export function alumniResidencyYearLabel(row: AlumniAirtableRow): string {
  return alumniYearLabel(alumniResidencyYear(row))
}

export function alumniHasWebsite(row: AlumniAirtableRow): boolean {
  return Boolean(row.website?.trim())
}

/** True when location text suggests Miami (case-insensitive). */
export function alumniIsMiamiBased(row: AlumniAirtableRow): boolean {
  const loc = row.location?.trim()
  if (!loc) return false
  return /\bmiami\b/i.test(loc)
}

export type WebsiteFilter = '__all__' | 'yes' | 'no'
export type MiamiFilter = '__all__' | 'miami' | 'not_miami'

export function rowMatchesWebsiteFilter(
  row: AlumniAirtableRow,
  filter: WebsiteFilter
): boolean {
  if (filter === '__all__') return true
  const has = alumniHasWebsite(row)
  return filter === 'yes' ? has : !has
}

export function rowMatchesMiamiFilter(row: AlumniAirtableRow, filter: MiamiFilter): boolean {
  if (filter === '__all__') return true
  const miami = alumniIsMiamiBased(row)
  return filter === 'miami' ? miami : !miami
}

export function rowMatchesResidencyYear(
  row: AlumniAirtableRow,
  yearFilter: string
): boolean {
  if (yearFilter === '__all__') return true
  return rowResidencyYearTokens(row).includes(yearFilter)
}
