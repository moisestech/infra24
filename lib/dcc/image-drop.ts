/**
 * Ranked image drops for DCC MIA public surfaces.
 * Canonical human list: docs/dcc/IMAGE_DROP.md
 * Do not invent Clandestine artist names. Do not label conceptual stills as shop photos.
 */

export type DccImageKind =
  | 'portrait'
  | 'artwork-doc'
  | 'documentary'
  | 'conceptual'
  | 'diagram'
  | 'identity'
  | '360-poster'
  | 'slicer-screenshot'

export type DccImagePriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'

export type DccImageDrop = {
  id: string
  priority: DccImagePriority
  fileName: string
  kind: DccImageKind
  aspect: string
  size: string
  route: string
  shot: string
  alternateA: string
  alternateB: string
  /** Public path once the file is force-added. */
  publicPath?: string
  blockedOnPacket?: boolean
}

/** One Studio 43 setup covers finishes hero + L0–L4 crops. */
export const FABRICATION_ONE_OBJECT_LADDER = [
  '04-finishes-states.webp',
  'finish-l0-raw.webp',
  'finish-l1-clean.webp',
  'finish-l2-assembly.webp',
  'finish-l3-exhibition.webp',
  'finish-l4-finished.webp',
] as const

export const CLANDESTINE_PROGRAM_HERO_PATH =
  '/dcc/culture/programs/clandestine-art-fair-2026/hero.svg' as const

export const CLANDESTINE_PROGRAM_HERO_ALT =
  'DCC MIA Program 001 at Clandestine Art Fair 2026. Three participating artists will be named when confirmed.'

