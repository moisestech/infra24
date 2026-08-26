import type {
  ModuleMediaPlaceholder,
  ModuleTutorialVideo,
} from '@/lib/workshop-engine/types'
import { RESIN_CONCEPT_CDN } from '@/lib/workshop-engine/resin-printing/cloudinary'

export const RESIN_ASSET_PATHS = {
  hero: '/workshops/resin-printing/assets/resin-hero-01.png',
  workflowDiagram: '/workshops/resin-printing/assets/resin-diagram-workflow-01.svg',
  zonesDiagram: '/workshops/resin-printing/assets/resin-diagram-zones-01.svg',
} as const

export const RESIN_HERO_MEDIA: ModuleMediaPlaceholder = {
  assetId: 'resin-hero-01',
  title: 'Workshop hero image',
  shot: 'Illustrative placeholder: resin printer silhouette and cured samples on a clean workstation. Replace with a real Oolite shot.',
  altIntent: 'Illustrative resin printer and finished artist samples in a workshop space.',
  aspect: 'landscape 16:10',
  minSize: '2400×1500',
  src: RESIN_ASSET_PATHS.hero,
  caption: 'Illustrative placeholder',
  kind: 'illustrative',
}

/** Primary teaching still per module (Cloudinary module stills 200–214). */
export const RESIN_MODULE_PRIMARY_MEDIA: Record<string, ModuleMediaPlaceholder> = {
  welcome: {
    assetId: '200-m00-participant-path',
    title: 'Participant path',
    shot: 'Participant path from join through modules to supervised appointment.',
    altIntent: 'Conceptual path from class join to supervised fabrication appointment.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['200-m00-participant-path'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'why-resin': {
    assetId: '201-m01-process-choice',
    title: 'Process choice',
    shot: 'Conceptual comparison of resin vs other process pathways.',
    altIntent: 'Process choice comparison for resin candidacy.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['201-m01-process-choice'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'safety-zones': {
    assetId: '202-m02-safety-zone-behaviors',
    title: 'Safety zone behaviors',
    shot: 'Conceptual behaviors for clean vs controlled zones.',
    altIntent: 'Separated participant and resin-handling zone behaviors.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['202-m02-safety-zone-behaviors'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'complete-workflow': {
    assetId: '203-m03-workflow-checkpoints',
    title: 'Workflow checkpoints',
    shot: 'Conceptual checkpoints across model → slice → print → wash → cure.',
    altIntent: 'Five-stage resin workflow checkpoints.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['203-m03-workflow-checkpoints'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'file-readiness': {
    assetId: '204-m04-five-file-checks',
    title: 'Five file checks',
    shot: 'Conceptual five checks before calling a file printable.',
    altIntent: 'File readiness checklist visualization.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['204-m04-five-file-checks'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'slicer-lab': {
    assetId: '206-m05-orientation-tradeoffs',
    title: 'Orientation tradeoffs',
    shot: 'Conceptual orientation tradeoffs for resin slicing.',
    altIntent: 'Orientation tradeoffs in resin slicer preparation.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['206-m05-orientation-tradeoffs'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'print-wash-cure': {
    assetId: '210-m06-print-wash-dry-support-cure',
    title: 'Print / wash / cure sequence',
    shot: 'Conceptual print → wash → dry → supports → cure sequence.',
    altIntent: 'Instructor-operated print, wash, and cure sequence.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['210-m06-print-wash-dry-support-cure'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'failure-clinic': {
    assetId: '211-m07-failure-symptom-atlas',
    title: 'Failure symptom atlas',
    shot: 'Conceptual atlas of cured failure symptoms.',
    altIntent: 'Cured failure symptoms for diagnostic teaching.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['211-m07-failure-symptom-atlas'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
  'project-readiness': {
    assetId: '213-m08-readiness-board',
    title: 'Readiness board',
    shot: 'Conceptual readiness board and handoff cues.',
    altIntent: 'Materials prepared for a supervised resin-printing appointment.',
    aspect: 'landscape 16:9',
    minSize: '1672×941',
    src: RESIN_CONCEPT_CDN['213-m08-readiness-board'],
    caption: 'Conceptual teaching still',
    kind: 'illustration',
  },
}

/** Related asset IDs beyond the primary placeholder (kit shots, extras). */
export const RESIN_MODULE_MEDIA_IDS: Record<string, string[]> = {
  welcome: ['200-m00-participant-path', 'resin-kit-00', 'resin-room-wide-01'],
  'why-resin': ['201-m01-process-choice', 'resin-kit-01'],
  'safety-zones': [
    '202-m02-safety-zone-behaviors',
    'resin-mod-safety-ppe-01',
    'resin-kit-02',
    'resin-diagram-zones-01',
  ],
  'complete-workflow': [
    '203-m03-workflow-checkpoints',
    'resin-kit-03',
    'resin-diagram-workflow-01',
  ],
  'file-readiness': [
    '204-m04-five-file-checks',
    '205-m04-file-outcomes',
    'resin-kit-04',
  ],
  'slicer-lab': [
    '206-m05-orientation-tradeoffs',
    '207-m05-hollow-drain-cutaway',
    '208-m05-layers-and-islands',
    'resin-kit-05',
  ],
  'print-wash-cure': [
    '209-m06-preflight-stop-check',
    '210-m06-print-wash-dry-support-cure',
    'resin-kit-06',
  ],
  'failure-clinic': [
    '211-m07-failure-symptom-atlas',
    '212-m07-evidence-first-diagnosis',
    'resin-kit-07',
  ],
  'project-readiness': [
    '213-m08-readiness-board',
    '214-m08-readiness-pathways',
    'resin-kit-08',
  ],
}

export const RESIN_MEDIA_SHOT_LIST_HREF = '/workshop/resin-printing/media'

/** Short tutorial / demo video slots (placeholders until assets land). */
export const RESIN_MODULE_TUTORIAL_VIDEOS: Record<string, ModuleTutorialVideo> = {
  welcome: {
    assetId: 'resin-vid-welcome-01',
    title: 'How join + pace modes work',
    shot: '15–30s loop: TV join QR, Follow class vs My pace toggle, expectation statement on screen.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot',
  },
  'why-resin': {
    assetId: 'resin-vid-why-01',
    title: 'Detail vs scale comparison',
    shot: 'Macro pan across cured fine-detail sample beside a larger structural FDM/other sample.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot',
  },
  'safety-zones': {
    assetId: 'resin-vid-safety-01',
    title: 'Clean zone vs controlled zone walkthrough',
    shot: 'Illustrative room walk: clean table → amber boundary → controlled kit (no liquid handling).',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot — not a PPE procedure film',
  },
  'complete-workflow': {
    assetId: 'resin-vid-workflow-01',
    title: 'Five-stage pipeline in 30 seconds',
    shot: 'Cut between staged objects: file → supports → print → wash vessel → cured finish.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot',
  },
  'file-readiness': {
    assetId: 'resin-vid-file-01',
    title: 'Spot wall, cavity, and overhang issues',
    shot: 'Section cut animation on one sculptural form highlighting thin wall, cavity, overhang.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot',
  },
  'slicer-lab': {
    assetId: 'resin-vid-slicer-01',
    title: 'Orientation + supports overview',
    shot: 'Concept loop: rotate model, grow supports, pass translucent slice planes (no branded UI).',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot — not a slicer screenshot demo',
  },
  'print-wash-cure': {
    assetId: 'resin-vid-stations-01',
    title: 'Station roles (observe only)',
    shot: 'Three-beat cut: supported print → sealed wash vessel → curing glow. No hands-on operation.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot — instructor-led process only',
  },
  'failure-clinic': {
    assetId: 'resin-vid-fail-01',
    title: 'Evidence before diagnosis',
    shot: 'Raking light across four cured failure specimens; pause on each surface clue.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot — illustrative specimens',
  },
  'project-readiness': {
    assetId: 'resin-vid-ready-01',
    title: 'Ready / repair / consultation triage',
    shot: 'Top-down kit assemble: checklist, USB, sample, then three token states without badges.',
    aspect: 'landscape 16:9',
    caption: 'Tutorial video slot',
  },
}

