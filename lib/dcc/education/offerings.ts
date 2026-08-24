import { vibeCodingNetArtOverview } from '@/content/workshop/vibe-coding-net-art-overview'
import { ipAgeOfAiWorkshop } from '@/data/ipAgeOfAiWorkshop'
import type { DccWorkshopOffering } from '@/lib/dcc/education/types'

/**
 * DCC MIA public workshop offerings — pages that already exist.
 * Do not list Oolite tenant-catalog rows here. Do not invent prices or capacity.
 * Resin copy/capacity stay in sync with `RESIN_PRINTING_WORKSHOP` (do not embed fabricate rates).
 */
export const DCC_WORKSHOP_OFFERINGS: DccWorkshopOffering[] = [
  {
    id: 'saturday-lab',
    slug: 'saturday-lab',
    title: 'Saturday Lab',
    shortDescription:
      'In-room lab for artist websites and vibe coding. Cheat sheets, packets, and a starter template — no account required.',
    href: '/workshop/saturday-lab',
    syllabusHref: '/workshop/saturday-lab/paths',
    format: 'lab',
    enrollment: 'open-lab',
    featured: true,
  },
  {
    id: 'resin-printing',
    slug: 'resin-printing',
    title: 'Intro to 3D Resin Printing for Artists',
    shortDescription:
      'Prepare a project, make informed slicing decisions, understand the complete workflow, and arrive ready for a supervised print appointment.',
    href: '/workshop/resin-printing',
    syllabusHref: '/workshop/resin-printing',
    format: 'in-person',
    capacity: 8,
    durationMinutes: 180,
    enrollment: 'inquiry',
    featured: true,
  },
  {
    id: 'vibe-coding-net-art',
    slug: 'vibe-coding-net-art',
    title: vibeCodingNetArtOverview.title,
    shortDescription: vibeCodingNetArtOverview.subtitle,
    href: '/workshop/vibe-coding-net-art',
    syllabusHref: '/workshop/vibe-coding-net-art',
    format: 'self-paced',
    enrollment: 'self-serve-handbook',
  },
  {
    id: 'ip-age-of-ai',
    slug: ipAgeOfAiWorkshop.slug,
    title: ipAgeOfAiWorkshop.title,
    shortDescription: ipAgeOfAiWorkshop.description,
    href: '/workshops/ip-age-of-ai',
    syllabusHref: '/workshops/ip-age-of-ai',
    format: 'hybrid',
    enrollment: 'inquiry',
  },
]

export function listWorkshopOfferings(
  offerings: readonly DccWorkshopOffering[] = DCC_WORKSHOP_OFFERINGS
): DccWorkshopOffering[] {
  return [...offerings]
}

export function getWorkshopOfferingBySlug(
  slug: string,
  offerings: readonly DccWorkshopOffering[] = DCC_WORKSHOP_OFFERINGS
): DccWorkshopOffering | undefined {
  return offerings.find((offering) => offering.slug === slug)
}

export function assertWorkshopOfferingSlugsValid(
  offerings: readonly DccWorkshopOffering[] = DCC_WORKSHOP_OFFERINGS
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const offering of offerings) {
    if (!offering.id) errors.push('workshop offering missing id')
    if (!offering.slug) errors.push(`workshop offering ${offering.id} missing slug`)
    if (!offering.href) errors.push(`workshop offering ${offering.id} missing href`)
    if (ids.has(offering.id)) errors.push(`duplicate workshop offering id ${offering.id}`)
    if (slugs.has(offering.slug)) {
      errors.push(`duplicate workshop offering slug ${offering.slug}`)
    }
    ids.add(offering.id)
    slugs.add(offering.slug)
  }
  return errors
}
