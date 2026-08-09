import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_MBO_FIELDS as F } from '@/lib/dcc/os-field-map'

export type DccMbo = {
  id: string
  name: string
  objective?: string
  progress: number
  target: number
  status?: string
  notes?: string
}

function num(fields: Record<string, unknown>, key: string): number {
  const v = fields[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}

function mapMbo(rec: AirtableRecord): DccMbo {
  return {
    id: rec.id,
    name:
      typeof rec.fields[F.name] === 'string'
        ? (rec.fields[F.name] as string)
        : '(mbo)',
    objective:
      typeof rec.fields[F.objective] === 'string'
        ? (rec.fields[F.objective] as string)
        : undefined,
    progress: num(rec.fields, F.progress),
    target: num(rec.fields, F.target) || 100,
    status:
      typeof rec.fields[F.status] === 'string'
        ? (rec.fields[F.status] as string)
        : undefined,
    notes:
      typeof rec.fields[F.notes] === 'string'
        ? (rec.fields[F.notes] as string)
        : undefined,
  }
}

export async function listMbos(conn?: DccOsConnection): Promise<DccMbo[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.mbos, c.apiKey)
  return rows.map(mapMbo)
}
