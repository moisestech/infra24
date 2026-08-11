import type { ModuleMediaPlaceholder } from '@/lib/workshop-engine/types'

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

/** Primary teaching still per module (replaces on-page placeholders). */
export const RESIN_MODULE_PRIMARY_MEDIA: Record<string, ModuleMediaPlaceholder> = {
  welcome: {
    assetId: 'resin-mod-welcome-01',
    title: 'Join screen + teaching kit',
    shot: 'Wide room image with both smart TVs on the join/QR screen, printed QR backup card, and cured samples in the foreground.',
    altIntent: 'Workshop room prepared for participants with screens and teaching objects.',
    aspect: 'landscape 16:10',
    minSize: '2400×1500',
  },
  'why-resin': {
    assetId: 'resin-mod-why-01',
    title: 'Resin detail comparison',
    shot: 'Macro pair: small fine-detail cured object beside a larger cured object with ruler or coin for scale.',
    altIntent: 'Close comparison of cured resin prints at two scales.',
    aspect: 'portrait 4:5',
    minSize: '1600×2000',
  },
  'safety-zones': {
    assetId: 'resin-diagram-zones-01',
    title: 'Clean zone / controlled zone',
    shot: 'Venue-neutral instructional diagram of clean vs controlled resin zones.',
    altIntent: 'Separated participant and resin-handling areas.',
    aspect: 'landscape 16:9',
    minSize: '960×420',
    src: RESIN_ASSET_PATHS.zonesDiagram,
    caption: 'Instructional diagram',
    kind: 'diagram',
  },
  'complete-workflow': {
    assetId: 'resin-diagram-workflow-01',
    title: 'Five-stage material workflow',
    shot: 'Instructional diagram: model → slice → print → wash → cure.',
    altIntent: 'Five stages of the resin printing workflow.',
    aspect: 'landscape 16:9',
    minSize: '960×360',
    src: RESIN_ASSET_PATHS.workflowDiagram,
    caption: 'Instructional diagram',
    kind: 'diagram',
  },
  'file-readiness': {
    assetId: 'resin-mod-file-good-01',
    title: 'Ready / repair comparison',
    shot: 'Annotated render pairing a printable manifold model with thin walls, holes, and trapped cavities.',
    altIntent: 'Digital models compared for resin-printing readiness.',
    aspect: 'landscape 16:9',
    minSize: '2400×1350',
  },
  'slicer-lab': {
    assetId: 'resin-mod-slicer-01',
    title: 'Slicer sequence',
    shot: 'Clean screen capture: demo model oriented, supports on, hollow + drain visible, layer preview panel open.',
    altIntent: 'A model being prepared in the validated resin slicer.',
    aspect: 'landscape 16:9',
    minSize: '2400×1350',
  },
  'print-wash-cure': {
    assetId: 'resin-mod-stations-01',
    title: 'Print / wash / cure stations',
    shot: 'Three-part station image photographed from the participant clean-zone viewpoint: printer | wash | cure.',
    altIntent: 'Instructor-operated resin printer, washing station, and curing station.',
    aspect: 'landscape 16:9',
    minSize: '2400×1350',
  },
  'failure-clinic': {
    assetId: 'resin-mod-fail-grid-01',
    title: 'Cured failure specimens',
    shot: 'Labeled grid of cured failures: plate/film fail, detached part, crack, white bloom, soft/warp detail.',
    altIntent: 'Cured failed prints used as diagnostic teaching samples.',
    aspect: 'landscape 16:9',
    minSize: '2400×1350',
  },
  'project-readiness': {
    assetId: 'resin-mod-ready-01',
    title: 'Appointment-ready kit',
    shot: 'Top-down: printed checklist, cured sample, labeled USB, and resource QR card.',
    altIntent: 'Materials prepared for a supervised resin-printing appointment.',
    aspect: 'portrait 4:5',
    minSize: '1600×2000',
  },
}

/** Related asset IDs beyond the primary placeholder (kit shots, extras). */
export const RESIN_MODULE_MEDIA_IDS: Record<string, string[]> = {
  welcome: ['resin-mod-welcome-01', 'resin-kit-00', 'resin-room-wide-01'],
  'why-resin': ['resin-mod-why-01', 'resin-kit-01'],
  'safety-zones': [
    'resin-mod-safety-01',
    'resin-mod-safety-ppe-01',
    'resin-kit-02',
    'resin-diagram-zones-01',
  ],
  'complete-workflow': ['resin-mod-workflow-01', 'resin-kit-03', 'resin-diagram-workflow-01'],
  'file-readiness': ['resin-mod-file-good-01', 'resin-mod-file-bad-01', 'resin-kit-04'],
  'slicer-lab': [
    'resin-mod-slicer-01',
    'resin-mod-slicer-steps-01',
    'resin-mod-slicer-steps-02',
    'resin-mod-slicer-steps-03',
    'resin-mod-slicer-steps-04',
    'resin-mod-slicer-steps-05',
    'resin-kit-05',
  ],
  'print-wash-cure': [
    'resin-mod-stations-01',
    'resin-mod-stations-detail-01',
    'resin-kit-06',
  ],
  'failure-clinic': [
    'resin-mod-fail-grid-01',
    'resin-mod-fail-01',
    'resin-mod-fail-02',
    'resin-mod-fail-03',
    'resin-mod-fail-04',
    'resin-mod-fail-05',
    'resin-kit-07',
  ],
  'project-readiness': ['resin-mod-ready-01', 'resin-kit-08'],
}

export const RESIN_MEDIA_SHOT_LIST_HREF = '/workshop/resin-printing/media'
