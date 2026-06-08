/**
 * Per-org Airtable Programming connection from env.
 * Pattern: AIRTABLE_{ORG}_PROGRAMMING_* (org token = slug uppercased, hyphens → underscores).
 * Legacy: for org `oolite` only, falls back to flat AIRTABLE_PROGRAMMING_* if prefixed vars are absent.
 */

import { isAirtableConnectionConfigured } from '@/lib/airtable/client'

export type ProgrammingFieldMap = {
  title: string
  organization: string
  recordType: string
  status: string
  visibility: string
  startDate: string
  endDate: string
  locationName: string
  address: string
  summary: string
  description: string
  curator: string
  featuredArtists: string
  imageUrl: string
  publicUrl: string
  rsvpUrl: string
  bookable: string
  smartSignEligible: string
  publicAiApproved: string
  priority: string
  tags: string
  sourceNotes: string
  doNotUseInAi: string
  instructor: string
  timeText: string
  durationText: string
  costText: string
  capacity: string
  ageRequirement: string
  language: string
  contactName: string
  contactEmail: string
  artists: string
  curators: string
  programStaff: string
}

export type OrgProgrammingConnection = {
  apiKey: string
  baseId: string
  tableId: string
  viewId?: string
  /** Linked Organization record id for filterByFormula */
  orgRecordId?: string
  /** Fallback org label match when orgRecordId is unset */
  orgName?: string
  fieldMap: ProgrammingFieldMap
}

const DEFAULT_FIELDS: ProgrammingFieldMap = {
  title: 'Title',
  organization: 'Organization',
  recordType: 'Record Type',
  status: 'Status',
  visibility: 'Visibility',
  startDate: 'Start Date',
  endDate: 'End Date',
  locationName: 'Location Name',
  address: 'Address',
  summary: 'Summary',
  description: 'Description',
  curator: 'Curator',
  featuredArtists: 'Featured Artists',
  imageUrl: 'Image URL',
  publicUrl: 'Public URL',
  rsvpUrl: 'RSVP URL',
  bookable: 'Bookable',
  smartSignEligible: 'Smart Sign Eligible',
  publicAiApproved: 'Public AI Approved',
  priority: 'Priority',
  tags: 'Tags',
  sourceNotes: 'Source Notes',
  doNotUseInAi: 'Do Not Use In AI',
  instructor: 'Instructor',
  timeText: 'Time Text',
  durationText: 'Duration Text',
  costText: 'Cost Text',
  capacity: 'Capacity',
  ageRequirement: 'Age Requirement',
  language: 'Language',
  contactName: 'Contact Name',
  contactEmail: 'Contact Email',
  artists: 'Artists',
  curators: 'Curators',
  programStaff: 'Program Staff',
}

function readEnv(key: string): string | undefined {
  const v = process.env[key]
  return v?.trim() || undefined
}

function buildFieldMap(envPrefix: string): ProgrammingFieldMap {
  const pick = (suffix: keyof ProgrammingFieldMap) =>
    readEnv(`${envPrefix}FIELD_${suffix.toUpperCase()}`) || DEFAULT_FIELDS[suffix]
  return {
    title: pick('title'),
    organization: pick('organization'),
    recordType: pick('recordType'),
    status: pick('status'),
    visibility: pick('visibility'),
    startDate: pick('startDate'),
    endDate: pick('endDate'),
    locationName: pick('locationName'),
    address: pick('address'),
    summary: pick('summary'),
    description: pick('description'),
    curator: pick('curator'),
    featuredArtists: pick('featuredArtists'),
    imageUrl: pick('imageUrl'),
    publicUrl: pick('publicUrl'),
    rsvpUrl: pick('rsvpUrl'),
    bookable: pick('bookable'),
    smartSignEligible: pick('smartSignEligible'),
    publicAiApproved: pick('publicAiApproved'),
    priority: pick('priority'),
    tags: pick('tags'),
    sourceNotes: pick('sourceNotes'),
    doNotUseInAi: pick('doNotUseInAi'),
    instructor: pick('instructor'),
    timeText: pick('timeText'),
    durationText: pick('durationText'),
    costText: pick('costText'),
    capacity: pick('capacity'),
    ageRequirement: pick('ageRequirement'),
    language: pick('language'),
    contactName: pick('contactName'),
    contactEmail: pick('contactEmail'),
    artists: pick('artists'),
    curators: pick('curators'),
    programStaff: pick('programStaff'),
  }
}

function resolveProgrammingBaseId(prefix: string, orgSlug: string): string | undefined {
  const fromPrefix = readEnv(`${prefix}BASE_ID`)
  if (fromPrefix) return fromPrefix

  const token = orgSlug.trim().toLowerCase().replace(/-/g, '_').replace(/[^a-z0-9_]/g, '').toUpperCase()
  const fromAlumni = readEnv(`AIRTABLE_${token}_ALUMNI_BASE_ID`)
  if (fromAlumni) return fromAlumni

  return readEnv('AIRTABLE_BASE_ID')
}

function resolveProgrammingApiKey(prefix: string, orgSlug: string): string | undefined {
  const fromPrefix = readEnv(`${prefix}API_KEY`)
  if (fromPrefix) return fromPrefix

  const token = orgSlugToProgrammingEnvToken(orgSlug)
  if (token) {
    const fromOrgAlumni = readEnv(`AIRTABLE_${token}_ALUMNI_API_KEY`)
    if (fromOrgAlumni) return fromOrgAlumni
  }

  return readEnv('AIRTABLE_ALUMNI_API_KEY') || readEnv('AIRTABLE_API_KEY')
}

function tryConnection(prefix: string, orgSlug: string): OrgProgrammingConnection | null {
  const baseId = resolveProgrammingBaseId(prefix, orgSlug)
  const tableId = readEnv(`${prefix}TABLE_ID`)
  const apiKey = resolveProgrammingApiKey(prefix, orgSlug)

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId })) {
    return null
  }

  return {
    apiKey: apiKey!,
    baseId: baseId!,
    tableId: tableId!,
    viewId: readEnv(`${prefix}VIEW_ID`),
    orgRecordId: readEnv(`${prefix}ORG_RECORD_ID`),
    orgName: readEnv(`${prefix}ORG_NAME`),
    fieldMap: buildFieldMap(prefix),
  }
}

/** Slug `oolite` → `OOLITE`, `mad-arts` → `MAD_ARTS` */
export function orgSlugToProgrammingEnvToken(orgSlug: string): string | null {
  const raw = orgSlug.trim().toLowerCase().replace(/-/g, '_')
  const safe = raw.replace(/[^a-z0-9_]/g, '')
  if (!safe) return null
  return safe.toUpperCase()
}

export function getProgrammingConnectionForOrg(orgSlug: string): OrgProgrammingConnection | null {
  const slug = orgSlug.trim().toLowerCase()
  const token = orgSlugToProgrammingEnvToken(orgSlug)
  if (!token) return null

  const orgPrefix = `AIRTABLE_${token}_PROGRAMMING_`
  const fromOrg = tryConnection(orgPrefix, slug)
  if (fromOrg) return fromOrg

  if (slug === 'oolite') {
    return tryConnection('AIRTABLE_PROGRAMMING_', slug)
  }

  return null
}

export function isAirtableProgrammingConfigured(orgSlug: string): boolean {
  return getProgrammingConnectionForOrg(orgSlug) != null
}
