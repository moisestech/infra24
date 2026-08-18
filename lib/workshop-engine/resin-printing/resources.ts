import type { WorkshopResource } from '@/lib/workshop-engine/types'
import {
  RESIN_BOOKLET_EDITION,
  bookletDownloadHref,
} from '@/lib/workshop-engine/resin-printing/booklet'

/** @deprecated Prefer bookletDownloadHref() — kept for older imports. */
export const RESIN_BOOKLET_DRAFT_HREF = bookletDownloadHref()

export const RESIN_BOOKLET_PDF_HREF = bookletDownloadHref()

export const RESIN_RESOURCES: WorkshopResource[] = [
  {
    id: 'booklet-print-spreads',
    title: 'Artist guide (print-spread PDF)',
    description: `${RESIN_BOOKLET_EDITION.editionNote}`,
    href: RESIN_BOOKLET_PDF_HREF,
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
    id: 'photon-workshop',
    title: 'Photon Workshop (slicer)',
    description:
      'Validated Anycubic Photon Workshop resource for the slicer lab. Exporting a slice file is not permission to start the printer.',
    href: 'https://www.anycubic.com/pages/anycubic-photon-workshop',
    status: 'ready',
  },
  {
    id: 'readiness-checklist',
    title: 'Appointment readiness checklist',
    description: 'Ready / repair / consultation exit card for supervised print booking.',
    href: '/workshop/resin-printing/modules/project-readiness',
    status: 'ready',
  },
  {
    id: 'fabricate-pricing',
    title: 'Transparent fabrication pricing',
    description:
      'Full-Service, Artist Access, and Commercial rates with worked examples — separate from workshop curriculum.',
    href: '/fabricate/pricing',
    status: 'ready',
  },
  {
    id: 'fabricate-finishes',
    title: 'Finish levels',
    description: 'Raw through finished object — in-house Levels 0–2, custom quote for 3–4.',
    href: '/fabricate/finishes',
    status: 'ready',
  },
  {
    id: 'fabricate-quote',
    title: 'Request a fabrication quote',
    description: 'Submit a project for staff review and a transparent estimate.',
    href: '/fabricate/quote',
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
