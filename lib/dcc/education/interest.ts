import { DCC_WORKSHOP_INTEREST_SOURCE_PREFIX } from '@/lib/dcc/education/copy'
import {
  getWorkshopOfferingBySlug,
  listAllWorkshopOfferings,
} from '@/lib/dcc/education/offerings'
import { getCurriculumWorkshopBySlug } from '@/lib/dcc/education/3d-curriculum/workshops'

export type WorkshopInterestMatch = {
  title: string
  slug: string
}

export function parseWorkshopInterestSource(
  source: string | undefined
): WorkshopInterestMatch | undefined {
  const raw = source?.trim()
  if (!raw) return undefined
  if (!raw.startsWith(DCC_WORKSHOP_INTEREST_SOURCE_PREFIX)) return undefined
  const slug = decodeURIComponent(raw.slice(DCC_WORKSHOP_INTEREST_SOURCE_PREFIX.length))
  if (!slug) return undefined
  const offering = getWorkshopOfferingBySlug(slug, listAllWorkshopOfferings())
  if (offering) return { title: offering.title, slug: offering.slug }
  const curriculum = getCurriculumWorkshopBySlug(slug)
  if (curriculum) return { title: curriculum.title, slug: curriculum.slug }
  return undefined
}
