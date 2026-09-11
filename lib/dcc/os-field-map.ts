/** Field maps for DCC OS ops tables (Airtable column titles). Override via env later if needed. */

export const DCC_MACHINE_FIELDS = {
  name: 'Name',
  type: 'Type',
  status: 'Status',
  buildVolume: 'Build Volume',
  materials: 'Materials',
  whatItCanMake: 'What It Can Make',
  notes: 'Notes',
} as const

export const DCC_MACHINE_STATUS = {
  operational: 'Operational',
  serviceSoon: 'Service Soon',
  maintenance: 'Maintenance',
  offline: 'Offline',
  planned: 'Planned / Not Acquired',
} as const

export type PublicMachineStatusLabel =
  | 'Available'
  | 'In service'
  | 'Offline'
  | 'Coming soon'

export function publicMachineStatusLabel(
  airtableStatus: string | undefined
): PublicMachineStatusLabel {
  switch (airtableStatus) {
    case DCC_MACHINE_STATUS.operational:
    case DCC_MACHINE_STATUS.serviceSoon:
      return 'Available'
    case DCC_MACHINE_STATUS.maintenance:
      return 'In service'
    case DCC_MACHINE_STATUS.offline:
      return 'Offline'
    case DCC_MACHINE_STATUS.planned:
    default:
      return 'Coming soon'
  }
}

export const DCC_SERVICE_FIELDS = {
  name: 'Service Name',
  category: 'Category',
  associate: 'Associate',
  public: 'Public',
  commercial: 'Commercial',
  unit: 'Unit',
  active: 'Active',
  notes: 'Notes',
  serviceKind: 'Service Kind',
  paymentPolicy: 'Payment Policy',
  fulfillmentNotes: 'Fulfillment Notes',
} as const

export const DCC_JOB_FIELDS = {
  jobName: 'Job Name',
  stage: 'Stage',
  customer: 'Customer',
  tier: 'Tier',
  service: 'Service',
  machine: 'Machine',
  dueDate: 'Due Date',
  notes: 'Notes',
  quoteAmount: 'Quote Amount',
  materialCost: 'Material Cost',
  laborCost: 'Labor Cost',
  machineReserve: 'Machine Reserve',
  commercialStatus: 'Commercial Status',
  paymentStatus: 'Payment Status',
  fulfillmentStatus: 'Fulfillment Status',
  paymentPolicy: 'Payment Policy',
  quoteVersion: 'Quote Version',
  quoteSnapshot: 'Quote Snapshot',
  quoteSentAt: 'Quote Sent At',
  quoteAcceptedAt: 'Quote Accepted At',
  quoteAcceptedBy: 'Quote Accepted By',
  clientPortalToken: 'Client Portal Token',
  clientPortalTokenIssuedAt: 'Client Portal Token Issued At',
  depositAmount: 'Deposit Amount',
  depositReceivedAt: 'Deposit Received At',
  depositPaymentProvider: 'Deposit Payment Provider',
  depositInvoiceId: 'Deposit Invoice / Payment ID',
  depositPaymentUrl: 'Deposit Payment URL',
  balanceAmount: 'Balance Amount',
  balanceReceivedAt: 'Balance Received At',
  balancePaymentProvider: 'Balance Payment Provider',
  balanceInvoiceId: 'Balance Invoice / Payment ID',
  balancePaymentUrl: 'Balance Payment URL',
  completionApprovedAt: 'Completion Approved At',
  completionApprovedBy: 'Completion Approved By',
  adjustmentRequest: 'Adjustment Request',
  reviewAssets: 'Review Assets',
  externalCost: 'External Cost',
  internalNotes: 'Internal Notes',
} as const

export const DCC_JOB_STAGES = {
  inquiry: 'Inquiry',
  quoted: 'Quoted',
  approved: 'Approved',
  inProduction: 'In Production',
  postProcessing: 'Post-Processing',
  delivered: 'Delivered',
  paid: 'Paid',
  declined: 'Declined',
} as const

export const DCC_CHANGE_LOG_FIELDS = {
  name: 'Name',
  entity: 'Entity',
  entityId: 'Entity ID',
  action: 'Action',
  actor: 'Actor',
  details: 'Details',
  source: 'Source',
} as const

export const DCC_TRANSACTION_FIELDS = {
  name: 'Name',
  amount: 'Amount',
  type: 'Type',
  date: 'Date',
  job: 'Job',
  notes: 'Notes',
  kind: 'Kind',
  person: 'Person',
  assignment: 'Assignment',
} as const

/** Staff/operator identity on People — not DCC Signup Status. */
export const DCC_PERSON_OPS_FIELDS = {
  accountStatus: 'Account Status',
  clerkUserId: 'Clerk User ID',
  dccAppRoles: 'DCC App Roles',
  operatorActive: 'Operator Active',
  firstSeenAt: 'First Seen At',
  firstSeenSource: 'First Seen Source',
} as const

export const DCC_ASSIGNMENT_FIELDS = {
  name: 'Name',
  job: 'Job',
  person: 'Person',
  role: 'Role',
  status: 'Status',
  estimatedHours: 'Estimated Hours',
  hourlyRate: 'Hourly Rate',
  estimatedCompensation: 'Estimated Compensation',
  actualHours: 'Actual Hours',
  approvedCompensation: 'Approved Compensation',
  offeredAt: 'Offered At',
  acceptedAt: 'Accepted At',
  completedAt: 'Completed At',
  cancelledAt: 'Cancelled At',
  declinedReason: 'Declined Reason',
  notes: 'Notes',
} as const

export const DCC_ASSIGNMENTS_TABLE_NAME = 'Assignments' as const

export const DCC_INTERACTION_NOTES_FIELD = 'Notes' as const

export const DCC_INTERACTION_TYPE_ADDITIONS = [
  'Workshop Attendance',
  'Studio Visit',
  'Consultation',
] as const

export const DCC_CREDIT_FIELDS = {
  name: 'Name',
  allocation: 'Allocation',
  retailValueDelivered: 'Retail Value Delivered',
  person: 'Person',
  notes: 'Notes',
} as const

export const DCC_MBO_FIELDS = {
  name: 'Name',
  objective: 'Objective',
  progress: 'Progress',
  target: 'Target',
  status: 'Status',
  notes: 'Notes',
} as const

export const DCC_BOOKING_FIELDS = {
  name: 'Name',
  start: 'Start',
  end: 'End',
  machine: 'Machine',
  person: 'Person',
  status: 'Status',
  notes: 'Notes',
} as const
