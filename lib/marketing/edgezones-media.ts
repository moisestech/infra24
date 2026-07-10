/**
 * Edge Zones portal media registry — swap Cloudinary URLs here when Edge Zones assets are ready.
 */

import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography'
import type { MemoryAgentGalleryImage } from '@/types/memory-agent'
import type { EdgeZonesPhoto } from '@/lib/marketing/edgezones-media-types'

export type { EdgeZonesPhoto, EdgeZonesGallerySlotKey } from '@/lib/marketing/edgezones-media-types'

/** Named slots — set Cloudinary URLs when available; null uses fallback. */
export const EDGE_ZONES_GALLERY_SLOTS = {
  exterior: null as string | null,
  emptyGallery: null as string | null,
  hallwayInstall: null as string | null,
  mapTexture: null as string | null,
  pdfPreview:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1783704743/dccmiami/booklet/desktop-cover-edgezones-proposal-dccmiami_p0mrvu.png' as string | null,
} as const

/** Google Drive — partnership PDF (view / download). */
export const EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_ID = '1rh6-_AaGYYiItMz9qpOlfhfbPTtLZVuo' as const

export const EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_VIEW_URL =
  `https://drive.google.com/file/d/${EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_ID}/view?usp=sharing` as const

export const EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_DOWNLOAD_URL =
  `https://drive.google.com/uc?export=download&id=${EDGE_ZONES_PARTNERSHIP_PDF_DRIVE_ID}` as const

export const EDGE_ZONES_PARTNERSHIP_PDF_COVER_URL = EDGE_ZONES_GALLERY_SLOTS.pdfPreview as string

const SLOT_FALLBACKS = {
  exterior: dccHomePhotos.galleryCrowdOpening,
  emptyGallery: dccHomePhotos.galleryInteractiveStations,
  hallwayInstall: dccHomePhotos.touchgrassTreadmillWide,
} as const

export function edgeZonesSlotPhoto(
  slot: keyof typeof EDGE_ZONES_GALLERY_SLOTS,
  fallback?: EdgeZonesPhoto
): EdgeZonesPhoto {
  const url = EDGE_ZONES_GALLERY_SLOTS[slot]
  if (url) return { src: url, alt: `Edge Zones — ${slot}` }
  if (fallback) return fallback
  const fb = SLOT_FALLBACKS[slot as keyof typeof SLOT_FALLBACKS]
  if (fb) return fb
  return dccHomePhotos.galleryInteractiveStations
}

export type EdgeZonesBannerKey = 'hero' | 'exhibition' | 'programs' | 'archive' | 'concept'

export const EDGE_ZONES_BANNERS: Record<EdgeZonesBannerKey, EdgeZonesPhoto> = {
  hero: edgeZonesSlotPhoto('exterior', dccHomePhotos.touchgrassTreadmillWide),
  exhibition: edgeZonesSlotPhoto('emptyGallery', dccHomePhotos.touchgrassTreadmillFigure),
  concept: edgeZonesSlotPhoto('emptyGallery', dccHomePhotos.galleryInteractiveStations),
  programs: dccHomePhotos.galleryCrowdOpening,
  archive: edgeZonesSlotPhoto('hallwayInstall', dccHomePhotos.galleryInteractiveStations),
}

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

/** Hero collage images for proposal hero */
export function edgeZonesHeroCollagePhotos(): EdgeZonesPhoto[] {
  return [
    edgeZonesSlotPhoto('exterior'),
    edgeZonesSlotPhoto('emptyGallery'),
    edgeZonesSlotPhoto('hallwayInstall'),
  ]
}

export function edgeZonesPartnershipPdfCover(): EdgeZonesPhoto {
  const url = EDGE_ZONES_GALLERY_SLOTS.pdfPreview
  return {
    src: url ?? EDGE_ZONES_PARTNERSHIP_PDF_COVER_URL,
    alt: 'DCC Miami × Edge Zones partnership proposal — booklet cover',
    caption: 'Partnership proposal packet',
  }
}
