import { JOURNAL_DESCRIPTOR } from '@/lib/dcc/culture/copy'
import { listFeaturedArtists } from '@/lib/dcc/culture/artists'
import { getEditorialPublicPath, listEditorial, listFeaturedEditorial } from '@/lib/dcc/culture/editorial'
import { getProgramPublicPath, listCurrentOrUpcomingPrograms } from '@/lib/dcc/culture/programs'
import { getBornDigitalEraChannel } from '@/lib/marketing/content'
import { eraAccent, eraAccentForChannel } from '@/lib/era/tokens'
import type { EraChannelEffect } from '@/lib/era/tokens'
import type { BornDigitalEraChannelId } from '@/lib/marketing/content'

/** Homepage pathway grid cap — keep the band scannable. */
export const HOME_PATHWAY_MAX = 9

export type HomePathway = {
  id: string
  kicker: string
  shortLabel: string
  title: string
  description: string
  group: string
  href: string
  label: string
  converge: string
  accent: string
  cardEffect: EraChannelEffect
  eraHref?: string
  eraChannelId?: BornDigitalEraChannelId
}

const HOME_ACCENT = {
  programs: eraAccent.irlEvents,
  artists: '#e879f9',
  fabricate: '#fb923c',
  journal: '#818cf8',
} as const

/**
 * Public entry pathways on `/` `#now`.
 * Mixes the live cultural snapshot (program, artist, journal) with the
 * durable doors (workshops, fabricate, newsletter, network, events, open lab).
 * Clinics and public interfaces stay on `/era` so this grid stays at nine.
 */
