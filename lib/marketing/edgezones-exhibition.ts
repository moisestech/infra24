import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/normalize-suggested-question-key'
import type { MemoryAgentGalleryImage } from '@/types/memory-agent'
import { DCC_MIAMI_LOGO_URL_LIGHT } from '@/lib/marketing/cdc-brand'
import {
  EDGE_ZONES_GALLERY_MARK_URL,
  JORDAN_HORTON_PORTRAIT_URL,
  edgeZonesNetworkIndex,
  staticProfilesToArtistProfiles,
} from '@/lib/marketing/edgezones-network-index'

export type EdgeZonesExhibitionConfig = {
  key: string
  workingTitle: string
  titleStatus: string
  title: string
  curator: string
  curatorStatementQuote: string
  curatorImageUrl: string
  partnership: {
    host: string
    digital: string
  }
  partnershipImages: {
    host: { url: string; alt: string; fit: 'cover' | 'contain' }
    curator: { url: string; alt: string; fit: 'cover' | 'contain' }
    digital: { url: string; alt: string; fit: 'cover' | 'contain' }
  }
  spokenAnswer: string
  displayAnswer: string
  followUps: string[]
  galleryImages: MemoryAgentGalleryImage[]
  location: string
  dates: string
  ctaUrl: string
  artistNames: string[]
  /** @deprecated Use curatorStatementQuote */
  curatorialBlurb: string
}

/** Verbatim curator statement from Jordan Horton (working title retained). */
export const JORDAN_HORTON_CURATOR_STATEMENT = `Touching Grass (working title) explores the relationship between technology and the real world. In a world where it is almost impossible to be AFK (away from keys), the artists in this exhibition use digital materials and language to remind us not only of how interconnected the online and offline spheres are, but also of the importance of disconnecting and the consequences of failing to do so. Each artist pushes the boundaries of new media to hark back to in-world relationality and the environments we are bound to, despite the avatar state many are adopting.`

const EXHIBITION_ARTIST_NAMES = edgeZonesNetworkIndex
  .filter((entry) => entry.roleType !== 'Physical host space' && entry.roleType !== 'Curator')
  .map((entry) => entry.name)

export const TOUCHING_GRASS_EXHIBITION: EdgeZonesExhibitionConfig = {
  key: 'touching_grass',
  workingTitle: 'Touching Grass',
  titleStatus: 'working title',
  title: 'Touching Grass',
  curator: 'Jordan Horton',
  curatorStatementQuote: JORDAN_HORTON_CURATOR_STATEMENT,
  curatorImageUrl: JORDAN_HORTON_PORTRAIT_URL,
  partnership: {
    host: 'Edge Zones Gallery',
    digital: 'DCC Miami',
  },
  partnershipImages: {
    host: {
      url: EDGE_ZONES_GALLERY_MARK_URL,
      alt: 'Edge Zones Gallery',
      fit: 'contain',
    },
    curator: {
      url: JORDAN_HORTON_PORTRAIT_URL,
      alt: 'Jordan Horton, curator',
      fit: 'cover',
    },
    digital: {
      url: DCC_MIAMI_LOGO_URL_LIGHT,
      alt: 'DCC.miami — Digital Culture Center Miami',
      fit: 'contain',
    },
  },
  location: 'Edge Zones Gallery, Miami',
  dates: 'Dates TBD',
  ctaUrl: '/edgezones#exhibition',
  artistNames: EXHIBITION_ARTIST_NAMES,
  curatorialBlurb: JORDAN_HORTON_CURATOR_STATEMENT,
  spokenAnswer: `Touching Grass is a group exhibition curated by Jordan Horton at Edge Zones Gallery, supported by DCC Miami. Dates are still being confirmed. Jordan Horton writes: "${JORDAN_HORTON_CURATOR_STATEMENT.slice(0, 120)}…" Featuring ${EXHIBITION_ARTIST_NAMES.join(', ')}.`,
  displayAnswer: `Touching Grass (working title)

Curated by Jordan Horton · Edge Zones Gallery · DCC Miami
Dates TBD

Curator's statement — Jordan Horton

"${JORDAN_HORTON_CURATOR_STATEMENT}"

Featuring ${EXHIBITION_ARTIST_NAMES.join(', ')}.

Partnership: Edge Zones Gallery (physical host) · Jordan Horton (curatorial vision) · DCC Miami (digital platform and support layer).

Location: Edge Zones Gallery, Miami`,
  followUps: [
    'Who is curating Touching Grass?',
    'Tell me about Fabiola Larios.',
    'Tell me about Angelo Caruso.',
    'Which artists work with new media in Miami?',
    "Join Miami's Digital Culture Map",
  ],
  galleryImages: [],
}

export const EDGE_ZONES_EXHIBITION_SUGGESTED_QUESTIONS = [
  'Tell me about the Touching Grass exhibition.',
] as const

const TOUCHING_GRASS_RE = /\btouching\s+grass\b/i
const EDGE_ZONES_EXHIBITION_RE = /\bedge\s+zones\b.*\bexhibition\b|\bexhibition\b.*\bedge\s+zones\b/i
const JORDAN_HORTON_EXHIBITION_RE = /\bjordan\s+horton\b.*\bexhibition\b|\bexhibition\b.*\bjordan\s+horton\b/i

export function matchEdgeZonesExhibitionQuestion(
  question: string
): EdgeZonesExhibitionConfig | undefined {
  const key = normalizeSuggestedQuestionKey(question)
  if (
    key === 'tell me about the touching grass exhibition' ||
    key.includes('touching grass') ||
    TOUCHING_GRASS_RE.test(question) ||
    EDGE_ZONES_EXHIBITION_RE.test(question) ||
    JORDAN_HORTON_EXHIBITION_RE.test(question)
  ) {
    return TOUCHING_GRASS_EXHIBITION
  }
  return undefined
}

/** Participating artist profiles for memory-agent cards (excludes gallery host and curator). */
export function edgeZonesExhibitionArtistProfiles() {
  return staticProfilesToArtistProfiles(
    edgeZonesNetworkIndex.filter(
      (entry) => entry.roleType !== 'Physical host space' && entry.roleType !== 'Curator'
    )
  )
}

export function edgeZonesExhibitionCuratorProfile() {
  return staticProfilesToArtistProfiles(
    edgeZonesNetworkIndex.filter((entry) => entry.slug === 'jordan-horton')
  )[0]
}
