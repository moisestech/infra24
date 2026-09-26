import {
  COMPETENCY_LEVELS,
  OPERATING_STAGES,
  transitionFail,
  transitionOk,
  type ClientJobPhase,
  type CompensationModel,
  type CompetencyLevel,
  type CompetencyStatus,
  type EnrollmentStatus,
  type MainOperatingStage,
  type OperatingStage,
  type PaymentState,
  type PayoutState,
  type RunStatus,
  type TransitionResult,
} from '@/lib/dcc/fabrication-os/domain'

const ENROLLMENT_MAIN: readonly EnrollmentStatus[] = [
  'Interested',
  'Registered',
  'Payment Pending',
  'Confirmed',
  'Attended',
  'Completed',
]

const PRE_COMPLETE = new Set<EnrollmentStatus>([
  'Interested',
  'Registered',
  'Payment Pending',
  'Confirmed',
  'Attended',
])

const NO_SHOW_FROM = new Set<EnrollmentStatus>(['Confirmed', 'Attended'])

const REFUND_FROM = new Set<EnrollmentStatus>([
  'Registered',
  'Payment Pending',
  'Confirmed',
  'Attended',
  'Completed',
])

export type EnrollmentTransition = {
  status: EnrollmentStatus
  /** Completing a class never writes a competency. */
  competencyGranted: false
}

export function transitionEnrollment(
  from: EnrollmentStatus,
  to: EnrollmentStatus,
  context?: { paymentState?: PaymentState }
): TransitionResult<EnrollmentTransition> {
  if (from === to) return transitionFail('Enrollment is already in that status')

  if (to === 'Cancelled') {
    if (!PRE_COMPLETE.has(from)) {
      return transitionFail('Cancelled is only available before completion')
    }
    return transitionOk({ status: to, competencyGranted: false })
  }

  if (to === 'No Show') {
    if (!NO_SHOW_FROM.has(from)) {
      return transitionFail('No Show is only available from Confirmed or Attended')
    }
    return transitionOk({ status: to, competencyGranted: false })
  }

  if (to === 'Refunded') {
    if (context?.paymentState !== 'Paid') {
      return transitionFail('Refunded requires a Paid payment state')
    }
    if (!REFUND_FROM.has(from)) {
      return transitionFail('Refunded is not available from this enrollment status')
    }
    return transitionOk({ status: to, competencyGranted: false })
  }

  const fromIndex = ENROLLMENT_MAIN.indexOf(from)
  const toIndex = ENROLLMENT_MAIN.indexOf(to)
  if (fromIndex === -1 || toIndex !== fromIndex + 1) {
    return transitionFail(`Cannot move enrollment from ${from} to ${to}`)
  }
  return transitionOk({ status: to, competencyGranted: false })
}

function hasVerifier(context?: {
  verifiedById?: string
  verifiedAt?: string
}): boolean {
  return Boolean(context?.verifiedById?.trim() && context?.verifiedAt?.trim())
}

export function transitionCompetencyLevel(
  from: CompetencyLevel,
  to: CompetencyLevel,
  context?: { verifiedById?: string; verifiedAt?: string }
): TransitionResult<CompetencyLevel> {
  if (from === to) return transitionFail('Competency is already at that level')
  const fromIndex = COMPETENCY_LEVELS.indexOf(from)
  const toIndex = COMPETENCY_LEVELS.indexOf(to)
  if (toIndex !== fromIndex + 1) {
    return transitionFail(`Cannot move competency from ${from} to ${to}`)
  }
  if (
    (to === 'Verified' || to === 'Active Fabricator') &&
    !hasVerifier(context)
  ) {
    return transitionFail(`${to} requires Verified By and Verified At`)
  }
  return transitionOk(to)
}

export function transitionCompetencyStatus(
  level: CompetencyLevel,
  from: CompetencyStatus,
  to: CompetencyStatus,
  nextLevel?: CompetencyLevel
): TransitionResult<{ level: CompetencyLevel; status: CompetencyStatus }> {
  if (from === to && nextLevel === undefined) {
    return transitionFail('Competency status is unchanged')
  }

  if (
    level === 'Active Fabricator' &&
    from === 'Active' &&
    (to === 'Inactive' || to === 'Needs Reverification')
  ) {
    return transitionOk({ level, status: to })
  }

  if (from === 'Needs Reverification' && to === 'Active') {
    if (nextLevel !== 'Verified' && nextLevel !== 'Active Fabricator') {
      return transitionFail(
        'Needs Reverification returns only to Verified or Active Fabricator'
      )
    }
    return transitionOk({ level: nextLevel, status: 'Active' })
  }

  return transitionFail(`Cannot move competency status from ${from} to ${to}`)
}

const PRE_PRODUCTION = new Set<OperatingStage>([
  'New Inquiry',
  'Scoped',
  'Quoted',
  'Accepted',
  'Payment Pending',
])

const TERMINAL_JOB = new Set<OperatingStage>(['Closed', 'Declined', 'Cancelled'])

