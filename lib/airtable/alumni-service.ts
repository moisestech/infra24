/**
 * Airtable alumni directory (separate base/table from budget).
 * Server-only; per-org env AIRTABLE_{ORG}_ALUMNI_* with oolite legacy AIRTABLE_ALUMNI_*.
 */

import {
  fetchAllRecords,
  type AirtableRecord,
} from '@/lib/airtable/client'
import {
  alumniImageForContext,
  isUsableImageUrl,
  parseAdditionalImageUrls,
  type AlumniImageReviewStatus,
  type AlumniPreferredImageOrientation,
} from '@/lib/airtable/alumni-images'
import type { AlumniFieldMap } from '@/lib/airtable/org-alumni-config'
import { getAlumniConnectionForOrg } from '@/lib/airtable/org-alumni-config'

export type AlumniAirtableRow = {
  id: string
  /** Required for row identity / filters (mapped name field) */
  name: string
  /** Optional professional or display name shown on cards when set */
  artistName?: string
  /** Default Memory Agent / directory image (resolved from featured + orientation fields) */
  photoUrl?: string
  featuredImageUrl?: string
  portraitVerticalUrl?: string
  portraitLandscapeUrl?: string
  additionalImageUrls?: string[]
  imageAltText?: string
  imageCredit?: string
  imageSource?: string
  imageReviewStatus?: AlumniImageReviewStatus
  preferredImageOrientation?: AlumniPreferredImageOrientation
  cloudinarySourceBatch?: string
  email?: string
  cohort?: string
  program?: string
  /** @deprecated Prefer `residencyYear`; kept in sync for filters/sort */
  year?: string
  /** Year in residency (primary); from dedicated column or `year` fallback */
  residencyYear?: string
  pronoun?: string
  ethnicity?: string
  nationality?: string
  phone?: string
  notes?: string
  website?: string
  /** Normalized topic tags for filters and display */
  topics: string[]
  /** Extra theme tags when a separate Airtable column is mapped */
  themes: string[]
  medium?: string
  artifacts?: string
  /** From checkbox / yes-no when mapped column exists */
  digitalArtist?: boolean
  inCollection?: boolean
  videoArt?: boolean
  /** Public bio for AI when mapped */
  publicBio?: string
  instagram?: string
  location?: string
  visibilityLevel?: string
  approvedForPublicAi?: boolean
  doNotUseInAi?: boolean
  studioNumber?: string
  currentAlumniStatus?: string
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
    if (!isUsableImageUrl(t)) return undefined
    return t
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

function cellToImageUrl(
  fields: Record<string, unknown>,
  airtableFieldName: string
): string | undefined {
  if (!airtableFieldName.trim()) return undefined
  return cellToPhotoUrl(fields, airtableFieldName)
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

  const featuredImageUrl =
    cellToImageUrl(fields, fieldMap.featuredImageUrl) ??
    cellToImageUrl(fields, fieldMap.photo)
  const portraitVerticalUrl = cellToImageUrl(fields, fieldMap.portraitVerticalUrl)
  const portraitLandscapeUrl = cellToImageUrl(fields, fieldMap.portraitLandscapeUrl)
  const additionalRaw = fieldMap.additionalImageUrls?.trim()
    ? cellToString(fields[fieldMap.additionalImageUrls])
    : undefined
  const additionalImageUrls = parseAdditionalImageUrls(additionalRaw)
  const imageAltText = fieldMap.imageAltText?.trim()
    ? cellToString(fields[fieldMap.imageAltText])
    : undefined
  const imageCredit = fieldMap.imageCredit?.trim()
    ? cellToString(fields[fieldMap.imageCredit])
    : undefined
  const imageSource = fieldMap.imageSource?.trim()
    ? cellToString(fields[fieldMap.imageSource])
    : undefined
  const imageReviewStatus = fieldMap.imageReviewStatus?.trim()
    ? (cellToString(fields[fieldMap.imageReviewStatus]) as AlumniImageReviewStatus | undefined)
    : undefined
  const preferredImageOrientation = fieldMap.preferredImageOrientation?.trim()
    ? (cellToString(fields[fieldMap.preferredImageOrientation]) as
        | AlumniPreferredImageOrientation
        | undefined)
    : undefined
  const cloudinarySourceBatch = fieldMap.cloudinarySourceBatch?.trim()
    ? cellToString(fields[fieldMap.cloudinarySourceBatch])
    : undefined

  const imageFields = {
    featuredImageUrl,
    portraitVerticalUrl,
    portraitLandscapeUrl,
    photoUrl: cellToImageUrl(fields, fieldMap.photo),
    imageReviewStatus,
  }
  const photoUrl = alumniImageForContext(imageFields, 'default')

  const themesField = fieldMap.themes?.trim()
  const themes = themesField ? cellToTopicList(fields, themesField) : []

  const publicBioField = fieldMap.publicBio?.trim()
  const publicBio = publicBioField
    ? cellToString(fields[publicBioField])
    : undefined

  const instagramField = fieldMap.instagram?.trim()
  const instagram = instagramField
    ? cellToString(fields[instagramField])
    : undefined

  const locationField = fieldMap.location?.trim()
  const location = locationField
    ? cellToString(fields[locationField])
    : undefined

  const visField = fieldMap.visibilityLevel?.trim()
  const visibilityLevel = visField
    ? cellToString(fields[visField])
    : undefined

  const approvedField = fieldMap.approvedForPublicAi?.trim()
  const approvedForPublicAi = approvedField
    ? cellToBool(fields[approvedField])
    : undefined

  const doNotField = fieldMap.doNotUseInAi?.trim()
  const doNotUseInAi = doNotField ? cellToBool(fields[doNotField]) : undefined

  const studioField = fieldMap.studioNumber?.trim()
  const studioNumber = studioField ? cellToString(fields[studioField]) : undefined

  const statusField = fieldMap.currentAlumniStatus?.trim()
  const currentAlumniStatus = statusField ? cellToString(fields[statusField]) : undefined

  const residencyCol = fieldMap.residencyYear?.trim()
  const residencyFromCol = residencyCol
    ? cellToString(fields[residencyCol])
    : undefined
  const yearLegacy = cellToString(fields[fieldMap.year])
  const residencyYear = residencyFromCol || yearLegacy

  const pronounCol = fieldMap.pronoun?.trim()
  const pronoun = pronounCol ? cellToString(fields[pronounCol]) : undefined
  const ethnicityCol = fieldMap.ethnicity?.trim()
  const ethnicity = ethnicityCol ? cellToString(fields[ethnicityCol]) : undefined
  const nationalityCol = fieldMap.nationality?.trim()
  const nationality = nationalityCol ? cellToString(fields[nationalityCol]) : undefined

  return {
    id: record.id,
    name,
    ...(artistName ? { artistName } : {}),
    ...(photoUrl ? { photoUrl } : {}),
    ...(featuredImageUrl ? { featuredImageUrl } : {}),
    ...(portraitVerticalUrl ? { portraitVerticalUrl } : {}),
    ...(portraitLandscapeUrl ? { portraitLandscapeUrl } : {}),
    ...(additionalImageUrls.length ? { additionalImageUrls } : {}),
    ...(imageAltText ? { imageAltText } : {}),
    ...(imageCredit ? { imageCredit } : {}),
    ...(imageSource ? { imageSource } : {}),
    ...(imageReviewStatus ? { imageReviewStatus } : {}),
    ...(preferredImageOrientation ? { preferredImageOrientation } : {}),
    ...(cloudinarySourceBatch ? { cloudinarySourceBatch } : {}),
    email: cellToString(fields[fieldMap.email]),
    cohort: cellToString(fields[fieldMap.cohort]),
    program: cellToString(fields[fieldMap.program]),
    year: residencyYear,
    ...(residencyYear ? { residencyYear } : {}),
    ...(pronoun ? { pronoun } : {}),
    ...(ethnicity ? { ethnicity } : {}),
    ...(nationality ? { nationality } : {}),
    phone: cellToString(fields[fieldMap.phone]),
    notes: cellToString(fields[fieldMap.notes]),
    website,
    topics: cellToTopicList(fields, fieldMap.topics),
    themes,
    medium: cellToString(fields[fieldMap.medium]),
    artifacts: cellToString(fields[fieldMap.artifacts]),
    digitalArtist: cellToBool(fields[fieldMap.digitalArtist]),
    inCollection: cellToBool(fields[fieldMap.inCollection]),
    videoArt: cellToBool(fields[fieldMap.videoArt]),
    ...(publicBio ? { publicBio } : {}),
    ...(instagram ? { instagram } : {}),
    ...(location ? { location } : {}),
    ...(visibilityLevel ? { visibilityLevel } : {}),
    ...(approvedForPublicAi !== undefined ? { approvedForPublicAi } : {}),
    ...(doNotUseInAi !== undefined ? { doNotUseInAi } : {}),
    ...(studioNumber ? { studioNumber } : {}),
    ...(currentAlumniStatus ? { currentAlumniStatus } : {}),
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
