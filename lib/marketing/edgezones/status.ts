import type { EdgeZonesModuleStatus } from './types'

export function edgeZonesModuleStatusClass(status: EdgeZonesModuleStatus): string {
  switch (status) {
    case 'live':
      return 'ez-status-live'
    case 'in-development':
      return 'ez-status-dev'
    case 'materials-needed':
      return 'ez-status-materials'
    case 'coming-soon':
      return 'ez-status-soon'
  }
}
