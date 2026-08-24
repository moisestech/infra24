import { isReservedArtistSlug } from '@/lib/dcc/culture/taxonomy'
import type { DccArtist } from '@/lib/dcc/culture/types'

/**
 * Curated artists DCC MIA has presented or worked with.
 *
 * TODO — Clandestine Art Fair 2026 (do not invent):
 * - names of the three participating artists
 * - slugs, short bios, practice tags
 * - portrait + hero images
 * - website / Instagram if the artist wants them public
 * - programIds: ['clandestine-2026']
 */
export const DCC_ARTISTS: DccArtist[] = []

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
