export const FABRICATION_JOB_STATUSES = [
  'INQUIRY',
  'FILE_RECEIVED',
  'TECHNICAL_REVIEW',
  'MATERIAL_CONFIRMATION',
  'SCOPED',
  'PROTOTYPE_SCOPING',
  'QUOTED',
  'ACCEPTED_PAID',
  'OPEN_FOR_FABRICATION',
  'CLAIMED',
  'PRODUCTION',
  'POST_PROCESS',
  'QA',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'DOCUMENTED',
] as const

export type FabricationJobStatus = (typeof FABRICATION_JOB_STATUSES)[number]

export const FABRICATION_JOB_STATUS_LABELS: Record<
  FabricationJobStatus,
  { internal: string; client: string }
> = {
  INQUIRY: { internal: 'Inquiry', client: 'Inquiry received' },
  FILE_RECEIVED: { internal: 'File received', client: 'File received' },
  TECHNICAL_REVIEW: { internal: 'Technical review', client: 'In technical review' },
  MATERIAL_CONFIRMATION: {
    internal: 'Material confirmation',
    client: 'Material confirmation',
  },
  SCOPED: { internal: 'Scoped', client: 'Scope in review' },
  PROTOTYPE_SCOPING: {
    internal: 'Prototype scoping',
    client: 'Prototype scoping',
  },
  QUOTED: { internal: 'Quoted', client: 'Quote ready' },
  ACCEPTED_PAID: { internal: 'Accepted / paid', client: 'Accepted' },
  OPEN_FOR_FABRICATION: {
    internal: 'Open for fabrication',
    client: 'Ready for fabrication',
  },
  CLAIMED: { internal: 'Claimed by operator', client: 'In production' },
  PRODUCTION: { internal: 'Production', client: 'In production' },
  POST_PROCESS: { internal: 'Post-process', client: 'Finishing' },
  QA: { internal: 'QA', client: 'Quality check' },
  READY_FOR_DELIVERY: {
    internal: 'Ready for delivery',
    client: 'Ready for pickup',
  },
  DELIVERED: { internal: 'Delivered', client: 'Delivered' },
  DOCUMENTED: { internal: 'Documented', client: 'Complete' },
}

export function clientFacingJobStatus(status: FabricationJobStatus): string {
  return FABRICATION_JOB_STATUS_LABELS[status].client
}
