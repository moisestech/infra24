import type { Metadata } from 'next';
import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './dcc-local-fonts.css'
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { MarketingJsonLd } from '@/components/marketing/MarketingJsonLd';
import { dccSiteMeta, marketingHomeMeta } from '@/lib/marketing/content';
import { getSiteUrl } from '@/lib/marketing/site-url';
import { cn } from '@/lib/utils';
import './cdc-marketing-theme.css';
import './dcc-network-theme.css';

/** Marketing-only (OFL): Space Grotesk for UI + display; IBM Plex Mono for labels / mono strip. */
const siteUrl = getSiteUrl();
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: dccSiteMeta.organizationName,
    template: `%s | ${dccSiteMeta.organizationName}`,
  },
  description: marketingHomeMeta.description,
  keywords: [
    'Digital Culture Center Miami',
    'DCC.miami',
    'Miami',
    'digital culture',
    'artist support',
    'cultural infrastructure',
    'public programs',
    'digital literacy',
    'smart signage',
    'wayfinding',
    'nonprofit',
    'civic interfaces',
    'Infra24',
  ],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: dccSiteMeta.organizationName,
    locale: 'en_US',
    title: dccSiteMeta.organizationName,
    description: marketingHomeMeta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: dccSiteMeta.organizationName,
    description: marketingHomeMeta.description,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'cdc-marketing min-h-screen bg-[#fafafa] text-neutral-900 antialiased transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100',
        'dcc-local-fonts'
      )}
    >
      <MarketingJsonLd />
      <SiteHeader />
      <main className="min-h-[60vh] scroll-smooth">{children}</main>
      <SiteFooter />
    </div>
  );
}
