import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/marketing/site-url';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/o/',
        '/sign-in/',
        '/sign-up/',
        '/login',
        '/admin/',
        '/fabricate/proposals',
        '/fabricate/internal',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
