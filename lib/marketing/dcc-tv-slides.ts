/** Landscape TV funnel — 7-slide loop, intake-first (no Edge Zones until partnership is live). */

export type DccTvSlideMotion =
  | 'terminal'
  | 'split'
  | 'cards'
  | 'tiles'
  | 'pulse'
  | 'chips'
  | 'network'

export type DccTvSlide = {
  id: string
  eyebrow: string
  title: string
  body: string
  /** Short URL shown beside the persistent QR (not encoded in QR). */
  pathLabel: string
  durationMs: number
  motion: DccTvSlideMotion
  /** Stronger visual weight for conversion beats */
  emphasize?: boolean
}

/** Persistent QR target for every slide in the loop. */
export const DCC_TV_QR_PATH = '/network/signup' as const
export const DCC_TV_QR_SOURCE = 'dcc-tv' as const

export const DCC_TV_SLIDES: DccTvSlide[] = [
  {
    id: 'dcc-miami',
    eyebrow: 'Digital Culture Center Miami',
    title: 'DCC Miami',
    body: 'A platform for digital art, public programs, and cultural infrastructure in Miami.',
    pathLabel: 'dcc.miami',
    durationMs: 10_000,
    motion: 'terminal',
  },
  {
    id: 'join-index',
    eyebrow: 'Join the map',
    title: 'Join the DCC Index',
    body: 'Artists, curators, educators, students, institutions, and collaborators shaping digital culture.',
    pathLabel: 'dcc.miami/network/signup',
    durationMs: 12_000,
    motion: 'pulse',
    emphasize: true,
  },
  {
    id: 'network',
    eyebrow: 'Living network',
    title: 'Artist Network Index',
    body: 'Explore artists, institutions, programs, and the connections shaping Miami’s digital culture field.',
    pathLabel: 'dcc.miami/network',
    durationMs: 10_000,
    motion: 'network',
  },
  {
    id: 'programs',
    eyebrow: 'Public programs',
    title: 'Talks, workshops & events',
    body: 'Studio visits, screenings, open labs, clinics, and community gatherings across Miami.',
    pathLabel: 'dcc.miami/programs',
    durationMs: 10_000,
    motion: 'tiles',
  },
  {
    id: 'workshops',
    eyebrow: 'Artist access',
    title: 'Workshops',
    body: 'Digital presence, AI tools, vibe coding, websites, archives, and media literacy.',
    pathLabel: 'dcc.miami/workshops',
    durationMs: 10_000,
    motion: 'chips',
  },
  {
    id: 'era',
    eyebrow: 'Born-Digital Era',
    title: 'Seven pathways, one network',
    body: 'Workshops, events, clinics, public interfaces, newsletter, and the living cultural map.',
    pathLabel: 'dcc.miami/era',
    durationMs: 10_000,
    motion: 'cards',
  },
  {
    id: 'miami',
    eyebrow: 'Miami pilot',
    title: 'Digital culture in Miami',
    body: 'Real places. Digital systems. Lasting archives.',
    pathLabel: 'dcc.miami',
    durationMs: 10_000,
    motion: 'network',
  },
]

export const DCC_TV_LOOP_MS = DCC_TV_SLIDES.reduce((sum, s) => sum + s.durationMs, 0)

export function dccTvSignupUrl(origin: string): string {
  return `${origin}${DCC_TV_QR_PATH}?source=${encodeURIComponent(DCC_TV_QR_SOURCE)}`
}
