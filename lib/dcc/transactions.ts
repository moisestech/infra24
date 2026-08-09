import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_TRANSACTION_FIELDS as F } from '@/lib/dcc/os-field-map'

export type DccTransaction = {
  id: string
  name: string
  amount: number
  type?: string
  date?: string
  notes?: string
}

function mapTx(rec: AirtableRecord): DccTransaction {
  const amountRaw = rec.fields[F.amount]
  const amount = typeof amountRaw === 'number' ? amountRaw : 0
  return {
    id: rec.id,
    name:
      typeof rec.fields[F.name] === 'string'
        ? (rec.fields[F.name] as string)
        : '(tx)',
    amount,
    type: typeof rec.fields[F.type] === 'string' ? (rec.fields[F.type] as string) : undefined,
    date: typeof rec.fields[F.date] === 'string' ? (rec.fields[F.date] as string) : undefined,
    notes:
      typeof rec.fields[F.notes] === 'string' ? (rec.fields[F.notes] as string) : undefined,
  }
}

export async function listTransactions(
  conn?: DccOsConnection
): Promise<DccTransaction[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.transactions, c.apiKey)
  return rows.map(mapTx)
}

export function sumCashAvailable(txs: DccTransaction[]): number {
  return txs.reduce((sum, t) => sum + t.amount, 0)
}

export function monthlyRevenue(
  txs: DccTransaction[],
  year: number,
  month: number
): number {
  return txs
    .filter((t) => {
      if (!t.date) return false
      const d = new Date(t.date)
      return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month
    })
    .filter((t) => {
      const ty = (t.type ?? '').toLowerCase()
      return !ty.includes('expense') && !ty.includes('cost') && t.amount > 0
    })
    .reduce((sum, t) => sum + t.amount, 0)
}
