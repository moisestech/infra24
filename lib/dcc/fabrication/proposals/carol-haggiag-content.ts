export const CAROL_INTERNAL_WORKING_TITLE = 'Chicken Fingers'

export const CAROL_STATUS_SUBLABEL = 'Source + priorities clarified'

export const CAROL_PROJECT_THESIS =
  'Can Carol’s chicken-foot form become a mirrored pair of approximately 2.5-inch earrings that retain the texture and sculptural character of the source while becoming light enough to wear comfortably?'

export const CAROL_PROJECT_SUMMARY =
  'A focused lightweight earring prototype study — starting from Carol’s existing metal casts and an internet reference image, with the first goal of preserving texture and character while solving for weight and wearability.'

export const CAROL_TESTING_FOCUS = [
  'Lightness — substantially reduce mass from the brass reference',
  'Texture — preserve sculptural surface character at earring scale',
  'Wearability — test real relationship to the ear and body',
  'Mirrored pair geometry',
  'Target scale ~2.5 in / ~63.5 mm — to confirm in person',
  'Attachment orientation and comfortable finished weight',
]

export const CAROL_OBJECT_ANALYSIS = {
  source:
    'Internet reference image supplied by Carol (visual inspiration — not her original design). Carol’s own brass casts are the stronger physical source.',
  scale:
    'Approximately ~2.5 in / ~63.5 mm long — written as “2, 5 inches” in email; confirm at object review.',
  pair: 'Mirrored pair — confirmed.',
  weight:
    'Brass casts are too heavy for earrings. Previous metal experiments established weight as the primary constraint.',
  material:
    'Resin and other lightweight methods remain under evaluation — not predetermined.',
} as const

export const CAROL_PRIOR_METAL_STUDY = {
  heading: 'What we already learned',
  intro:
    'Carol’s existing metal casts already answer one important question: the form can hold substantial sculptural detail, but brass makes the object too heavy for the earring application she now wants to explore.',
  shift:
    'The objective is no longer “Can this form exist physically?” It is: “Can we preserve the form and texture while removing enough weight to make it wearable?”',
  criteria: [
    { label: 'Texture', note: 'Preserve sculptural character' },
    { label: 'Weight', note: 'Substantially reduce mass' },
    { label: 'Wearability', note: 'Test real relationship to the ear/body' },
  ],
} as const

export const CAROL_SOURCE_PATHWAYS = [
  {
    id: 'physical',
    title: 'Carol’s physical cast',
    badge: 'Preferred starting point',
    emphasis: 'primary' as const,
    steps: [
      'Physical object',
      'Measure + weigh',
      'Photograph / digital capture',
      'Build / clean geometry',
      'Mirror',
      'Lightweight prototype',
      'Weigh + test',
      'Carol review',
    ],
  },
  {
    id: 'images',
    title: 'Internet reference image',
    emphasis: 'default' as const,
    steps: [
      'Visual inspiration',
      'Secondary reference only',
      'Not primary geometry source',
    ],
  },
  {
    id: 'file',
    title: 'Existing 3D file',
    emphasis: 'default' as const,
    steps: ['Existing geometry', 'Inspection', 'Repair', 'Fabrication prep'],
  },
] as const

export const CAROL_SOURCE_PATHWAY_NOTE =
  'At the in-person review we will determine the simplest capture method — photogrammetry, scanning, image-assisted reconstruction, manual modeling, or another route. Generated geometry is a starting point, not automatically fabrication-ready jewelry CAD.'

export const CAROL_MATERIAL_DIRECTIONS = [
  {
    id: 'fdm',
    title: 'FDM form study',
    purpose: 'Low-cost scale / silhouette / lightweight study',
  },
  {
    id: 'gray-resin',
    title: 'Gray resin',
    purpose: 'High-detail geometry / texture evaluation — candidate prototype material',
  },
  {
    id: 'black-resin',
    title: 'Black resin',
    purpose: 'Visual direction close to the internet reference — candidate prototype material',
  },
  {
    id: 'clear-resin',
    title: 'Clear / translucent',
    purpose: 'Optional material exploration',
  },
  {
    id: 'metallic',
    title: 'Metal / brass',
    purpose:
      'Previously explored — currently deprioritized because of weight. Not the current goal.',
    status: 'Deprioritized',
  },
] as const

export const CAROL_METAL_CASTING_NOTE =
  'Previous brass experiments established that weight is a major constraint. The current study focuses on lightweight fabrication rather than another metal casting route.'

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
  'Carol’s physical cast',
  'Measure + weigh',
  'Digital source',
  'Mirrored study geometry',
  'Lightweight prototype',
  'Weight + texture + wearability',
  'Carol review',
  'Optional refinement',
] as const

