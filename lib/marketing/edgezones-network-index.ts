/**
 * Canonical Edge Zones Network Index (PDF Page 4).
 * Edit names, bios, Instagram handles, websites, and images here — not in page components.
 * Airtable Seed Candidates override matching entries by name when configured.
 */

import { DCC_MIAMI_LOGO_URL_LIGHT } from '@/lib/marketing/cdc-brand'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto' as const

/** Example artwork images for Touching Grass participating artists. */
export const TOUCHING_GRASS_ARTWORK_URLS = {
  adrienneGionta: `${CLOUDINARY_BASE}/v1783708096/dccmiami/exhibition/touching-grass/artists/adrienne-rose-gionta-art_pts9rt.jpg`,
  fabiolaLarios: `${CLOUDINARY_BASE}/v1783708100/dccmiami/exhibition/touching-grass/artists/fabiola-larios-art_vfirjq.jpg`,
  angeloCaruso: `${CLOUDINARY_BASE}/v1783708099/dccmiami/exhibition/touching-grass/artists/angelo-caruso-art_zzy9by.jpg`,
  cynthiaCruz: `${CLOUDINARY_BASE}/v1783708097/dccmiami/exhibition/touching-grass/artists/cynthia-cruz-art_hcwsfu.jpg`,
  moisesSanabria: `${CLOUDINARY_BASE}/v1783708094/dccmiami/exhibition/touching-grass/artists/moises-sanabria-art_kets0r.jpg`,
  violetForest: `${CLOUDINARY_BASE}/v1783708102/dccmiami/exhibition/touching-grass/artists/violet-forest-art_q2p9k1.jpg`,
} as const

/** Edge Zones Gallery logo — transparent square mark (dark text, for light backgrounds). */
export const EDGE_ZONES_GALLERY_MARK_URL =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1783701153/dccmiami/logo/edge-zones-logo-transparent-square_wl5cru.webp' as const

/** Edge Zones Gallery logo — white text on transparent (for dark backgrounds). */
export const EDGE_ZONES_GALLERY_MARK_URL_DARK =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1783711647/dccmiami/logo/edge-zones-logo-transparent-square-white-text_p51wvh.png' as const

export function edgeZonesGalleryMarkUrl(theme: 'light' | 'dark'): string {
  return theme === 'dark' ? EDGE_ZONES_GALLERY_MARK_URL_DARK : EDGE_ZONES_GALLERY_MARK_URL
}

export const EDGE_ZONES_GALLERY_WEBSITE = 'https://edgezones.org' as const

export const JORDAN_HORTON_INSTAGRAM_URL = 'https://instagram.com/horton.exe' as const

export const DCC_MIAMI_WEBSITE = 'https://dcc.miami' as const

/**
 * Jordan Horton portrait — upload to this Cloudinary path when available.
 * Falls back to initials in UI when the asset 404s.
 */
export const JORDAN_HORTON_PORTRAIT_URL =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488666/dccmiami/portraits/jordan-horton_o8igs7.jpg' as const

export type EdgeZonesPartnershipPortrait = {
  name: string
  imageUrl: string
  imageUrlDark?: string
  imageAlt: string
  /** Logos use contain; portraits use cover. */
  imageFit?: 'cover' | 'contain'
}

