import type { CrmPeopleFieldMap } from '@/lib/airtable/oolite-crm-people-config'
import { DEFAULT_CRM_PEOPLE_FIELD_MAP } from '@/lib/oolite/people-field-map'

export type OolitePeopleSeedRecord = {
  recordId?: string
  fullName: string
  titleRole?: string
  department?: string
  city?: string
  website?: string
  instagram?: string
  pronouns?: string
  bio?: string
  primaryImageUrl?: string
  portfolioImageUrls?: string[]
  practiceTags?: string[]
  publicAiApproved?: boolean
  programmingRecordIds?: string[]
  institutionRecordIds?: string[]
  /** When institution is not a linked Oolite org record (e.g. external curator). */
  skipInstitutionLink?: boolean
}

export function seedPersonToAirtableFields(
  row: OolitePeopleSeedRecord,
  organizationRecordId: string,
  fieldMap: CrmPeopleFieldMap = DEFAULT_CRM_PEOPLE_FIELD_MAP
): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    [fieldMap.name]: row.fullName,
  }

  if (!row.skipInstitutionLink) {
    fields[fieldMap.institution] = row.institutionRecordIds?.length
      ? row.institutionRecordIds
      : [organizationRecordId]
  }

  if (row.titleRole) fields[fieldMap.titleRole] = row.titleRole
  if (row.department) fields[fieldMap.department] = row.department
  if (row.city) fields[fieldMap.city] = row.city
  if (row.website) fields[fieldMap.website] = row.website
  if (row.pronouns) fields[fieldMap.pronouns] = row.pronouns
  if (row.bio) fields[fieldMap.bio] = row.bio
  if (row.primaryImageUrl) fields[fieldMap.primaryImageUrl] = row.primaryImageUrl
  if (row.portfolioImageUrls?.length) {
    fields[fieldMap.portfolioImageUrls] = row.portfolioImageUrls.join('\n')
  }
  if (row.practiceTags?.length) fields[fieldMap.practiceTags] = row.practiceTags
  if (row.publicAiApproved != null) fields[fieldMap.publicAiApproved] = row.publicAiApproved
  if (row.instagram) fields[fieldMap.instagram] = row.instagram
  if (row.programmingRecordIds?.length) fields[fieldMap.programming] = row.programmingRecordIds

  return fields
}

export function normalizePeopleName(name: string): string {
  return name.trim().toLowerCase()
}
