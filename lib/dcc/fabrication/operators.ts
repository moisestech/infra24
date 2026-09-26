import type { Operator } from '@/lib/dcc/fabrication/schema'

export const FABRICATION_OPERATORS: Operator[] = [
  {
    id: 'moises-sanabria',
    name: 'Moises Sanabria',
    role: 'both',
    capabilities: [
      'project lead',
      'technical review',
      'material / profile judgment',
      'SLA operation',
      'QA',
    ],
    machinesAuthorized: ['anycubic-photon-mono-m7-max'],
    /** Internal only. Never render on client pages. */
    hourlyRateInternal: 35,
    active: true,
  },
  {
    id: 'diego-gabaldon',
    name: 'Diego Gabaldon',
    role: 'operator',
    capabilities: [],
    machinesAuthorized: [],
    active: true,
  },
  {
    id: 'alec-jerome',
    name: 'Alec Jerome',
    role: 'operator',
    capabilities: [],
    machinesAuthorized: [],
    active: true,
  },
  {
    id: 'augusto-esquivel',
    name: 'Augusto Esquivel',
    role: 'operator',
    capabilities: [],
    machinesAuthorized: [],
    active: true,
  },
  {
    id: 'naz',
    name: 'Naz',
    role: 'operator',
    capabilities: [],
    machinesAuthorized: [],
    active: true,
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'operator',
    capabilities: [],
    machinesAuthorized: ['anycubic-photon-mono-m7-max'],
    active: true,
  },
]

export function getOperator(id: string): Operator | undefined {
  return FABRICATION_OPERATORS.find((o) => o.id === id)
}

/** Public-safe name only. Never expose hourlyRateInternal. */
export function publicOperatorName(id: string | undefined): string | undefined {
  if (!id) return undefined
  return getOperator(id)?.name
}

/** Names only. No role, capabilities, machines, or rates. */
export function publicOperatorNames(): { id: string; name: string }[] {
  return FABRICATION_OPERATORS.filter((operator) => operator.active).map((operator) => ({
    id: operator.id,
    name: operator.name,
  }))
}
