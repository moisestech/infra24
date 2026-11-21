import { DEFAULT_DCC_SITE_URL } from '@/lib/marketing/site-url';

export function getDccCanonicalRedirectUrl(
  requestUrl: URL,
  vercelEnv = process.env.VERCEL_ENV
): URL | null {
  if (vercelEnv !== 'production') return null;
  if (!requestUrl.hostname.endsWith('.vercel.app')) return null;

  const canonical = new URL(DEFAULT_DCC_SITE_URL);
  canonical.pathname = requestUrl.pathname;
  canonical.search = requestUrl.search;
  return canonical;
}