export const CAROL_PHASE_1_STEPS = [
  {
    number: '01',
    title: 'Object review',
    body: 'Inspect Carol’s existing brass pieces in person at Studio 43.',
  },
  {
    number: '02',
    title: 'Measure + weigh',
    body: 'Record dimensions, weight, relevant geometry, and surface details.',
  },
  {
    number: '03',
    title: 'Digital source',
    body: 'Determine the simplest appropriate method to translate the physical object into usable digital geometry.',
  },
  {
    number: '04',
    title: 'Mirrored study',
    body: 'Create one geometry and mirrored counterpart as appropriate.',
  },
  {
    number: '05',
    title: 'Lightweight prototype',
    body: 'Produce one focused material/form test — method chosen for low weight, texture fidelity, and practical prototyping cost.',
  },
  {
    number: '06',
    title: 'Evaluate',
    body: 'Compare weight, texture, wearability, and attachment possibilities.',
  },
  {
    number: '07',
    title: 'Review with Carol',
    body: 'Decide whether a second refinement is worthwhile. Prototype 1 answers the material and wearability question before committing to a finished pair.',
  },
] as const

export const CAROL_DOCUMENTATION_STAGES = [
  { id: 'reference', label: 'Reference', status: 'complete' as const },
  { id: 'visual-study', label: 'Visual study', status: 'complete' as const },
  { id: 'client-input', label: 'Client input', status: 'complete' as const },
  { id: 'physical-review', label: 'Physical object review', status: 'pending' as const },
  { id: 'measure-weigh', label: 'Measure / weigh', status: 'pending' as const },
  { id: 'digital-source', label: 'Digital source', status: 'pending' as const },
  { id: 'lightweight-prototype', label: 'Lightweight prototype', status: 'pending' as const },
  { id: 'wearability-review', label: 'Wearability review', status: 'pending' as const },
  { id: 'carol-review', label: 'Carol review', status: 'pending' as const },
  { id: 'optional-refinement', label: 'Optional refinement', status: 'pending' as const },
]

export const CAROL_PRODUCTION_NETWORK = [
  { role: 'Carol Haggiag', note: 'Artistic intent / jewelry design' },
  { role: 'Moises Sanabria', note: 'Creative technology + fabrication direction' },
  {
    role: '3D specialist',
    note: 'When digital capture or reconstruction exceeds in-house scope',
  },
  { role: 'Prototype operator', note: 'Lightweight prototype production at Bakehouse' },
] as const

export const CAROL_CONFIRMED_INPUTS = [
  {
    id: 'physical',
    label: 'Physical reference',
    answer: 'Carol has real chicken feet previously cast in brass/metal (originally pendants).',
  },
  {
    id: 'mirror',
    label: 'Pair orientation',
    answer: 'Mirrored pair.',
  },
  {
    id: 'scale',
    label: 'Target scale',
    answer: 'Approximately ~2.5 in / ~63.5 mm — to confirm in person.',
  },
  {
    id: 'priorities',
    label: 'Prototype 1 priorities',
    answer: 'Lightness, texture, wearability.',
  },
  {
    id: 'metal',
    label: 'Metal casting',
    answer: 'Not desired right now — brass proved too heavy.',
  },
  {
    id: 'resin',
    label: 'Material direction',
    answer: 'Resin is one candidate prototype material — not yet selected.',
  },
] as const

export const CAROL_CLIENT_QUESTIONS = [
  {
    id: 'q1',
    text: 'Can you confirm approximately 2.5 inches long for each earring?',
  },
  {
    id: 'q2',
    text: 'What attachment or hardware direction feels appropriate to you?',
  },
  {
    id: 'q3',
    text: 'Is there a particular deadline or occasion you are working toward?',
  },
  {
    id: 'q4',
    text: 'What qualities of the physical metal pieces feel most important to preserve?',
  },
  {
    id: 'q5',
    text: 'What finished weight feels comfortable? (We can compare at the meeting — no gram value required.)',
  },
] as const

export const CAROL_FUTURE_SCOPE_EXCLUDED = [
  'Precious-metal casting, plating, or professional jewelry finishing',
  'Production edition or unlimited revisions',
  'Precious-metal hardware, molds, or external vendor costs',
  'Guaranteed reproduction of geometry not visible in source references',
  'Another metal casting route — deprioritized after brass weight tests',
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
