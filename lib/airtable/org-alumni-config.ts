/**
 * Per-org Airtable alumni connection from env.
 * Pattern: AIRTABLE_{ORG}_ALUMNI_BASE_ID (org token = slug uppercased, hyphens → underscores).
 * Legacy: for org `oolite` only, falls back to flat AIRTABLE_ALUMNI_* if prefixed vars are absent.
 */

import { isAirtableConnectionConfigured } from '@/lib/airtable/client'

export type AlumniFieldMap = {
  name: string
  email: string
  cohort: string
  program: string
  year: string
  phone: string
  notes: string
  /** Primary website or portfolio URL */
  website: string
  /** Comma / multi-select topics, themes, or tags */
  topics: string
  /** Discipline e.g. video, digital, painting */
  medium: string
  /** Work produced at Oolite; projects, links, description */
  artifacts: string
  /** Checkbox or yes/no: digital-focused practice */
  digitalArtist: string
  /** Checkbox: work in Oolite collection */
  inCollection: string
  /** Checkbox or tag: video art emphasis */
  videoArt: string
  /** Attachments or image URL for directory avatar */
  photo: string
  /** Optional display / professional name; card shows this when set, else Name */
  artistName: string
}

export type OrgAlumniConnection = {
  apiKey: string
  baseId: string
  tableId: string
  viewId?: string
  fieldMap: AlumniFieldMap
}

const DEFAULT_FIELDS: AlumniFieldMap = {
  name: 'Name',
  email: 'Email',
  cohort: 'Cohort',
  program: 'Program',
  year: 'Year',
  phone: 'Phone',
  notes: 'Notes',
  website: 'Website',
  topics: 'Topics',
  medium: 'Medium',
  artifacts: 'Artifacts',
  digitalArtist: 'Digital artist',
  inCollection: 'In collection',
  videoArt: 'Video art',
  photo: 'Photo',
  /** Empty = do not read a separate column (use Name only) */
  artistName: '',
}

/** Slug `oolite` → `OOLITE`, `mad-arts` → `MAD_ARTS` */
export function orgSlugToEnvToken(orgSlug: string): string | null {
  const raw = orgSlug.trim().toLowerCase().replace(/-/g, '_')
  const safe = raw.replace(/[^a-z0-9_]/g, '')
  if (!safe) return null
  return safe.toUpperCase()
}

function readEnv(key: string): string | undefined {
  const v = process.env[key]
  return v?.trim() || undefined
}

/** Field keys: AIRTABLE_{TOKEN}_ALUMNI_FIELD_NAME, etc. */
function fieldMapForPrefix(fullPrefix: string): AlumniFieldMap {
  const pick = (suffix: keyof AlumniFieldMap): string => {
    const v = readEnv(`${fullPrefix}FIELD_${suffix.toUpperCase()}`)
    return v ?? DEFAULT_FIELDS[suffix]
  }
  return {
    name: pick('name'),
    email: pick('email'),
    cohort: pick('cohort'),
    program: pick('program'),
    year: pick('year'),
    phone: pick('phone'),
    notes: pick('notes'),
    website: pick('website'),
    topics: pick('topics'),
    medium: pick('medium'),
    artifacts: pick('artifacts'),
    digitalArtist: pick('digitalArtist'),
    inCollection: pick('inCollection'),
    videoArt: pick('videoArt'),
    photo: pick('photo'),
    artistName: pick('artistName'),
  }
}

/** Legacy flat AIRTABLE_ALUMNI_FIELD_* (no org token) */
function fieldMapLegacy(): AlumniFieldMap {
  const pick = (suffix: keyof AlumniFieldMap): string => {
    const v = readEnv(`AIRTABLE_ALUMNI_FIELD_${suffix.toUpperCase()}`)
    return v ?? DEFAULT_FIELDS[suffix]
  }
  return {
    name: pick('name'),
    email: pick('email'),
    cohort: pick('cohort'),
    program: pick('program'),
    year: pick('year'),
    phone: pick('phone'),
    notes: pick('notes'),
    website: pick('website'),
    topics: pick('topics'),
    medium: pick('medium'),
    artifacts: pick('artifacts'),
    digitalArtist: pick('digitalArtist'),
    inCollection: pick('inCollection'),
    videoArt: pick('videoArt'),
    photo: pick('photo'),
    artistName: pick('artistName'),
  }
}

function tryConnection(
  prefix: string,
  fieldMap: AlumniFieldMap
): OrgAlumniConnection | null {
  const baseId = readEnv(`${prefix}BASE_ID`)
  const tableId = readEnv(`${prefix}TABLE_ID`)
  const apiKey =
    readEnv(`${prefix}API_KEY`) ||
    readEnv('AIRTABLE_ALUMNI_API_KEY') ||
    readEnv('AIRTABLE_API_KEY')

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId })) {
    return null
  }

  const viewId = readEnv(`${prefix}VIEW_ID`)

  return {
    apiKey: apiKey!,
    baseId: baseId!,
    tableId: tableId!,
    viewId,
    fieldMap,
  }
}

/**
 * Resolve alumni Airtable settings for an org slug.
 * Tries AIRTABLE_{TOKEN}_ALUMNI_* first; for `oolite` only, falls back to AIRTABLE_ALUMNI_*.
 */
export function getAlumniConnectionForOrg(orgSlug: string): OrgAlumniConnection | null {
  const token = orgSlugToEnvToken(orgSlug)
  if (!token) return null

  const orgPrefix = `AIRTABLE_${token}_ALUMNI_`
  const fromOrg = tryConnection(orgPrefix, fieldMapForPrefix(orgPrefix))
  if (fromOrg) return fromOrg

  if (orgSlug.trim().toLowerCase() === 'oolite') {
    return tryConnection('AIRTABLE_ALUMNI_', fieldMapLegacy())
  }

  return null
}
