export const CAROL_INTERNAL_WORKING_TITLE = 'Chicken Fingers'

export const CAROL_PROJECT_SUMMARY =
  'Translating Carol Haggiag’s sculptural hand forms into a tested physical jewelry prototype — exploring scale, weight, attachment, material, and wearability while preserving the organic surface and elongated fingers.'

export const CAROL_TESTING_FOCUS = [
  'Digital geometry fidelity from source',
  'Scale and weight on the body',
  'Structural strength of thin elongated fingers',
  'Attachment loop strength and orientation',
  'Material direction (resin study vs future metal path)',
  'How much surface texture survives at earring scale',
]

export const CAROL_OBJECT_ANALYSIS = {
  surface:
    'Pronounced organic texture and deep relief. Need to test how much survives at earring scale.',
  structure:
    'Thin elongated fingers create potential structural weaknesses at jewelry scale.',
  connection:
    'Existing wrist loop gives a starting point, but attachment strength and orientation must be tested.',
  wearability:
    'Scale, weight, movement, and relationship to the body matter — not silhouette alone.',
} as const

export const CAROL_SOURCE_PATHWAYS = [
  {
    id: 'file',
    title: 'Existing 3D file',
    steps: ['Existing geometry', 'Inspection', 'Repair', 'Fabrication prep'],
  },
  {
    id: 'physical',
    title: 'Physical object',
    steps: ['Physical form', 'Photography / scan', 'Mesh cleanup', 'Fabrication prep'],
  },
  {
    id: 'images',
    title: 'Images only',
    steps: [
      'Reference imagery',
      'Image-assisted reconstruction',
      'Manual cleanup',
      'Fabrication-ready study geometry',
    ],
  },
] as const

export const CAROL_SOURCE_PATHWAY_NOTE =
  'Generated geometry is a starting point, not automatically a fabrication-ready jewelry model.'

export const CAROL_MATERIAL_DIRECTIONS = [
  {
    id: 'fdm',
    title: 'FDM form study',
    purpose: 'Scale, silhouette, rapid inexpensive iteration',
  },
  {
    id: 'gray-resin',
    title: 'Gray resin',
    purpose: 'Geometry, texture, shadow and detail evaluation',
  },
  {
    id: 'black-resin',
    title: 'Black resin',
    purpose: 'Material direction close to source imagery',
  },
  {
    id: 'clear-resin',
    title: 'Clear / translucent resin',
    purpose: 'Material and light exploration',
  },
  {
    id: 'metallic',
    title: 'Metallic / silver direction',
    purpose: 'Future production visualization only — not a current DCC capability',
  },
  {
    id: 'castable',
    title: 'Castable resin',
    purpose:
      'Future only, after a specialist caster / workflow has been validated. DCC does not perform metal casting.',
  },
] as const

export const CAROL_ATTACHMENT_OPTIONS = [
  { id: 'hook', label: 'Direct hook', note: 'Simplest path — strength and orientation TBD' },
  { id: 'jump-ring', label: 'Jump ring', note: 'Common jewelry hardware — sizing TBD' },
  {
    id: 'integrated',
    label: 'Integrated connection / bail',
    note: 'Uses or extends wrist loop — structural review required',
  },
] as const

export const CAROL_FABRICATION_PATH = [
  'Carol’s vision',
  'Source',
  'Digital geometry',
  'Form + scale',
  'Optional FDM study',
  'High-detail resin study',
  'Wash / cure / finish',
  'Attachment + weight',
  'Carol review',
  'One defined refinement',
  'Prototype output',
] as const

