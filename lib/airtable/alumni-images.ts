import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'

export type AlumniImageReviewStatus =
  | 'Ready'
  | 'Needs Alt Text'
  | 'Needs Credit'
  | 'Needs Better Image'
  | 'Duplicate Image Review'
  | 'Do Not Use'

export type AlumniPreferredImageOrientation =
  | 'Vertical'
  | 'Landscape'
  | 'Both Available'
  | 'Missing Image'

/** Where the UI should pick portrait vs landscape vs default featured image. */
export type AlumniImageContext = 'default' | 'card' | 'profile' | 'kiosk'

const URL_RE = /^https?:\/\//i

export function isUsableImageUrl(value: string | undefined): value is string {
  if (!value?.trim()) return false
  const t = value.trim()
  if (/^pending$/i.test(t)) return false
  return URL_RE.test(t)
}

/** Parse newline- or comma-separated extra image URLs; drops invalid, pending, and duplicates. */
export function parseAdditionalImageUrls(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of raw.split(/[\n,]+/)) {
    const url = part.trim()
    if (!isUsableImageUrl(url)) continue
    const key = url.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(url)
  }
  return out
}

export function alumniImagesBlocked(row: Pick<AlumniAirtableRow, 'imageReviewStatus'>): boolean {
  return row.imageReviewStatus?.trim().toLowerCase() === 'do not use'
}

function firstUsableImageUrl(...urls: (string | undefined)[]): string | undefined {
  for (const url of urls) {
    if (isUsableImageUrl(url)) return url
  }
  return undefined
}

/**
 * Pick the best image URL for cards, profile sheets, kiosk, or Memory Agent default.
 * Falls back through featured → landscape → vertical (card/kiosk) or vertical first (profile).
 */
export function alumniImageForContext(
  row: Pick<
    AlumniAirtableRow,
    'featuredImageUrl' | 'portraitLandscapeUrl' | 'portraitVerticalUrl' | 'photoUrl' | 'imageReviewStatus'
  >,
  context: AlumniImageContext = 'default'
): string | undefined {
  if (alumniImagesBlocked(row)) return undefined

  const featured = firstUsableImageUrl(row.featuredImageUrl, row.photoUrl)
  const landscape = firstUsableImageUrl(row.portraitLandscapeUrl)
  const vertical = firstUsableImageUrl(row.portraitVerticalUrl)

  switch (context) {
    case 'card':
      return featured || landscape || vertical
    case 'kiosk':
      return landscape || featured || vertical
    case 'profile':
      return vertical || featured || landscape
    default:
      return featured || landscape || vertical
  }
}

/** Alt text for accessibility — prefers Image Alt Text, else a generated label. */
export function alumniImageAltText(
  row: Pick<AlumniAirtableRow, 'imageAltText' | 'name' | 'artistName' | 'program' | 'residencyYear'>,
  displayName: string
): string {
  const custom = row.imageAltText?.trim()
  if (custom) return custom
  const year = row.residencyYear?.trim()
  const program = row.program?.trim()
  const suffix = [program, year].filter(Boolean).join(' ')
  return suffix ? `Portrait of ${displayName}, ${suffix}.` : `Portrait of ${displayName}.`
}

/** All gallery URLs: primary orientations + additional, deduped. */
export function alumniGalleryImageUrls(
  row: Pick<
    AlumniAirtableRow,
    | 'featuredImageUrl'
    | 'portraitLandscapeUrl'
    | 'portraitVerticalUrl'
    | 'additionalImageUrls'
    | 'photoUrl'
    | 'imageReviewStatus'
  >
): string[] {
  if (alumniImagesBlocked(row)) return []
  const seen = new Set<string>()
  const out: string[] = []
  const add = (url: string | undefined) => {
    if (!isUsableImageUrl(url)) return
    const key = url.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(url)
  }
  add(row.featuredImageUrl ?? row.photoUrl)
  add(row.portraitVerticalUrl)
  add(row.portraitLandscapeUrl)
  for (const url of row.additionalImageUrls ?? []) add(url)
  return out
}
