import type {
  ModuleInstructionalConcepts,
  WorkshopMedia,
} from '@/lib/workshop-engine/types'
import { RESIN_CONCEPT_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'

export const INSTRUCTIONAL_CONCEPT_SIZE = {
  width: 1672,
  height: 941,
} as const

function concept(
  id: keyof typeof RESIN_CONCEPT_CDN,
  partial: Omit<WorkshopMedia, 'id' | 'src' | 'width' | 'height' | 'kind' | 'evidenceLevel'> & {
    kind?: WorkshopMedia['kind']
    evidenceLevel?: WorkshopMedia['evidenceLevel']
  }
): WorkshopMedia {
  return {
    id,
    src: RESIN_CONCEPT_CDN[id],
    width: INSTRUCTIONAL_CONCEPT_SIZE.width,
    height: INSTRUCTIONAL_CONCEPT_SIZE.height,
    kind: 'illustration',
    evidenceLevel: 'conceptual',
    ...partial,
  }
}

/** Slicer Lab visual sequence (orientation → supports → hollow/drain → layers). */
export const SLICER_LAB_CONCEPTS: WorkshopMedia[] = [
  concept('107-slicer-orientation-compare', {
    alt: 'The same resin artifact shown upright and tilted above supported build planes.',
    role: 'comparison',
    caption: 'Orientation comparison — conceptual only',
    prompt:
      'What changes when the same artifact tilts — cross-section, peel forces, and where supports would land?',
    iconKey: 'rotate-3d',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept('108-slicer-support-patterns', {
    alt: 'Three identical branching artifacts shown with sparse, moderate, and crowded support patterns.',
    role: 'comparison',
    caption: 'Support patterns — no option is marked correct',
    prompt:
      'Notice contact points, surface access, marking risk, and stability across the three patterns.',
    iconKey: 'network',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept('109-slicer-hollow-drain-logic', {
    alt: 'Three geometric vessels compare a solid form, an enclosed hollow cavity, and a hollow form with low openings.',
    role: 'comparison',
    caption: 'Solid vs enclosed vs drained volume — conceptual',
    prompt:
      'Compare internal volume and possible exit paths. Do not treat this as a drain-hole specification.',
    iconKey: 'circle-dashed',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept('110-slicer-layer-preview', {
    alt: 'A branching artifact intersects translucent horizontal planes beside six representative cross-sections.',
    role: 'comparison',
    caption: 'Volume → layers — not a slicer screenshot',
    prompt:
      'Connect the three-dimensional volume to stacked cross-sections before you open the validated slicer.',
    iconKey: 'layers-3',
    zoomable: true,
    objectPosition: 'center',
  }),
  concept('119-photon-workshop-concept', {
    alt: 'Conceptual Photon Workshop slicer workspace with a supported model and layer preview.',
    role: 'lesson',
    caption: 'Photon Workshop concept — not a live UI capture',
    prompt:
      'Locate orientation, supports, and layer preview as ideas before you open the venue-validated slicer.',
    iconKey: 'sparkles',
    zoomable: false,
    objectPosition: 'center',
  }),
]

export const FILE_SCALE_CONCEPT: WorkshopMedia = concept(
  '111-file-scale-mismatch',
  {
    alt: 'The same porous artifact appears at tiny, handheld, and oversized scales beside neutral reference blocks.',
    role: 'comparison',
    caption: 'Units and scale mismatch — conceptual',
    prompt:
      'Which version matches the scale you intended, and what would you verify in the file?',
    iconKey: 'ruler',
    zoomable: true,
    objectPosition: 'center',
  }
)

export const PLANNING_DRIVERS_CONCEPT: WorkshopMedia = concept(
  '112-project-planning-drivers',
  {
    alt: 'Four studies of one artifact compare small, hollow, supported, and finished project states.',
    role: 'lesson',
    caption: 'What affects the plan? — conceptual',
    prompt:
      'Discuss scale, material volume, supports, duration, post-processing, and staff review — without prices.',
    iconKey: 'list-checks',
    zoomable: false,
    objectPosition: 'center',
  }
)

export const POST_PROCESSING_CONCEPT: WorkshopMedia = concept(
  '113-post-processing-states',
  {
    alt: 'The same artifact appears supported, clean with supports removed, and fully finished under violet-cyan light.',
    role: 'lesson',
    caption: 'Post-processing states — observe only',
    prompt:
      'Distinguish supported, cleaned, and finished states. Instructors operate equipment; participants observe.',
    iconKey: 'sparkles',
    zoomable: false,
    objectPosition: 'center',
  }
)

export const FAILURE_EVIDENCE_CONCEPT: WorkshopMedia = concept(
  '114-failure-evidence-first',
  {
    alt: 'A cured artifact, known-good reference, magnifying lens, blank observation card, stage tiles, and test coupons sit on an inspection table.',
    role: 'evidence',
    caption: 'Evidence-first diagnosis — conceptual method',
    prompt:
      'Describe visible evidence, locate the stage, compare a known-good reference, list factors without certainty, then choose the smallest next test.',
    iconKey: 'search-check',
    zoomable: true,
    objectPosition: 'center',
  }
)

const TOOLCHAIN_CONCEPT = concept('115-complete-toolchain', {
  alt: 'Conceptual toolchain from source image through mesh, slicer, printer, wash, and cure stages.',
  role: 'lesson',
  caption: 'Complete toolchain — conceptual map',
  prompt: 'Name each stage before naming the tool that belongs there.',
  iconKey: 'workflow',
  zoomable: false,
  objectPosition: 'center',
})

const SOURCE_PREP_CONCEPT = concept('116-source-image-preparation', {
  alt: 'Source photograph prepared for 3D conversion with cropping and silhouette clarity cues.',
  role: 'lesson',
  caption: 'Source image preparation — conceptual',
  prompt: 'What would make this source clearer before any AI-to-3D conversion?',
  iconKey: 'image',
  zoomable: false,
  objectPosition: 'center',
})

const AI_TO_3D_CONCEPT = concept('117-ai-image-to-3d-compare', {
  alt: 'Side-by-side comparison of AI image-to-3D mesh outputs with different topology quality.',
  role: 'comparison',
  caption: 'AI image → 3D compare — conceptual',
  prompt: 'Which mesh looks more printable, and what would you still inspect manually?',
  iconKey: 'box',
  zoomable: true,
  objectPosition: 'center',
})

const BLENDER_MESH_CONCEPT = concept('118-blender-mesh-inspection', {
  alt: 'Conceptual Blender-style mesh inspection with non-manifold cues and scale reference.',
  role: 'lesson',
  caption: 'Mesh inspection — conceptual',
  prompt: 'What would you check for manifold integrity, normals, and units before export?',
  iconKey: 'box',
  zoomable: false,
  objectPosition: 'center',
})

const EQUIPMENT_M7_CONCEPT = concept('120-m7-max-equipment-portrait', {
  alt: 'Illustrative resin printer portrait for venue equipment recognition.',
  role: 'lesson',
  caption: 'Printer portrait — illustrative, not a how-to',
  prompt: 'Recognize the machine form factor. Operation remains instructor-led.',
  iconKey: 'printer',
  zoomable: false,
  objectPosition: 'center',
})

const PRINTER_COMPONENTS_CONCEPT = concept('121-resin-printer-components', {
  alt: 'Labeled conceptual diagram of resin printer major components.',
  role: 'lesson',
  caption: 'Printer components — conceptual atlas',
  prompt: 'Locate vat, build plate, and screen as ideas — do not operate them.',
  iconKey: 'printer',
  zoomable: false,
  objectPosition: 'center',
})

const WASH_CURE_EQUIPMENT_CONCEPT = concept(
  '122-wash-cure-equipment-portrait',
  {
    alt: 'Illustrative wash and cure station portrait.',
    role: 'lesson',
    caption: 'Wash / cure equipment — observe only',
    prompt: 'Name wash vs cure as separate stages before any demonstration.',
    iconKey: 'droplets',
    zoomable: false,
    objectPosition: 'center',
  }
)

const PPE_ATLAS_CONCEPT = concept('123-ppe-consumables-atlas', {
  alt: 'Conceptual atlas of PPE and consumables for resin handling.',
  role: 'evidence',
  caption: 'PPE & consumables atlas — conceptual',
  prompt: 'Which items belong in the controlled zone before any wet-resin work?',
  iconKey: 'shield',
  zoomable: false,
  objectPosition: 'center',
})

const MESHY_CARD = concept('124-meshy-tool-card', {
  alt: 'Conceptual Meshy tool card for AI mesh generation awareness.',
  role: 'lesson',
  caption: 'Meshy tool card — awareness only',
  prompt: 'Treat AI mesh tools as starting points that still need inspection.',
  iconKey: 'sparkles',
  zoomable: false,
  objectPosition: 'center',
})

const TRIPO_CARD = concept('125-tripo-tool-card', {
  alt: 'Conceptual Tripo tool card for AI mesh generation awareness.',
  role: 'lesson',
  caption: 'Tripo tool card — awareness only',
  prompt: 'Compare outputs for topology and scale before trusting an export.',
  iconKey: 'sparkles',
  zoomable: false,
  objectPosition: 'center',
})

const FILE_HANDOFF_CONCEPT = concept('126-file-format-handoff', {
  alt: 'Conceptual file format handoff from mesh export to slicer-ready package.',
  role: 'lesson',
  caption: 'File format handoff — conceptual',
  prompt: 'What naming, units, and format would you put on a supervised appointment handoff?',
  iconKey: 'file-stack',
  zoomable: false,
  objectPosition: 'center',
})

const MATERIAL_STATES_CONCEPT = concept('127-material-states', {
  alt: 'Conceptual material states from liquid resin through washed and cured polymer.',
  role: 'lesson',
  caption: 'Material states — conceptual',
  prompt: 'Name liquid, green/wet, washed, and cured as different risk states.',
  iconKey: 'droplets',
  zoomable: false,
  objectPosition: 'center',
})

const STOP_ISOLATE_CONCEPT = concept('128-stop-isolate-notify', {
  alt: 'Conceptual stop, isolate, and notify sequence for resin incidents.',
  role: 'evidence',
  caption: 'Stop → isolate → notify',
  prompt: 'What is the first action if uncured resin leaves the controlled zone?',
  iconKey: 'octagon-alert',
  zoomable: false,
  objectPosition: 'center',
})

const FAILURE_PLATE_CONCEPT = concept('129-failure-plate-detached', {
  alt: 'Conceptual failure evidence of a print detached from the build plate.',
  role: 'evidence',
  caption: 'Plate detachment — describe evidence only',
  prompt: 'Describe what you see before guessing a cause.',
  iconKey: 'search-check',
  zoomable: true,
  objectPosition: 'center',
})

const FAILURE_CRACK_CONCEPT = concept('130-failure-crack-bloom', {
  alt: 'Conceptual failure evidence showing crack bloom on a cured specimen.',
  role: 'evidence',
  caption: 'Crack / bloom — describe evidence only',
  prompt: 'Where on the part is the symptom, and at which stage might it have started?',
  iconKey: 'search-check',
  zoomable: true,
  objectPosition: 'center',
})

const FAILURE_SURFACE_CONCEPT = concept('131-failure-surface-symptoms', {
  alt: 'Conceptual failure evidence of surface symptoms on a cured specimen.',
  role: 'evidence',
  caption: 'Surface symptoms — describe evidence only',
  prompt: 'Separate support marks, incomplete cure cues, and peel artifacts as observations.',
  iconKey: 'search-check',
  zoomable: true,
  objectPosition: 'center',
})

const KNOWN_GOOD_TEST_CONCEPT = concept('132-known-good-next-test', {
  alt: 'Conceptual known-good reference beside the next smallest useful test coupon.',
  role: 'lesson',
  caption: 'Known-good → smallest next test',
  prompt: 'What is the smallest useful next test after comparing a known-good reference?',
  iconKey: 'list-checks',
  zoomable: false,
  objectPosition: 'center',
})

const RESIN_FDM_CONSULT = concept('133-resin-fdm-consultation', {
  alt: 'Conceptual comparison prompting resin vs FDM vs consultation.',
  role: 'comparison',
  caption: 'Resin vs FDM vs consultation',
  prompt: 'When is consultation the right outcome instead of forcing resin?',
  iconKey: 'scale',
  zoomable: false,
  objectPosition: 'center',
})

const FILE_INSPECTION_TOOLKIT = concept('134-file-inspection-toolkit', {
  alt: 'Conceptual file inspection toolkit with scale, manifold, and wall-thickness cues.',
  role: 'lesson',
  caption: 'File inspection toolkit — conceptual',
  prompt: 'Which three checks would you run before calling a file printable?',
  iconKey: 'ruler',
  zoomable: false,
  objectPosition: 'center',
})

const DRY_FINISHING_TOOLKIT = concept('135-dry-finishing-toolkit', {
  alt: 'Conceptual dry finishing toolkit for cured resin after wash and cure.',
  role: 'lesson',
  caption: 'Dry finishing toolkit — after cure only',
  prompt: 'Which finishing steps wait until the part is fully cured and dry?',
  iconKey: 'hammer',
  zoomable: false,
  objectPosition: 'center',
})

/** Module → instructional concept block (supporting layer; does not replace banners).
 * 200–214 live in technique-boards.ts (interactive layouts).
 */
export const RESIN_MODULE_INSTRUCTIONAL_CONCEPTS: Record<
  string,
  ModuleInstructionalConcepts
> = {
  'why-resin': {
    title: 'Fit, tools, and planning',
    intro:
      'Additional conceptual stills — not a cost calculator or certification checklist.',
    layout: 'expandable',
    items: [
      PLANNING_DRIVERS_CONCEPT,
      RESIN_FDM_CONSULT,
      SOURCE_PREP_CONCEPT,
      AI_TO_3D_CONCEPT,
      MESHY_CARD,
      TRIPO_CARD,
    ],
    htmlPoints: [
      'Scale and detail requirements',
      'Material volume and hollowing',
      'Supports and surface access',
      'Duration estimate (venue profile)',
      'Post-processing labor',
      'Staff review / supervised appointment',
    ],
  },
  'safety-zones': {
    title: 'PPE, zones, and stop-work',
    intro:
      'Additional conceptual safety stills. Venue SDS and instructor demo remain the authority.',
    layout: 'expandable',
    items: [PPE_ATLAS_CONCEPT, STOP_ISOLATE_CONCEPT, EQUIPMENT_M7_CONCEPT],
  },
  'complete-workflow': {
    title: 'Toolchain map',
    intro:
      'Additional toolchain map. Stages matter more than brand names.',
    layout: 'single',
    items: [TOOLCHAIN_CONCEPT],
  },
  'file-readiness': {
    title: 'Units, mesh, and handoff',
    intro:
      'Additional scale and mesh stills. Measurements stay in the file.',
    layout: 'expandable',
    items: [
      FILE_SCALE_CONCEPT,
      BLENDER_MESH_CONCEPT,
      FILE_INSPECTION_TOOLKIT,
      FILE_HANDOFF_CONCEPT,
      AI_TO_3D_CONCEPT,
    ],
  },
  'slicer-lab': {
    title: 'Slicer Lab — supporting sequence',
    intro:
      'Supporting conceptual steps (107–110 + Photon). Primary teaching uses Technique Boards 206–208.',
    layout: 'slicer-sequence',
    items: SLICER_LAB_CONCEPTS,
  },
  'print-wash-cure': {
    title: 'Equipment, states, and finishing',
    intro:
      'Additional state and equipment stills. Participants observe; instructors operate.',
    layout: 'expandable',
    items: [
      POST_PROCESSING_CONCEPT,
      MATERIAL_STATES_CONCEPT,
      WASH_CURE_EQUIPMENT_CONCEPT,
      PRINTER_COMPONENTS_CONCEPT,
      DRY_FINISHING_TOOLKIT,
    ],
  },
  'failure-clinic': {
    title: 'Evidence set',
    intro:
      'Additional evidence stills. Real cured specimens remain the actual evidence when available.',
    layout: 'expandable',
    items: [
      FAILURE_EVIDENCE_CONCEPT,
      FAILURE_PLATE_CONCEPT,
      FAILURE_CRACK_CONCEPT,
      FAILURE_SURFACE_CONCEPT,
      KNOWN_GOOD_TEST_CONCEPT,
    ],
    htmlPoints: [
      'Describe the visible evidence',
      'Locate the stage where it appeared',
      'Compare a known-good reference',
      'Record possible factors without claiming certainty',
      'Choose the smallest useful next test',
    ],
  },
  'project-readiness': {
    title: 'Plan and handoff stills',
    intro:
      'Additional planning stills. Pricing stays on /fabricate.',
    layout: 'expandable',
    items: [
      PLANNING_DRIVERS_CONCEPT,
      FILE_HANDOFF_CONCEPT,
      RESIN_FDM_CONSULT,
    ],
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
