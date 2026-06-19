/**
 * Canonical Edge Zones Network Index (PDF Page 4).
 * Edit names, bios, Instagram handles, websites, and images here — not in page components.
 * Airtable Seed Candidates override matching entries by name when configured.
 */

import { DCC_MIAMI_LOGO_URL_LIGHT } from '@/lib/marketing/cdc-brand'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'

/** Edge Zones Gallery mark — replace with official logo in Cloudinary when available. */
export const EDGE_ZONES_GALLERY_MARK_URL = '/marketing/edgezones/edge-zones-gallery-mark.png' as const

/**
 * Jordan Horton portrait — upload to this Cloudinary path when available.
 * Falls back to initials in UI when the asset 404s.
 */
export const JORDAN_HORTON_PORTRAIT_URL =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488666/dccmiami/portraits/jordan-horton_o8igs7.jpg' as const

export type EdgeZonesPartnershipPortrait = {
  name: string
  imageUrl: string
  imageAlt: string
  /** Logos use contain; portraits use cover. */
  imageFit?: 'cover' | 'contain'
}

export const edgeZonesPartnershipPortraits: EdgeZonesPartnershipPortrait[] = [
  {
    name: 'Edge Zones',
    imageUrl: EDGE_ZONES_GALLERY_MARK_URL,
    imageAlt: 'Edge Zones Gallery',
    imageFit: 'contain',
  },
  {
    name: 'Jordan Horton',
    imageUrl: JORDAN_HORTON_PORTRAIT_URL,
    imageAlt: 'Jordan Horton, curator',
    imageFit: 'cover',
  },
  {
    name: 'DCC Miami',
    imageUrl: DCC_MIAMI_LOGO_URL_LIGHT,
    imageAlt: 'DCC.miami — Digital Culture Center Miami',
    imageFit: 'contain',
  },
]

export function partnershipPortraitFor(name: string): EdgeZonesPartnershipPortrait | undefined {
  return edgeZonesPartnershipPortraits.find((entry) => entry.name === name)
}

export type EdgeZonesNetworkIndexEntry = Omit<EdgeZonesArtistProfile, 'id' | 'practiceTags'> & {
  /** Stable key for merge with Airtable */
  slug: string
  practiceTags?: string[]
}

/** Public PDF asset — place file at public/docs/dcc-edgezones-partnership.pdf */
export const EDGE_ZONES_PARTNERSHIP_PDF_PATH = '/docs/dcc-edgezones-partnership.pdf' as const

export const edgeZonesNetworkIndex: EdgeZonesNetworkIndexEntry[] = [
  {
    slug: 'edge-zones-gallery',
    name: 'Edge Zones Gallery',
    roleType: 'Physical host space',
    bio: 'Miami gallery and programming space hosting the partnership exhibition and on-site public programs.',
    instagram: 'edgezonesgallery',
    website: 'edgezones.gallery',
    imageUrl: EDGE_ZONES_GALLERY_MARK_URL,
  },
  {
    slug: 'jordan-horton',
    name: 'Jordan Horton',
    roleType: 'Curator',
    bio: 'Curator and art historian whose work focuses on internet subcultures, sonic and visual aesthetics, and institutional critique.',
    instagram: 'horton.exe',
    imageUrl: JORDAN_HORTON_PORTRAIT_URL,
  },
  {
    slug: 'adrienne-gionta',
    name: 'AdrienneRose Gionta',
    roleType: 'Artist',
    bio: 'Miami-based artist working across installation, material culture, and expanded digital practice.',
    instagram: 'adrienne_rose_gionta',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488961/dccmiami/portraits/AdrienneRose-Gionta-headshot-by-Lynton-Gardiner-2025-564x705_bhjm3t.jpg',
  },
  {
    slug: 'fabiola-larios',
    name: 'Fabiola Larios',
    roleType: 'Artist',
    bio: 'Net artist and educator exploring surveillance, obsolescence, and internet-native aesthetics.',
    instagram: 'fabiolalariosm',
    website: 'fabiola.io',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777518148/dccmiami/portraits/fabiola-lariosm-profile_vuypf4.jpg',
  },
  {
    slug: 'angelo-caruso',
    name: 'Angelo Caruso',
    roleType: 'Artist',
    bio: 'Artist working at the intersection of sculpture, technology, and embodied digital experience.',
    instagram: 'angelocaruso.art',
    website: 'angelocaruso.art',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488560/dccmiami/portraits/angelo-caruso-portrait-from-exhibition_avht0i.png',
  },
  {
    slug: 'moises-sanabria',
    name: 'Moises Sanabria',
    roleType: 'Artist · DCC Miami',
    bio: 'Artist and platform lead building public digital culture infrastructure for Miami artists and audiences.',
    instagram: 'moisesdsanabria',
    website: 'moisesdsanabria.com',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511801/dccmiami/portraits/moises-pfp_dnn3d3.jpg',
  },
  {
    slug: 'cynthia-cruz',
    name: 'Cynthia Cruz',
    roleType: 'Artist',
    bio: 'Artist exploring memory, identity, and material presence through hybrid analog and digital forms.',
    instagram: 'cynthia.cruz.art',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488805/dccmiami/portraits/CynthiaCruz-TheElliesWinners1478_RET_sRGBLESLIEGABALDON-705x705_xpilbo.jpg',
  },
  {
    slug: 'violet-forest',
    name: 'Violet Forest',
    roleType: 'Artist',
    bio: 'Artist working with feminist net art, software, and collaborative digital publishing.',
    instagram: 'violetforest',
    website: 'violetforest.info',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488760/dccmiami/portraits/violet-forest-portrait_amk7o0.jpg',
  },
]

export function staticProfilesToArtistProfiles(
  entries: EdgeZonesNetworkIndexEntry[]
): EdgeZonesArtistProfile[] {
  return entries.map((entry) => ({
    id: `edgezones-static-${entry.slug}`,
    name: entry.name,
    instagram: entry.instagram?.startsWith('http')
      ? entry.instagram
      : entry.instagram
        ? `https://instagram.com/${entry.instagram.replace(/^@/, '')}`
        : undefined,
    website: entry.website?.startsWith('http')
      ? entry.website
      : entry.website
        ? `https://${entry.website}`
        : undefined,
    bio: entry.bio,
    imageUrl: entry.imageUrl,
    roleType: entry.roleType,
    practiceTags: entry.practiceTags ?? [],
    program: entry.program,
    sourceUrl: entry.sourceUrl,
  }))
}

/** Airtable wins on matching name; static config fills gaps and sets display order. */
export function mergeEdgeZonesNetworkIndex(
  staticEntries: EdgeZonesNetworkIndexEntry[],
  airtableProfiles: EdgeZonesArtistProfile[]
): EdgeZonesArtistProfile[] {
  const byName = new Map(airtableProfiles.map((p) => [p.name.toLowerCase(), p]))
  return staticEntries.map((entry) => {
    const fromAirtable = byName.get(entry.name.toLowerCase())
    const base = staticProfilesToArtistProfiles([entry])[0]
    if (!fromAirtable) return base
    return {
      ...base,
      ...fromAirtable,
      name: entry.name,
      imageUrl: fromAirtable.imageUrl ?? base.imageUrl,
      bio: fromAirtable.bio ?? base.bio,
      instagram: fromAirtable.instagram ?? base.instagram,
      website: fromAirtable.website ?? base.website,
      roleType: fromAirtable.roleType ?? base.roleType,
      practiceTags: fromAirtable.practiceTags.length > 0 ? fromAirtable.practiceTags : base.practiceTags,
    }
  })
}
