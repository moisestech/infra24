/**
 * Bespoke Soho House demo programming for Member Signal Agent pitch.
 * Not live CMS data — mapped through KnowledgeRecord → event cards → outputs/signage.
 */

import type {
  KnowledgeRecord,
  KnowledgeRecordKind,
} from '@/lib/memory-agent/knowledge-record'
import type { MemoryAgentMode } from '@/types/memory-agent'

export const SOHO_DEMO_ORG_SLUG = 'sohohouse'

export function isSohoDemoOrg(orgSlug: string): boolean {
  return orgSlug.trim().toLowerCase() === SOHO_DEMO_ORG_SLUG
}

/** Relative schedule anchor for demo dates that stay fresh each week. */
export type SohoDemoSchedule =
  | 'tonight'
  | 'tomorrow'
  | 'week_tue'
  | 'week_wed'
  | 'week_thu'
  | 'week_fri'
  | 'week_sat'
  | 'week_sun'
  | 'ongoing'

export type SohoDemoSeedRecord = {
  id: string
  recordKind: KnowledgeRecordKind
  title: string
  summary: string
  location?: string
  tags?: string[]
  schedule?: SohoDemoSchedule
  /** Grounded booking link — only for bookable_event */
  bookingUrl?: string
  bookingLabel?: string
  imageUrl?: string
}

const ORG_TZ = 'America/New_York'

