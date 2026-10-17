import {
  MACHINE_HOURLY_USD,
  OPERATOR_HOURLY_USD,
  PAYMENT_FEE_RATE,
} from '@/lib/dcc/fabrication/economics-defaults'
import { estimatePaymentFee } from '@/lib/dcc/fabrication/quote-economics'
import {
  CAROL_PROPOSAL,
  FRANKIE_PROPOSAL,
  OSCAR_PROPOSAL,
  SANDRA_PROPOSAL,
} from '@/lib/dcc/fabrication/proposals'

/**
 * Staff-only sprint assumptions. Edit this module to change a quote.
 * Client proposal pages do not import it.
 * Null costs are Pending technical review and are never treated as zero.
 */

export type SprintCostBucket =
  | 'cad'
  | 'file_prep'
  | 'machine'
  | 'material'
  | 'operator'
  | 'finishing'
  | 'qa_risk'
  | 'external'
  | 'coordination'
  | 'payment_fee'

export type SprintCostRow = {
  id: string
  bucket: SprintCostBucket
  label: string
  quantity?: number
  unit?: string
  /** Internal rate frame. Never render on a client page. */
  internalRate?: number
  costUsd: number | null
  notes?: string
}

export type QuoteSprintRole = 'active' | 'historical' | 'candidate'

export type QuoteSprintEntry = {
  slug: string
  role: QuoteSprintRole
  clientName: string
  projectTitle: string
  airtableRecordId?: string
  stage: string
  /** Client-facing planning allowance. Not a firm quote. */
  workingAllowanceUsd: number | null
  confidence: 'low' | 'medium' | 'high'
  missingInputs: string[]
  proposedOperator: string
  proposedMachine: string
  constraints: string[]
  quoteReadiness: string
  nextAction: string
  lastConfirmedClientContact: string
  documentationPermission: string
  founderHours: number | null
  rows: SprintCostRow[]
}

export const PENDING_TECHNICAL_REVIEW = 'Pending technical review'

const NO_CONFIRMED_CONTACT = 'No confirmed client message date in the proposal record.'

const PRIVATE_DOCS =
  'Internal process notes only. Public client name, CAD, process photos, finished object, economics, and case study are not approved.'

function pendingRow(
  bucket: Exclude<SprintCostBucket, 'payment_fee'>,
  label: string,
  internalRate?: number
): SprintCostRow {
  return {
    id: bucket,
    bucket,
    label,
    internalRate,
    costUsd: null,
    notes: PENDING_TECHNICAL_REVIEW,
  }
}

function productionRows(): SprintCostRow[] {
  return [
    pendingRow('cad', 'CAD and modeling labor', OPERATOR_HOURLY_USD),
    pendingRow('file_prep', 'File preparation', OPERATOR_HOURLY_USD),
    pendingRow('machine', 'Machine time', MACHINE_HOURLY_USD),
    pendingRow('material', 'Material consumption'),
    pendingRow('operator', 'Operator labor', OPERATOR_HOURLY_USD),
    pendingRow('finishing', 'Post-processing and finishing', OPERATOR_HOURLY_USD),
    pendingRow('qa_risk', 'QA and production risk'),
    pendingRow('external', 'External fabrication'),
    pendingRow('coordination', 'Coordination and founder time'),
  ]
}

function paymentFeeRow(allowanceUsd: number): SprintCostRow {
  return {
    id: 'payment_fee',
    bucket: 'payment_fee',
    label: 'Payment fee if the planning allowance is charged',
    internalRate: PAYMENT_FEE_RATE,
    costUsd: Number(estimatePaymentFee(allowanceUsd).toFixed(2)),
    notes: 'Formula only. Not a live charge and not a firm quote.',
  }
}

function pendingPaymentFeeRow(): SprintCostRow {
  return {
    id: 'payment_fee',
    bucket: 'payment_fee',
    label: 'Payment fee',
    internalRate: PAYMENT_FEE_RATE,
    costUsd: null,
    notes: PENDING_TECHNICAL_REVIEW,
  }
}