export const DCC_IMAGE_DROPS: DccImageDrop[] = [
  {
    id: 'fab-hero',
    priority: 'P0',
    fileName: '01-fabricate-hero.webp',
    kind: 'documentary',
    aspect: '21:9',
    size: '1920×823',
    route: '/fabricate',
    shot: 'Wide Studio 43 / Bakehouse desk: printer silhouette, cured or FDM samples, no people, no readable UI.',
    alternateA: 'Same desk, tighter 16:9 crop we letterbox.',
    alternateB: 'Conceptual still of printer + samples, captioned not a documentary photo.',
    publicPath: '/dcc/fabrication/01-fabricate-hero.webp',
  },
  {
    id: 'clandestine-hero',
    priority: 'P0',
    fileName: 'hero.svg',
    kind: 'identity',
    aspect: '16:9',
    size: '1600×900',
    route: '/programs/art-fairs/clandestine-art-fair-2026',
    shot: 'DCC presentation identity without invented artists. Fair graphic or empty booth build.',
    alternateA: 'Fair exterior / corridor with DCC signage.',
    alternateB: 'Typographic lockup (shipped). Still no fake names.',
    publicPath: CLANDESTINE_PROGRAM_HERO_PATH,
  },
  {
    id: 'home-now-stills',
    priority: 'P0',
    fileName: '(optional now-band stills)',
    kind: 'artwork-doc',
    aspect: '4:5 or 16:9',
    size: '1200×1500 or 1600×900',
    route: '/#now',
    shot: 'One still per slot: program, Moises, workshop, fabricate.',
    alternateA: 'Reuse existing homepage photos cropped.',
    alternateB: 'Leave text-only (current).',
  },
  {
    id: 'fab-lanes',
    priority: 'P1',
    fileName: '02-service-lanes.webp',
    kind: 'conceptual',
    aspect: '16:9',
    size: '1600×900',
    route: '/fabricate',
    shot: 'Triptych: USB/file · mesh on laptop silhouette · sketch-to-object. No type in image.',
    alternateA: 'Three 1:1 tiles composited in CSS.',
    alternateB: 'Reuse resin concept 115-complete-toolchain until shot.',
    publicPath: '/dcc/fabrication/02-service-lanes.webp',
  },
  {
    id: 'fab-pricing',
    priority: 'P1',
    fileName: '03-pricing-transparency.webp',
    kind: 'conceptual',
    aspect: '16:9',
    size: '1600×900',
    route: '/fabricate',
    shot: 'Scale cube, spool silhouette, timer form, blank estimate card — no numbers.',
    alternateA: 'Hands-off tools only.',
    alternateB: 'Keep placeholder; do not fake a quote screenshot.',
    publicPath: '/dcc/fabrication/03-pricing-transparency.webp',
  },
  {
    id: 'fab-finishes-states',
    priority: 'P1',
    fileName: '04-finishes-states.webp',
    kind: 'documentary',
    aspect: '16:9',
    size: '1600×900',
    route: '/fabricate/finishes',
    shot: 'Same object raw → cleaned → assembly → primed → finished, left to right.',
    alternateA: 'Five 4:5 frames shown as a strip.',
    alternateB: 'Keep instructional 113 stand-in, labeled conceptual.',
    publicPath: '/dcc/fabrication/04-finishes-states.webp',
  },
  {
    id: 'fab-access',
    priority: 'P1',
    fileName: '05-artist-access.webp',
    kind: 'conceptual',
    aspect: '16:9',
    size: '1600×900',
    route: '/fabricate',
    shot: 'Workshop badge, checklist, small token — no logos or dollar amounts.',
    alternateA: 'Alumni workshop still, faces obscured.',
    alternateB: 'Icon-only placeholder (current).',
    publicPath: '/dcc/fabrication/05-artist-access.webp',
  },
  {
    id: 'fab-quote',
    priority: 'P1',
    fileName: '06-quote-intake.webp',
    kind: 'documentary',
    aspect: '16:9',
    size: '1600×900',
    route: '/fabricate/quote',
    shot: 'Labeled USB, closed box, blank form. No PII.',
    alternateA: 'USB + box only.',
    alternateB: 'Placeholder.',
    publicPath: '/dcc/fabrication/06-quote-intake.webp',
  },
  {
    id: 'fab-finish-l0',
    priority: 'P1',
    fileName: 'finish-l0-raw.webp',
    kind: 'documentary',
    aspect: '4:5',
    size: '1200×1500',
    route: '/fabricate/finishes',
    shot: 'As-printed, supports just off, raking light. Crop from the one-object ladder.',
    alternateA: 'Crop from 04-finishes-states.',
    alternateB: 'Concept 113 left panel.',
    publicPath: '/dcc/fabrication/finish-l0-raw.webp',
  },
  {
    id: 'fab-finish-l1',
    priority: 'P1',
    fileName: 'finish-l1-clean.webp',
    kind: 'documentary',
    aspect: '4:5',
    size: '1200×1500',
    route: '/fabricate/finishes',
    shot: 'Cleaned, light sand, no paint.',
    alternateA: 'Crop from 04-finishes-states.',
    alternateB: 'Concept 113.',
    publicPath: '/dcc/fabrication/finish-l1-clean.webp',
  },
  {
    id: 'fab-finish-l2',
    priority: 'P1',
    fileName: 'finish-l2-assembly.webp',
    kind: 'documentary',
    aspect: '4:5',
    size: '1200×1500',
    route: '/fabricate/finishes',
    shot: 'Joined, pins/seams, unpainted.',
    alternateA: 'Crop from 04-finishes-states.',
    alternateB: 'Concept 113.',
    publicPath: '/dcc/fabrication/finish-l2-assembly.webp',
  },
  {
    id: 'fab-finish-l3',
    priority: 'P1',
    fileName: 'finish-l3-exhibition.webp',
    kind: 'documentary',
    aspect: '4:5',
    size: '1200×1500',
    route: '/fabricate/finishes',
    shot: 'Primed/filled, ready for paint.',
    alternateA: 'Crop from 04-finishes-states.',
    alternateB: 'Concept 113.',
    publicPath: '/dcc/fabrication/finish-l3-exhibition.webp',
  },
  {
    id: 'fab-finish-l4',
    priority: 'P1',
    fileName: 'finish-l4-finished.webp',
    kind: 'documentary',
    aspect: '4:5',
    size: '1200×1500',
    route: '/fabricate/finishes',
    shot: 'Painted/coated, presentation-ready.',
    alternateA: 'Crop from 04-finishes-states.',
    alternateB: 'Artwork doc of a finished DCC test with permission.',
    publicPath: '/dcc/fabrication/finish-l4-finished.webp',
  },
  {
    id: 'angelo-hero',
    priority: 'P2',
    fileName: 'hero.webp',
    kind: 'artwork-doc',
    aspect: '16:9 or 4:5',
    size: '1600×900',
    route: '/artists/angelo-caruso',
    shot: 'One approved work, captioned. Do not invent a 360 tour.',
    alternateA: 'Exhibition install crop.',
    alternateB: 'Leave empty (current).',
    publicPath: '/dcc/culture/artists/angelo-caruso/hero.webp',
    blockedOnPacket: true,
  },
  {
    id: 'clandestine-artist-portrait',
    priority: 'P2',
    fileName: '{slug}/portrait.webp',
    kind: 'portrait',
    aspect: '4:5',
    size: '1200×1500',
    route: '/artists/{slug}',
    shot: 'Face, artist-approved. Three participating artists — names unknown.',
    alternateA: 'Existing press portrait.',
    alternateB: 'Fair badge crop (last).',
    blockedOnPacket: true,
  },
  {
    id: 'clandestine-artist-hero',
    priority: 'P2',
    fileName: '{slug}/hero.webp',
    kind: 'artwork-doc',
    aspect: '16:9',
    size: '1600×900',
    route: '/artists/{slug}',
    shot: 'Selected work for the fair.',
    alternateA: 'Studio process still.',
    alternateB: 'Install at fair (after).',
    blockedOnPacket: true,
  },
  {
    id: 'clandestine-artist-works',
    priority: 'P2',
    fileName: '{slug}/work-01.webp … work-05.webp',
    kind: 'artwork-doc',
    aspect: '4:5',
    size: '1200×1500',
    route: '/artists/{slug}',
    shot: '3–5 works with title, year, medium, dimensions, photo credit.',
    alternateA: '3 works instead of 5.',
    alternateB: 'Process + 2 works.',
    blockedOnPacket: true,
  },
]

export function listImageDropsByPriority(
  priority: DccImagePriority
): DccImageDrop[] {
  return DCC_IMAGE_DROPS.filter((drop) => drop.priority === priority)
}

export function getImageDropById(id: string): DccImageDrop | undefined {
  return DCC_IMAGE_DROPS.find((drop) => drop.id === id)
}
