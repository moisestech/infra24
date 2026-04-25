/** Canonical catalog + disk slug for this course product surface. */
export const VIBE_NET_ART_WORKSHOP_SLUG = 'vibe-coding-and-net-art' as const

export function isVibeNetArtCourseSlug(slug: string): boolean {
  return slug === VIBE_NET_ART_WORKSHOP_SLUG || slug === 'vibe-coding-net-art'
}
