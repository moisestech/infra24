import { isReservedArtistSlug } from '@/lib/dcc/culture/taxonomy'
import type { DccArtist } from '@/lib/dcc/culture/types'
import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography'

/**
 * Curated artists DCC MIA has presented or worked with.
 *
 * Founders / Studio 43 circle are published from existing public copy.
 * Do not attach them to Clandestine until the fair participating artists are confirmed.
 *
 * TODO — Clandestine Art Fair 2026 (do not invent):
 * - names of the three participating artists
 * - slugs, short bios, practice tags
 * - portrait + hero images
 * - website / Instagram if the artist wants them public
 * - programIds: ['clandestine-2026']
 */
export const DCC_ARTISTS: DccArtist[] = [
  {
    id: 'moises-sanabria',
    slug: 'moises-sanabria',
    name: 'Moises Sanabria',
    location: 'Studio 43, Bakehouse Art Complex',
    shortBio:
      'Bakehouse artist, Oolite Digital Lab Technical Director, and educator working across vibe coding, AI, digital systems, and contemporary art.',
    portrait:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511801/dccmiami/portraits/moises-pfp_dnn3d3.jpg',
    portraitAlt: 'Moises Sanabria',
    heroImage: dccHomePhotos.babyAgi.src,
    heroImageAlt: dccHomePhotos.babyAgi.alt,
    websiteUrl: 'https://moisesdsanabria.com',
    instagramUrl: 'https://www.instagram.com/moisesdsanabria/',
    featured: true,
    status: 'published',
  },
  {
    id: 'fabiola-larios',
    slug: 'fabiola-larios',
    name: 'Fabiola Larios',
    shortBio:
      'Bakehouse artist-in-residence, Director of Digital at Oolite Arts, and online presence workshop educator.',
    portrait:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777518148/dccmiami/portraits/fabiola-lariosm-profile_vuypf4.jpg',
    portraitAlt: 'Fabiola Larios',
    heroImage: dccHomePhotos.fabiolaSurveillanceCutie2024.src,
    heroImageAlt: dccHomePhotos.fabiolaSurveillanceCutie2024.alt,
    websiteUrl: 'https://fabiola.io',
    instagramUrl: 'https://www.instagram.com/fabiolalariosm/',
    featured: false,
    status: 'published',
  },
  {
    id: 'angelo-caruso',
    slug: 'angelo-caruso',
    name: 'Angelo Caruso',
    shortBio:
      'Artist with recent exhibitions at Ritter Art Gallery and the Cultural Council of Palm Beach.',
    portrait:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488560/dccmiami/portraits/angelo-caruso-portrait-from-exhibition_avht0i.png',
    portraitAlt: 'Angelo Caruso',
    websiteUrl: 'https://angelocaruso.art',
    instagramUrl: 'https://www.instagram.com/angelocaruso.art/',
    featured: false,
    status: 'published',
  },
]

export function isPublishedArtist(artist: DccArtist): boolean {
  return (artist.status ?? 'published') === 'published'
}

export function listArtists(artists: readonly DccArtist[] = DCC_ARTISTS): DccArtist[] {
  return artists.filter(isPublishedArtist)
}

export function listFeaturedArtists(
  artists: readonly DccArtist[] = DCC_ARTISTS
): DccArtist[] {
  return listArtists(artists).filter((artist) => artist.featured)
}

export function getArtistById(
  id: string,
  artists: readonly DccArtist[] = DCC_ARTISTS
): DccArtist | undefined {
  return artists.find((artist) => artist.id === id)
}

export function getArtistBySlug(
  slug: string,
  artists: readonly DccArtist[] = DCC_ARTISTS
): DccArtist | undefined {
  return artists.find((artist) => artist.slug === slug)
}

export function getPublishedArtistBySlug(
  slug: string,
  artists: readonly DccArtist[] = DCC_ARTISTS
): DccArtist | undefined {
  const artist = getArtistBySlug(slug, artists)
  if (!artist || !isPublishedArtist(artist)) return undefined
  return artist
}

export function assertArtistSlugsValid(
  artists: readonly DccArtist[] = DCC_ARTISTS
): string[] {
  const errors: string[] = []
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const artist of artists) {
    if (!artist.id) errors.push('artist missing id')
    if (!artist.slug) errors.push(`artist ${artist.id} missing slug`)
    if (isReservedArtistSlug(artist.slug)) {
      errors.push(`artist slug "${artist.slug}" is reserved`)
    }
    if (ids.has(artist.id)) errors.push(`duplicate artist id ${artist.id}`)
    if (slugs.has(artist.slug)) errors.push(`duplicate artist slug ${artist.slug}`)
    ids.add(artist.id)
    slugs.add(artist.slug)
  }
  return errors
}