export const edgeZonesPartnershipPortraits: EdgeZonesPartnershipPortrait[] = [
  {
    name: 'Edge Zones',
    imageUrl: EDGE_ZONES_GALLERY_MARK_URL,
    imageUrlDark: EDGE_ZONES_GALLERY_MARK_URL_DARK,
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
  materialsStatus?: 'complete' | 'pending'
  workImageUrl?: string
  imageFit?: 'cover' | 'contain'
  imageUrlDark?: string
}

/** Public PDF asset — place file at public/docs/dcc-edgezones-partnership.pdf */
export const EDGE_ZONES_PARTNERSHIP_PDF_PATH = '/docs/dcc-edgezones-partnership.pdf' as const

export const edgeZonesNetworkIndex: EdgeZonesNetworkIndexEntry[] = [
  {
    slug: 'edge-zones-gallery',
    name: 'Edge Zones Gallery',
    roleType: 'Physical host space',
    bio: 'Experimental art space and gallery in Miami supporting exhibitions, performances, and cultural programming.',
    instagram: 'edgezonesgallery',
    website: EDGE_ZONES_GALLERY_WEBSITE,
    imageUrl: EDGE_ZONES_GALLERY_MARK_URL,
    imageUrlDark: EDGE_ZONES_GALLERY_MARK_URL_DARK,
    imageFit: 'contain',
  },
  {
    slug: 'jordan-horton',
    name: 'Jordan Horton',
    roleType: 'Curator',
    bio: 'Invited curator for Touching Grass, shaping artist conversations, research, and exhibition direction.',
    instagram: 'horton.exe',
    imageUrl: JORDAN_HORTON_PORTRAIT_URL,
  },
  {
    slug: 'adrienne-gionta',
    name: 'AdrienneRose Gionta',
    roleType: 'Artist',
    bio: 'Oolite Residency alum, Wolfsonian Creative Fellow, and South Florida Cultural Consortium Grant awardee.',
    instagram: 'adrienne_rose_gionta',
    materialsStatus: 'complete',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488961/dccmiami/portraits/AdrienneRose-Gionta-headshot-by-Lynton-Gardiner-2025-564x705_bhjm3t.jpg',
    workImageUrl: TOUCHING_GRASS_ARTWORK_URLS.adrienneGionta,
  },
  {
    slug: 'fabiola-larios',
    name: 'Fabiola Larios',
    roleType: 'Artist',
    bio: 'Bakehouse artist-in-residence, Director of Digital at Oolite Arts, and online presence workshop educator.',
    instagram: 'fabiolalariosm',
    website: 'fabiola.io',
    materialsStatus: 'complete',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777518148/dccmiami/portraits/fabiola-lariosm-profile_vuypf4.jpg',
    workImageUrl: TOUCHING_GRASS_ARTWORK_URLS.fabiolaLarios,
  },
  {
    slug: 'angelo-caruso',
    name: 'Angelo Caruso',
    roleType: 'Artist',
    bio: 'Artist with recent exhibitions at Ritter Art Gallery and the Cultural Council of Palm Beach.',
    instagram: 'angelocaruso.art',
    website: 'angelocaruso.art',
    materialsStatus: 'complete',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488560/dccmiami/portraits/angelo-caruso-portrait-from-exhibition_avht0i.png',
    workImageUrl: TOUCHING_GRASS_ARTWORK_URLS.angeloCaruso,
  },
  {
    slug: 'moises-sanabria',
    name: 'Moises Sanabria',
    roleType: 'Artist · DCC Miami',
    bio: 'Bakehouse artist, Oolite Digital Lab Technical Director, and educator working across vibe coding, AI, digital systems, and contemporary art.',
    instagram: 'moisesdsanabria',
    website: 'moisesdsanabria.com',
    materialsStatus: 'complete',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511801/dccmiami/portraits/moises-pfp_dnn3d3.jpg',
    workImageUrl: TOUCHING_GRASS_ARTWORK_URLS.moisesSanabria,
  },
  {
    slug: 'cynthia-cruz',
    name: 'Cynthia Cruz',
    roleType: 'Artist',
    bio: 'Former digital art professor at New World School of the Arts, Knight Foundation Grant awardee, and Oolite Creator Award recipient.',
    instagram: 'cynthia.cruz.art',
    materialsStatus: 'complete',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488805/dccmiami/portraits/CynthiaCruz-TheElliesWinners1478_RET_sRGBLESLIEGABALDON-705x705_xpilbo.jpg',
    workImageUrl: TOUCHING_GRASS_ARTWORK_URLS.cynthiaCruz,
  },
  {
    slug: 'violet-forest',
    name: 'Violet Forest',
    roleType: 'Artist',
    bio: 'New media artist and creative technologist with recent showings at Untitled Art Miami and Neort Gallery Tokyo.',
    instagram: 'violetforest',
    website: 'violetforest.info',
    materialsStatus: 'complete',
    imageUrl:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1780488760/dccmiami/portraits/violet-forest-portrait_amk7o0.jpg',
    workImageUrl: TOUCHING_GRASS_ARTWORK_URLS.violetForest,
  },
]

export function edgeZonesWorkImageFor(name: string): string | undefined {
  return edgeZonesNetworkIndex.find((e) => e.name === name)?.workImageUrl
}

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
