import { DCC_WORKSHOP_INTEREST_SOURCE_PREFIX } from '@/lib/dcc/education/copy'
import {
  getWorkshopOfferingBySlug,
  listAllWorkshopOfferings,
} from '@/lib/dcc/education/offerings'
import type { DccWorkshopOffering } from '@/lib/dcc/education/types'

export function parseWorkshopInterestSource(
  source: string | undefined
): DccWorkshopOffering | undefined {
  const raw = source?.trim()
  if (!raw) return undefined
  if (!raw.startsWith(DCC_WORKSHOP_INTEREST_SOURCE_PREFIX)) return undefined
  const slug = decodeURIComponent(raw.slice(DCC_WORKSHOP_INTEREST_SOURCE_PREFIX.length))
  if (!slug) return undefined
  return getWorkshopOfferingBySlug(slug, listAllWorkshopOfferings())
}
