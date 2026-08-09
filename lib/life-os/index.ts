export {
  getLifeOsConnection,
  isLifeOsConfigured,
  LIFE_OS_BASE_ID_DEFAULT,
  type LifeOsConnection,
} from '@/lib/life-os/config'
export {
  DEFAULT_LIFE_OS_TASK_FIELD_MAP,
  LIFE_OS_STATUS,
  OPEN_TASK_STATUSES,
  resolveLifeOsTaskFieldMap,
  type LifeOsStatus,
  type LifeOsTaskFieldMap,
} from '@/lib/life-os/field-map'
export {
  LIFE_OS_NOTE_PREFIX,
  addAgentNote,
  attachPr,
  claimTask,
  getTask,
  listAllTasks,
  listOpenTasks,
  markDeployed,
  markDone,
  markInProgress,
  type ClaimTaskOptions,
  type LifeOsTask,
  type MarkDeployedOptions,
} from '@/lib/life-os/tasks'
