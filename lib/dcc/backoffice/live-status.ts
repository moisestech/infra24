import { DCC_JOB_STAGES, DCC_MACHINE_STATUS } from '@/lib/dcc/os-field-map'

/**
 * Fold a live DCC CRM Jobs status into the capacity vocabulary.
 * "Accepted / Paid" stays an open accepted job. It is not a closed payment.
 */
export function stageForCapacity(status: string): string {
  switch (status) {
    case 'New Request':
    case 'Needs Info':
    case 'Scoping':
      return DCC_JOB_STAGES.inquiry
    case 'Quoted':
      return DCC_JOB_STAGES.quoted
    case 'Accepted / Paid':
      return DCC_JOB_STAGES.approved
    case 'Open for Fabrication':
    case 'Claimed / Assigned':
    case 'Production':
      return DCC_JOB_STAGES.inProduction
    case 'Review / Delivery':
      return DCC_JOB_STAGES.postProcessing
    case 'Documented':
      return DCC_JOB_STAGES.delivered
    case 'Closed / Lost':
      return DCC_JOB_STAGES.declined
    default:
      return status
  }
}

/** Fold a live Machines status into the capacity vocabulary. Busy is occupied, not down. */
export function machineStatusForCapacity(status: string): string {
  switch (status) {
    case 'Available':
      return DCC_MACHINE_STATUS.operational
    case 'Maintenance':
      return DCC_MACHINE_STATUS.maintenance
    case 'Offline':
      return DCC_MACHINE_STATUS.offline
    default:
      return status
  }
}