export type JobTransitionContext = {
  paymentState?: PaymentState
  /** Required when payment is Partially Paid and the job enters Production Authorized. */
  partialPaymentOverride?: boolean
  /** Main stage stored when the job entered On Hold. */
  resumeTo?: MainOperatingStage
}

function productionAuthorizedAllowed(context?: JobTransitionContext): string | null {
  const payment = context?.paymentState
  if (
    payment === 'Paid' ||
    payment === 'Waived' ||
    payment === 'Not Required'
  ) {
    return null
  }
  if (payment === 'Partially Paid') {
    return context?.partialPaymentOverride
      ? null
      : 'Partially Paid requires an explicit override before Production Authorized'
  }
  return 'Production Authorized requires Paid, Waived, Not Required, or Partially Paid with an explicit override'
}

export function transitionJob(
  from: OperatingStage,
  to: OperatingStage,
  context?: JobTransitionContext
): TransitionResult<OperatingStage> {
  if (from === to) return transitionFail('Job is already in that stage')
  if (TERMINAL_JOB.has(from)) {
    return transitionFail(`${from} is a terminal job stage`)
  }

  if (to === 'On Hold') {
    if (from === 'On Hold') return transitionFail('Job is already On Hold')
    if (!(OPERATING_STAGES as readonly string[]).includes(from)) {
      return transitionFail('Only a main-path stage can be placed On Hold')
    }
    return transitionOk(to)
  }

  if (to === 'Cancelled') return transitionOk(to)

  if (from === 'On Hold') {
    if (!context?.resumeTo || to !== context.resumeTo) {
      return transitionFail('On Hold resumes only to the held stage')
    }
    return transitionOk(to)
  }

  if (to === 'Declined') {
    if (!PRE_PRODUCTION.has(from)) {
      return transitionFail('Declined is only available before production is authorized')
    }
    return transitionOk(to)
  }

  const fromIndex = OPERATING_STAGES.indexOf(from as MainOperatingStage)
  const toIndex = OPERATING_STAGES.indexOf(to as MainOperatingStage)
  if (fromIndex === -1 || toIndex !== fromIndex + 1) {
    return transitionFail(`Cannot move job from ${from} to ${to}`)
  }

  if (to === 'Production Authorized') {
    const blocked = productionAuthorizedAllowed(context)
    if (blocked) return transitionFail(blocked)
  }

  return transitionOk(to)
}

const RUN_MAIN: readonly RunStatus[] = [
  'Ready',
  'Assigned',
  'Queued',
  'Printing',
  'Cooling / Curing',
  'Post Processing',
  'QC',
  'Complete',
]

const PAUSABLE = new Set<RunStatus>([
  'Assigned',
  'Queued',
  'Printing',
  'Cooling / Curing',
  'Post Processing',
  'QC',
])

const RUN_TERMINAL = new Set<RunStatus>([
  'Complete',
  'Failed',
  'Cancelled',
  'Reprint Required',
])

const REPRINT_FROM = new Set<RunStatus>([
  'Assigned',
  'Queued',
  'Printing',
  'Cooling / Curing',
  'Post Processing',
  'QC',
  'Paused',
])

export function transitionRun(
  from: RunStatus,
  to: RunStatus,
  context?: { resumeTo?: RunStatus }
): TransitionResult<RunStatus> {
  if (from === to) return transitionFail('Run is already in that status')
  if (RUN_TERMINAL.has(from)) {
    return transitionFail(`${from} is terminal on this run`)
  }

  if (to === 'Paused') {
    if (!PAUSABLE.has(from)) {
      return transitionFail('This run status cannot be paused')
    }
    return transitionOk(to)
  }

  if (from === 'Paused') {
    if (to === 'Failed' || to === 'Cancelled' || to === 'Reprint Required') {
      return transitionOk(to)
    }
    if (!context?.resumeTo || to !== context.resumeTo || !PAUSABLE.has(to)) {
      return transitionFail('Paused resumes only to the prior active status')
    }
    return transitionOk(to)
  }

  if (to === 'Failed') {
    if (from === 'Ready') return transitionFail('A Ready run is cancelled, not failed')
    return transitionOk(to)
  }

  if (to === 'Cancelled') return transitionOk(to)

  if (to === 'Reprint Required') {
    if (!REPRINT_FROM.has(from)) {
      return transitionFail('Reprint Required is not available from this status')
    }
    return transitionOk(to)
  }

  const fromIndex = RUN_MAIN.indexOf(from)
  const toIndex = RUN_MAIN.indexOf(to)
  if (fromIndex === -1 || toIndex !== fromIndex + 1) {
    return transitionFail(`Cannot move run from ${from} to ${to}`)
  }
  return transitionOk(to)
}

const RECONCILABLE = new Set<PaymentState>([
  'Invoiced',
  'Partially Paid',
  'Paid',
  'Refunded',
])

export type PaymentTransitionContext = {
  quickBooksId?: string
  adapterConfirmedBalanceZero?: boolean
  adapterConfirmed?: boolean
  /** State stored when the reference entered Needs Reconciliation. */
  resumeTo?: PaymentState
}

