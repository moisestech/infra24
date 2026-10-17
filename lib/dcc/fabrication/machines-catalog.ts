import type { Machine } from '@/lib/dcc/fabrication/schema'

export const FABRICATION_MACHINES: Machine[] = [
  {
    id: 'bambu-lab-h2s',
    name: 'Bambu Lab H2S',
    manufacturer: 'Bambu Lab',
    model: 'H2S',
    process: 'FDM',
    location: 'Studio 43 / Bakehouse Art Complex',
    owner: 'DCC operated — ownership and funding terms require documentation',
    accessStatus: 'unconfirmed',
    compatibleMaterials: [],
    active: true,
  },
  {
    id: 'bambu-lab-h2d',
    name: 'Bambu Lab H2D',
    manufacturer: 'Bambu Lab',
    model: 'H2D',
    process: 'FDM',
    location: 'Studio 43 / Bakehouse Art Complex',
    owner: 'DCC operated — ownership and funding terms require documentation',
    accessStatus: 'unconfirmed',
    compatibleMaterials: [],
    active: true,
  },
  {
    id: 'anycubic-photon-mono-m7-max',
    name: 'Anycubic Photon Mono M7 Max',
    manufacturer: 'Anycubic',
    model: 'Photon Mono M7 Max',
    process: 'SLA / MSLA',
    location: 'Studio 43 / Bakehouse Art Complex',
    owner: 'Leo',
    accessStatus: 'operator_owned',
    compatibleMaterials: ['resin-high-clear-anycubic', 'resin-translucent-pending'],
    /** Internal only. Never render on client pages. */
    internalHourlyRate: 15,
    active: true,
  },
]

export function getMachineCatalogEntry(id: string): Machine | undefined {
  return FABRICATION_MACHINES.find((m) => m.id === id)
}

export function machineAccessLabel(machine: Machine): string {
  switch (machine.accessStatus) {
    case 'dcc_owned':
      return 'DCC-owned'
    case 'partner_access':
      return 'Partner access'
    case 'operator_owned':
      return 'Operator-owned'
    case 'unconfirmed':
    default:
      return 'Access unconfirmed — not assumed to belong to DCC'
  }
}
