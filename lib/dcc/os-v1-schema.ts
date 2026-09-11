/**
 * DCC OS v1 operating-model schema (Airtable display labels).
 * Source of truth for the human checklist and additive Meta API scaffold.
 * Does not mutate records. Stage remains a compatibility projection.
 */

import {
  DCC_ASSIGNMENT_FIELDS as A,
  DCC_INTERACTION_NOTES_FIELD,
  DCC_INTERACTION_TYPE_ADDITIONS,
  DCC_JOB_FIELDS as J,
  DCC_JOB_STAGES,
  DCC_PERSON_OPS_FIELDS as P,
  DCC_SERVICE_FIELDS as S,
  DCC_TRANSACTION_FIELDS as T,
} from '@/lib/dcc/os-field-map'

export const DCC_COMMERCIAL_STATUS = {
  inquiry: 'Inquiry',
  scoping: 'Scoping',
  quoted: 'Quoted',
  accepted: 'Accepted',
  active: 'Active',
  closed: 'Closed',
  declined: 'Declined',
  cancelled: 'Cancelled',
  onHold: 'On Hold',
} as const

export const DCC_PAYMENT_STATUS = {
  none: 'None',
  depositDue: 'Deposit Due',
  depositPaid: 'Deposit Paid',
  balanceDue: 'Balance Due',
  paid: 'Paid',
  notRequired: 'Not Required',
  refunded: 'Refunded',
} as const

export const DCC_FULFILLMENT_STATUS = {
  unscheduled: 'Unscheduled',
  scheduled: 'Scheduled',
  inProgress: 'In Progress',
  qa: 'QA',
  clientReview: 'Client Review',
  readyForRelease: 'Ready for Release',
  delivered: 'Delivered',
  completed: 'Completed',
} as const

export const DCC_PAYMENT_POLICY = {
  free: 'Free',
  fullUpfront: 'Full Upfront',
  deposit50: 'Deposit 50',
} as const

export const DCC_SERVICE_KIND = {
  fabrication: 'Fabrication',
  consulting: 'Consulting',
  visit: 'Visit',
} as const

export const DCC_ACCOUNT_STATUS = {
  none: 'None',
  invited: 'Invited',
  active: 'Active',
  disabled: 'Disabled',
} as const

export const DCC_APP_ROLES = {
  admin: 'admin',
  operator: 'operator',
} as const

export const DCC_FIRST_SEEN_SOURCE = {
  workshop: 'Workshop',
  fabrication: 'Fabrication',
  networkSignup: 'Network Signup',
  studioVisit: 'Studio Visit',
  journal: 'Journal',
  referral: 'Referral',
  other: 'Other',
} as const