export function sprintKnownCostUsd(rows: readonly SprintCostRow[]): number {
  return rows.reduce((sum, row) => (row.costUsd == null ? sum : sum + row.costUsd), 0)
}

export function sprintPendingRows(rows: readonly SprintCostRow[]): SprintCostRow[] {
  return rows.filter((row) => row.costUsd == null)
}

export function sprintContributionReady(rows: readonly SprintCostRow[]): boolean {
  return sprintPendingRows(rows).length === 0
}

const CAROL: QuoteSprintEntry = {
  slug: CAROL_PROPOSAL.slug,
  role: 'active',
  clientName: CAROL_PROPOSAL.job.clientName,
  projectTitle: CAROL_PROPOSAL.job.projectTitle,
  airtableRecordId: CAROL_PROPOSAL.job.id,
  stage: 'Scoping',
  workingAllowanceUsd: 225,
  confidence: 'low',
  missingInputs: [
    'In-person brass cast inspection',
    'Exact length (working note is about 2 inches)',
    'One approved resin tint for the first test',
    'Confirmed access to the Photon Mono M7 Max and compatible resin',
  ],
  proposedOperator: 'Project lead: Moises Sanabria. Machine operator: unconfirmed.',
  proposedMachine: 'Anycubic Photon Mono M7 Max — access and resin supply unconfirmed.',
  constraints: [
    '$225 is one hollow-shell resin test in one color, not both requested colors.',
    'Not a finished wearable pair.',
    'Fuchsia transparent and high-visibility green remain requested directions for a later quote.',
  ],
  quoteReadiness: 'Planning allowance only. Not quote-ready.',
  nextAction: CAROL_PROPOSAL.approvalNextStep,
  lastConfirmedClientContact: 'Aug 19, 2026 photos to the Digital Lab inbox; forwarded Sep 16, 2026.',
  documentationPermission: PRIVATE_DOCS,
  founderHours: null,
  rows: [...productionRows(), paymentFeeRow(225)],
}

const OSCAR: QuoteSprintEntry = {
  slug: OSCAR_PROPOSAL.slug,
  role: 'active',
  clientName: OSCAR_PROPOSAL.job.clientName,
  projectTitle: OSCAR_PROPOSAL.job.projectTitle,
  airtableRecordId: OSCAR_PROPOSAL.job.id,
  stage: 'Needs Info',
  workingAllowanceUsd: 350,
  confidence: 'low',
  missingInputs: [...OSCAR_PROPOSAL.requiredInputs],
  proposedOperator: 'Project lead: Moises Sanabria. Machine operator: unconfirmed.',
  proposedMachine: 'Bambu H2S or H2D at Studio 43 — schedule and filament unconfirmed.',
  constraints: [
    '$350 is conditional on one small unpainted desktop model from photographs.',
    'Not a structural, full-scale, or architecturally exact balcony.',
  ],
  quoteReadiness: 'Planning allowance only. Not quote-ready.',
  nextAction: OSCAR_PROPOSAL.approvalNextStep,
  lastConfirmedClientContact: 'Aug 18, 2026 image request; resent Sep 25, 2026.',
  documentationPermission: PRIVATE_DOCS,
  founderHours: null,
  rows: [...productionRows(), paymentFeeRow(350)],
}

const FRANKIE: QuoteSprintEntry = {
  slug: FRANKIE_PROPOSAL.slug,
  role: 'active',
  clientName: FRANKIE_PROPOSAL.job.clientName,
  projectTitle: FRANKIE_PROPOSAL.job.projectTitle,
  airtableRecordId: FRANKIE_PROPOSAL.job.id,
  stage: 'Needs Info',
  workingAllowanceUsd: null,
  confidence: 'low',
  missingInputs: [...FRANKIE_PROPOSAL.requiredInputs],
  proposedOperator: 'Project lead: Moises Sanabria. Machine operator: unconfirmed.',
  proposedMachine: 'Resin process not selected. Diagnostic comes before a mold reprint.',
  constraints: [
    'Lane A, precision mold diagnostic, and lane B, coral enlargement, are separate.',
    'The earlier $75 ring-halves estimate does not apply.',
  ],
  quoteReadiness: 'Not quote-ready. No planning allowance.',
  nextAction: FRANKIE_PROPOSAL.approvalNextStep,
  lastConfirmedClientContact: NO_CONFIRMED_CONTACT,
  documentationPermission: PRIVATE_DOCS,
  founderHours: null,
  rows: [...productionRows(), pendingPaymentFeeRow()],
}