export const CAROL_PHASE_1_STEPS = [
  {
    number: '01',
    title: 'Source review',
    body: 'Determine whether starting from a 3D file, physical object, or images.',
  },
  {
    number: '02',
    title: 'Digital preparation',
    body: 'Prepare or reconstruct study geometry to an agreed fidelity.',
  },
  {
    number: '03',
    title: 'Physical study',
    body: 'Use FDM only if it helps answer scale or silhouette. Produce one high-detail neutral resin test.',
  },
  {
    number: '04',
    title: 'Wearability',
    body: 'Test scale, weight, loop strength, and preliminary hardware.',
  },
  {
    number: '05',
    title: 'Review',
    body: 'Carol reviews the physical result.',
  },
  {
    number: '06',
    title: 'One defined revision',
    body: 'One agreed geometry or scale adjustment — not open-ended iteration.',
  },
  {
    number: '07',
    title: 'Output',
    body: 'Refined prototype pair or second study depending on first test results.',
  },
] as const

export const CAROL_DOCUMENTATION_STAGES = [
  { id: 'reference', label: 'Reference', status: 'complete' as const },
  { id: 'visual-study', label: 'Visual study', status: 'complete' as const },
  { id: 'source-review', label: 'Source review', status: 'pending' as const },
  { id: 'digital-model', label: 'Digital model', status: 'pending' as const },
  { id: 'fdm-study', label: 'FDM study', status: 'conditional' as const },
  { id: 'resin-test', label: 'Resin test', status: 'pending' as const },
  { id: 'wearability', label: 'Wearability', status: 'pending' as const },
  { id: 'carol-review', label: 'Carol review', status: 'pending' as const },
  { id: 'refinement', label: 'Refinement', status: 'pending' as const },
  { id: 'final-output', label: 'Final output', status: 'pending' as const },
]

export const CAROL_PRODUCTION_NETWORK = [
  { role: 'Carol Haggiag', note: 'Artistic intent / jewelry design' },
  { role: 'Moises Sanabria', note: 'Creative technology + fabrication direction' },
  {
    role: '3D specialist',
    note: 'When digital sculpting or reconstruction exceeds in-house scope',
  },
  { role: 'Resin operator', note: 'Prototype production at Bakehouse' },
  {
    role: 'Specialist caster',
    note: 'Only if future metal production is selected — not in Phase 1',
  },
] as const

export const CAROL_CLIENT_QUESTIONS = [
  {
    id: 'q1',
    text: 'Do these images come from an existing 3D file, or are they the original source?',
  },
  {
    id: 'q2',
    text: 'Does a physical version of the hand exist that could potentially be photographed or scanned?',
  },
  { id: 'q3', text: 'About how large do you imagine each earring?' },
  {
    id: 'q4',
    text: 'Should the earrings be identical, mirrored, or intentionally different?',
  },
  {
    id: 'q5',
    text: 'What matters most in the first prototype: texture, scale, wearability, material, or path toward metal?',
  },
  { id: 'q6', text: 'Is black part of the intended final appearance?' },
  {
    id: 'q7',
    text: 'Could resin be a final material, or is it primarily a prototype toward another material?',
  },
  {
    id: 'q8',
    text: 'Do you already have a preferred attachment or hardware strategy?',
  },
  {
    id: 'q9',
    text: 'Is this currently one-off, or could it eventually become multiples or an edition?',
  },
  { id: 'q10', text: 'Is there a date or occasion the project is working toward?' },
] as const

export const CAROL_ESSENTIAL_QUESTION =
  'What about the original hands feels essential to preserve — and what are you comfortable changing if fabrication requires it?'

export const CAROL_FUTURE_SCOPE_EXCLUDED = [
  'Precious-metal casting, plating, or professional jewelry finishing',
  'Production edition or unlimited revisions',
  'Precious-metal hardware, molds, or external vendor costs',
  'Guaranteed reproduction of geometry not visible in source references',
  'Metal casting by DCC — future path may involve a specialist caster only',
]

export const CAROL_CREDITS = [
  { name: 'Carol Haggiag', role: 'Concept / jewelry design / artistic direction' },
  {
    name: 'Moises Sanabria · Moises.Tech',
    role: 'Creative technology / digital fabrication development / prototype coordination',
  },
  {
    name: 'DCC Miami',
    role: 'Fabrication infrastructure where appropriate',
  },
] as const
