import { vibeCodingNetArtOverview } from '@/content/workshop/vibe-coding-net-art-overview'
import { ipAgeOfAiWorkshop } from '@/data/ipAgeOfAiWorkshop'
import type { DccWorkshopOffering } from '@/lib/dcc/education/types'
import { RESIN_BANNER_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'
import { SATURDAY_LAB_BANNERS } from '@/lib/workshops/saturday-lab-media'
import { IP_AGE_OF_AI_LANDSCAPE_BANNER_URL } from '@/lib/workshops/ip-age-of-ai-video'

/** Existing vibe-coding catalog still (same asset as the handbook chapters). */
const VIBE_CODING_OFFERING_IMAGE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525117/dccmiami/workshops/vibe-coding-with-net-art_dtead3.png'

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
    image: {
      src: SATURDAY_LAB_BANNERS.startHere,
      alt: 'Saturday Lab start-here banner with two in-room paths: beginner website and vibe coding.',
      caption: 'Existing Saturday Lab banner',
    },
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
    image: {
      src: RESIN_BANNER_CDN.welcome,
      alt: 'Conceptual resin sculpture and cured sample on a workshop table — same curriculum as the Oolite Digital Lab session.',
      caption: 'Conceptual — not a documentary photo',
    },
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
    image: {
      src: VIBE_CODING_OFFERING_IMAGE,
      alt: 'Vibecoding and Net Art handbook catalog still.',
      caption: 'Existing handbook banner',
    },
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
    image: {
      src: IP_AGE_OF_AI_LANDSCAPE_BANNER_URL,
      alt: 'Skills: Intellectual Property in the Age of AI landscape banner.',
      caption: 'Existing session banner',
    },
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
