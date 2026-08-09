/**
 * LIFE OS Tasks field names — override via AIRTABLE_LIFE_OS_FIELD_*.
 * Adjust after Meta discovery if your base uses different column titles.
 */

export type LifeOsTaskFieldMap = {
  title: string
  status: string
  repo: string
  branch: string
  prUrl: string
  notes: string
  deployedAt: string
  agentRunId: string
  agent: string
}

export const DEFAULT_LIFE_OS_TASK_FIELD_MAP: LifeOsTaskFieldMap = {
  title: 'Name',
  status: 'Status',
  repo: 'Repo',
  branch: 'Branch',
  prUrl: 'PR URL',
  notes: 'Notes',
  deployedAt: 'Deployed At',
  agentRunId: 'Agent Run ID',
  agent: 'Agent',
}

/** Default status values (single-select). Override via env if your choices differ. */
export const LIFE_OS_STATUS = {
  todo: 'Todo',
  ready: 'Ready',
  inProgress: 'In Progress',
  inReview: 'In Review',
  deployed: 'Deployed',
  blocked: 'Blocked',
  done: 'Done',
} as const

export type LifeOsStatus = (typeof LIFE_OS_STATUS)[keyof typeof LIFE_OS_STATUS]

export const OPEN_TASK_STATUSES: readonly string[] = [
  LIFE_OS_STATUS.todo,
  LIFE_OS_STATUS.ready,
]

function envField(suffix: string, fallback: string): string {
  const key = `AIRTABLE_LIFE_OS_FIELD_${suffix}`
  const v = process.env[key]?.trim()
  return v || fallback
}

export function resolveLifeOsTaskFieldMap(): LifeOsTaskFieldMap {
  return {
    title: envField('TITLE', DEFAULT_LIFE_OS_TASK_FIELD_MAP.title),
    status: envField('STATUS', DEFAULT_LIFE_OS_TASK_FIELD_MAP.status),
    repo: envField('REPO', DEFAULT_LIFE_OS_TASK_FIELD_MAP.repo),
    branch: envField('BRANCH', DEFAULT_LIFE_OS_TASK_FIELD_MAP.branch),
    prUrl: envField('PR_URL', DEFAULT_LIFE_OS_TASK_FIELD_MAP.prUrl),
    notes: envField('NOTES', DEFAULT_LIFE_OS_TASK_FIELD_MAP.notes),
    deployedAt: envField('DEPLOYED_AT', DEFAULT_LIFE_OS_TASK_FIELD_MAP.deployedAt),
    agentRunId: envField('AGENT_RUN_ID', DEFAULT_LIFE_OS_TASK_FIELD_MAP.agentRunId),
    agent: envField('AGENT', DEFAULT_LIFE_OS_TASK_FIELD_MAP.agent),
  }
}
