import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
  type AirtableRecord,
} from '@/lib/airtable/client'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'

const F = DEFAULT_DCC_PEOPLE_FIELD_MAP

/** Escape single quotes for Airtable filterByFormula. */
export function escapeAirtableString(value: string): string {
  return value.replace(/'/g, "''")
}

export async function findPersonByEmail(
  baseId: string,
  tableId: string,
  apiKey: string,
  email: string
): Promise<AirtableRecord | undefined> {
  const escaped = escapeAirtableString(email.trim().toLowerCase())
  const formula = `LOWER({${F.email}}) = '${escaped}'`
  const rows = await fetchAllRecords(baseId, tableId, apiKey, { filterFormula: formula })
  return rows[0]
}

export type UpsertPersonResult = {
  recordId: string
  updated: boolean
  record: AirtableRecord
}

export async function upsertPersonRecord(
  baseId: string,
  tableId: string,
  apiKey: string,
  email: string,
  fields: Record<string, unknown>
): Promise<UpsertPersonResult> {
  const existing = await findPersonByEmail(baseId, tableId, apiKey, email)

  if (existing) {
    const record = await patchAirtableRecord(baseId, tableId, apiKey, existing.id, fields)
    return { recordId: record.id, updated: true, record }
  }

  const [record] = await createAirtableRecords(baseId, tableId, apiKey, [{ fields }])
  if (!record) throw new Error('Airtable create returned no record')
  return { recordId: record.id, updated: false, record }
}

export function existingCampaignIds(record: AirtableRecord | undefined): string[] {
  if (!record) return []
  const raw = record.fields[F.campaigns]
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === 'string')
  return []
}