export function listHomePathways(): HomePathway[] {
  const now = listCurrentOrUpcomingPrograms()[0]
  const artist = listFeaturedArtists()[0]
  const journal = listFeaturedEditorial()[0] ?? listEditorial()[0]
  const workshops = getBornDigitalEraChannel('workshops')
  const newsletter = getBornDigitalEraChannel('newsletter')
  const network = getBornDigitalEraChannel('network')
  const events = getBornDigitalEraChannel('irl-events')
  const openLab = getBornDigitalEraChannel('open-lab')

  const pathways: HomePathway[] = []

  if (now) {
    const forthcoming = !now.startDate && !(now.artistIds && now.artistIds.length > 0)
    pathways.push({
      id: 'now',
      kicker: 'Now',
      shortLabel: 'NOW',
      title: now.title,
      description: now.shortDescription ?? 'Current DCC MIA program.',
      group: 'What is in public this season.',
      href: getProgramPublicPath(now),
      label: forthcoming ? 'Coming soon' : 'View program',
      converge: 'The lasting program record — before, during, and after the week.',
      accent: HOME_ACCENT.programs,
      cardEffect: 'venue-node',
    })
  }

  if (artist) {
    pathways.push({
      id: 'artists',
      kicker: 'Artist',
      shortLabel: 'ARTIST',
      title: artist.name,
      description: artist.shortBio ?? artist.location ?? 'Featured DCC artist.',
      group: 'Artists DCC presents and works with.',
      href: `/artists/${artist.slug}`,
      label: 'Meet the artist',
      converge: 'A curated record — not an open directory.',
      accent: HOME_ACCENT.artists,
      cardEffect: 'signal-pulse',
    })
  } else {
    pathways.push({
      id: 'artists',
      kicker: 'Artists',
      shortLabel: 'ARTIST',
      title: 'Artists',
      description: 'A curated record of artists DCC presents and works with.',
      group: 'Artists DCC presents and works with.',
      href: '/artists',
      label: 'View artists',
      converge: 'Names appear here when they are confirmed.',
      accent: HOME_ACCENT.artists,
      cardEffect: 'signal-pulse',
    })
  }

  if (workshops) {
    pathways.push({
      id: 'workshops',
      kicker: 'Learn',
      shortLabel: workshops.shortLabel,
      title: workshops.title,
      description:
        'Build the skills to understand and use the tools — then make work with them.',
      group: workshops.group,
      href: workshops.siteHref,
      label: 'Browse workshops',
      converge: workshops.converge,
      accent: eraAccentForChannel('workshops'),
      cardEffect: workshops.cardEffect,
      eraHref: workshops.eraHref,
      eraChannelId: 'workshops',
    })
  }

  pathways.push({
    id: 'fabricate',
    kicker: 'Make',
    shortLabel: 'MAKE',
    title: 'Fabricate',
    description:
      'You bring the idea. We help you figure out how to make it — no print-ready file required.',
    group: 'Artists moving an idea into a physical test.',
    href: '/fabricate',
    label: 'See how it works',
    converge: 'Production is a pathway, not a prerequisite course.',
    accent: HOME_ACCENT.fabricate,
    cardEffect: 'city-scan',
  })

  if (journal) {
    pathways.push({
      id: 'journal',
      kicker: 'Show',
      shortLabel: 'SHOW',
      title: journal.title,
      description: journal.dek ?? journal.excerpt ?? 'Latest from DCC MIA.',
      group: 'Essays and field notes from the work.',
      href: getEditorialPublicPath(journal),
      label: 'Read',
      converge: JOURNAL_DESCRIPTOR,
      accent: HOME_ACCENT.journal,
      cardEffect: 'particle-dispatch',
    })
  } else {
    pathways.push({
      id: 'journal',
      kicker: 'Show',
      shortLabel: 'SHOW',
      title: 'Journal',
      description: JOURNAL_DESCRIPTOR,
      group: 'Essays and field notes from the work.',
      href: '/journal',
      label: 'Open journal',
      converge: 'We publish when there is something worth sharing.',
      accent: HOME_ACCENT.journal,
      cardEffect: 'particle-dispatch',
    })
  }

  if (newsletter) {
    pathways.push({
      id: 'newsletter',
      kicker: 'Join',
      shortLabel: newsletter.shortLabel,
      title: newsletter.title,
      description:
        'Programs, conversations and workshop dates — owned audience, not only Instagram.',
      group: newsletter.group,
      href: newsletter.siteHref,
      label: 'Subscribe',
      converge: newsletter.converge,
      accent: eraAccentForChannel('newsletter'),
      cardEffect: newsletter.cardEffect,
      eraHref: newsletter.eraHref,
      eraChannelId: 'newsletter',
    })
  }

  if (network) {
    pathways.push({
      id: 'network',
      kicker: 'Map',
      shortLabel: network.shortLabel,
      title: network.title,
      description: network.description,
      group: network.group,
      href: network.siteHref,
      label: 'Open the network',
      converge: network.converge,
      accent: eraAccentForChannel('network'),
      cardEffect: network.cardEffect,
      eraHref: network.eraHref,
      eraChannelId: 'network',
    })
  }

  if (events) {
    pathways.push({
      id: 'events',
      kicker: 'Gather',
      shortLabel: events.shortLabel,
      title: events.title,
      description: events.description,
      group: events.group,
      href: events.siteHref,
      label: 'See events',
      converge: events.converge,
      accent: eraAccentForChannel('irl-events'),
      cardEffect: events.cardEffect,
      eraHref: events.eraHref,
      eraChannelId: 'irl-events',
    })
  }

  if (openLab) {
    pathways.push({
      id: 'open-lab',
      kicker: 'Studio',
      shortLabel: openLab.shortLabel,
      title: openLab.title,
      description: openLab.description,
      group: openLab.group,
      href: openLab.siteHref,
      label: 'Drop in',
      converge: openLab.converge,
      accent: eraAccentForChannel('open-lab'),
      cardEffect: openLab.cardEffect,
      eraHref: openLab.eraHref,
      eraChannelId: 'open-lab',
    })
  }

  return pathways.slice(0, HOME_PATHWAY_MAX)
}
