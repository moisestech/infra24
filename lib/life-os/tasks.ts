import {
  fetchAllRecords,
  patchAirtableRecord,
  type AirtableRecord,
} from '@/lib/airtable/client'
import { getLifeOsConnection, type LifeOsConnection } from '@/lib/life-os/config'
import {
  LIFE_OS_STATUS,
  OPEN_TASK_STATUSES,
  type LifeOsTaskFieldMap,
} from '@/lib/life-os/field-map'

export const LIFE_OS_NOTE_PREFIX = '[cursor:life-os]'

export type LifeOsTask = {
  id: string
  title: string
  status: string
  repo?: string
  branch?: string
  prUrl?: string
  notes?: string
  deployedAt?: string
  agentRunId?: string
  agent?: string
  raw: AirtableRecord
}

function str(fields: Record<string, unknown>, key: string): string | undefined {
  const v = fields[key]
  if (typeof v === 'string' && v.trim()) return v.trim()
  if (typeof v === 'number') return String(v)
  return undefined
}

function mapRecord(rec: AirtableRecord, F: LifeOsTaskFieldMap): LifeOsTask {
  const f = rec.fields
  return {
    id: rec.id,
    title: str(f, F.title) ?? '(untitled)',
    status: str(f, F.status) ?? '',
    repo: str(f, F.repo),
    branch: str(f, F.branch),
    prUrl: str(f, F.prUrl),
    notes: str(f, F.notes),
    deployedAt: str(f, F.deployedAt),
    agentRunId: str(f, F.agentRunId),
    agent: str(f, F.agent),
    raw: rec,
  }
}

function requireConn(conn?: LifeOsConnection | null): LifeOsConnection {
  const c = conn ?? getLifeOsConnection()
  if (!c) {
    throw new Error(
      'LIFE OS not configured. Set AIRTABLE_LIFE_OS_TABLE_TASKS and AIRTABLE_LIFE_OS_API_KEY (or AIRTABLE_API_KEY).'
    )
  }
  return c
}

