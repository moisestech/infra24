export type QueueTierId = 'access' | 'standard' | 'priority' | 'rush'

export type FabricationQueueTier = {
  id: QueueTierId
  label: string
  turnaround: string
  pricing: string
  surcharge?: number
}

export const FABRICATION_QUEUE_TIERS: FabricationQueueTier[] = [
  {
    id: 'access',
    label: 'Access Queue',
    turnaround: 'Scheduled around paid work',
    pricing: 'Access rate',
  },
  {
    id: 'standard',
    label: 'Standard Queue',
    turnaround: '5–7 business days',
    pricing: 'Base rate',
  },
  {
    id: 'priority',
    label: 'Priority Queue',
    turnaround: '2–3 business days',
    pricing: '+20%',
    surcharge: 0.2,
  },
  {
    id: 'rush',
    label: 'Rush Queue',
    turnaround: '24–48 hours if feasible',
    pricing: '+35%',
    surcharge: 0.35,
  },
]
