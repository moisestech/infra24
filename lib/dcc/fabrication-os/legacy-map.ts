import { DCC_JOB_STAGES } from '@/lib/dcc/os-field-map'
import type { FabricationJobStatus } from '@/lib/dcc/fabrication/job-status'
import type { OperatingStage } from '@/lib/dcc/fabrication-os/domain'

export type LegacyStageMapResult = {
  /** Null when the legacy value is a money fact, not a production stage. */
  operatingStage: OperatingStage | null
  /** Paid must become a Payment Reference. It must not be copied onto Operating Stage. */
  createPaymentReference: boolean
}

const LEGACY_STAGE_MAP: Record<string, LegacyStageMapResult> = {
  [DCC_JOB_STAGES.inquiry]: {
    operatingStage: 'New Inquiry',
    createPaymentReference: false,
  },
  [DCC_JOB_STAGES.quoted]: {
    operatingStage: 'Quoted',
    createPaymentReference: false,
  },
  [DCC_JOB_STAGES.approved]: {
    operatingStage: 'Accepted',
    createPaymentReference: false,
  },
  [DCC_JOB_STAGES.inProduction]: {
    operatingStage: 'In Production',
    createPaymentReference: false,
  },
  [DCC_JOB_STAGES.postProcessing]: {
    operatingStage: 'Review / QC',
    createPaymentReference: false,
  },
  [DCC_JOB_STAGES.delivered]: {
    operatingStage: 'Delivered',
    createPaymentReference: false,
  },
  [DCC_JOB_STAGES.paid]: {
    operatingStage: null,
    createPaymentReference: true,
  },
  [DCC_JOB_STAGES.declined]: {
    operatingStage: 'Declined',
    createPaymentReference: false,
  },
}

/** Map a live Airtable Jobs.Stage value. Unknown values return null. */
export function mapLegacyJobStage(stage: string): LegacyStageMapResult | null {
  return LEGACY_STAGE_MAP[stage] ?? null
}

const GIT_STATUS_MAP: Record<FabricationJobStatus, OperatingStage> = {
  INQUIRY: 'New Inquiry',
  FILE_RECEIVED: 'Scoped',
  TECHNICAL_REVIEW: 'Scoped',
  MATERIAL_CONFIRMATION: 'Scoped',
  SCOPED: 'Scoped',
  PROTOTYPE_SCOPING: 'Scoped',
  QUOTED: 'Quoted',
  ACCEPTED_PAID: 'Accepted',
  OPEN_FOR_FABRICATION: 'Open for Fabrication',
  CLAIMED: 'Assigned / Claimed',
  PRODUCTION: 'In Production',
  POST_PROCESS: 'Review / QC',
  QA: 'Review / QC',
  READY_FOR_DELIVERY: 'Ready',
  DELIVERED: 'Delivered',
  DOCUMENTED: 'Documented',
}

/**
 * Map a git proposal status onto Operating Stage.
 * ACCEPTED_PAID becomes Accepted. Payment stays on a Payment Reference.
 */
export function mapGitJobStatus(status: FabricationJobStatus): OperatingStage {
  return GIT_STATUS_MAP[status]
}

export function gitStatusSplitsPayment(status: FabricationJobStatus): boolean {
  return status === 'ACCEPTED_PAID'
}
