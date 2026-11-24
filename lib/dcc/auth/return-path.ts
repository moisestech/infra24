/**
 * Never trust a user-controlled URL passed as Clerk's post-auth return target.
 * Only internal paths are accepted. Preserves Smart Sign's /dashboard target.
 */
export function dccPostAuthPath(raw: string | null, fallback: string): string {
  if (!raw || raw.length > 1500 || !raw.startsWith('/') ||
      raw.startsWith('//') || raw.includes('\\') ||
      /[\u0000-\u001f\u007f]/.test(raw) || /%2f|%5c|%0a|%0d/i.test(raw)) {
    return fallback
  }
  return raw
}