export function transitionPayment(
  from: PaymentState,
  to: PaymentState,
  context?: PaymentTransitionContext
): TransitionResult<PaymentState> {
  if (from === to) return transitionFail('Payment is already in that state')
  if (from === 'Not Required') {
    return transitionFail('Not Required is a terminal payment state')
  }

  if (to === 'Paid' && context?.quickBooksId && !context.adapterConfirmedBalanceZero) {
    return transitionFail(
      'QuickBooks owns Paid. A manual Paid write requires a confirmed zero balance'
    )
  }

  if (to === 'Needs Reconciliation') {
    if (!RECONCILABLE.has(from)) {
      return transitionFail('Only a synced payment can need reconciliation')
    }
    return transitionOk(to)
  }

  if (from === 'Needs Reconciliation') {
    if (!context?.adapterConfirmed || !context.resumeTo || to !== context.resumeTo) {
      return transitionFail(
        'Needs Reconciliation resolves only to the adapter-confirmed state'
      )
    }
    if (to === 'Paid' && context.quickBooksId && !context.adapterConfirmedBalanceZero) {
      return transitionFail(
        'QuickBooks owns Paid. A manual Paid write requires a confirmed zero balance'
      )
    }
    return transitionOk(to)
  }

  if (to === 'Failed' && (from === 'Pending' || from === 'Invoiced')) {
    return transitionOk(to)
  }
  if (from === 'Failed' && to === 'Pending') return transitionOk(to)
  if (from === 'Pending' && to === 'Waived') return transitionOk(to)
  if (from === 'Pending' && to === 'Invoiced') return transitionOk(to)
  if (from === 'Invoiced' && (to === 'Partially Paid' || to === 'Paid')) {
    return transitionOk(to)
  }
  if (from === 'Partially Paid' && to === 'Paid') return transitionOk(to)
  if (from === 'Paid' && to === 'Refunded') return transitionOk(to)

  return transitionFail(`Cannot move payment from ${from} to ${to}`)
}

const PAYOUT_MAIN: readonly PayoutState[] = [
  'Estimated',
  'Awaiting Approval',
  'Approved',
  'Payable',
  'Paid',
]

const UNPAID_PAYOUT = new Set<PayoutState>([
  'Estimated',
  'Awaiting Approval',
  'Approved',
  'Payable',
])

export function transitionPayout(
  from: PayoutState,
  to: PayoutState,
  context?: { resumeTo?: PayoutState }
): TransitionResult<PayoutState> {
  if (from === to) return transitionFail('Payout is already in that state')
  if (from === 'Not Applicable' || from === 'Paid') {
    return transitionFail(`${from} is a terminal payout state`)
  }

  if (to === 'On Hold') {
    if (!UNPAID_PAYOUT.has(from)) {
      return transitionFail('On Hold is only available from an unpaid payout')
    }
    return transitionOk(to)
  }

  if (from === 'On Hold') {
    if (!context?.resumeTo || to !== context.resumeTo || !UNPAID_PAYOUT.has(to)) {
      return transitionFail('On Hold resumes only to the held unpaid state')
    }
    return transitionOk(to)
  }

  const fromIndex = PAYOUT_MAIN.indexOf(from)
  const toIndex = PAYOUT_MAIN.indexOf(to)
  if (fromIndex === -1 || toIndex !== fromIndex + 1) {
    return transitionFail(`Cannot move payout from ${from} to ${to}`)
  }
  return transitionOk(to)
}

export type CompensationInput = {
  model: CompensationModel
  rate: number
  hoursOrQuantity: number
  clientRevenue?: number
}

/**
 * Flat task, hourly, and fixed project use rate × quantity.
 * Revenue share uses rate × client revenue, and only when the model says so.
 * Rate for revenue share is a fraction (0.2 = 20%).
 */
export function compensationAmount(
  input: CompensationInput
): TransitionResult<number> {
  if (input.model === 'Revenue Share') {
    if (input.clientRevenue === undefined) {
      return transitionFail('Revenue share requires client revenue')
    }
    return transitionOk(input.rate * input.clientRevenue)
  }
  return transitionOk(input.rate * input.hoursOrQuantity)
}

export function clientJobPhase(
  stage: OperatingStage,
  heldStage?: MainOperatingStage
): ClientJobPhase {
  if (stage === 'On Hold') {
    return heldStage ? clientJobPhase(heldStage) : 'Quote / Approval'
  }
  switch (stage) {
    case 'New Inquiry':
    case 'Scoped':
    case 'Quoted':
    case 'Accepted':
    case 'Declined':
    case 'Cancelled':
      return 'Quote / Approval'
    case 'Payment Pending':
      return 'Payment'
    case 'Production Authorized':
    case 'Open for Fabrication':
    case 'Assigned / Claimed':
      return 'Production Queue'
    case 'In Production':
      return 'Fabrication'
    case 'Review / QC':
      return 'Quality Review'
    case 'Ready':
    case 'Delivered':
    case 'Documented':
    case 'Closed':
      return 'Ready / Delivered'
    default: {
      const exhaustive: never = stage
      return exhaustive
    }
  }
}
