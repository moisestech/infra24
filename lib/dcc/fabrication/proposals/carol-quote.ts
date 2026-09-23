import type { QuoteLineItem } from '@/lib/dcc/fabrication/schema'

/** Scope layers for Carol — amounts pending until physical object review. */
export const CAROL_QUOTE_LAYERS: QuoteLineItem[] = [
  {
    id: 'source-digital',
    label: 'Object review + digital source preparation',
    shortLabel: 'SOURCE',
    description:
      'In-person inspection of Carol’s brass pieces; measure, weigh, and determine the simplest digital capture or preparation route.',
    clientReceives: [
      'Physical object review at Studio 43',
      'Dimensions, weight, and surface documentation',
      'Digital source method decision — not production-ready jewelry CAD yet',
    ],
    category: 'preflight',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'geometry-study',
    label: 'Geometry / scale / mirror preparation',
    shortLabel: 'STUDY',
    description:
      'Build or clean study geometry, confirm mirrored pair logic, and prepare for a focused prototype run.',
    clientReceives: [
      'Mirrored study geometry at agreed scale',
      'Scale confirmation against ~2.5 in target (once confirmed)',
      'Study-model prep — not final production CAD',
    ],
    category: 'preflight',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'fabrication',
    label: 'Lightweight prototype fabrication',
    shortLabel: 'FABRICATION',
    description:
      'One focused prototype using the best candidate material for weight, texture fidelity, and practical cost.',
    clientReceives: [
      'One lightweight prototype form test',
      'Machine + post-processing to review checkpoint',
      'Material choice documented — resin only if it is the best candidate',
    ],
    category: 'fabrication',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'wearability',
    label: 'Weight + attachment + wearability evaluation',
    shortLabel: 'WEAR',
    description:
      'Compare prototype weight, texture, and wearability against Carol’s brass reference and comfort goals.',
    clientReceives: [
      'Weight comparison notes',
      'Attachment option review (not final hardware approval)',
      'Wearability observations against the body',
    ],
    category: 'qa',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'review',
    label: 'Review with Carol',
    shortLabel: 'REVIEW',
    description:
      'Structured review of Prototype 1 findings and recommendation for next steps.',
    clientReceives: [
      'In-person or scheduled review checkpoint',
      'Findings record — what worked, what to adjust',
      'Clear recommendation before any second study',
    ],
    category: 'handoff',
    clientVisible: true,
    amountStatus: 'pending',
    source: 'DCC-JOB-002 Phase 1 packaging',
  },
  {
    id: 'revision',
    label: 'Optional revision',
    shortLabel: 'OPTIONAL',
    description:
      'Only if Prototype 1 indicates it is worthwhile — one scoped adjustment, not open-ended iteration.',
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
]