export const DCC_ASSIGNMENT_STATUS = {
  proposed: 'Proposed',
  offered: 'Offered',
  accepted: 'Accepted',
  declined: 'Declined',
  inProgress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const

export const DCC_ASSIGNMENT_ROLE = {
  resinProduction: 'Resin production',
  cadPrep: 'CAD prep',
  finishingQa: 'Finishing/QA',
  visitHost: 'Visit host',
  consulting: 'Consulting',
  other: 'Other',
} as const

export const DCC_TRANSACTION_KIND = {
  deposit: 'Deposit',
  balance: 'Balance',
  full: 'Full',
  refund: 'Refund',
  operatorPayout: 'Operator Payout',
  expense: 'Expense',
} as const

export type DccCommercialStatus = (typeof DCC_COMMERCIAL_STATUS)[keyof typeof DCC_COMMERCIAL_STATUS]
export type DccPaymentStatus = (typeof DCC_PAYMENT_STATUS)[keyof typeof DCC_PAYMENT_STATUS]
export type DccFulfillmentStatus = (typeof DCC_FULFILLMENT_STATUS)[keyof typeof DCC_FULFILLMENT_STATUS]

export type InferredJobState = {
  commercialStatus: DccCommercialStatus
  paymentStatus: DccPaymentStatus
  fulfillmentStatus: DccFulfillmentStatus
}

const values = <T extends Record<string, string>>(obj: T): Array<T[keyof T]> =>
  Object.values(obj) as Array<T[keyof T]>

const choice = (names: readonly string[]) => ({
  choices: names.map((name) => ({ name })),
})

const isoDate = { dateFormat: { name: 'iso' as const } }

const usd = { precision: 2 as const, symbol: '$' }

export type AirtableFieldCreate = {
  name: string
  type: string
  description?: string
  options?: Record<string, unknown>
}

export function peopleV1Fields(): AirtableFieldCreate[] {
  return [
    {
      name: P.accountStatus,
      type: 'singleSelect',
      options: choice(values(DCC_ACCOUNT_STATUS)),
    },
    { name: P.clerkUserId, type: 'singleLineText' },
    {
      name: P.dccAppRoles,
      type: 'multipleSelects',
      options: choice(values(DCC_APP_ROLES)),
    },
    {
      name: P.operatorActive,
      type: 'checkbox',
      options: { icon: 'check', color: 'greenBright' },
    },
    { name: P.firstSeenAt, type: 'date', options: isoDate },
    {
      name: P.firstSeenSource,
      type: 'singleSelect',
      options: choice(values(DCC_FIRST_SEEN_SOURCE)),
    },
  ]
}

export function servicesV1Fields(): AirtableFieldCreate[] {
  return [
    {
      name: S.serviceKind,
      type: 'singleSelect',
      options: choice(values(DCC_SERVICE_KIND)),
    },
    {
      name: S.paymentPolicy,
      type: 'singleSelect',
      options: choice(values(DCC_PAYMENT_POLICY)),
    },
    { name: S.fulfillmentNotes, type: 'multilineText' },
  ]
}

export function jobsV1Fields(): AirtableFieldCreate[] {
  return [
    {
      name: J.commercialStatus,
      type: 'singleSelect',
      options: choice(values(DCC_COMMERCIAL_STATUS)),
    },
    {
      name: J.paymentStatus,
      type: 'singleSelect',
      options: choice(values(DCC_PAYMENT_STATUS)),
    },
    {
      name: J.fulfillmentStatus,
      type: 'singleSelect',
      options: choice(values(DCC_FULFILLMENT_STATUS)),
    },
    {
      name: J.paymentPolicy,
      type: 'singleSelect',
      options: choice(values(DCC_PAYMENT_POLICY)),
    },
    { name: J.quoteVersion, type: 'number', options: { precision: 0 } },
    { name: J.quoteSnapshot, type: 'multilineText' },
    { name: J.quoteSentAt, type: 'date', options: isoDate },
    { name: J.quoteAcceptedAt, type: 'date', options: isoDate },
    { name: J.quoteAcceptedBy, type: 'singleLineText' },
    { name: J.clientPortalToken, type: 'singleLineText' },
    { name: J.clientPortalTokenIssuedAt, type: 'date', options: isoDate },
    { name: J.depositAmount, type: 'currency', options: usd },
    { name: J.depositReceivedAt, type: 'date', options: isoDate },
    { name: J.depositPaymentProvider, type: 'singleLineText' },
    { name: J.depositInvoiceId, type: 'singleLineText' },
    { name: J.depositPaymentUrl, type: 'url' },
    { name: J.balanceAmount, type: 'currency', options: usd },
    { name: J.balanceReceivedAt, type: 'date', options: isoDate },
    { name: J.balancePaymentProvider, type: 'singleLineText' },
    { name: J.balanceInvoiceId, type: 'singleLineText' },
    { name: J.balancePaymentUrl, type: 'url' },
    { name: J.completionApprovedAt, type: 'date', options: isoDate },
    { name: J.completionApprovedBy, type: 'singleLineText' },
    { name: J.adjustmentRequest, type: 'multilineText' },
    { name: J.reviewAssets, type: 'multipleAttachments' },
    { name: J.externalCost, type: 'currency', options: usd },
    { name: J.internalNotes, type: 'multilineText' },
  ]
}

export function assignmentsTableFields(jobsTableId: string, peopleTableId: string): AirtableFieldCreate[] {
  return [
    { name: A.name, type: 'singleLineText' },
    {
      name: A.job,
      type: 'multipleRecordLinks',
      options: { linkedTableId: jobsTableId },
    },
    {
      name: A.person,
      type: 'multipleRecordLinks',
      options: { linkedTableId: peopleTableId },
    },
    {
      name: A.role,
      type: 'singleSelect',
      options: choice(values(DCC_ASSIGNMENT_ROLE)),
    },
    {
      name: A.status,
      type: 'singleSelect',
      options: choice(values(DCC_ASSIGNMENT_STATUS)),
    },
    { name: A.estimatedHours, type: 'number', options: { precision: 2 } },
    { name: A.hourlyRate, type: 'currency', options: usd },
    {
      name: A.estimatedCompensation,
      type: 'formula',
      options: {
        formula: `{${A.estimatedHours}} * {${A.hourlyRate}}`,
      },
    },
    { name: A.actualHours, type: 'number', options: { precision: 2 } },
    { name: A.approvedCompensation, type: 'currency', options: usd },
    { name: A.offeredAt, type: 'date', options: isoDate },
    { name: A.acceptedAt, type: 'date', options: isoDate },
    { name: A.completedAt, type: 'date', options: isoDate },
    { name: A.cancelledAt, type: 'date', options: isoDate },
    { name: A.declinedReason, type: 'multilineText' },
    { name: A.notes, type: 'multilineText' },
  ]
}

export function transactionsV1Fields(
  peopleTableId: string,
  assignmentsTableId: string
): AirtableFieldCreate[] {
  return [
    {
      name: T.kind,
      type: 'singleSelect',
      options: choice(values(DCC_TRANSACTION_KIND)),
    },
    {
      name: T.person,
      type: 'multipleRecordLinks',
      options: { linkedTableId: peopleTableId },
    },
    {
      name: T.assignment,
      type: 'multipleRecordLinks',
      options: { linkedTableId: assignmentsTableId },
    },
  ]
}

export function interactionNotesField(): AirtableFieldCreate {
  return { name: DCC_INTERACTION_NOTES_FIELD, type: 'multilineText' }
}

export const INTERACTION_TYPE_ADDITIONS = DCC_INTERACTION_TYPE_ADDITIONS

/**
 * Read-time inference when Commercial Status is blank.
 * Does not write back. Payment unknown on legacy rows stays None.
 */
export function inferStateFromLegacyStage(stage: string | undefined): InferredJobState {
  switch (stage) {
    case DCC_JOB_STAGES.quoted:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.quoted,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      }
    case DCC_JOB_STAGES.approved:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.active,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      }
    case DCC_JOB_STAGES.inProduction:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.active,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.inProgress,
      }
    case DCC_JOB_STAGES.postProcessing:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.active,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.qa,
      }
    case DCC_JOB_STAGES.delivered:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.active,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.delivered,
      }
    case DCC_JOB_STAGES.paid:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.closed,
        paymentStatus: DCC_PAYMENT_STATUS.paid,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.delivered,
      }
    case DCC_JOB_STAGES.declined:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.declined,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      }
    case DCC_JOB_STAGES.inquiry:
    default:
      return {
        commercialStatus: DCC_COMMERCIAL_STATUS.inquiry,
        paymentStatus: DCC_PAYMENT_STATUS.none,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      }
  }
}

