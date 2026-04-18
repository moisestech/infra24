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
  /** Required for row identity / filters (mapped name field) */
  name: string
  /** Optional professional or display name shown on cards when set */
  artistName?: string
  /** First attachment URL or URL string from mapped photo field */
  photoUrl?: string
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

/** Label for cards: artist name when mapped, else legal/display name */
export function alumniDisplayName(row: AlumniAirtableRow): string {
  const a = row.artistName?.trim()
  if (a) return a
  return row.name
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

/** Airtable attachment cell or URL / string field */
function cellToPhotoUrl(
  fields: Record<string, unknown>,
  airtableFieldName: string
): string | undefined {
  if (!airtableFieldName.trim()) return undefined
  const raw = fields[airtableFieldName]
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (!t) return undefined
    if (/^https?:\/\//i.test(t)) return t
    return undefined
  }
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0]
    if (first && typeof first === 'object' && 'url' in first) {
      const u = (first as { url?: unknown }).url
      if (typeof u === 'string' && u.trim()) return u.trim()
    }
  }
  return undefined
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

  const artistField = fieldMap.artistName?.trim()
  const artistName = artistField
    ? cellToString(fields[artistField])
    : undefined
  const photoUrl = cellToPhotoUrl(fields, fieldMap.photo)

  return {
    id: record.id,
    name,
    ...(artistName ? { artistName } : {}),
    ...(photoUrl ? { photoUrl } : {}),
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

/** Short year label for cards (first 4-digit year in cell if messy) */
export function alumniYearLabel(year?: string): string {
  if (!year?.trim()) return ''
  const y = parseAlumniYearValue(year)
  if (y != null) return String(y)
  return year.trim()
}

export type FetchAlumniDetailedResult =
  | {
      ok: true
      alumni: AlumniAirtableRow[]
      /** Total Airtable rows returned (before name filter) */
      airtableRecordCount: number
      /** Rows dropped because the mapped name field was empty */
      skippedWithoutName: number
    }
  | { ok: false; reason: 'not_configured' }
  | { ok: false; reason: 'airtable_error'; message: string }

/**
 * Same as {@link fetchAlumniFromAirtable} but includes Airtable error text when the request fails.
 */
export async function fetchAlumniFromAirtableDetailed(
  orgSlug: string
): Promise<FetchAlumniDetailedResult> {
  const conn = getAlumniConnectionForOrg(orgSlug)
  if (!conn) return { ok: false, reason: 'not_configured' }

  try {
    const records = await fetchAllRecords(conn.baseId, conn.tableId, conn.apiKey, {
      viewId: conn.viewId,
    })
    const rows: AlumniAirtableRow[] = []
    for (const r of records) {
      const row = mapRecordToAlumni(r, conn.fieldMap)
      if (row) rows.push(row)
    }
    return {
      ok: true,
      alumni: rows,
      airtableRecordCount: records.length,
      skippedWithoutName: records.length - rows.length,
    }
  } catch (err) {
    console.error('Airtable alumni fetch error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, reason: 'airtable_error', message }
  }
}

/**
 * Fetch mapped alumni rows from Airtable for an org with env configured.
 * Returns null if not configured or fetch fails.
 */
export async function fetchAlumniFromAirtable(
  orgSlug: string
): Promise<AlumniAirtableRow[] | null> {
  const r = await fetchAlumniFromAirtableDetailed(orgSlug)
  if (r.ok) return r.alumni
  return null
}

export function isAlumniAirtableConfigured(orgSlug: string): boolean {
  return getAlumniConnectionForOrg(orgSlug) !== null
}
