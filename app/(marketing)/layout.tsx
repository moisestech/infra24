import type { Metadata } from 'next';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { SiteFooter } from '@/components/marketing/SiteFooter';
import { MarketingJsonLd } from '@/components/marketing/MarketingJsonLd';
import { cdcSiteMeta, marketingHomeMeta } from '@/lib/marketing/content';
import { getSiteUrl } from '@/lib/marketing/site-url';
import './cdc-marketing-theme.css';

const siteUrl = getSiteUrl();
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: cdcSiteMeta.organizationName,
    template: `%s | ${cdcSiteMeta.organizationName}`,
  },
  description: marketingHomeMeta.description,
  keywords: [
    'Center of Digital Culture',
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
    siteName: cdcSiteMeta.organizationName,
    locale: 'en_US',
    title: cdcSiteMeta.organizationName,
    description: marketingHomeMeta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: cdcSiteMeta.organizationName,
    description: marketingHomeMeta.description,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cdc-marketing min-h-screen bg-[#fafafa] text-neutral-900 antialiased">
      <MarketingJsonLd />
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
    </div>
  );
}
