import {
  MACHINE_HOURLY_USD,
  OPERATOR_HOURLY_USD,
} from '@/lib/dcc/fabrication/economics-defaults'
import { estimatePaymentFee } from '@/lib/dcc/fabrication/quote-economics'
import type { CostLineItem, QuoteLineItem } from '@/lib/dcc/fabrication/schema'

export const HEATHER_QUOTE_TOTAL_USD = 625

export const HEATHER_DEFAULT_FOUNDER_HOURS = 2.5

export const HEATHER_CLIENT_MATERIAL_OUTLAY_USD = 42.47

export const HEATHER_QUOTE_LINE_ITEMS: QuoteLineItem[] = [
  {
    id: 'preflight',
    label: 'Technical preflight + production preparation',
    shortLabel: 'PREP',
    description:
      'File review, slice sanity check, and production prep before the machine is reserved.',
    clientReceives: [
      'Review of the current file and supported production state',
      'Orientation / support strategy check against the existing slice',
      'Material profile checkpoint once resin is approved',
      'M7 Max reservation and production prep for one attempt',
    ],
    prevents:
      'Starting production on an unreviewed file or unconfirmed material profile.',
    category: 'preflight',
    clientVisible: true,
    amount: 165,
    source: 'DCC-JOB-001 scoped packaging',
  },
  {
    id: 'fabrication',
    label: 'Fabrication + machine allocation',
    shortLabel: 'MAKE',
    description:
      'One production attempt on the approved SLA machine, including machine prep and run monitoring.',
    clientReceives: [
      'Machine prep and allocation for Prototype 1',
      'One included fabrication attempt on Anycubic Photon Mono M7 Max',
      'Production monitoring through the agreed checkpoint',
    ],
    prevents: 'Open-ended print retries without a separate approval.',
    category: 'fabrication',
    clientVisible: true,
    amount: 210,
    source: 'DCC-JOB-001 scoped packaging',
  },
  {
    id: 'postprocess',
    label: 'Post-processing + basic cleanup',
    shortLabel: 'FINISH',
    description:
      'Wash, cure, support removal, and basic cleanup to the Prototype 1 finishing checkpoint.',
    clientReceives: [
      'Wash and cure per the confirmed translucent profile',
      'Support removal to the agreed finishing checkpoint',
      'Basic surface cleanup — not exhibition finishing',
    ],
    category: 'postprocess',
    clientVisible: true,
    amount: 110,
    source: 'DCC-JOB-001 scoped packaging',
  },
  {
    id: 'qa-findings',
    label: 'QA + manufacturer findings record',
    shortLabel: 'LEARN',
    description:
      'Quality review against fit and lighting notes, plus a findings record for manufacturer review.',
    clientReceives: [
      'QA against fit and lighting-hardware notes once inputs arrive',
      'Documented findings record for manufacturer review',
      'Recommendations for Prototype 2 if warranted',
    ],
    category: 'qa',
    clientVisible: true,
    amount: 90,
    source: 'DCC-JOB-001 scoped packaging',
  },
  {
    id: 'handoff',
    label: 'Project handoff + review',
    shortLabel: 'HANDOFF',
    description:
      'Scheduling, pickup coordination, and a Studio 43 review checkpoint before handoff.',
    clientReceives: [
      'Pickup / handoff scheduling',
      'Studio 43 review checkpoint before release',
      'Handoff summary for manufacturer review',
    ],
    category: 'handoff',
    clientVisible: true,
    amount: 50,
    source: 'DCC-JOB-001 scoped packaging',
  },
]

export type HeatherCostInputs = {
  machineHours: number
  operatorHours: number
  consumablesUsd: number
  quoteTotal?: number
}

export function buildHeatherCostLineItems(
  input: HeatherCostInputs
): CostLineItem[] {
  const quoteTotal = input.quoteTotal ?? HEATHER_QUOTE_TOTAL_USD
  const paymentFee = estimatePaymentFee(quoteTotal)

  return [
    {
      id: 'machine',
      category: 'machine',
      label: 'Machine',
      quantity: input.machineHours,
      unit: 'hr',
      internalRate: MACHINE_HOURLY_USD,
      cost: input.machineHours * MACHINE_HOURLY_USD,
    },
    {
      id: 'operator',
      category: 'operator',
      label: 'Operator',
      quantity: input.operatorHours,
      unit: 'hr',
      internalRate: OPERATOR_HOURLY_USD,
      cost: input.operatorHours * OPERATOR_HOURLY_USD,
      operatorId: 'moises-sanabria',
    },
    {
      id: 'consumables',
      category: 'consumables',
      label: 'Consumables',
      quantity: 1,
      cost: input.consumablesUsd,
    },
    {
      id: 'payment-fee',
      category: 'payment_fee',
      label: 'Payment fee (est.)',
      notes: '2.9% + $0.30 — estimate, not a live Stripe charge',
      cost: paymentFee,
    },
    {
      id: 'dcc-materials',
      category: 'materials',
      label: 'DCC-supplied materials',
      cost: 0,
    },
    {
      id: 'partner-costs',
      category: 'partner',
      label: 'Partner costs',
      cost: 0,
    },
  ]
}

/** Default internal cost stack for DCC-JOB-001 at locked pilot rates. */
export const HEATHER_DEFAULT_COST_INPUTS: HeatherCostInputs = {
  machineHours: 8,
  operatorHours: 3,
  consumablesUsd: 35,
}

export const HEATHER_COST_LINE_ITEMS: CostLineItem[] = buildHeatherCostLineItems(
  HEATHER_DEFAULT_COST_INPUTS
)
