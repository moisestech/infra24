/** Member-facing Atlas contract. Never pass raw CRM records to the browser. */
export const INTERESTS = [
  { id: 'making', label: 'Fabrication, materials & objects', short: 'Making', color: '#e9a45a' },
  { id: 'image-sound', label: 'Film, animation & sound', short: 'Image + sound', color: '#ba9ce8' },
  { id: 'interactive', label: 'Games, XR & interactive installations', short: 'Interactive', color: '#6baee8' },
  { id: 'code-ai', label: 'Creative coding, AI & automation', short: 'Code + AI', color: '#70cbb2' },
  { id: 'culture', label: 'Art, exhibitions & creative practice', short: 'Culture', color: '#df8597' },
  { id: 'exploring', label: 'Still exploring / across disciplines', short: 'Exploring', color: '#c5cbbf' },
] as const

export type InterestId = (typeof INTERESTS)[number]['id']
export type AtlasProfile = {
  slug: string
  name: string
  summary: string
  practice: string[]
  interests: InterestId[]
  website?: string
  links?: { label: string; url: string }[]
}
export type ApprovedProfileInput = AtlasProfile & {
  identityVerified: boolean
  publicConsent: boolean
  approved: boolean
  withdrawn: boolean
}

const INTEREST_IDS = new Set<string>(INTERESTS.map((i) => i.id))
export function isInterestId(value: string): value is InterestId {
  return INTEREST_IDS.has(value)
}

/** Explicit allowlist: spreads and client-side privacy filtering are forbidden here. */
export function projectPublicProfiles(records: ApprovedProfileInput[]): AtlasProfile[] {
  return records
    .filter((r) => r.identityVerified === true && r.publicConsent === true && r.approved === true && r.withdrawn === false)
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      summary: r.summary,
      practice: [...r.practice],
      interests: r.interests.filter(isInterestId),
      ...(r.website && /^https:\/\//i.test(r.website) ? { website: r.website } : {}),
    }))
}

/** OR semantics across overlapping interests. Unanswered never means uninterested. */
export function filterProfiles(profiles: AtlasProfile[], selected: InterestId[], query = '') {
  const search = query.trim().toLocaleLowerCase()
  return profiles.filter((profile) =>
    (!selected.length || selected.some((interest) => profile.interests.includes(interest))) &&
    (!search || [profile.name, profile.summary, ...profile.practice].join(' ').toLocaleLowerCase().includes(search))
  )
}

/** User-requested editorial previews. These are NOT poll responses or consent records. */
export const PILOT_PREVIEWS: AtlasProfile[] = [
  {
    slug: 'moises-sanabria', name: 'Moises Sanabria',
    summary: 'Artist, creative technologist and DCC Miami co-founder.',
    practice: ['Interdisciplinary art', 'Creative technology', 'Digital fabrication'],
    interests: ['making', 'code-ai', 'culture'], website: 'https://www.moises.tech',
  },
  {
    slug: 'fabiola-larios', name: 'Fabiola Larios',
    summary: 'Interdisciplinary artist and DCC Miami co-founder.',
    practice: ['Digital art', 'AI', 'Creative practice'],
    interests: ['image-sound', 'code-ai', 'culture'], website: 'https://fabiola.io',
  },
  {
    slug: 'angelo-caruso', name: 'Angelo Caruso',
    summary: 'Artist working with interactive and tactile objects.',
    practice: ['Interactive art', 'Objects', 'Digital fabrication'],
    interests: ['making', 'interactive'], website: 'https://angelocaruso.art',
  },
]

export type FieldNode = {
  id: string
  kind: 'anonymous' | 'profile' | 'interest'
  position: [number, number, number]
  color: string
  profileSlug?: string
}

/** Generated from an aggregate quantity, with no correspondence to individual members. */
export function buildAnonymousNodes(count: number): FieldNode[] {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.min(1024, Math.floor(count))) : 0
  return Array.from({ length: safeCount }, (_, i) => {
    const y = 1 - (i / Math.max(1, safeCount - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = i * 2.399963229728653
    return {
      id: `illustrative-dot-${i}`, kind: 'anonymous', color: '#57686b',
      position: [Math.cos(angle) * radius * 12, y * 9, Math.sin(angle) * radius * 7],
    }
  })
}

export const PASSPORT_PREVIEW_KEY = 'dcc-passport-preview-v1'
export type PassportPreview = { name: string; interests: InterestId[]; visibility: 'private' | 'members' | 'public' }

export function readPassportPreview(raw: string | null): PassportPreview | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const v = value as Record<string, unknown>
    if (typeof v.name !== 'string' || !v.name.trim() || v.name.length > 80 || !Array.isArray(v.interests)) return null
    if (!['private', 'members', 'public'].includes(String(v.visibility))) return null
    return { name: v.name.trim(), interests: v.interests.filter((i): i is InterestId => typeof i === 'string' && isInterestId(i)), visibility: v.visibility as PassportPreview['visibility'] }
  } catch { return null }
}
