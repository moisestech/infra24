import {
  CONCEPTUAL_EDUCATIONAL_CAPTION,
  DCC_EDUCATION_PHOTO_STILLS,
} from '@/lib/dcc/education/photo-stills'
import { workshopInterestHref } from '@/lib/dcc/education/copy'

export type EditorialWorkshopFigure = {
  src: string
  alt: string
  caption: string
  /** CSS object-position to keep the action in frame on mobile crops. */
  objectPosition?: string
}

export type EditorialWorkshopSection = {
  kicker: string
  body: string
  image: EditorialWorkshopFigure
}

export type EditorialWorkshopLink = {
  href: string
  label: string
}

export type EditorialWorkshopPageContent = {
  slug: string
  title: string
  lead: string
  heroKicker: string
  hero: EditorialWorkshopFigure
  sections: EditorialWorkshopSection[]
  furtherTitle: string
  furtherBody: string
  furtherLinks: EditorialWorkshopLink[]
}

const caption = CONCEPTUAL_EDUCATIONAL_CAPTION

export const THREE_D_PRINTING_FOR_ARTISTS: EditorialWorkshopPageContent = {
  slug: '3d-printing-for-artists',
  title: '3D Printing for Artists',
  lead:
    'Print, clean, finish, and check a physical object. FDM/PLA and resin SLA are process choices. An AI-generated file can start the work — it is not automatically fabrication-ready.',
  heroKicker: 'PRINT',
  hero: {
    src: DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail'],
    alt: 'Close conceptual view of an FDM printer depositing filament onto a small form.',
    caption,
    objectPosition: 'center 40%',
  },
  sections: [
    {
      kicker: 'CLEANUP',
      body: 'Support removal is a skill, not leftover plastic. What comes off the machine is not the finished object.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['3d-printing-support-removal'],
        alt: 'Hands removing support material from a small printed form.',
        caption,
        objectPosition: 'center 55%',
      },
    },
    {
      kicker: 'FINISH',
      body: 'Surface work changes how the object reads in a room. One action: sanding, filling, or priming — not a full shop tour.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['3d-printing-finishing'],
        alt: 'Gloved hand sanding a printed surface, conceptual educational still.',
        caption,
        objectPosition: 'center 45%',
      },
    },
    {
      kicker: 'MEASURE',
      body: 'Print, then inspect. Dimensions and fit are checked against the intent of the file — not assumed from the slicer.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['3d-printing-measure-validate'],
        alt: 'Caliper jaws measuring a printed part, conceptual educational still.',
        caption,
        objectPosition: 'center 50%',
      },
    },
    {
      kicker: 'COMPARE',
      body: 'Layer lines, seams, and sanding marks are judgments you can see. The page names the difference; the photograph holds one comparison.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['3d-printing-finish-comparison'],
        alt: 'Side-by-side conceptual still of a raw printed surface and a refined surface.',
        caption,
        objectPosition: 'center 50%',
      },
    },
  ],
  furtherTitle: 'Take it further',
  furtherBody:
    'Resin SLA has its own taught syllabus. AI → 3D is the path from concept to a physical object on either printer class.',
  furtherLinks: [
    { href: '/workshop/resin-printing', label: 'Resin SLA syllabus' },
    { href: '/workshop/ai-3d-physical-object', label: 'AI → 3D Physical Object' },
    { href: workshopInterestHref('3d-printing-for-artists'), label: 'Register interest' },
  ],
}

export const AI_3D_PHYSICAL_OBJECT: EditorialWorkshopPageContent = {
  slug: 'ai-3d-physical-object',
  title: 'AI → 3D Physical Object',
  lead:
    'Move from a digital concept to a physical object. This path can land on PLA FDM or resin SLA. Photographs here are conceptual educational stills, not a documentary class.',
  heroKicker: 'MODEL',
  hero: {
    src: DCC_EDUCATION_PHOTO_STILLS['ai-3d-model-review'],
    alt: 'Two people reviewing a laptop model beside a small green printed object — conceptual educational still.',
    caption,
    objectPosition: 'center 35%',
  },
  sections: [
    {
      kicker: 'IMAGINE',
      body: 'Several visual directions, photographed as a working session. No fake software tutorial, no readable interface.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['ai-3d-concept-selection'],
        alt: 'Laptop, sketches, and small printed thumbnails on a work table, conceptual educational still.',
        caption,
        objectPosition: 'center 45%',
      },
    },
    {
      kicker: 'PREPARE',
      body: 'Slicing and support strategy is a relationship between screen and object. AI output is not automatically fabrication-ready.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['ai-3d-slicing'],
        alt: 'Printed test piece beside a generic slicing visualization, no readable UI.',
        caption,
        objectPosition: 'center 50%',
      },
    },
    {
      kicker: 'PRINT',
      body: 'The machine is shared with 3D Printing for Artists. Process choice — FDM or resin — happens here, not in a separate catalog card.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail'],
        alt: 'Close conceptual view of an FDM printer depositing filament onto a small form.',
        caption,
        objectPosition: 'center 40%',
      },
    },
    {
      kicker: 'FINISH',
      body: 'Physical refinement after the print. One action, close detail.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['ai-3d-finishing'],
        alt: 'Close sanding of a printed form, conceptual educational still.',
        caption,
        objectPosition: 'center 50%',
      },
    },
    {
      kicker: 'TEST',
      body: 'Digital dimensions become physical reality only when they are checked. The image does not publish measurements as facts.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['ai-3d-measure-validate'],
        alt: 'Caliper close-up on a printed object, conceptual educational still.',
        caption,
        objectPosition: 'center 50%',
      },
    },
    {
      kicker: 'OUTCOME',
      body: 'The object became real. Not product glamour — an uncluttered studio still of a finished form.',
      image: {
        src: DCC_EDUCATION_PHOTO_STILLS['ai-3d-final-object'],
        alt: 'Finished printed object against an uncluttered studio background, conceptual educational still.',
        caption,
        objectPosition: 'center 45%',
      },
    },
  ],
  furtherTitle: 'Take it further',
  furtherBody:
    '3D Printing for Artists is the physical process. Resin SLA has a taught syllabus when that is the printer class.',
  furtherLinks: [
    { href: '/workshop/3d-printing-for-artists', label: '3D Printing for Artists' },
    { href: '/workshop/resin-printing', label: 'Resin SLA syllabus' },
    { href: workshopInterestHref('ai-3d-physical-object'), label: 'Register interest' },
  ],
}

export function getEditorialWorkshopBySlug(
  slug: string
): EditorialWorkshopPageContent | undefined {
  if (slug === THREE_D_PRINTING_FOR_ARTISTS.slug) return THREE_D_PRINTING_FOR_ARTISTS
  if (slug === AI_3D_PHYSICAL_OBJECT.slug) return AI_3D_PHYSICAL_OBJECT
  return undefined
}
