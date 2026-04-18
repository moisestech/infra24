/**
 * Labels and option ids for the Digital Lab workshop catalog filters.
 * Option ids match `workshops.metadata` enums or `audienceTags` slugs.
 */

import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export const DIGITAL_LAB_TRACK_OPTIONS = [
  { id: 'presence', label: 'Presence' },
  { id: 'ai_literacy', label: 'AI Literacy' },
  { id: 'creative_coding', label: 'Creative Coding' },
  { id: 'systems_archive', label: 'Systems + Archive' },
] as const

export const DIGITAL_LAB_LEVEL_OPTIONS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'beginner_intermediate', label: 'Beginner–Intermediate' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced_experimental', label: 'Advanced / Experimental' },
] as const

export const DIGITAL_LAB_FORMAT_OPTIONS = [
  { id: 'one_day', label: 'One-day workshop' },
  { id: 'series', label: 'Series' },
  { id: 'talk_demo', label: 'Talk / Demo' },
  { id: 'clinic_lab', label: 'Clinic / Lab' },
] as const

export const DIGITAL_LAB_DURATION_OPTIONS = [
  { id: 'two_h', label: '2 hours' },
  { id: 'two_to_three_h', label: '2–3 hours' },
  { id: 'three_h', label: '3 hours' },
  { id: 'three_to_four_h', label: '3–4 hours' },
] as const

/** Stored in `metadata.audienceTags` */
export const DIGITAL_LAB_AUDIENCE_OPTIONS = [
  { id: 'artists', label: 'Artists' },
  { id: 'teaching_artists', label: 'Teaching artists' },
  { id: 'residents', label: 'Residents' },
  { id: 'educators', label: 'Educators' },
  { id: 'interdisciplinary_practitioners', label: 'Interdisciplinary practitioners' },
  { id: 'arts_organizations', label: 'Arts organizations' },
] as const

export const DIGITAL_LAB_STATUS_OPTIONS = [
  { id: 'website_ready', label: 'Website Ready' },
  { id: 'in_development', label: 'In Development' },
  { id: 'coming_soon', label: 'Coming Soon' },
] as const

export const DIGITAL_LAB_PACKET_STATUS_OPTIONS = [
  { id: 'strategy_defined', label: 'Strategy Defined' },
  { id: 'homepage_ready', label: 'Homepage Ready' },
  { id: 'syllabus_ready', label: 'Syllabus Ready' },
  { id: 'packet_in_progress', label: 'Packet in Progress' },
  { id: 'packet_ready', label: 'Packet Ready' },
  { id: 'lms_ready', label: 'LMS Ready' },
] as const

export const DIGITAL_LAB_WEBSITE_OPTIONS = [
  { id: 'ready', label: 'Website Ready' },
  { id: 'needs_build', label: 'Needs Website Build' },
] as const

export const DIGITAL_LAB_RESOURCES_OPTIONS = [
  { id: 'packet_available', label: 'Packet Available' },
  { id: 'packet_coming_soon', label: 'Packet Coming Soon' },
] as const

export type CatalogFilterGroupId =
  | 'track'
  | 'level'
  | 'format'
  | 'duration'
  | 'audience'
  | 'status'
  | 'packet_status'
  | 'website'
  | 'resources'

const OPTION_LISTS: Record<
  CatalogFilterGroupId,
  readonly { id: string; label: string }[]
> = {
  track: DIGITAL_LAB_TRACK_OPTIONS,
  level: DIGITAL_LAB_LEVEL_OPTIONS,
  format: DIGITAL_LAB_FORMAT_OPTIONS,
  duration: DIGITAL_LAB_DURATION_OPTIONS,
  audience: DIGITAL_LAB_AUDIENCE_OPTIONS,
  status: DIGITAL_LAB_STATUS_OPTIONS,
  packet_status: DIGITAL_LAB_PACKET_STATUS_OPTIONS,
  website: DIGITAL_LAB_WEBSITE_OPTIONS,
  resources: DIGITAL_LAB_RESOURCES_OPTIONS,
}

export function filterOptionLabel(
  group: CatalogFilterGroupId,
  id: string
): string {
  return OPTION_LISTS[group].find((o) => o.id === id)?.label ?? id
}

export const DIGITAL_LAB_FILTER_GROUPS: {
  id: CatalogFilterGroupId
  label: string
}[] = [
  { id: 'track', label: 'Track' },
  { id: 'level', label: 'Level' },
  { id: 'format', label: 'Format' },
  { id: 'duration', label: 'Duration' },
  { id: 'audience', label: 'Audience' },
  { id: 'status', label: 'Status' },
  { id: 'packet_status', label: 'Packet Status' },
  { id: 'website', label: 'Website' },
  { id: 'resources', label: 'Resources' },
]

export type CatalogSortMode =
  | 'featured'
  | 'alphabetical'
  | 'beginner_friendly'
  | 'duration_asc'
  | 'website_ready_first'

export const DIGITAL_LAB_SORT_OPTIONS: { id: CatalogSortMode; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'alphabetical', label: 'Alphabetical' },
  { id: 'beginner_friendly', label: 'Beginner Friendly' },
  { id: 'duration_asc', label: 'Duration: Short to Long' },
  { id: 'website_ready_first', label: 'Website Ready First' },
]

export function labelForTrack(id: string): string {
  return DIGITAL_LAB_TRACK_OPTIONS.find((o) => o.id === id)?.label ?? id
}

export function labelForPacketStatus(
  id: NonNullable<WorkshopMarketingMetadata['packetStatus']>
): string {
  return DIGITAL_LAB_PACKET_STATUS_OPTIONS.find((o) => o.id === id)?.label ?? id
}

/** Secondary badge on cards (subset of packet + resources) */
export function secondaryBadgeForView(
  packetStatus: WorkshopMarketingMetadata['packetStatus'],
  resourcesAvailability: WorkshopMarketingMetadata['resourcesAvailability']
): { label: string; variant: 'default' | 'secondary' | 'outline' } | null {
  if (resourcesAvailability === 'packet_coming_soon') {
    return { label: 'Packet Coming Soon', variant: 'outline' }
  }
  if (resourcesAvailability === 'packet_available') {
    return { label: 'Packet Available', variant: 'secondary' }
  }
  if (packetStatus === 'packet_ready' || packetStatus === 'lms_ready') {
    return { label: 'Packet Ready', variant: 'secondary' }
  }
  if (packetStatus === 'packet_in_progress') {
    return { label: 'Packet in Progress', variant: 'outline' }
  }
  return null
}
