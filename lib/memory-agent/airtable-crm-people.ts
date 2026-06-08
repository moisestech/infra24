import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'
import { parseAdditionalImageUrls } from '@/lib/airtable/alumni-images'
import {
  getOoliteCrmPeopleConnection,
  type CrmPeopleFieldMap,
  type OoliteCrmPeopleConnection,
} from '@/lib/airtable/oolite-crm-people-config'
import type { MemoryAgentMode } from '@/types/memory-agent'

function cellStr(fields: Record<string, unknown>, key: string): string | undefined {
  const raw = fields[key]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length ? t : undefined
  }
  return undefined
}

function cellBool(fields: Record<string, unknown>, key: string): boolean | undefined {
  if (!(key in fields) || fields[key] == null) return undefined
  const raw = fields[key]
  if (raw === true) return true
  if (raw === false) return false
  if (typeof raw === 'string') {
    const t = raw.trim().toLowerCase()
    if (['yes', 'true', '1', 'y'].includes(t)) return true
    if (['no', 'false', '0', 'n'].includes(t)) return false
  }
  return undefined
}

function cellTags(fields: Record<string, unknown>, key: string): string[] {
  const raw = fields[key]
  if (!Array.isArray(raw)) return []
  return raw
    .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
    .filter(Boolean)
}

function normalizeWebsiteUrl(href: string): string {
  const t = href.trim()
  if (!t) return t
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

function rowMatchesOrg(record: AirtableRecord, conn: OoliteCrmPeopleConnection): boolean {
  if (conn.orgRecordId) {
    const orgField = record.fields[conn.fieldMap.institution]
    if (Array.isArray(orgField)) return orgField.includes(conn.orgRecordId)
    return orgField === conn.orgRecordId
  }
  if (conn.orgName) {
    const hay = JSON.stringify(record.fields[conn.fieldMap.institution] ?? '').toLowerCase()
    return hay.includes(conn.orgName.trim().toLowerCase())
  }
  return true
}

export function mapCrmPeopleRow(
  record: AirtableRecord,
  fieldMap: CrmPeopleFieldMap
): AlumniAirtableRow | null {
  const fields = record.fields
  const name = cellStr(fields, fieldMap.name)
  if (!name) return null

  const websiteRaw = cellStr(fields, fieldMap.website)
  const portfolioRaw = cellStr(fields, fieldMap.portfolioImageUrls)
  const primaryImage = cellStr(fields, fieldMap.primaryImageUrl)
  const practiceTags = cellTags(fields, fieldMap.practiceTags)
  const publicAiApproved = cellBool(fields, fieldMap.publicAiApproved)
  const doNotUseInAi = cellBool(fields, fieldMap.doNotUseInAi)

  return {
    id: `crm_people:${record.id}`,
    name,
    artistName: name,
    photoUrl: primaryImage,
    featuredImageUrl: primaryImage,
    additionalImageUrls: parseAdditionalImageUrls(portfolioRaw),
    website: websiteRaw ? normalizeWebsiteUrl(websiteRaw) : undefined,
    publicBio: cellStr(fields, fieldMap.bio),
    pronoun: cellStr(fields, fieldMap.pronouns),
    topics: practiceTags,
    themes: [],
    medium: cellStr(fields, fieldMap.titleRole),
    program: cellStr(fields, fieldMap.department),
    location: cellStr(fields, fieldMap.city),
    approvedForPublicAi: publicAiApproved,
    doNotUseInAi: doNotUseInAi,
  }
}

export function mergeCrmPeopleWithAlumni(
  alumniRows: AlumniAirtableRow[],
  crmRows: AlumniAirtableRow[]
): AlumniAirtableRow[] {
  const byName = new Map<string, AlumniAirtableRow>()
  for (const row of alumniRows) {
    byName.set(row.name.trim().toLowerCase(), row)
  }
  for (const row of crmRows) {
    const key = row.name.trim().toLowerCase()
    const existing = byName.get(key)
    if (!existing) {
      byName.set(key, row)
      continue
    }
    byName.set(key, {
      ...existing,
      ...row,
      id: existing.id.startsWith('crm_people:') ? row.id : existing.id,
      publicBio: row.publicBio || existing.publicBio,
      website: row.website || existing.website,
      photoUrl: row.photoUrl || existing.photoUrl,
      featuredImageUrl: row.featuredImageUrl || existing.featuredImageUrl,
      additionalImageUrls: row.additionalImageUrls?.length
        ? row.additionalImageUrls
        : existing.additionalImageUrls,
      topics: row.topics.length ? row.topics : existing.topics,
      pronoun: row.pronoun || existing.pronoun,
      approvedForPublicAi: row.approvedForPublicAi ?? existing.approvedForPublicAi,
    })
  }
  return [...byName.values()]
}

export async function fetchCrmPeopleForMemoryAgent(
  orgSlug: string,
  mode: MemoryAgentMode
): Promise<{ ok: true; rows: AlumniAirtableRow[] } | { ok: false; reason: string }> {
  const conn = getOoliteCrmPeopleConnection(orgSlug)
  if (!conn) return { ok: false, reason: 'not_configured' }

  try {
    const filterFormula = conn.orgName
      ? `{${conn.fieldMap.institution}}='${conn.orgName.replace(/'/g, "\\'")}'`
      : undefined

    const records = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
      filterFormula,
      viewId: conn.viewId,
    })

    const scoped = records.filter((row) => rowMatchesOrg(row, conn))
    const mapped = scoped
      .map((row) => mapCrmPeopleRow(row, conn.fieldMap))
      .filter(Boolean) as AlumniAirtableRow[]

    const filtered =
      mode === 'staff_operator'
        ? mapped
        : mapped.filter((row) => {
            if (row.doNotUseInAi === true) return false
            return row.approvedForPublicAi === true
          })

    return { ok: true, rows: filtered }
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) }
  }
}
