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
  /** Legacy year column; used when residencyYear column is empty or unmapped */
  year: string
  /** Year in residency (preferred); falls back to `year` when blank in Airtable */
  residencyYear: string
  pronoun: string
  ethnicity: string
  nationality: string
  phone: string
  notes: string
  /** Primary website or portfolio URL */
  website: string
  /** Comma / multi-select topics, themes, or tags */
  topics: string
  /** Optional separate themes column; if empty, Memory Agent uses topics only */
  themes: string
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
  /** Public-facing bio for AI context; if empty, artifacts/notes are not used as bio substitute here */
  publicBio: string
  instagram: string
  location: string
  /** Single line or single select: public / internal / restricted (substring match, case insensitive) */
  visibilityLevel: string
  /** Checkbox: must be true for public Memory Agent mode when this column is mapped */
  approvedForPublicAi: string
  /** Checkbox: exclude row from any Memory Agent retrieval */
  doNotUseInAi: string
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
  residencyYear: 'Year in residency',
  pronoun: 'Pronoun',
  ethnicity: 'Ethnicity',
  nationality: 'Nationality',
  phone: 'Phone',
  notes: 'Notes',
  website: 'Website',
  topics: 'Topics',
  themes: '',
  medium: 'Medium',
  artifacts: 'Artifacts',
  digitalArtist: 'Digital artist',
  inCollection: 'In collection',
  videoArt: 'Video art',
  photo: 'Photo',
  /** Empty = do not read a separate column (use Name only) */
  artistName: '',
  publicBio: '',
  instagram: '',
  location: '',
  visibilityLevel: '',
  approvedForPublicAi: '',
  doNotUseInAi: '',
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
    residencyYear: pick('residencyYear'),
    pronoun: pick('pronoun'),
    ethnicity: pick('ethnicity'),
    nationality: pick('nationality'),
    phone: pick('phone'),
    notes: pick('notes'),
    website: pick('website'),
    topics: pick('topics'),
    themes: pick('themes'),
    medium: pick('medium'),
    artifacts: pick('artifacts'),
    digitalArtist: pick('digitalArtist'),
    inCollection: pick('inCollection'),
    videoArt: pick('videoArt'),
    photo: pick('photo'),
    artistName: pick('artistName'),
    publicBio: pick('publicBio'),
    instagram: pick('instagram'),
    location: pick('location'),
    visibilityLevel: pick('visibilityLevel'),
    approvedForPublicAi: pick('approvedForPublicAi'),
    doNotUseInAi: pick('doNotUseInAi'),
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
    residencyYear: pick('residencyYear'),
    pronoun: pick('pronoun'),
    ethnicity: pick('ethnicity'),
    nationality: pick('nationality'),
    phone: pick('phone'),
    notes: pick('notes'),
    website: pick('website'),
    topics: pick('topics'),
    themes: pick('themes'),
    medium: pick('medium'),
    artifacts: pick('artifacts'),
    digitalArtist: pick('digitalArtist'),
    inCollection: pick('inCollection'),
    videoArt: pick('videoArt'),
    photo: pick('photo'),
    artistName: pick('artistName'),
    publicBio: pick('publicBio'),
    instagram: pick('instagram'),
    location: pick('location'),
    visibilityLevel: pick('visibilityLevel'),
    approvedForPublicAi: pick('approvedForPublicAi'),
    doNotUseInAi: pick('doNotUseInAi'),
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

  /** Pilot: share Oolite alumni base until Soho House Airtable is provisioned */
  if (orgSlug.trim().toLowerCase() === 'sohohouse') {
    const oolitePrefix = 'AIRTABLE_OOLITE_ALUMNI_'
    const fromOolite = tryConnection(oolitePrefix, fieldMapForPrefix(oolitePrefix))
    if (fromOolite) return fromOolite
    return tryConnection('AIRTABLE_ALUMNI_', fieldMapLegacy())
  }

  return null
}