function escapeFormula(value: string): string {
  return value.replace(/'/g, "''")
}

function appendNote(existing: string | undefined, line: string): string {
  const stamped = `${LIFE_OS_NOTE_PREFIX} ${line}`
  if (!existing?.trim()) return stamped
  return `${existing.trim()}\n${stamped}`
}

/** Open backlog: Status in Todo / Ready (or custom OPEN statuses via filter). */
export async function listOpenTasks(
  conn?: LifeOsConnection | null
): Promise<LifeOsTask[]> {
  const c = requireConn(conn)
  const F = c.fieldMap
  const statuses = OPEN_TASK_STATUSES.map((s) => `{${F.status}} = '${escapeFormula(s)}'`).join(
    ', '
  )
  const filterFormula =
    OPEN_TASK_STATUSES.length === 1
      ? `{${F.status}} = '${escapeFormula(OPEN_TASK_STATUSES[0]!)}'`
      : `OR(${statuses})`

  const rows = await fetchAllRecords(c.baseId, c.tasksTableId, c.apiKey, {
    filterFormula,
  })
  return rows.map((r) => mapRecord(r, F))
}

export async function getTask(
  id: string,
  conn?: LifeOsConnection | null
): Promise<LifeOsTask | null> {
  const c = requireConn(conn)
  const rows = await fetchAllRecords(c.baseId, c.tasksTableId, c.apiKey, {
    filterFormula: `RECORD_ID() = '${escapeFormula(id)}'`,
  })
  const rec = rows[0]
  return rec ? mapRecord(rec, c.fieldMap) : null
}

export async function listAllTasks(
  conn?: LifeOsConnection | null
): Promise<LifeOsTask[]> {
  const c = requireConn(conn)
  const rows = await fetchAllRecords(c.baseId, c.tasksTableId, c.apiKey)
  return rows.map((r) => mapRecord(r, c.fieldMap))
}

export type ClaimTaskOptions = {
  agent?: string
  agentRunId?: string
  repo?: string
  branch?: string
  note?: string
}

/** Claim → In Progress + agent stamp. */
export async function claimTask(
  id: string,
  options: ClaimTaskOptions = {},
  conn?: LifeOsConnection | null
): Promise<LifeOsTask> {
  const c = requireConn(conn)
  const F = c.fieldMap
  const existing = await getTask(id, c)
  if (!existing) throw new Error(`LIFE OS task not found: ${id}`)

  const fields: Record<string, unknown> = {
    [F.status]: LIFE_OS_STATUS.inProgress,
  }
  if (options.agent) fields[F.agent] = options.agent
  if (options.agentRunId) fields[F.agentRunId] = options.agentRunId
  if (options.repo) fields[F.repo] = options.repo
  if (options.branch) fields[F.branch] = options.branch
  fields[F.notes] = appendNote(
    existing.notes,
    options.note ?? `claimed by ${options.agent ?? 'cursor'} at ${new Date().toISOString()}`
  )

  const updated = await patchAirtableRecord(
    c.baseId,
    c.tasksTableId,
    c.apiKey,
    id,
    fields
  )
  return mapRecord(updated, F)
}

export async function markInProgress(
  id: string,
  note?: string,
  conn?: LifeOsConnection | null
): Promise<LifeOsTask> {
  return claimTask(id, { note: note ?? 'marked In Progress' }, conn)
}

export async function attachPr(
  id: string,
  prUrl: string,
  conn?: LifeOsConnection | null
): Promise<LifeOsTask> {
  const c = requireConn(conn)
  const F = c.fieldMap
  const existing = await getTask(id, c)
  if (!existing) throw new Error(`LIFE OS task not found: ${id}`)

  const fields: Record<string, unknown> = {
    [F.prUrl]: prUrl,
    [F.status]: LIFE_OS_STATUS.inReview,
    [F.notes]: appendNote(existing.notes, `PR attached: ${prUrl}`),
  }

  const updated = await patchAirtableRecord(
    c.baseId,
    c.tasksTableId,
    c.apiKey,
    id,
    fields
  )
  return mapRecord(updated, F)
}

export type MarkDeployedOptions = {
  prUrl?: string
  note?: string
  deployedAt?: string
}

export async function markDeployed(
  id: string,
  options: MarkDeployedOptions = {},
  conn?: LifeOsConnection | null
): Promise<LifeOsTask> {
  const c = requireConn(conn)
  const F = c.fieldMap
  const existing = await getTask(id, c)
  if (!existing) throw new Error(`LIFE OS task not found: ${id}`)

  const at = options.deployedAt ?? new Date().toISOString().slice(0, 10)
  const fields: Record<string, unknown> = {
    [F.status]: LIFE_OS_STATUS.deployed,
    [F.deployedAt]: at,
    [F.notes]: appendNote(
      existing.notes,
      options.note ?? `deployed ${at}`
    ),
  }
  if (options.prUrl) fields[F.prUrl] = options.prUrl

  const updated = await patchAirtableRecord(
    c.baseId,
    c.tasksTableId,
    c.apiKey,
    id,
    fields
  )
  return mapRecord(updated, F)
}

export async function addAgentNote(
  id: string,
  note: string,
  conn?: LifeOsConnection | null
): Promise<LifeOsTask> {
  const c = requireConn(conn)
  const F = c.fieldMap
  const existing = await getTask(id, c)
  if (!existing) throw new Error(`LIFE OS task not found: ${id}`)

  const updated = await patchAirtableRecord(
    c.baseId,
    c.tasksTableId,
    c.apiKey,
    id,
    { [F.notes]: appendNote(existing.notes, note) }
  )
  return mapRecord(updated, F)
}

/** Mark In Review / Done without deploy timestamp (optional terminal). */
export async function markDone(
  id: string,
  options: { prUrl?: string; note?: string } = {},
  conn?: LifeOsConnection | null
): Promise<LifeOsTask> {
  const c = requireConn(conn)
  const F = c.fieldMap
  const existing = await getTask(id, c)
  if (!existing) throw new Error(`LIFE OS task not found: ${id}`)

  const fields: Record<string, unknown> = {
    [F.status]: LIFE_OS_STATUS.done,
    [F.notes]: appendNote(existing.notes, options.note ?? 'marked Done'),
  }
  if (options.prUrl) {
    fields[F.prUrl] = options.prUrl
  }

  const updated = await patchAirtableRecord(
    c.baseId,
    c.tasksTableId,
    c.apiKey,
    id,
    fields
  )
  return mapRecord(updated, F)
}
