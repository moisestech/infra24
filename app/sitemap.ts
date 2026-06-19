import type { MetadataRoute } from 'next';
import { getAllCdcPaths } from '@/lib/cdc/routes';
import { getIndexableOpportunityPaths } from '@/lib/marketing/opportunities-index';
import { getSiteUrl } from '@/lib/marketing/site-url';

const EXTRA_PATHS = ['/platform', '/soho-house-ai-assistant'] as const;

/** Draft / proposal pages — accessible by URL but excluded until public launch. */
const SITEMAP_EXCLUDED = new Set(['/edgezones']);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const registryPaths = getAllCdcPaths();
  const opportunityPaths = getIndexableOpportunityPaths();
  const unique = new Set<string>(['/', ...registryPaths, ...EXTRA_PATHS, ...opportunityPaths]);
  const paths = [...unique].filter((path) => !SITEMAP_EXCLUDED.has(path)).sort((a, b) => a.localeCompare(b));

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority:
      path === '/'
        ? 1
        : path === '/grants' || path === '/contact' || path === '/programs' || path === '/opportunities'
          ? 0.9
          : 0.75,
  }));
}
