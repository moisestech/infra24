import { createAirtableRecords } from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_CHANGE_LOG_FIELDS as F } from '@/lib/dcc/os-field-map'

export type ChangeLogEntry = {
  entity: string
  entityId?: string
  action: string
  actor: string
  details?: string
  source: string
}

export async function appendChangeLog(
  entry: ChangeLogEntry,
  conn?: DccOsConnection
): Promise<void> {
  const c = conn ?? requireDccOsConnection()
  const name = `${entry.action} — ${entry.entity}${entry.entityId ? ` ${entry.entityId}` : ''}`
  await createAirtableRecords(c.baseId, c.tables.changeLog, c.apiKey, [
    {
      fields: {
        [F.name]: name.slice(0, 80),
        [F.entity]: entry.entity,
        ...(entry.entityId ? { [F.entityId]: entry.entityId } : {}),
        [F.action]: entry.action,
        [F.actor]: entry.actor,
        ...(entry.details ? { [F.details]: entry.details } : {}),
        [F.source]: entry.source,
      },
    },
  ])
}
