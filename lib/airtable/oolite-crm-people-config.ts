/**
 * Oolite CRM People table (same base as Programming).
 * Artists, instructors, curators live here — not a separate Artists table.
 */

import { isAirtableConnectionConfigured } from '@/lib/airtable/client'
import { getProgrammingConnectionForOrg } from '@/lib/airtable/programming-config'

export type CrmPeopleFieldMap = {
  name: string
  titleRole: string
  department: string
  institution: string
  city: string
  bio: string
  website: string
  pronouns: string
  primaryImageUrl: string
  portfolioImageUrls: string
  practiceTags: string
  publicAiApproved: string
  doNotUseInAi: string
  programming: string
  instagram: string
}

export type OoliteCrmPeopleConnection = {
  apiKey: string
  baseId: string
  tableId: string
  viewId?: string
  orgRecordId?: string
  orgName?: string
  fieldMap: CrmPeopleFieldMap
}

const DEFAULT_FIELDS: CrmPeopleFieldMap = {
  name: 'Full Name',
  titleRole: 'Title / Role',
  department: 'Department',
  institution: 'Institution',
  city: 'City',
  bio: 'Bio',
  website: 'Website',
  pronouns: 'Pronouns',
  primaryImageUrl: 'Image / Portrait URL',
  portfolioImageUrls: 'Portfolio Image URLs',
  practiceTags: 'Practice Tags',
  publicAiApproved: 'Public AI Approved',
  doNotUseInAi: 'Do Not Use In AI',
  programming: 'Programming',
  instagram: 'Instagram',
}

function readEnv(key: string): string | undefined {
  const v = process.env[key]
  return v?.trim() || undefined
}

function buildFieldMap(prefix: string): CrmPeopleFieldMap {
  const pick = (suffix: keyof CrmPeopleFieldMap) =>
    readEnv(`${prefix}FIELD_${suffix.toUpperCase()}`) || DEFAULT_FIELDS[suffix]
  return {
    name: pick('name'),
    titleRole: pick('titleRole'),
    department: pick('department'),
    institution: pick('institution'),
    city: pick('city'),
    bio: pick('bio'),
    website: pick('website'),
    pronouns: pick('pronouns'),
    primaryImageUrl: pick('primaryImageUrl'),
    portfolioImageUrls: pick('portfolioImageUrls'),
    practiceTags: pick('practiceTags'),
    publicAiApproved: pick('publicAiApproved'),
    doNotUseInAi: pick('doNotUseInAi'),
    programming: pick('programming'),
    instagram: pick('instagram'),
  }
}

export function getOoliteCrmPeopleConnection(orgSlug: string): OoliteCrmPeopleConnection | null {
  const slug = orgSlug.trim().toLowerCase()
  if (slug !== 'oolite') return null

  const programming = getProgrammingConnectionForOrg(slug)
  if (!programming) return null

  const tableId = readEnv('AIRTABLE_OOLITE_PEOPLE_TABLE_ID')
  if (!tableId) return null

  if (!isAirtableConnectionConfigured({ apiKey: programming.apiKey, baseId: programming.baseId, tableId })) {
    return null
  }

  return {
    apiKey: programming.apiKey,
    baseId: programming.baseId,
    tableId,
    viewId: readEnv('AIRTABLE_OOLITE_PEOPLE_VIEW_ID'),
    orgRecordId: programming.orgRecordId,
    orgName: programming.orgName,
    fieldMap: buildFieldMap('AIRTABLE_OOLITE_PEOPLE_'),
  }
}

export function isOoliteCrmPeopleConfigured(orgSlug: string): boolean {
  return getOoliteCrmPeopleConnection(orgSlug) != null
}
