/**
 * Airtable alumni directory (separate base/table from budget).
 * Server-only; per-org env AIRTABLE_{ORG}_ALUMNI_* with oolite legacy AIRTABLE_ALUMNI_*.
 */

import {
  fetchAllRecords,
  type AirtableRecord,
} from '@/lib/airtable/client'
import type { AlumniFieldMap } from '@/lib/airtable/org-alumni-config'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'

export type AlumniAirtableRow = {
  id: string
  name: string
  email?: string
  cohort?: string
  program?: string
  year?: string
  phone?: string
  notes?: string
  website?: string
  /** Normalized topic tags for filters and display */
  topics: string[]
  medium?: string
  artifacts?: string
  /** From checkbox / yes-no when mapped column exists */
  digitalArtist?: boolean
  inCollection?: boolean
  videoArt?: boolean
}

function cellToString(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') {
    const t = value.trim()
    return t.length ? t : undefined
  }
  if (typeof value === 'number' && !Number.isNaN(value)) return String(value)
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
      .filter(Boolean)
    return parts.length ? parts.join(', ') : undefined
  }
  return undefined
}

function cellToBool(value: unknown): boolean | undefined {
  if (value === true) return true
  if (value === false) return false
  if (typeof value === 'string') {
    const t = value.trim().toLowerCase()
    if (['yes', 'true', '1', 'y'].includes(t)) return true
    if (['no', 'false', '0', 'n'].includes(t)) return false
  }
  return undefined
}

function cellToTopicList(fields: Record<string, unknown>, airtableFieldName: string): string[] {
  const raw = fields[airtableFieldName]
  if (raw == null) return []
  if (Array.isArray(raw)) {
    return raw
      .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
      .filter(Boolean)
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

function normalizeWebsiteUrl(href: string): string {
  const t = href.trim()
  if (!t) return t
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t}`
}

function mapRecordToAlumni(
  record: AirtableRecord,
  fieldMap: AlumniFieldMap
): AlumniAirtableRow | null {
  const fields = record.fields
  const name = cellToString(fields[fieldMap.name])
  if (!name) return null

  const websiteRaw = cellToString(fields[fieldMap.website])
  const website = websiteRaw ? normalizeWebsiteUrl(websiteRaw) : undefined

  return {
    id: record.id,
    name,
    email: cellToString(fields[fieldMap.email]),
    cohort: cellToString(fields[fieldMap.cohort]),
    program: cellToString(fields[fieldMap.program]),
    year: cellToString(fields[fieldMap.year]),
    phone: cellToString(fields[fieldMap.phone]),
    notes: cellToString(fields[fieldMap.notes]),
    website,
    topics: cellToTopicList(fields, fieldMap.topics),
    medium: cellToString(fields[fieldMap.medium]),
    artifacts: cellToString(fields[fieldMap.artifacts]),
    digitalArtist: cellToBool(fields[fieldMap.digitalArtist]),
    inCollection: cellToBool(fields[fieldMap.inCollection]),
    videoArt: cellToBool(fields[fieldMap.videoArt]),
  }
}

/** First plausible 4-digit year for sorting */
export function parseAlumniYearValue(year?: string): number | null {
  if (!year?.trim()) return null
  const m = year.match(/\d{4}/)
  if (m) {
    const n = parseInt(m[0], 10)
    return Number.isFinite(n) ? n : null
  }
  return null
}

/**
 * Fetch mapped alumni rows from Airtable for an org with env configured.
 * Returns null if not configured or fetch fails.
 */
export async function fetchAlumniFromAirtable(
  orgSlug: string
): Promise<AlumniAirtableRow[] | null> {
  const conn = getAlumniConnectionForOrg(orgSlug)
  if (!conn) return null

  try {
    const records = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
      viewId: conn.viewId,
    })
    const rows: AlumniAirtableRow[] = []
    for (const r of records) {
      const row = mapRecordToAlumni(r, conn.fieldMap)
      if (row) rows.push(row)
    }
    return rows
  } catch (err) {
    console.error('Airtable alumni fetch error:', err)
    return null
  }
}

export function isAlumniAirtableConfigured(orgSlug: string): boolean {
  return getAlumniConnectionForOrg(orgSlug) !== null
}
