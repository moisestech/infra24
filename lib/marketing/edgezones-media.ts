/**
 * Edge Zones portal media registry — swap Cloudinary URLs here when Edge Zones assets are ready.
 * Interim install photography sourced from dccHomePhotos.
 */

import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography'
import type { MemoryAgentGalleryImage } from '@/types/memory-agent'

export type EdgeZonesBannerKey = 'hero' | 'exhibition' | 'programs' | 'archive' | 'studioVisits' | 'publishing'

export type EdgeZonesPhoto = { readonly src: string; readonly alt: string; readonly caption?: string }

/** Section banner images — replace with Edge Zones gallery photography when available. */
export const EDGE_ZONES_BANNERS: Record<EdgeZonesBannerKey, EdgeZonesPhoto> = {
  hero: dccHomePhotos.touchgrassTreadmillWide,
  exhibition: dccHomePhotos.touchgrassTreadmillFigure,
  programs: dccHomePhotos.galleryCrowdOpening,
  archive: dccHomePhotos.galleryInteractiveStations,
  studioVisits: dccHomePhotos.digitalDivinities,
  publishing: dccHomePhotos.moisesArtec2024Talk,
}

/** Exhibition install mosaic — interim DCC / participating artist documentation. */
export const EDGE_ZONES_GALLERY: readonly EdgeZonesPhoto[] = [
  dccHomePhotos.touchgrassTreadmillFigure,
  dccHomePhotos.fabiolaSurveillanceCutie2024,
  dccHomePhotos.digitalDivinities,
  dccHomePhotos.galleryInteractiveStations,
] as const

export function edgeZonesGalleryForMemoryAgent(): MemoryAgentGalleryImage[] {
  return EDGE_ZONES_GALLERY.map((photo) => ({
    url: photo.src,
    title: photo.caption ?? photo.alt,
    subtitle: 'Touching Grass · Edge Zones partnership (interim documentation)',
  }))
}

export const EDGE_ZONES_CONTACT = {
  email: 'hello@dcc.miami',
  liaisonName: 'Charo Oquet',
  liaisonRole: 'Edge Zones',
  /** Upload Charo portrait to Cloudinary and set here when available. */
  portraitUrl: undefined as string | undefined,
} as const

export function edgeZonesPartnershipMailto(): string {
  const subject = 'Edge Zones partnership inquiry'
  const body = `Hi DCC team,

I'm reaching out about the Edge Zones × DCC Miami partnership and the Touching Grass exhibition.

[Your message]

—
Sent from the Edge Zones portal: https://dcc.miami/edgezones`
  return `mailto:${EDGE_ZONES_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
