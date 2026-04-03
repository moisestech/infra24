/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.example.org).
 */

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, '');
    return host.startsWith('http') ? host : `https://${host}`;
  }
  return 'http://localhost:3000';
}
