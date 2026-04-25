/** Turn @handle or bare handle into an instagram.com profile URL. */
export function instagramProfileHref(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  if (/^https?:\/\//i.test(t)) return t
  const handle = t
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/\/+$/, '')
  if (!handle) return ''
  return `https://www.instagram.com/${handle}/`
}
