/**
 * Normalized retrieval record for Memory Agent (people + programming).
 * Sources stay federated; model context is unified.
 */

export type KnowledgeRecordSource =
  | 'airtable_alumni'
  | 'airtable_programming'
  | 'announcement'
  | 'workshop'
  | 'cms_story'
  | 'soho_record'

export type KnowledgeRecordKind =
  | 'person'
  | 'exhibition'
  | 'event'
  | 'workshop'
  | 'announcement'
  | 'residency'
  | 'tour'
  | 'opportunity'
  | 'screening'
  | 'house_story'
  | 'bookable_event'
  | 'editorial_story'
  | 'space'
  | 'member_route'
  | 'partner'

export type ProgrammingRecordStatus =
  | 'draft'
  | 'coming_soon'
  | 'on_view'
  | 'published'
  | 'canceled'
  | 'archived'

export type ProgrammingRecordVisibility = 'public' | 'internal' | 'members_only'

export type KnowledgeRecordVisibility = 'public' | 'internal' | 'both'

export type KnowledgeRecordEventState = 'scheduled' | 'postponed' | 'canceled'

export type KnowledgeRecordBookingCta = {
  label: string
  url: string
  /** True only when URL is present on the source row */
  grounded: boolean
}

/** Unified shape for retrieval + LLM context (not necessarily API response cards yet). */
export type KnowledgeRecord = {
  id: string
  orgSlug: string
  source: KnowledgeRecordSource
  recordKind: KnowledgeRecordKind
  title: string
  summary?: string
  description?: string
  startsAt?: string
  endsAt?: string
  publishedAt?: string
  expiresAt?: string
  eventState?: KnowledgeRecordEventState
  visibility: KnowledgeRecordVisibility
  approvedForPublicAi?: boolean
  doNotUseInAi?: boolean
  tags?: string[]
  topics?: string[]
  location?: string
  primaryLink?: string
  rsvpUrl?: string
  bookingCta?: KnowledgeRecordBookingCta
  /** Hero / card image from source record when available */
  imageUrl?: string
  /** Airtable Programming editorial status */
  status?: ProgrammingRecordStatus
  /** Airtable Programming visibility (distinct from legacy visibility) */
  programmingVisibility?: ProgrammingRecordVisibility
  /** Exhibition / program curator when present on source row */
  curator?: string
  /** Semicolon- or newline-separated artist names from source row */
  featuredArtists?: string
  /** Workshop instructor when present on source row */
  instructor?: string
  timeText?: string
  durationText?: string
  costText?: string
  capacity?: number
  ageRequirement?: string
  language?: string
  contactName?: string
  contactEmail?: string
  /** Street address when separate from location name */
  address?: string
  /** Retrieval boost from Airtable Priority field */
  priority?: number
  /** May appear on smart-sign drafts when true */
  smartSignEligible?: boolean
  /** Org-relative public detail page when known */
  publicPath?: string
  relatedPeopleIds?: string[]
  /** Linked People record ids — exhibiting artists */
  artistRecordIds?: string[]
  artistNames?: string[]
  curatorRecordIds?: string[]
  curatorNames?: string[]
  programStaffRecordIds?: string[]
  programStaffNames?: string[]
  relatedEventIds?: string[]
  sourceUrl?: string
  sourceTable?: string
  sourceRecordId: string
}

export type MemoryIntent =
  | 'people'
  | 'programming'
  | 'recognition'
  | 'mixed'
  | 'time_bound'
  | 'recommendation'
  | 'latest'
  | 'upcoming'
  | 'data_gap'
