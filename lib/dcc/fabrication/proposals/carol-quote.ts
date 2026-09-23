import type { QuoteLineItem } from '@/lib/dcc/fabrication/schema'

/** Scope layers for Carol — amounts pending until source review. */
export const CAROL_QUOTE_LAYERS: QuoteLineItem[] = [
  {
    id: 'source-digital',
    label: 'Source review + digital preparation',
    shortLabel: 'SOURCE',
    description:
      'Determine starting input (file, object, or images) and prepare study geometry to agreed fidelity.',
    clientReceives: [
      'Source pathway decision with Carol',
      'Geometry inspection or reconstruction scope',
      'Study-model prep — not production-ready jewelry CAD',
    ],
    category: 'preflight',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'physical-study',
    label: 'Physical study (FDM + resin)',
    shortLabel: 'STUDY',
    description:
      'Optional FDM for scale/silhouette; one high-detail neutral resin test on M7 Max when geometry is ready.',
    clientReceives: [
      'FDM iteration only if it answers scale or silhouette',
      'One high-detail resin test print path',
      'Wash / cure / basic cleanup to review checkpoint',
    ],
    category: 'fabrication',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'wearability',
    label: 'Wearability + attachment review',
    shortLabel: 'WEAR',
    description:
      'Test scale, weight, loop strength, and preliminary hardware against the body.',
    clientReceives: [
      'Wearability notes against Carol’s scale intent',
      'Attachment option comparison (not a final hardware approval)',
      'Weight and movement observations',
    ],
    category: 'qa',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'review',
    label: 'Carol review + findings',
    shortLabel: 'REVIEW',
    description:
      'Structured review of the physical result and documented findings for next decisions.',
    clientReceives: [
      'In-person or scheduled review checkpoint',
      'Findings record — what worked, what to adjust',
      'Recommendation for one defined revision or second study',
    ],
    category: 'handoff',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'revision',
    label: 'One defined revision',
    shortLabel: 'REVISE',
    description:
      'One agreed geometry or scale adjustment after the first physical review — not open-ended iteration.',
    clientReceives: [
      'Single scoped revision after review sign-off',
      'Updated study geometry if required',
      'Second physical test only if agreed in revision scope',
    ],
    prevents: 'Unlimited redesign or production attempts without separate approval.',
    category: 'postprocess',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'output',
    label: 'Prototype output + handoff',
    shortLabel: 'OUTPUT',
    description:
      'Refined prototype pair or second study object depending on first test results.',
    clientReceives: [
      'Physical prototype output per agreed scope',
      'Handoff summary for Carol’s next decisions',
      'Documentation rights per project agreement',
    ],
    category: 'handoff',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
]
