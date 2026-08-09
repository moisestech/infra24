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
} as const

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
