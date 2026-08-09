import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_SERVICE_FIELDS as F } from '@/lib/dcc/os-field-map'

export type DccService = {
  id: string
  name: string
  category?: string
  associatePrice: number | null
  publicPrice: number | null
  commercialPrice: number | null
  unit?: string
  active: boolean
  notes?: string
  /** True when large-format / resin — show quote formula, not flat hourly */
  quoteFormulaOnly: boolean
}

function str(fields: Record<string, unknown>, key: string): string | undefined {
  const v = fields[key]
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

function money(fields: Record<string, unknown>, key: string): number | null {
  const v = fields[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v.replace(/[$,]/g, ''))
    return Number.isFinite(n) ? n : null
  }
  return null
}

function isActive(fields: Record<string, unknown>): boolean {
  const v = fields[F.active]
  if (v === true) return true
  if (v === false || v == null) return false
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1'
  return Boolean(v)
}

function isQuoteFormulaCategory(category: string | undefined, name: string): boolean {
  const hay = `${category ?? ''} ${name}`.toLowerCase()
  return (
    hay.includes('large') ||
    hay.includes('resin') ||
    hay.includes('giga') ||
    hay.includes('large-format')
  )
}

function mapService(rec: AirtableRecord): DccService {
  const name = str(rec.fields, F.name) ?? '(unnamed service)'
  const category = str(rec.fields, F.category)
  return {
    id: rec.id,
    name,
    category,
    associatePrice: money(rec.fields, F.associate),
    publicPrice: money(rec.fields, F.public),
    commercialPrice: money(rec.fields, F.commercial),
    unit: str(rec.fields, F.unit),
    active: isActive(rec.fields),
    notes: str(rec.fields, F.notes),
    quoteFormulaOnly: isQuoteFormulaCategory(category, name),
  }
}

/** Active services only — never render inactive rows on /pricing. */
export async function listActiveServices(
  conn?: DccOsConnection
): Promise<DccService[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.services, c.apiKey)
  return rows.map(mapService).filter((s) => s.active)
}

export async function getService(
  id: string,
  conn?: DccOsConnection
): Promise<DccService | null> {
  const all = await listActiveServices(conn)
  return all.find((s) => s.id === id) ?? null
}

export function formatTierPrice(value: number | null): string {
  if (value == null) return 'Quoted'
  if (value === 0) return 'Quoted'
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}
