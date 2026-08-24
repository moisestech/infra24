import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography'

/**
 * Public 360 studio tours on dcc.miami.
 * Swap `embedSrc`, `title`, and `artistSlug` when Fabiola or Angelo send a new URL.
 * Do not invent a tour for Angelo until we have a Momento360 / Kuula / Matterport embed.
 */

export const STUDIO_TOUR_IFRAME_ALLOW =
  'xr-spatial-tracking; gyroscope; accelerometer' as const

export type DccStudioTour = {
  id: string
  artistSlug: string
  artistName: string
  studioLabel: string
  venueLabel?: string
  caption: string
  title: string
  enterLabel: string
  embedSrc: string
  shareUrl: string
  posterSrc?: string
  posterAlt?: string
  sourceHref?: string
  sourceLabel?: string
}

export const DCC_STUDIO_TOURS: DccStudioTour[] = [
  {
    id: 'moises-sanabria',
    artistSlug: 'moises-sanabria',
    artistName: 'Moises Sanabria',
    studioLabel: 'Studio 43',
    venueLabel: 'Bakehouse Art Complex',
    caption: 'Moises Sanabria · Studio 43 · Bakehouse Art Complex',
    title: 'Moises Sanabria — Studio 43, Bakehouse Art Complex',
    enterLabel: 'Enter Studio 43',
    embedSrc:
      'https://momento360.com/e/u/a338f042352a4550b3e12a6ccc29f98b?utm_campaign=embed&utm_source=other&heading=128.94&pitch=-17.74&field-of-view=75&size=medium&display-plan=true',
    shareUrl: 'https://momento360.com/e/u/a338f042352a4550b3e12a6ccc29f98b',
    posterSrc: dccHomePhotos.digitalDivinities.src,
    posterAlt:
      'Studio still from Bakehouse Art Complex — click to enter the Studio 43 360 tour.',
    sourceHref: 'https://moises.tech/research/born-into-the-machine#studio',
    sourceLabel: 'Open on moises.tech',
  },
  {
    id: 'fabiola-larios',
    artistSlug: 'fabiola-larios',
    artistName: 'Fabiola Larios',
    studioLabel: 'Studio',
    caption: 'Fabiola Larios · studio',
    title: 'Fabiola Larios — studio tour',
    enterLabel: 'Virtual Studio Tour',
    embedSrc:
      'https://momento360.com/e/u/fd0861891d284eff90e0995a727186fd?utm_campaign=embed&utm_source=other&heading=165.08&pitch=-15.38&field-of-view=75&size=medium&display-plan=true',
    shareUrl: 'https://momento360.com/e/u/fd0861891d284eff90e0995a727186fd',
    posterSrc: dccHomePhotos.fabiolaSurveillanceCutie2024.src,
    posterAlt: dccHomePhotos.fabiolaSurveillanceCutie2024.alt,
  },
]

export function listPublishedStudioTours(
  tours: readonly DccStudioTour[] = DCC_STUDIO_TOURS
): DccStudioTour[] {
  return [...tours]
}

export function getStudioTourByArtistSlug(
  artistSlug: string,
  tours: readonly DccStudioTour[] = DCC_STUDIO_TOURS
): DccStudioTour | undefined {
  return tours.find((tour) => tour.artistSlug === artistSlug)
}

export function assertStudioTourSlugsValid(
  tours: readonly DccStudioTour[] = DCC_STUDIO_TOURS
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const tour of tours) {
    if (!tour.id) errors.push('studio tour missing id')
    if (!tour.artistSlug) errors.push(`studio tour ${tour.id} missing artistSlug`)
    if (!tour.embedSrc) errors.push(`studio tour ${tour.id} missing embedSrc`)
    if (ids.has(tour.id)) errors.push(`duplicate studio tour id ${tour.id}`)
    if (slugs.has(tour.artistSlug)) {
      errors.push(`duplicate studio tour artistSlug ${tour.artistSlug}`)
    }
    ids.add(tour.id)
    slugs.add(tour.artistSlug)
  }
  return errors
}
