import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_CREDIT_FIELDS as F } from '@/lib/dcc/os-field-map'

export type DccCredit = {
  id: string
  name: string
  allocation: number
  retailValueDelivered: number
}

function num(fields: Record<string, unknown>, key: string): number {
  const v = fields[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}

function mapCredit(rec: AirtableRecord): DccCredit {
  return {
    id: rec.id,
    name:
      typeof rec.fields[F.name] === 'string'
        ? (rec.fields[F.name] as string)
        : '(credit)',
    allocation: num(rec.fields, F.allocation),
    retailValueDelivered: num(rec.fields, F.retailValueDelivered),
  }
}

export async function listCredits(conn?: DccOsConnection): Promise<DccCredit[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.credits, c.apiKey)
  return rows.map(mapCredit)
}

/** sum(Retail Value Delivered) / sum(Allocation); target ≥ 3× */
export function impactMultiplier(credits: DccCredit[]): number | null {
  const alloc = credits.reduce((s, c) => s + c.allocation, 0)
  const retail = credits.reduce((s, c) => s + c.retailValueDelivered, 0)
  if (alloc <= 0) return null
  return retail / alloc
}
