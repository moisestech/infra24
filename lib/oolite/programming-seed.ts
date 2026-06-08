import { DEFAULT_PROGRAMMING_FIELD_MAP } from '@/lib/memory-agent/airtable-programming'

export type OoliteProgrammingSeedRecord = {
  title: string
  recordType: string
  status?: string
  visibility?: string
  startDate?: string
  endDate?: string
  locationName?: string
  address?: string
  summary?: string
  description?: string
  curator?: string
  featuredArtists?: string
  imageUrl?: string
  publicUrl?: string
  rsvpUrl?: string
  bookable?: boolean
  smartSignEligible?: boolean
  publicAiApproved?: boolean
  priority?: number
  tags?: string[]
  sourceNotes?: string
  doNotUseInAi?: boolean
  instructor?: string
  timeText?: string
  durationText?: string
  costText?: string
  capacity?: number
  ageRequirement?: string
  language?: string
  contactName?: string
  contactEmail?: string
}

export function seedRecordToAirtableFields(
  row: OoliteProgrammingSeedRecord,
  organizationRecordId: string
): Record<string, unknown> {
  const f = DEFAULT_PROGRAMMING_FIELD_MAP
  const fields: Record<string, unknown> = {
    [f.title]: row.title,
    [f.organization]: [organizationRecordId],
    [f.recordType]: row.recordType,
  }

  if (row.status) fields[f.status] = row.status
  if (row.visibility) fields[f.visibility] = row.visibility
  if (row.startDate) fields[f.startDate] = row.startDate
  if (row.endDate) fields[f.endDate] = row.endDate
  if (row.locationName) fields[f.locationName] = row.locationName
  if (row.address) fields[f.address] = row.address
  if (row.summary) fields[f.summary] = row.summary
  if (row.description) fields[f.description] = row.description
  if (row.curator) fields[f.curator] = row.curator
  if (row.featuredArtists) fields[f.featuredArtists] = row.featuredArtists
  if (row.imageUrl) fields[f.imageUrl] = row.imageUrl
  if (row.publicUrl) fields[f.publicUrl] = row.publicUrl
  if (row.rsvpUrl) fields[f.rsvpUrl] = row.rsvpUrl
  if (row.bookable != null) fields[f.bookable] = row.bookable
  if (row.smartSignEligible != null) fields[f.smartSignEligible] = row.smartSignEligible
  if (row.publicAiApproved != null) fields[f.publicAiApproved] = row.publicAiApproved
  if (row.priority != null) fields[f.priority] = row.priority
  if (row.tags?.length) fields[f.tags] = row.tags
  if (row.sourceNotes) fields[f.sourceNotes] = row.sourceNotes
  if (row.doNotUseInAi != null) fields[f.doNotUseInAi] = row.doNotUseInAi
  if (row.instructor) fields[f.instructor] = row.instructor
  if (row.timeText) fields[f.timeText] = row.timeText
  if (row.durationText) fields[f.durationText] = row.durationText
  if (row.costText) fields[f.costText] = row.costText
  if (row.capacity != null) fields[f.capacity] = row.capacity
  if (row.ageRequirement) fields[f.ageRequirement] = row.ageRequirement
  if (row.language) fields[f.language] = row.language
  if (row.contactName) fields[f.contactName] = row.contactName
  if (row.contactEmail) fields[f.contactEmail] = row.contactEmail

  return fields
}