/** Compatibility Stage written alongside the three new dimensions. */
export function projectLegacyStage(state: {
  commercialStatus: string
  paymentStatus: string
  fulfillmentStatus: string
}): string {
  const { commercialStatus: c, paymentStatus: p, fulfillmentStatus: f } = state

  if (c === DCC_COMMERCIAL_STATUS.declined || c === DCC_COMMERCIAL_STATUS.cancelled) {
    return DCC_JOB_STAGES.declined
  }
  if (c === DCC_COMMERCIAL_STATUS.closed && p === DCC_PAYMENT_STATUS.paid) {
    return DCC_JOB_STAGES.paid
  }
  if (
    f === DCC_FULFILLMENT_STATUS.delivered ||
    f === DCC_FULFILLMENT_STATUS.completed
  ) {
    return DCC_JOB_STAGES.delivered
  }
  if (
    f === DCC_FULFILLMENT_STATUS.qa ||
    f === DCC_FULFILLMENT_STATUS.clientReview ||
    f === DCC_FULFILLMENT_STATUS.readyForRelease
  ) {
    return DCC_JOB_STAGES.postProcessing
  }
  if (f === DCC_FULFILLMENT_STATUS.inProgress) {
    return DCC_JOB_STAGES.inProduction
  }
  if (
    c === DCC_COMMERCIAL_STATUS.active &&
    (f === DCC_FULFILLMENT_STATUS.unscheduled ||
      f === DCC_FULFILLMENT_STATUS.scheduled)
  ) {
    return DCC_JOB_STAGES.approved
  }
  if (
    c === DCC_COMMERCIAL_STATUS.accepted &&
    p === DCC_PAYMENT_STATUS.depositDue
  ) {
    return DCC_JOB_STAGES.quoted
  }
  if (
    c === DCC_COMMERCIAL_STATUS.quoted ||
    c === DCC_COMMERCIAL_STATUS.accepted
  ) {
    return DCC_JOB_STAGES.quoted
  }
  return DCC_JOB_STAGES.inquiry
}

/** Dual-read: populated Commercial Status wins; otherwise infer from legacy Stage. */
export function resolveJobState(job: {
  commercialStatus?: string | null
  paymentStatus?: string | null
  fulfillmentStatus?: string | null
  stage?: string | null
}): InferredJobState {
  const commercial = job.commercialStatus?.trim()
  if (commercial) {
    return {
      commercialStatus: commercial as DccCommercialStatus,
      paymentStatus: (job.paymentStatus?.trim() ||
        DCC_PAYMENT_STATUS.none) as DccPaymentStatus,
      fulfillmentStatus: (job.fulfillmentStatus?.trim() ||
        DCC_FULFILLMENT_STATUS.unscheduled) as DccFulfillmentStatus,
    }
  }
  return inferStateFromLegacyStage(job.stage ?? undefined)
}
