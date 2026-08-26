/**
 * Swap-ready section media for /fabricate pages.
 * Drop WebP/PNG files into `public/dcc/fabrication/` matching `fileName`,
 * then set `src` (or leave undefined — UI shows the shot-brief placeholder).
 */
export type FabricationMediaKind = 'conceptual' | 'documentary'

export const FABRICATION_CONCEPTUAL_CAPTION =
  'Conceptual illustration — not a documentary photo'

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
  kind?: FabricationMediaKind
}

const BASE = '/dcc/fabrication'
const RESIN_FINISHES_CDN =
  'https://res.cloudinary.com/dck5rzi4h/image/upload'

function slot(
  partial: Omit<FabricationSectionMedia, 'src'> & {
    ready?: boolean
    /** Optional CDN or absolute URL override (preferred over local ready path). */
    cdnSrc?: string
  }
): FabricationSectionMedia {
  const { ready, cdnSrc, ...rest } = partial
  const hasSrc = Boolean(cdnSrc || ready)
  const caption =
    rest.caption ??
    (rest.kind === 'conceptual'
      ? FABRICATION_CONCEPTUAL_CAPTION
      : hasSrc
        ? undefined
        : 'Image needed')
  return {
    ...rest,
    src: cdnSrc ?? (ready ? `${BASE}/${partial.fileName}` : undefined),
    caption,
  }
}

