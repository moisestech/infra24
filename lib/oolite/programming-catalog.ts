/**
 * Canonical Airtable Programming options for Oolite.
 * Use for import seeds, Meta API setup script, and documentation.
 */

/** Record Type single-select values (stored as lowercase snake_case in seeds). */
export const OOLITE_PROGRAMMING_RECORD_TYPES = [
  'exhibition',
  'upcoming_exhibition',
  'event',
  'workshop',
  'artist_talk',
  'screening',
  'open_studio',
  'residency',
  'residency_event',
  'tour',
  'announcement',
  'public_announcement',
  'application_deadline',
  'bookable_event',
  'editorial_story',
  'space',
] as const

export const OOLITE_PROGRAMMING_STATUSES = [
  'draft',
  'coming_soon',
  'on_view',
  'published',
  'canceled',
  'archived',
] as const

export const OOLITE_PROGRAMMING_VISIBILITY = ['public', 'internal', 'members_only'] as const

/** Tags multiple-select — create these options in Airtable before import. */
export const OOLITE_PROGRAMMING_TAGS = [
  'exhibition',
  'upcoming exhibition',
  'workshop',
  'artist talk',
  'screening',
  'open studio',
  'residency',
  'residency event',
  'application deadline',
  'public announcement',
  'youth residents',
  'resident artists',
  'identity',
  'selfhood',
  'creative practice',
  'contemporary theory',
  'vitrine',
  'education',
  'little haiti',
  'smart sign',
  'opportunity',
] as const

/** Human labels for Airtable UI (Title Case) when options use friendly names. */
export function airtableChoiceLabel(value: string): string {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function allOoliteProgrammingTagChoices(): string[] {
  return [...OOLITE_PROGRAMMING_TAGS]
}

export function allOoliteProgrammingRecordTypeChoices(): string[] {
  return OOLITE_PROGRAMMING_RECORD_TYPES.map(airtableChoiceLabel)
}

export function allOoliteProgrammingStatusChoices(): string[] {
  return OOLITE_PROGRAMMING_STATUSES.map(airtableChoiceLabel)
}
