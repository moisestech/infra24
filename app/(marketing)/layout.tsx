import type { Metadata } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { MarketingJsonLd } from '@/components/marketing/MarketingJsonLd';
import { dccSiteMeta, marketingHomeMeta } from '@/lib/marketing/content';
import { getSiteUrl } from '@/lib/marketing/site-url';
import { cn } from '@/lib/utils';
import './cdc-marketing-theme.css';

/** Marketing-only (OFL): Space Grotesk for UI + display; IBM Plex Mono for labels / mono strip. */
const dccDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-dcc-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const dccMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dcc-mono',
  display: 'swap',
});

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
        dccDisplay.variable,
        dccMono.variable
      )}
    >
      <MarketingJsonLd />
      <SiteHeader />
      <main className="min-h-[60vh] scroll-smooth">{children}</main>
      <SiteFooter />
    </div>
  );
}
