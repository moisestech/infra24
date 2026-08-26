import { vibeCodingNetArtOverview } from '@/content/workshop/vibe-coding-net-art-overview'
import type { DccWorkshopOffering, DccWorkshopOfferingImage } from '@/lib/dcc/education/types'
import { DCC_WORKSHOP_IN_DEVELOPMENT } from '@/lib/dcc/education/in-development'
import {
  CONCEPTUAL_EDUCATIONAL_CAPTION,
  DCC_EDUCATION_PHOTO_STILLS,
} from '@/lib/dcc/education/photo-stills'
import { RESIN_CONCEPT_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'
import {
  SATURDAY_LAB_BANNERS,
  SATURDAY_LAB_ICONS,
  SATURDAY_LAB_TOOL_SCREENSHOTS,
} from '@/lib/workshops/saturday-lab-media'

/** Existing vibe-coding catalog still (same asset as the handbook chapters). */
const VIBE_CODING_OFFERING_IMAGE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525117/dccmiami/workshops/vibe-coding-with-net-art_dtead3.png'

const VIBE_CODING_HEADER_STILL =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1776612065/vibe-code-and-net-art_mx7emv.webp'

function still(
  src: string,
  alt: string,
  caption?: string
): DccWorkshopOfferingImage {
  return caption ? { src, alt, caption } : { src, alt }
}

function withCover(
  offering: Omit<DccWorkshopOffering, 'image'>
): DccWorkshopOffering {
  return {
    ...offering,
    image: offering.images[0],
  }
}

/**
 * DCC MIA public workshop offerings — pages that already exist.
 * Two 3D catalog workshops (physical process + AI→3D). Resin SLA syllabus
 * stays at `/workshop/resin-printing` and is linked from those pages — not a third catalog card.
 * Skills: IP in the Age of AI is Oolite Arts only — do not list it here.
 * Do not list other Oolite tenant-catalog rows. Do not invent prices or capacity.
 */
export const DCC_WORKSHOP_OFFERINGS: DccWorkshopOffering[] = [
  withCover({
    id: 'saturday-lab',
    slug: 'saturday-lab',
    title: 'Saturday Lab',
    shortDescription:
      'In-room lab for artist websites and vibe coding. Cheat sheets, packets, and a starter template — no account required.',
    href: '/workshop/saturday-lab',
    syllabusHref: '/workshop/saturday-lab/paths',
    format: 'lab',
    status: 'live',
    enrollment: 'open-lab',
    featured: true,
    hue: 158,
    hueAccent: 205,
    icon: {
      src: SATURDAY_LAB_ICONS.path,
      alt: 'Saturday Lab path icon — two in-room tracks.',
    },
    images: [
      still(
        SATURDAY_LAB_BANNERS.startHere,
        'Saturday Lab start-here banner with two in-room paths: beginner website and vibe coding.',
        'Existing Saturday Lab banner'
      ),
      still(
        SATURDAY_LAB_BANNERS.beginner,
        'Saturday Lab beginner artist website workflow banner.',
        'Existing Saturday Lab banner'
      ),
      still(
        SATURDAY_LAB_BANNERS.vibeCoding,
        'Saturday Lab vibe coding workspace banner.',
        'Existing Saturday Lab banner'
      ),
      still(
        SATURDAY_LAB_BANNERS.resources,
        'Saturday Lab resources and tutorial library banner.',
        'Existing Saturday Lab banner'
      ),
      still(
        SATURDAY_LAB_BANNERS.outcomes,
        'Saturday Lab workshop outcomes banner.',
        'Existing Saturday Lab banner'
      ),
    ],
  }),
  withCover({
    id: '3d-printing-for-artists',
    slug: '3d-printing-for-artists',
    title: '3D Printing for Artists',
    shortDescription:
      'Print, clean, finish, and check a physical object. FDM/PLA and resin SLA are process choices. AI can start a file — it is not automatically fabrication-ready.',
    href: '/workshop/3d-printing-for-artists',
    syllabusHref: '/workshop/resin-printing',
    format: 'in-person',
    status: 'live',
    enrollment: 'inquiry',
    featured: true,
    hue: 168,
    hueAccent: 145,
    icon: {
      src: RESIN_CONCEPT_CDN['201-m01-process-choice'],
      alt: 'Process-choice teaching board used as the 3D printing mark.',
    },
    images: [
      still(
        DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail'],
        'Close conceptual view of an FDM printer depositing filament.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['3d-printing-support-removal'],
        'Hands removing support material from a printed form.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['3d-printing-finishing'],
        'Gloved hand sanding a printed surface.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['3d-printing-measure-validate'],
        'Caliper jaws measuring a printed part.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['3d-printing-finish-comparison'],
        'Conceptual comparison of a raw printed surface and a refined surface.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
    ],
  }),
  withCover({
    id: 'ai-3d-physical-object',
    slug: 'ai-3d-physical-object',
    title: 'AI → 3D Physical Object',
    shortDescription:
      'From a digital concept to a physical object. This path can land on PLA FDM or resin SLA.',
    href: '/workshop/ai-3d-physical-object',
    format: 'hybrid',
    status: 'live',
    enrollment: 'inquiry',
    featured: true,
    hue: 175,
    hueAccent: 280,
    icon: {
      src: SATURDAY_LAB_ICONS.ai,
      alt: 'AI assistant icon for the AI to 3D workshop.',
    },
    images: [
      still(
        DCC_EDUCATION_PHOTO_STILLS['ai-3d-model-review'],
        'Reviewing a digital model beside a printed object, conceptual educational still.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['ai-3d-concept-selection'],
        'Concept-selection working session with sketches and printed thumbnails.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['ai-3d-slicing'],
        'Printed test piece beside a generic slicing visualization.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail'],
        'Shared printer still — the same machine used in 3D Printing for Artists.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
      still(
        DCC_EDUCATION_PHOTO_STILLS['ai-3d-final-object'],
        'Finished printed object against an uncluttered studio background.',
        CONCEPTUAL_EDUCATIONAL_CAPTION
      ),
    ],
  }),
  withCover({
    id: 'vibe-coding-net-art',
    slug: 'vibe-coding-net-art',
    title: vibeCodingNetArtOverview.title,
    shortDescription: vibeCodingNetArtOverview.subtitle,
    href: '/workshop/vibe-coding-net-art',
    syllabusHref: '/workshop/vibe-coding-net-art',
    format: 'self-paced',
    status: 'live',
    enrollment: 'self-serve-handbook',
    hue: 198,
    hueAccent: 312,
    icon: {
      src: SATURDAY_LAB_ICONS.code,
      alt: 'Code icon for the Vibecoding and Net Art handbook.',
    },
    images: [
      still(
        VIBE_CODING_OFFERING_IMAGE,
        'Vibecoding and Net Art handbook catalog still.',
        'Existing handbook banner'
      ),
      still(
        VIBE_CODING_HEADER_STILL,
        'Vibecoding and Net Art header still.',
        'Existing handbook still'
      ),
      still(
        SATURDAY_LAB_BANNERS.vibeCoding,
        'Vibe coding workspace banner from Saturday Lab.',
        'Existing Saturday Lab banner'
      ),
      still(
        SATURDAY_LAB_TOOL_SCREENSHOTS.codepen,
        'CodePen editor screenshot used in the vibe coding workshop.',
        'Existing tool still'
      ),
      still(
        SATURDAY_LAB_TOOL_SCREENSHOTS.cursor,
        'Cursor editor screenshot used in the vibe coding workshop.',
        'Existing tool still'
      ),
    ],
  }),
]

export function listWorkshopOfferings(
  offerings: readonly DccWorkshopOffering[] = DCC_WORKSHOP_OFFERINGS
): DccWorkshopOffering[] {
  return [...offerings]
}

export function listInDevelopmentWorkshopOfferings(
  offerings: readonly DccWorkshopOffering[] = DCC_WORKSHOP_IN_DEVELOPMENT
): DccWorkshopOffering[] {
  return [...offerings]
}

export function listAllWorkshopOfferings(): DccWorkshopOffering[] {
  return [...DCC_WORKSHOP_OFFERINGS, ...DCC_WORKSHOP_IN_DEVELOPMENT]
}

export function getWorkshopOfferingBySlug(
  slug: string,
  offerings: readonly DccWorkshopOffering[] = listAllWorkshopOfferings()
): DccWorkshopOffering | undefined {
  return offerings.find((offering) => offering.slug === slug)
}

export function assertWorkshopOfferingSlugsValid(
  offerings: readonly DccWorkshopOffering[] = listAllWorkshopOfferings()
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const offering of offerings) {
    if (!offering.id) errors.push('workshop offering missing id')
    if (!offering.slug) errors.push(`workshop offering ${offering.id} missing slug`)
    if (!offering.status) errors.push(`workshop offering ${offering.id} missing status`)
    if (offering.status === 'live' && !offering.href) {
      errors.push(`live workshop offering ${offering.id} missing href`)
    }
    if (offering.status === 'in-development' && offering.href) {
      errors.push(`in-development offering ${offering.id} must not invent a live href`)
    }
    if (ids.has(offering.id)) errors.push(`duplicate workshop offering id ${offering.id}`)
    if (slugs.has(offering.slug)) {
      errors.push(`duplicate workshop offering slug ${offering.slug}`)
    }
    ids.add(offering.id)
    slugs.add(offering.slug)
  }
  return errors
}
