import type { MetadataRoute } from 'next';
import { getAllCdcPaths } from '@/lib/cdc/routes';
import { getSiteUrl } from '@/lib/marketing/site-url';

const EXTRA_PATHS = ['/platform'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const registryPaths = getAllCdcPaths();
  const unique = new Set<string>(['/', ...registryPaths, ...EXTRA_PATHS]);
  const paths = [...unique].sort((a, b) => a.localeCompare(b));

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority:
      path === '/'
        ? 1
        : path === '/grants' || path === '/contact' || path === '/programs'
          ? 0.9
          : 0.75,
  }));
}
