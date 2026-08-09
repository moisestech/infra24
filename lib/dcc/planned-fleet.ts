/**
 * Planned fleet shown when Airtable is empty or unconfigured.
 * Honest "Coming soon" until real inventory is installed.
 */
import type { DccMachine } from '@/lib/dcc/machines'

export const PLANNED_FLEET: DccMachine[] = [
  {
    id: 'planned-gigas',
    name: 'OrangeStorm Gigas (planned)',
    type: 'Large FDM',
    status: 'Planned / Not Acquired',
    publicStatus: 'Coming soon',
    buildVolume: 'Large-format',
    whatItCanMake: 'Large-format additive fabrication',
    notes: 'Installation pending facility approval.',
  },
  {
    id: 'planned-resin',
    name: 'Resin printer (planned)',
    type: 'Resin',
    status: 'Planned / Not Acquired',
    publicStatus: 'Coming soon',
    whatItCanMake: 'High-detail resin parts',
    notes: 'Installation pending facility approval.',
  },
  {
    id: 'planned-fdm',
    name: 'FDM workhorse (planned)',
    type: 'FDM',
    status: 'Planned / Not Acquired',
    publicStatus: 'Coming soon',
    whatItCanMake: 'Prototypes and production FDM',
    notes: 'Installation pending facility approval.',
  },
  {
    id: 'planned-scanner',
    name: '3D scanner (planned)',
    type: 'Scan',
    status: 'Planned / Not Acquired',
    publicStatus: 'Coming soon',
    whatItCanMake: 'Capture for reverse engineering and archives',
    notes: 'Installation pending facility approval.',
  },
]
