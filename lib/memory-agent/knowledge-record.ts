/**
 * Normalized retrieval record for Memory Agent (people + programming).
 * Sources stay federated; model context is unified.
 */

export type KnowledgeRecordSource =
  | 'airtable_alumni'
  | 'announcement'
  | 'workshop'
  | 'cms_story'
  | 'soho_record'

export type KnowledgeRecordKind =
  | 'person'
  | 'exhibition'
  | 'event'
  | 'workshop'
  | 'opportunity'
  | 'screening'
  | 'house_story'
  | 'bookable_event'
  | 'editorial_story'
  | 'space'
  | 'member_route'
  | 'partner'

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
  /** Org-relative public detail page when known */
  publicPath?: string
  relatedPeopleIds?: string[]
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