/** Landing + pricing + finishes + quote section slots. */
export const FABRICATION_SECTION_MEDIA = {
  hero: slot({
    id: 'fab-hero',
    fileName: '01-fabricate-hero.webp',
    title: 'Fabrication studio hero',
    shot: 'Wide Bakehouse / Studio 43 fabrication desk: printer silhouette, cured or FDM samples, no people, no readable UI. 21:9 banner-friendly.',
    alt: 'Conceptual fabrication workstation with printer and sample objects — not a documentary Studio 43 photo.',
    aspect: '21/9',
    width: 1920,
    height: 823,
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/q_auto,f_auto/v1787769817/dccmiami/workshops/resin-printing-for-artist/01-fabricate-hero-conceptual-01_hxs1v9.webp`,
  }),
  fieldLab: slot({
    id: 'fab-field-lab',
    fileName: 'field-lab-joint-testing-overhead.webp',
    title: 'Field-lab joint testing',
    shot: 'Overhead conceptual still of printed parts arranged for joint testing. Not a documentary shop photo.',
    alt: 'Overhead conceptual view of printed parts arranged for joint testing.',
    aspect: '16/9',
    width: 1600,
    height: 900,
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/q_auto,f_auto/v1787769817/dccmiami/workshops/resin-printing-for-artist/field-lab-joint-testing-overhead-conceptual-01_tkk8ip.webp`,
  }),
  lanes: slot({
    id: 'fab-lanes',
    fileName: '02-service-lanes.webp',
    title: 'Three service lanes',
    shot: 'Triptych still: print-ready USB/file, rough mesh on laptop silhouette, sketch-to-object planning tiles. No text in image.',
    alt: 'Three conceptual stages from print-ready file to custom project planning.',
    aspect: '16/9',
    width: 1536,
    height: 1024,
    kind: 'conceptual',
    ready: true,
  }),
  pricing: slot({
    id: 'fab-pricing',
    fileName: '03-pricing-transparency.webp',
    title: 'Transparent pricing visual',
    shot: 'Still life: scale cube, filament/resin spool silhouette, timer form, blank estimate card — communicate cost drivers without numbers in the image.',
    alt: 'Objects suggesting setup, machine time, material, and labor as pricing drivers.',
    aspect: '16/9',
    width: 1536,
    height: 1024,
    kind: 'conceptual',
    ready: true,
  }),
  finishesHero: slot({
    id: 'fab-finishes-hero',
    fileName: '300-finishes-l0-l4-hero.webp',
    title: 'Finish states overview',
    shot: 'Same object in raw / cleaned / refined / primed / finished states left-to-right. Prefer real photos when available; until then keep conceptual.',
    alt: 'One artifact shown across five finish states from raw print to artist-finished object.',
    aspect: '21/9',
    width: 1915,
    height: 821,
    caption: 'Conceptual finish ladder L0–L4',
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/v1787062508/dccmiami/workshops/resin-printing-for-artist/300-finishes-l0-l4-hero_nignxd.webp`,
  }),
  access: slot({
    id: 'fab-access',
    fileName: '05-artist-access.webp',
    title: 'Artist Access',
    shot: 'Membership / access cue: workshop badge card silhouette, approved checklist, small credit token — no logos or dollar amounts in image.',
    alt: 'Artist access materials suggesting workshop alumni pathway.',
    aspect: '16/9',
    width: 1536,
    height: 1024,
    kind: 'conceptual',
    ready: true,
  }),
  quote: slot({
    id: 'fab-quote',
    fileName: '06-quote-intake.webp',
    title: 'Quote intake',
    shot: 'Clean desk: labeled USB, closed project box, blank intake form silhouette. No PII or brand UI.',
    alt: 'Project intake materials for a fabrication quote request.',
    aspect: '16/9',
    width: 1536,
    height: 1024,
    kind: 'conceptual',
    ready: true,
  }),
  finishRaw: slot({
    id: 'fab-finish-raw',
    fileName: '301-finish-l0-raw-supported.webp',
    title: 'L0 Raw print',
    shot: 'As-printed part with supports just removed; raking light.',
    alt: 'Raw 3D print after basic support removal.',
    aspect: '4/5',
    width: 1122,
    height: 1402,
    caption: 'L0 raw / supported',
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/v1787062508/dccmiami/workshops/resin-printing-for-artist/301-finish-l0-raw-supported_gbznys.webp`,
  }),
  finishClean: slot({
    id: 'fab-finish-clean',
    fileName: '302-finish-l1-cleaned.webp',
    title: 'L1 Clean print',
    shot: 'Cleaned part, light sanding evidence, no paint.',
    alt: 'Cleaned 3D print after deburring and light sanding.',
    aspect: '4/5',
    width: 1122,
    height: 1402,
    caption: 'L1 cleaned',
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/v1787062509/dccmiami/workshops/resin-printing-for-artist/302-finish-l1-cleaned_sdx7pb.webp`,
  }),
  finishAssembly: slot({
    id: 'fab-finish-assembly',
    fileName: '303-finish-l2-refined.webp',
    title: 'L2 Assembly-ready',
    shot: 'Joined parts with visible pins/seams planned, unpainted. Product enum stays assembly-ready; caption uses refined.',
    alt: 'Refined assembly-ready fabricated parts with joining planned.',
    aspect: '4/5',
    width: 1122,
    height: 1402,
    caption: 'L2 refined (assembly-ready)',
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/v1787062509/dccmiami/workshops/resin-printing-for-artist/303-finish-l2-refined_qc3kmi.webp`,
  }),
  finishExhibition: slot({
    id: 'fab-finish-exhibition',
    fileName: '304-finish-l3-primed.webp',
    title: 'L3 Exhibition prep',
    shot: 'Primed / filled sculpture ready for paint.',
    alt: 'Exhibition-prep object with primer and seam repair.',
    aspect: '4/5',
    width: 1122,
    height: 1402,
    caption: 'L3 primed',
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/v1787062510/dccmiami/workshops/resin-printing-for-artist/304-finish-l3-primed_n1p7ar.webp`,
  }),
  finishFinished: slot({
    id: 'fab-finish-finished',
    fileName: '305-finish-l4-artist-finished.webp',
    title: 'L4 Finished object',
    shot: 'Presentation-ready painted or coated object.',
    alt: 'Finished fabricated object with surface treatment.',
    aspect: '4/5',
    width: 1122,
    height: 1402,
    caption: 'L4 artist finished',
    kind: 'conceptual',
    cdnSrc: `${RESIN_FINISHES_CDN}/v1787062510/dccmiami/workshops/resin-printing-for-artist/305-finish-l4-artist-finished_hvnzrn.webp`,
  }),
} as const

export type FabricationSectionMediaId = keyof typeof FABRICATION_SECTION_MEDIA

/** Temporary stand-in for pricing / planning until dedicated photography lands. */
export const FABRICATION_PLANNING_STANDIN_SRC =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1786559730/dccmiami/workshops/resin-printing-for-artist/112-project-planning-drivers_bkxbcj.webp'

/** @deprecated Prefer finishesHero CDN (300). Kept for any callers still importing the name. */
export const FABRICATION_FINISHES_STANDIN_SRC =
  FABRICATION_SECTION_MEDIA.finishesHero.src!

export function resolveFabricationSectionMedia(
  id: FabricationSectionMediaId
): FabricationSectionMedia {
  return FABRICATION_SECTION_MEDIA[id]
}

export function getFabricationSectionMedia(
  id: FabricationSectionMediaId
): FabricationSectionMedia {
  return resolveFabricationSectionMedia(id)
}

export const FABRICATION_MEDIA_DROP_PATH = 'public/dcc/fabrication'
