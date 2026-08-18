import type {
  ModuleInstructionalConcepts,
  WorkshopMedia,
} from '@/lib/workshop-engine/types'

export const INSTRUCTIONAL_CONCEPT_SIZE = {
  width: 1672,
  height: 941,
} as const

const BASE = '/workshops/resin-printing/instructional-concepts'

function concept(
  partial: Omit<WorkshopMedia, 'width' | 'height' | 'kind' | 'evidenceLevel'> & {
    kind?: WorkshopMedia['kind']
    evidenceLevel?: WorkshopMedia['evidenceLevel']
  }
): WorkshopMedia {
  return {
    width: INSTRUCTIONAL_CONCEPT_SIZE.width,
    height: INSTRUCTIONAL_CONCEPT_SIZE.height,
    kind: 'illustration',
    evidenceLevel: 'conceptual',
    ...partial,
  }
}

/** Slicer Lab visual sequence (orientation → supports → hollow/drain → layers). */
export const SLICER_LAB_CONCEPTS: WorkshopMedia[] = [
  concept({
    id: '107-slicer-orientation-compare',
    src: `${BASE}/107-slicer-orientation-compare.webp`,
    alt: 'The same resin artifact shown upright and tilted above supported build planes.',
    role: 'comparison',
    caption: 'Orientation comparison — conceptual only',
    prompt:
      'What changes when the same artifact tilts — cross-section, peel forces, and where supports would land?',
    iconKey: 'rotate-3d',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept({
    id: '108-slicer-support-patterns',
    src: `${BASE}/108-slicer-support-patterns.webp`,
    alt: 'Three identical branching artifacts shown with sparse, moderate, and crowded support patterns.',
    role: 'comparison',
    caption: 'Support patterns — no option is marked correct',
    prompt:
      'Notice contact points, surface access, marking risk, and stability across the three patterns.',
    iconKey: 'network',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept({
    id: '109-slicer-hollow-drain-logic',
    src: `${BASE}/109-slicer-hollow-drain-logic.webp`,
    alt: 'Three geometric vessels compare a solid form, an enclosed hollow cavity, and a hollow form with low openings.',
    role: 'comparison',
    caption: 'Solid vs enclosed vs drained volume — conceptual',
    prompt:
      'Compare internal volume and possible exit paths. Do not treat this as a drain-hole specification.',
    iconKey: 'circle-dashed',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept({
    id: '110-slicer-layer-preview',
    src: `${BASE}/110-slicer-layer-preview.webp`,
    alt: 'A branching artifact intersects translucent horizontal planes beside six representative cross-sections.',
    role: 'comparison',
    caption: 'Volume → layers — not a slicer screenshot',
    prompt:
      'Connect the three-dimensional volume to stacked cross-sections before you open the validated slicer.',
    iconKey: 'layers-3',
    zoomable: true,
    objectPosition: 'center',
  }),
]

export const FILE_SCALE_CONCEPT: WorkshopMedia = concept({
  id: '111-file-scale-mismatch',
  src: `${BASE}/111-file-scale-mismatch.webp`,
  alt: 'The same porous artifact appears at tiny, handheld, and oversized scales beside neutral reference blocks.',
  role: 'comparison',
  caption: 'Units and scale mismatch — conceptual',
  prompt:
    'Which version matches the scale you intended, and what would you verify in the file?',
  iconKey: 'ruler',
  zoomable: true,
  objectPosition: 'center',
})

export const PLANNING_DRIVERS_CONCEPT: WorkshopMedia = concept({
  id: '112-project-planning-drivers',
  src: `${BASE}/112-project-planning-drivers.webp`,
  alt: 'Four studies of one artifact compare small, hollow, supported, and finished project states.',
  role: 'lesson',
  caption: 'What affects the plan? — conceptual',
  prompt:
    'Discuss scale, material volume, supports, duration, post-processing, and staff review — without prices.',
  iconKey: 'list-checks',
  zoomable: false,
  objectPosition: 'center',
})

export const POST_PROCESSING_CONCEPT: WorkshopMedia = concept({
  id: '113-post-processing-states',
  src: `${BASE}/113-post-processing-states.webp`,
  alt: 'The same artifact appears supported, clean with supports removed, and fully finished under violet-cyan light.',
  role: 'lesson',
  caption: 'Post-processing states — observe only',
  prompt:
    'Distinguish supported, cleaned, and finished states. Instructors operate equipment; participants observe.',
  iconKey: 'sparkles',
  zoomable: false,
  objectPosition: 'center',
})

export const FAILURE_EVIDENCE_CONCEPT: WorkshopMedia = concept({
  id: '114-failure-evidence-first',
  src: `${BASE}/114-failure-evidence-first.webp`,
  alt: 'A cured artifact, known-good reference, magnifying lens, blank observation card, stage tiles, and test coupons sit on an inspection table.',
  role: 'evidence',
  caption: 'Evidence-first diagnosis — conceptual method',
  prompt:
    'Describe visible evidence, locate the stage, compare a known-good reference, list factors without certainty, then choose the smallest next test.',
  iconKey: 'search-check',
  zoomable: true,
  objectPosition: 'center',
})

/** Module → instructional concept block (supporting layer; does not replace banners). */
export const RESIN_MODULE_INSTRUCTIONAL_CONCEPTS: Record<
  string,
  ModuleInstructionalConcepts
> = {
  'why-resin': {
    title: 'What affects the plan?',
    intro:
      'Conceptual planning studies — not a cost calculator or certification checklist.',
    layout: 'expandable',
    items: [PLANNING_DRIVERS_CONCEPT],
    htmlPoints: [
      'Scale and detail requirements',
      'Material volume and hollowing',
      'Supports and surface access',
      'Duration estimate (venue profile)',
      'Post-processing labor',
      'Staff review / supervised appointment',
    ],
  },
  'file-readiness': {
    title: 'Units and scale',
    intro:
      'Spot scale mismatch before you chase tiny defects. Measurements stay in the file — not in this illustration.',
    layout: 'single',
    items: [FILE_SCALE_CONCEPT],
  },
  'slicer-lab': {
    title: 'Slicer Lab — conceptual sequence',
    intro:
      'Four conceptual steps. Follow each with the matching validated Photon Workshop screenshot when available. These are not software UI.',
    layout: 'slicer-sequence',
    items: SLICER_LAB_CONCEPTS,
  },
  'print-wash-cure': {
    title: 'Post-processing states',
    intro:
      'Conceptual state overview before the instructor demonstration. Participants observe; instructors operate.',
    layout: 'single',
    items: [POST_PROCESSING_CONCEPT],
  },
  'failure-clinic': {
    title: 'Evidence first',
    intro:
      'Practice the diagnostic method conceptually. Real cured specimens remain the actual evidence — this image does not claim a cause.',
    layout: 'single',
    items: [FAILURE_EVIDENCE_CONCEPT],
    htmlPoints: [
      'Describe the visible evidence',
      'Locate the stage where it appeared',
      'Compare a known-good reference',
      'Record possible factors without claiming certainty',
      'Choose the smallest useful next test',
    ],
  },
  'project-readiness': {
    title: 'What affects the plan?',
    intro:
      'Revisit planning drivers before you choose ready / repair / consultation. Pricing stays venue-specific and code-native.',
    layout: 'expandable',
    items: [PLANNING_DRIVERS_CONCEPT],
    htmlPoints: [
      'Scale and detail requirements',
      'Material volume and hollowing',
      'Supports and surface access',
      'Duration estimate (venue profile)',
      'Post-processing labor',
      'Staff review / supervised appointment',
    ],
  },
}
