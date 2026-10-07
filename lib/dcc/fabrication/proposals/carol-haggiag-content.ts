export const CAROL_INTERNAL_WORKING_TITLE = 'Chicken Fingers'

export const CAROL_STATUS_SUBLABEL = 'Source + priorities clarified'

export const CAROL_PROJECT_THESIS =
  'Can Carol’s chicken-foot form become a mirrored pair of earrings, about 2 inches long, that retain the texture and sculptural character of the source while becoming light enough to wear comfortably?'

export const CAROL_PROJECT_SUMMARY =
  'A focused lightweight earring prototype study — starting from Carol’s existing metal casts and an internet reference image, with the first goal of preserving texture and character while solving for weight and wearability.'

export const CAROL_TESTING_FOCUS = [
  'Lightness — substantially reduce mass from the brass reference',
  'Texture — preserve sculptural surface character at earring scale',
  'Wearability — test real relationship to the ear and body',
  'Mirrored pair geometry',
  'Target scale about 2 inches — exact length still coming',
  'Attachment orientation and comfortable finished weight',
]

export const CAROL_OBJECT_ANALYSIS = {
  source:
    'Internet reference image supplied by Carol (visual inspiration — not her original design). Carol’s own brass casts are the stronger physical source.',
  scale: 'About 2 inches long — exact length still coming. Do not lock millimeters until Carol sends the measurement.',
  pair: 'Mirrored pair — confirmed.',
  weight:
    'Brass casts are too heavy for earrings. A solid reprint of that volume will still be too heavy. The prototype is a thin hollow resin shell.',
  material:
    'Transparent resin in two colorways: fuchsia and high-visibility green. Clear resin is the family those colors belong to.',
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
    id: 'fuchsia-transparent',
    title: 'Fuchsia, transparent',
    purpose:
      'Current colorway. Tinted clear resin so the earring stays see-through.',
    status: 'Current',
  },
  {
    id: 'high-viz-green',
    title: 'High-visibility green, transparent',
    purpose:
      'Current colorway. Tinted clear resin, matched as the second wearable study.',
    status: 'Current',
  },
  {
    id: 'clear-resin',
    title: 'Clear resin',
    purpose:
      'The material family for both colorways. Print a thin hollow shell with a drain so uncured resin can leave.',
  },
  {
    id: 'fdm',
    title: 'FDM form study',
    purpose:
      'Optional silhouette check only. It will not read as transparent fuchsia or high-visibility green.',
    status: 'Optional',
  },
  {
    id: 'gray-resin',
    title: 'Gray resin',
    purpose: 'Optional detail check for texture — not the color Carol asked for.',
    status: 'Optional',
  },
  {
    id: 'black-resin',
    title: 'Black resin',
    purpose: 'Optional detail check — not the color Carol asked for.',
    status: 'Optional',
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
    body: 'Print one thin hollow resin shell, then the two transparent colorways — fuchsia and high-visibility green. Judge weight, transparency, and wear.',
  },
  {
    number: '06',
    title: 'Evaluate',
    body: 'Compare weight, transparency, texture, wearability, and attachment possibilities.',
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
    answer: 'About 2 inches — exact length still coming.',
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
    answer:
      'Transparent resin: fuchsia and high-visibility green. A thin hollow shell, not a solid cast.',
  },
] as const

export const CAROL_CLIENT_QUESTIONS = [
  {
    id: 'q1',
    text: 'What is the exact length for each earring? The working note is about 2 inches.',
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
