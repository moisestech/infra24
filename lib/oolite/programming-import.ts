import type { AirtableRecord } from '@/lib/airtable/client'
import type { OrgProgrammingConnection } from '@/lib/airtable/programming-config'

export function normalizeProgrammingTitle(title: string): string {
  return title.trim().toLowerCase()
}

export function normalizeProgrammingStartDate(value?: string | null): string {
  if (!value?.trim()) return ''
  return value.trim().slice(0, 10)
}

/** Stable upsert key: normalized title + ISO start date (YYYY-MM-DD). */
export function programmingUpsertKey(title: string, startDate?: string | null): string {
  return `${normalizeProgrammingTitle(title)}::${normalizeProgrammingStartDate(startDate)}`
}

export function indexProgrammingRowsByTitle(
  rows: AirtableRecord[],
  titleField: string
): Map<string, string> {
  const map = new Map<string, string>()
  for (const row of rows) {
    const raw = row.fields[titleField]
    const title = typeof raw === 'string' ? raw.trim() : undefined
    if (title) map.set(normalizeProgrammingTitle(title), row.id)
  }
  return map
}

export function indexProgrammingRowsByUpsertKey(
  rows: AirtableRecord[],
  titleField: string,
  startDateField: string
): Map<string, string> {
  const map = new Map<string, string>()
  for (const row of rows) {
    const rawTitle = row.fields[titleField]
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : undefined
    if (!title) continue
    const rawStart = row.fields[startDateField]
    const startDate =
      typeof rawStart === 'string'
        ? rawStart
        : typeof rawStart === 'number'
          ? String(rawStart)
          : undefined
    map.set(programmingUpsertKey(title, startDate), row.id)
  }
  return map
}

export function mergeLinkedRecordIds(
  existing: unknown,
  ...addIds: Array<string | undefined | null>
): string[] {
  const out = new Set<string>()
  if (Array.isArray(existing)) {
    for (const id of existing) {
      if (typeof id === 'string' && id.trim()) out.add(id.trim())
    }
  }
  for (const id of addIds) {
    if (id?.trim()) out.add(id.trim())
  }
  return [...out]
}

/** Linked Organization filters match institution name, not record id. */
export function buildProgrammingOrgFilterFormula(
  conn: OrgProgrammingConnection
): string | undefined {
  if (conn.orgName) {
    const escaped = conn.orgName.replace(/'/g, "\\'")
    return `{${conn.fieldMap.organization}}='${escaped}'`
  }
  return undefined
}

export function programmingRowMatchesOrg(
  record: AirtableRecord,
  conn: OrgProgrammingConnection
): boolean {
  if (conn.orgRecordId) {
    const orgField = record.fields[conn.fieldMap.organization]
    if (Array.isArray(orgField)) {
      return orgField.includes(conn.orgRecordId)
    }
    return orgField === conn.orgRecordId
  }
  if (conn.orgName) {
    const orgField = record.fields[conn.fieldMap.organization]
    const hay = JSON.stringify(orgField ?? '').toLowerCase()
    return hay.includes(conn.orgName.trim().toLowerCase())
  }
  return true
}

export function scopeProgrammingRowsByOrg(
  rows: AirtableRecord[],
  conn: OrgProgrammingConnection
): AirtableRecord[] {
  if (!conn.orgRecordId && !conn.orgName) return rows
  return rows.filter((row) => programmingRowMatchesOrg(row, conn))
}

export function mergeProgrammingFieldChoices(
  existing: string[] | undefined,
  desired: string[]
): string[] {
  const out = new Set<string>()
  for (const name of existing ?? []) {
    if (name.trim()) out.add(name.trim())
  }
  for (const raw of desired) {
    if (raw.trim()) out.add(raw.trim())
  }
  return [...out].sort((a, b) => a.localeCompare(b))
}
