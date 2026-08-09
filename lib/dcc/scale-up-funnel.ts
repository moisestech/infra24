export type FunnelStageStatus = 'VALIDATED' | 'TESTING' | 'BLOCKED' | 'NOT BUILT'

export type FunnelStage = {
  id: string
  label: string
  status: FunnelStageStatus
  note?: string
}

/** Hardcoded v1 funnel board — editable later from workbook. */
export const SCALE_UP_FUNNEL: FunnelStage[] = [
  {
    id: 'workshop',
    label: 'Workshop discovery → class page → pay → attend',
    status: 'VALIDATED',
  },
  {
    id: 'workshop-to-fab',
    label: 'Workshop attendee → fabrication customer',
    status: 'TESTING',
  },
  {
    id: 'fab-request',
    label: 'Fabrication request → quote → deposit',
    status: 'TESTING',
  },
  {
    id: 'production-pickup',
    label: 'Production → pickup',
    status: 'BLOCKED',
    note: 'No machines installed yet',
  },
  {
    id: 'micah-capital',
    label: "Accept and deploy Micah's $20k",
    status: 'BLOCKED',
    note: 'Entity structure unresolved',
  },
  {
    id: 'donation',
    label: 'Donation funnel',
    status: 'NOT BUILT',
  },
]

export function funnelStatusClass(status: FunnelStageStatus): string {
  switch (status) {
    case 'VALIDATED':
      return 'bg-emerald-600 text-white'
    case 'TESTING':
      return 'bg-amber-500 text-neutral-950'
    case 'BLOCKED':
      return 'bg-red-600 text-white'
    default:
      return 'bg-neutral-400 text-neutral-950'
  }
}