const SANDRA: QuoteSprintEntry = {
  slug: SANDRA_PROPOSAL.slug,
  role: 'active',
  clientName: SANDRA_PROPOSAL.job.clientName,
  projectTitle: SANDRA_PROPOSAL.job.projectTitle,
  airtableRecordId: SANDRA_PROPOSAL.job.id,
  stage: 'Needs Info',
  workingAllowanceUsd: null,
  confidence: 'low',
  missingInputs: [...SANDRA_PROPOSAL.requiredInputs],
  proposedOperator: 'Project lead: Moises Sanabria. Machine operator: unconfirmed.',
  proposedMachine: 'Not selected. Object and source material are still unknown.',
  constraints: ['No price, dimensions, material, or machine until the object is known.'],
  quoteReadiness: 'Discovery only. Not quote-ready.',
  nextAction: SANDRA_PROPOSAL.approvalNextStep,
  lastConfirmedClientContact: NO_CONFIRMED_CONTACT,
  documentationPermission: PRIVATE_DOCS,
  founderHours: null,
  rows: [...productionRows(), pendingPaymentFeeRow()],
}

const HEATHER: QuoteSprintEntry = {
  slug: 'heather-deitch',
  role: 'historical',
  clientName: 'Heather Deitch',
  projectTitle: 'Existing prototype history',
  stage: 'Closed',
  workingAllowanceUsd: null,
  confidence: 'high',
  missingInputs: [],
  proposedOperator: 'None. Do not assign production.',
  proposedMachine: 'None. Do not reserve a machine for the closed $625 scope.',
  constraints: [
    'The $625 fabrication scope was declined after self-production.',
    'Airtable rec7kiWSEqEINpcNG is Closed / Lost. Do not reopen it.',
    'A separate lighting and glass scoping row exists. Wait for a new concrete request before planning it.',
  ],
  quoteReadiness: 'Not in the sprint. Do not reopen.',
  nextAction: 'Wait for a new concrete request before any specialist production planning.',
  lastConfirmedClientContact: 'Not reconfirmed for a new request.',
  documentationPermission: PRIVATE_DOCS,
  founderHours: null,
  rows: [],
}

const GIANNI: QuoteSprintEntry = {
  slug: 'gianni-dalerta',
  role: 'candidate',
  clientName: "Gianni D'Alerta",
  projectTitle: 'Possible finishing or print-diagnostic clinic',
  stage: 'Signal',
  workingAllowanceUsd: null,
  confidence: 'low',
  missingInputs: ['A specific object he wants diagnosed', 'Willingness to pay for a short clinic'],
  proposedOperator: 'Not an operator. Do not assign paid-operator status.',
  proposedMachine: 'His own printer, or a DCC machine only after a paid diagnostic is accepted.',
  constraints: [
    'Candidate only. Not a committed client and not a fifth accepted job.',
    'Possible first offer is a 60–90 minute finishing or print-diagnostic clinic after he asks.',
  ],
  quoteReadiness: 'No quote. No job record.',
  nextAction: 'Track as a network signal. Offer a small paid clinic only after he asks.',
  lastConfirmedClientContact: NO_CONFIRMED_CONTACT,
  documentationPermission: 'No public before/after study without his consent.',
  founderHours: null,
  rows: [],
}

export const QUOTE_SPRINT: readonly QuoteSprintEntry[] = [
  CAROL,
  OSCAR,
  FRANKIE,
  SANDRA,
  HEATHER,
  GIANNI,
]

export function listActiveQuoteSprint(): QuoteSprintEntry[] {
  return QUOTE_SPRINT.filter((entry) => entry.role === 'active')
}

export function getQuoteSprintEntry(slug: string): QuoteSprintEntry | undefined {
  return QUOTE_SPRINT.find((entry) => entry.slug === slug && entry.role === 'active')
}
