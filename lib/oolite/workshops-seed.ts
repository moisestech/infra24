import type { OolitePeopleSeedRecord } from '@/lib/oolite/people-seed'
import {
  seedRecordToAirtableFields,
  type OoliteProgrammingSeedRecord,
} from '@/lib/oolite/programming-seed'
import { DEFAULT_PROGRAMMING_FIELD_MAP } from '@/lib/memory-agent/airtable-programming'

export type OoliteWorkshopSeedRecord = OoliteProgrammingSeedRecord & {
  /** Plain-text instructor name (also written to Instructor field). */
  instructorName?: string
  /** Explicit People record id; overrides name lookup for Artists link. */
  instructorPeopleId?: string
  /** Additional People record ids to merge into Programming.Artists. */
  artistRecordIds?: string[]
}

export type OoliteWorkshopsSeedFile = {
  organizationRecordId?: string
  /** Optional instructor People rows — upserted only when present. */
  instructors?: OolitePeopleSeedRecord[]
  workshops: OoliteWorkshopSeedRecord[]
}

export function workshopSeedToAirtableFields(
  row: OoliteWorkshopSeedRecord,
  organizationRecordId: string,
  artistIds?: string[]
): Record<string, unknown> {
  const fields = seedRecordToAirtableFields(
    {
      ...row,
      recordType: row.recordType || 'workshop',
      instructor: row.instructor ?? row.instructorName,
    },
    organizationRecordId
  )

  if (artistIds?.length) {
    fields[DEFAULT_PROGRAMMING_FIELD_MAP.artists] = artistIds
  }

  return fields
}

export function resolveWorkshopInstructorName(row: OoliteWorkshopSeedRecord): string | undefined {
  const name = row.instructorName ?? row.instructor
  return name?.trim() || undefined
}
