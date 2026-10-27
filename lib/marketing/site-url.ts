/**
 * Canonical public origin for DCC marketing metadata, sitemap, and robots.
 *
 * Keep this pinned to the public DCC domain instead of VERCEL_URL: preview and
 * production deployment hostnames are implementation details and should never
 * become canonical URLs or leak into social/search metadata.
 */
export const DEFAULT_DCC_SITE_URL = 'https://www.dcc.miami' as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL_ENV) {
    return 'http://localhost:3000';
  }

  return DEFAULT_DCC_SITE_URL;
}
