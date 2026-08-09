import {
  fetchAllRecords,
  patchAirtableRecord,
  type AirtableRecord,
} from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import {
  DCC_MACHINE_FIELDS as F,
  DCC_MACHINE_STATUS,
  publicMachineStatusLabel,
  type PublicMachineStatusLabel,
} from '@/lib/dcc/os-field-map'
import { appendChangeLog } from '@/lib/dcc/change-log'

export type DccMachine = {
  id: string
  name: string
  type?: string
  status: string
  publicStatus: PublicMachineStatusLabel
  buildVolume?: string
  materials?: string
  whatItCanMake?: string
  notes?: string
}

function str(fields: Record<string, unknown>, key: string): string | undefined {
  const v = fields[key]
  if (typeof v === 'string' && v.trim()) return v.trim()
  if (typeof v === 'number') return String(v)
  return undefined
}

function mapMachine(rec: AirtableRecord): DccMachine {
  const status = str(rec.fields, F.status) ?? DCC_MACHINE_STATUS.planned
  return {
    id: rec.id,
    name: str(rec.fields, F.name) ?? '(unnamed machine)',
    type: str(rec.fields, F.type),
    status,
    publicStatus: publicMachineStatusLabel(status),
    buildVolume: str(rec.fields, F.buildVolume),
    materials: str(rec.fields, F.materials),
    whatItCanMake: str(rec.fields, F.whatItCanMake),
    notes: str(rec.fields, F.notes),
  }
}

export async function listPublicMachines(
  conn?: DccOsConnection
): Promise<DccMachine[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.machines, c.apiKey)
  return rows.map(mapMachine)
}

export async function getMachine(
  id: string,
  conn?: DccOsConnection
): Promise<DccMachine | null> {
  const machines = await listPublicMachines(conn)
  return machines.find((m) => m.id === id) ?? null
}

export async function setMachineStatus(
  id: string,
  status: string,
  actor: string,
  conn?: DccOsConnection
): Promise<DccMachine> {
  const c = conn ?? requireDccOsConnection()
  const updated = await patchAirtableRecord(
    c.baseId,
    c.tables.machines,
    c.apiKey,
    id,
    { [F.status]: status }
  )
  await appendChangeLog(
    {
      entity: 'Machine',
      entityId: id,
      action: 'setMachineStatus',
      actor,
      details: `Status → ${status}`,
      source: 'staff',
    },
    c
  )
  return mapMachine(updated)
}

export async function logMaintenance(
  id: string,
  note: string,
  actor: string,
  conn?: DccOsConnection
): Promise<DccMachine> {
  const c = conn ?? requireDccOsConnection()
  const existing = await getMachine(id, c)
  const prev = existing?.notes?.trim()
  const nextNotes = prev ? `${prev}\n[maintenance] ${note}` : `[maintenance] ${note}`
  const updated = await patchAirtableRecord(
    c.baseId,
    c.tables.machines,
    c.apiKey,
    id,
    { [F.notes]: nextNotes }
  )
  await appendChangeLog(
    {
      entity: 'Machine',
      entityId: id,
      action: 'logMaintenance',
      actor,
      details: note,
      source: 'staff',
    },
    c
  )
  return mapMachine(updated)
}
