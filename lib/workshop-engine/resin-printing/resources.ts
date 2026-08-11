import type { WorkshopResource } from '@/lib/workshop-engine/types'
import { RESIN_BOOKLET_EDITION } from '@/lib/workshop-engine/resin-printing/booklet'

/** Interim 9-page draft (in-repo). Full Canva booklet is too large for git — host separately. */
export const RESIN_BOOKLET_DRAFT_HREF =
  '/workshops/resin-printing/artist-guide-draft.pdf'

export const RESIN_RESOURCES: WorkshopResource[] = [
  {
    id: 'booklet-draft',
    title: 'Artist guide draft (PDF)',
    description: `${RESIN_BOOKLET_EDITION.editionNote} Interim 9-page draft download available; exact page mapping still pending.`,
    href: RESIN_BOOKLET_DRAFT_HREF,
    status: 'ready',
  },
  {
    id: 'sample-stl',
    title: 'Sample STL',
    description: 'Validated demonstration model for the slicer lab sequence.',
    status: 'placeholder',
  },
  {
    id: 'slicer-link',
    title: 'Validated slicer',
    description: 'Venue-specific slicer + known-good profile (enter before publish).',
    status: 'placeholder',
  },
  {
    id: 'readiness-checklist',
    title: 'Appointment readiness checklist',
    description: 'Ready / repair / consultation exit card for supervised print booking.',
    href: '/workshop/resin-printing/modules/project-readiness',
    status: 'ready',
  },
  {
    id: 'glossary',
    title: 'Quick glossary',
    description: 'Plain-language terms: vat, FEP/film, supports, hollow, drain, cure.',
    href: '/workshop/resin-printing/resources#glossary',
    status: 'ready',
  },
  {
    id: 'media-shot-list',
    title: 'Media shot list',
    description:
      'Production checklist of stills, kit pack shots, class photos, video loops, and diagrams to capture or match.',
    href: '/workshop/resin-printing/media',
    status: 'ready',
  },
]

export const RESIN_GLOSSARY: { term: string; definition: string }[] = [
  {
    term: 'Uncured resin',
    definition:
      'Liquid or sticky photopolymer that has not fully hardened — requires PPE and containment.',
  },
  {
    term: 'Controlled zone',
    definition:
      'Area for printer, vat, wash/cure, and uncured materials. Instructor-led in this workshop.',
  },
  {
    term: 'Supports',
    definition:
      'Temporary structures added in the slicer so overhangs survive peel forces during printing.',
  },
  {
    term: 'Hollow + drain',
    definition:
      'Hollowing reduces resin use; drain holes prevent trapped liquid resin inside the part.',
  },
  {
    term: 'Wash',
    definition:
      'Solvent cleaning step (often IPA) to remove uncured resin from the surface before curing.',
  },
  {
    term: 'Cure',
    definition:
      'UV post-exposure that hardens remaining reactive material after washing.',
  },
]
