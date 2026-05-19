/**
 * Soho House knowledge domain — concepts the Memory Agent must understand.
 * Used for prompts, Airtable field design, and future retrieval (people + events + stories).
 *
 * Sources today: public House 10 round-ups, News verticals, membership product lines.
 * Not wired to live CMS yet — defines the ontology for ingestion and ask grounding.
 */

/** Product / membership lines under the Soho House & Co umbrella */
export const SOHO_BRANDS = [
  'soho_house',
  'cities_without_houses',
  'soho_friends',
  'soho_works',
] as const

export type SohoBrand = (typeof SOHO_BRANDS)[number]

export const SOHO_BRAND_LABELS: Record<SohoBrand, string> = {
  soho_house: 'Soho House',
  cities_without_houses: 'Cities Without Houses',
  soho_friends: 'Soho Friends',
  soho_works: 'Soho Works',
}

/** Physical or virtual place hierarchy */
export const SOHO_PLACE_KINDS = [
  'house', // numbered club e.g. House 10, Ludlow House
  'beach_house',
  'pool_house',
  'farmhouse',
  'mews_house',
  'warehouse',
  'works_location',
  'health_club',
  'pop_up', // Hideout at Coachella, House 44 at F1, etc.
  'retreat_destination',
] as const

export type SohoPlaceKind = (typeof SOHO_PLACE_KINDS)[number]

/** Recurring programming formats (from editorial + House 10 listings) */
export const SOHO_PROGRAM_FORMATS = [
  'house_nights',
  'house_party',
  'house_10_roundup', // weekly “essential things to book”
  'book_club',
  'wine_club',
  'art_club',
  'foodie_club',
  'fit_friday',
  'screening',
  'festival', // Soho House Festival, Soho Summit, Sohopalooza, etc.
  'retreat', // Soho Retreat
  'takeover', // restaurant / brand residency
  'members_run', // member-organised dinner, etc.
  'panel',
  'performance',
  'wellness',
  'mentorship',
  'foundation_grant',
] as const

export type SohoProgramFormat = (typeof SOHO_PROGRAM_FORMATS)[number]

/**
 * Bookable occurrence vs editorial story.
 * Agent must not treat a news article as a ticketed event with a date unless grounded.
 */
export const SOHO_RECORD_KINDS = [
  'bookable_event', // dated, venue, waitlist / tickets CTA
  'programme_announcement', // festival lineup, season calendar
  'house_story', // recap or preview article
  'member_profile',
  'place_guide', // neighbourhood / travel
  'menu_or_f_b', // food & drink editorial
  'benefit_or_membership', // Every House benefits, app hub
] as const

export type SohoRecordKind = (typeof SOHO_RECORD_KINDS)[number]

/** news.sohohouse.com verticals */
export const SOHO_NEWS_VERTICALS = [
  'latest',
  'art_and_design',
  'events',
  'fashion',
  'film_and_entertainment',
  'food_and_drink',
  'house_tips',
  'music',
  'soho_health_club',
  'travel',
  'work',
] as const

export type SohoNewsVertical = (typeof SOHO_NEWS_VERTICALS)[number]

/** Normalized record for retrieval (people, events, stories share shape) */
export type SohoKnowledgeRecord = {
  id: string
  source: 'airtable' | 'supabase' | 'cms_sync'
  recordKind: SohoRecordKind
  title: string
  summary?: string
  /** ISO date or range when known */
  startsAt?: string
  endsAt?: string
  locationLabel?: string
  placeName?: string
  placeKind?: SohoPlaceKind
  city?: string
  brand?: SohoBrand
  programFormat?: SohoProgramFormat
  newsVertical?: SohoNewsVertical
  tags?: string[]
  bookingCta?: 'tickets' | 'waitlist' | 'bedrooms' | 'none'
  externalUrl?: string
  approvedForPublicAi?: boolean
  doNotUseInAi?: boolean
}

/** Compact domain primer for system prompts (keep in sync with this file) */
export function sohoHouseDomainPrimer(): string {
  return [
    'DOMAIN — Soho House & Co:',
    '- Brands: Soho House (members’ clubs), Cities Without Houses (CWH, city programming without a House), Soho Friends, Soho Works (coworking).',
    '- Places: Houses (often numbered, e.g. House 10 at Soho Beach House Miami), Beach/Pool/Farm/Mews Houses, Works sites, Health Clubs, seasonal pop-ups.',
    '- Bookable events: dated listings with titles, venues (bar, beach, Snug), and CTAs (Book tickets / Join waitlist).',
    '- Editorial: News stories (Art, Events, Film, Food, Music, Travel, Work, etc.) — may describe past highlights or future seasons; do not invent dates from headlines alone.',
    '- Formats: House Nights, House Parties, clubs (Wine/Art/Book/Foodie), festivals (Soho House Festival, Summit, Fete), retreats, screenings, takeovers, member-run dinners.',
    'Answer people questions from Member/Creator records; programming questions from Event records; brand questions only when Brand field matches.',
  ].join('\n')
}
