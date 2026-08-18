/**
 * Swap-ready section media for /fabricate pages.
 * Drop WebP/PNG files into `public/dcc/fabrication/` matching `fileName`,
 * then set `src` (or leave undefined — UI shows the shot-brief placeholder).
 */
export type FabricationSectionMedia = {
  id: string
  /** Destination filename under /dcc/fabrication/ when you deliver assets. */
  fileName: string
  title: string
  /** Production shot brief for photographers / art direction. */
  shot: string
  alt: string
  aspect: '16/9' | '21/9' | '4/5' | '1/1'
  width: number
  height: number
  /** Public path when file exists — leave undefined for placeholder UI. */
  src?: string
  caption?: string
}

const BASE = '/dcc/fabrication'

function slot(
  partial: Omit<FabricationSectionMedia, 'src'> & { ready?: boolean }
): FabricationSectionMedia {
  const { ready, ...rest } = partial
  return {
    ...rest,
    src: ready ? `${BASE}/${partial.fileName}` : undefined,
    caption: partial.caption ?? 'Image needed',
  }
}

/** Landing + pricing + finishes + quote section slots. */
export const FABRICATION_SECTION_MEDIA = {
  hero: slot({
    id: 'fab-hero',
    fileName: '01-fabricate-hero.webp',
    title: 'Fabrication studio hero',
    shot: 'Wide Bakehouse / Studio 43 fabrication desk: printer silhouette, cured or FDM samples, no people, no readable UI. 21:9 banner-friendly.',
    alt: 'Artist fabrication workstation with printer and sample objects.',
    aspect: '21/9',
    width: 1920,
    height: 823,
  }),
  lanes: slot({
    id: 'fab-lanes',
    fileName: '02-service-lanes.webp',
    title: 'Three service lanes',
    shot: 'Triptych still: print-ready USB/file, rough mesh on laptop silhouette, sketch-to-object planning tiles. No text in image.',
    alt: 'Three conceptual stages from print-ready file to custom project planning.',
    aspect: '16/9',
    width: 1600,
    height: 900,
  }),
  pricing: slot({
    id: 'fab-pricing',
    fileName: '03-pricing-transparency.webp',
    title: 'Transparent pricing visual',
    shot: 'Still life: scale cube, filament/resin spool silhouette, timer form, blank estimate card — communicate cost drivers without numbers in the image.',
    alt: 'Objects suggesting setup, machine time, material, and labor as pricing drivers.',
    aspect: '16/9',
    width: 1600,
    height: 900,
  }),
  finishesHero: slot({
    id: 'fab-finishes-hero',
    fileName: '04-finishes-states.webp',
    title: 'Finish states overview',
    shot: 'Same object in raw / cleaned / assembly / primed / finished states left-to-right. Prefer real photos when available; until then keep conceptual.',
    alt: 'One artifact shown across five finish states from raw print to finished object.',
    aspect: '16/9',
    width: 1672,
    height: 941,
    caption: 'Conceptual stand-in — replace with verified finish photography',
  }),
  access: slot({
    id: 'fab-access',
    fileName: '05-artist-access.webp',
    title: 'Artist Access',
    shot: 'Membership / access cue: workshop badge card silhouette, approved checklist, small credit token — no logos or dollar amounts in image.',
    alt: 'Artist access materials suggesting workshop alumni pathway.',
    aspect: '16/9',
    width: 1600,
    height: 900,
  }),
  quote: slot({
    id: 'fab-quote',
    fileName: '06-quote-intake.webp',
    title: 'Quote intake',
    shot: 'Clean desk: labeled USB, closed project box, blank intake form silhouette. No PII or brand UI.',
    alt: 'Project intake materials for a fabrication quote request.',
    aspect: '16/9',
    width: 1600,
    height: 900,
  }),
  finishRaw: slot({
    id: 'fab-finish-raw',
    fileName: 'finish-l0-raw.webp',
    title: 'L0 Raw print',
    shot: 'As-printed part with supports just removed; raking light.',
    alt: 'Raw 3D print after basic support removal.',
    aspect: '4/5',
    width: 1200,
    height: 1500,
  }),
  finishClean: slot({
    id: 'fab-finish-clean',
    fileName: 'finish-l1-clean.webp',
    title: 'L1 Clean print',
    shot: 'Cleaned part, light sanding evidence, no paint.',
    alt: 'Cleaned 3D print after deburring and light sanding.',
    aspect: '4/5',
    width: 1200,
    height: 1500,
  }),
  finishAssembly: slot({
    id: 'fab-finish-assembly',
    fileName: 'finish-l2-assembly.webp',
    title: 'L2 Assembly-ready',
    shot: 'Joined parts with visible pins/seams planned, unpainted.',
    alt: 'Assembly-ready fabricated parts with joining hardware.',
    aspect: '4/5',
    width: 1200,
    height: 1500,
  }),
  finishExhibition: slot({
    id: 'fab-finish-exhibition',
    fileName: 'finish-l3-exhibition.webp',
    title: 'L3 Exhibition prep',
    shot: 'Primed / filled sculpture ready for paint.',
    alt: 'Exhibition-prep object with primer and seam repair.',
    aspect: '4/5',
    width: 1200,
    height: 1500,
  }),
  finishFinished: slot({
    id: 'fab-finish-finished',
    fileName: 'finish-l4-finished.webp',
    title: 'L4 Finished object',
    shot: 'Presentation-ready painted or coated object.',
    alt: 'Finished fabricated object with surface treatment.',
    aspect: '4/5',
    width: 1200,
    height: 1500,
  }),
} as const

export type FabricationSectionMediaId = keyof typeof FABRICATION_SECTION_MEDIA

/** Temporary stand-ins until dedicated finishes photography lands (instructional concepts). */
export const FABRICATION_FINISHES_STANDIN_SRC =
  '/workshops/resin-printing/instructional-concepts/113-post-processing-states.webp'

export const FABRICATION_PLANNING_STANDIN_SRC =
  '/workshops/resin-printing/instructional-concepts/112-project-planning-drivers.webp'

export function resolveFabricationSectionMedia(
  id: FabricationSectionMediaId
): FabricationSectionMedia {
  const media = FABRICATION_SECTION_MEDIA[id]
  if (id === 'finishesHero' && !media.src) {
    return { ...media, src: FABRICATION_FINISHES_STANDIN_SRC }
  }
  return media
}

export function getFabricationSectionMedia(
  id: FabricationSectionMediaId
): FabricationSectionMedia {
  return resolveFabricationSectionMedia(id)
}

export const FABRICATION_MEDIA_DROP_PATH = 'public/dcc/fabrication'