function startOfWeekLocal(now: Date): Date {
  const d = new Date(now.toLocaleString('en-US', { timeZone: ORG_TZ }))
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function scheduleToIso(
  schedule: SohoDemoSchedule | undefined,
  now: Date
): { startsAt?: string; endsAt?: string } {
  if (!schedule) return {}

  if (schedule === 'ongoing') {
    const weekStart = startOfWeekLocal(now)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    weekEnd.setMilliseconds(-1)
    return { startsAt: weekStart.toISOString(), endsAt: weekEnd.toISOString() }
  }

  const weekStart = startOfWeekLocal(now)
  const base = new Date(weekStart)

  const dayOffset: Partial<Record<SohoDemoSchedule, number>> = {
    week_tue: 1,
    week_wed: 2,
    week_thu: 3,
    week_fri: 4,
    week_sat: 5,
    week_sun: 6,
  }

  if (schedule === 'tonight') {
    const start = new Date(now)
    start.setHours(19, 0, 0, 0)
    if (start.getTime() < now.getTime()) start.setHours(21, 30, 0, 0)
    const end = new Date(start)
    end.setHours(start.getHours() + 2)
    return { startsAt: start.toISOString(), endsAt: end.toISOString() }
  }

  if (schedule === 'tomorrow') {
    const start = new Date(now)
    start.setDate(start.getDate() + 1)
    start.setHours(8, 30, 0, 0)
    const end = new Date(start)
    end.setHours(10, 0, 0, 0)
    return { startsAt: start.toISOString(), endsAt: end.toISOString() }
  }

  const offset = dayOffset[schedule]
  if (offset == null) return {}
  base.setDate(base.getDate() + offset)

  const hour =
    schedule === 'week_sat' || schedule === 'week_fri'
      ? 20
      : schedule === 'week_sun'
        ? 11
        : 18
  base.setHours(hour, 0, 0, 0)
  const end = new Date(base)
  end.setHours(base.getHours() + (schedule === 'week_sun' ? 2 : 3))
  return { startsAt: base.toISOString(), endsAt: end.toISOString() }
}

/** Static seed — dates resolved at load time. */
export const SOHO_DEMO_SEED_RECORDS: SohoDemoSeedRecord[] = [
  {
    id: 'film-screening-lost-highway',
    recordKind: 'bookable_event',
    title: 'Members\' Screening: Lost Highway',
    summary:
      '35mm screening in the House screening room with a short intro from our film programmer. Limited seats — members only.',
    location: 'Screening room, Soho Beach House Miami',
    tags: ['film', 'screening', 'members'],
    schedule: 'week_thu',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'Join waitlist',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ocho-rooftop-social',
    recordKind: 'bookable_event',
    title: 'Ocho Rooftop Social',
    summary:
      'Sunset cocktails and DJ set on Ocho rooftop. Casual dress; arrive early for skyline views.',
    location: 'Ocho rooftop, Soho Beach House Miami',
    tags: ['rooftop', 'social', 'music'],
    schedule: 'week_fri',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'RSVP',
    imageUrl:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'terrace-wellness-flow',
    recordKind: 'bookable_event',
    title: 'Terrace Wellness Flow',
    summary:
      'Morning movement session on the terrace with House trainer. Mats provided; all levels welcome.',
    location: 'Terrace, Soho Beach House Miami',
    tags: ['wellness', 'fitness', 'members'],
    schedule: 'tomorrow',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'Register',
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cowshed-evening-ritual',
    recordKind: 'bookable_event',
    title: 'Cowshed Evening Ritual',
    summary:
      'Guided wind-down session at Cowshed Spa — breathwork and restorative stretch before the weekend.',
    location: 'Cowshed Spa, Soho Beach House Miami',
    tags: ['wellness', 'spa', 'cowshed'],
    schedule: 'week_wed',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'Book treatment',
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cecconis-members-dinner',
    recordKind: 'bookable_event',
    title: 'Cecconi\'s Members\' Dinner',
    summary:
      'Seasonal Italian menu with a guest chef. Tables are limited; dietary notes welcome at booking.',
    location: 'Cecconi\'s, ground floor',
    tags: ['dining', 'cecconis', 'members'],
    schedule: 'week_tue',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'Reserve',
    imageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'new-member-first-week',
    recordKind: 'member_route',
    title: 'New Member First Week Route',
    summary:
      'Day 1: House tour + Cecconi\'s lunch. Day 2: Cowshed intro. Day 3: Screening room open house. Day 4: Ocho sunset. Day 5: Creative community breakfast.',
    location: 'Soho Beach House Miami',
    tags: ['new member', 'route', 'onboarding'],
    schedule: 'ongoing',
    imageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'quiet-evening-route',
    recordKind: 'member_route',
    title: 'Quiet Evening Route',
    summary:
      'For a low-key night: Library lounge → light bite at Cecconi\'s bar → terrace walk → early screening or vinyl in the Snug.',
    location: 'House 10, Soho Beach House Miami',
    tags: ['route', 'quiet', 'evening'],
    schedule: 'tonight',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-week-miami-route',
    recordKind: 'member_route',
    title: 'Art Week Miami Route',
    summary:
      'House breakfast → partner gallery walk → rooftop pause at Ocho → members\' panel in the screening room → late dinner at Cecconi\'s.',
    location: 'Miami Beach + House programming',
    tags: ['route', 'art week', 'culture'],
    schedule: 'week_sat',
    imageUrl:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdfbad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pool-beach-day-to-night',
    recordKind: 'member_route',
    title: 'Pool & Beach Day-to-Night',
    summary:
      'Morning pool → beach cabanas → light lunch → Cowshed reset → sunset on Ocho → vinyl set in the bar.',
    location: 'Beach + pool, Soho Beach House Miami',
    tags: ['route', 'pool', 'beach'],
    schedule: 'week_sun',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'house-foundations-mentorship',
    recordKind: 'editorial_story',
    title: 'House Foundations Mentorship',
    summary:
      'Editorial feature on members mentoring emerging creatives through House Foundations — stories, not a ticketed event.',
    location: 'Soho House global',
    tags: ['editorial', 'mentorship', 'community'],
    schedule: 'ongoing',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-deco-cuban-heritage',
    recordKind: 'house_story',
    title: 'Art Deco & Cuban Heritage Design Story',
    summary:
      'How the House draws on Miami Beach Art Deco lines and Cuban craft references in furniture, tile, and public rooms.',
    location: 'Soho Beach House Miami',
    tags: ['design', 'heritage', 'house story'],
    schedule: 'ongoing',
    imageUrl:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'space-ocho-rooftop',
    recordKind: 'space',
    title: 'Ocho Rooftop',
    summary:
      'Open-air rooftop bar with Atlantic views — best at sunset; members and guests with reservations.',
    location: 'Top floor, Soho Beach House Miami',
    tags: ['space', 'rooftop', 'bar'],
    schedule: 'ongoing',
    imageUrl:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'space-screening-room',
    recordKind: 'space',
    title: 'Screening Room',
    summary:
      'Intimate cinema for members\' screenings, panels, and festival previews. Check House programming for dated events.',
    location: 'Soho Beach House Miami',
    tags: ['space', 'screening', 'film'],
    schedule: 'ongoing',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'creative-community-breakfast',
    recordKind: 'bookable_event',
    title: 'Creative Community Breakfast',
    summary:
      'Informal breakfast for members working in film, design, and hospitality — hosted by Member Relations.',
    location: 'Cecconi\'s private dining room',
    tags: ['breakfast', 'community', 'networking'],
    schedule: 'week_tue',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'RSVP',
    imageUrl:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tonight-house-vinyl',
    recordKind: 'bookable_event',
    title: 'Tonight: House Vinyl Session',
    summary:
      'Resident selector in the Snug — soul, disco, and Balearic sets. Walk-ins welcome if capacity allows.',
    location: 'The Snug, Soho Beach House Miami',
    tags: ['music', 'tonight', 'members'],
    schedule: 'tonight',
    bookingUrl: 'https://www.sohohouse.com/',
    bookingLabel: 'Join waitlist',
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  },
]

export function mapSohoDemoSeedToKnowledgeRecord(
  seed: SohoDemoSeedRecord,
  orgSlug: string,
  now: Date = new Date()
): KnowledgeRecord {
  const { startsAt, endsAt } = scheduleToIso(seed.schedule, now)
  const bookable = seed.recordKind === 'bookable_event'
  const bookingUrl = bookable ? seed.bookingUrl?.trim() : undefined

  return {
    id: `soho_record:${seed.id}`,
    orgSlug,
    source: 'soho_record',
    recordKind: seed.recordKind,
    title: seed.title,
    summary: seed.summary,
    description: seed.summary,
    startsAt,
    endsAt,
    publishedAt: now.toISOString(),
    visibility: 'public',
    approvedForPublicAi: true,
    doNotUseInAi: false,
    tags: seed.tags ?? [],
    location: seed.location,
    imageUrl: seed.imageUrl,
    rsvpUrl: bookingUrl,
    bookingCta: bookingUrl
      ? {
          label: seed.bookingLabel?.trim() || 'RSVP',
          url: bookingUrl,
          grounded: true,
        }
      : undefined,
    sourceTable: 'soho_demo',
    sourceRecordId: seed.id,
  }
}

export function getSohoDemoKnowledgeRecords(
  orgSlug: string,
  _mode: MemoryAgentMode,
  now: Date = new Date()
): KnowledgeRecord[] {
  return SOHO_DEMO_SEED_RECORDS.map((seed) =>
    mapSohoDemoSeedToKnowledgeRecord(seed, orgSlug, now)
  )
}

export function sohoDemoDomainPrimer(): string {
  return [
    'SOHO DEMO MODE — programming comes from approved demo House records, not live internal CMS or private member data.',
    'Use member-facing language: members, House, programming, routes, screenings, rooftop, wellness, dining.',
    'member_route cards are curated experience paths — not ticketed events.',
    'house_story and editorial_story are never bookable; do not show RSVP unless recordKind is bookable_event with a grounded CTA in context.',
    'space records describe venues; only link to Book/RSVP when a separate bookable_event exists.',
    'Do not imply real-time availability unless startsAt and a grounded booking CTA appear in context.',
    'If asked for personal member matching or private preferences, explain this demo uses programming and public House knowledge only.',
  ].join('\n')
}
