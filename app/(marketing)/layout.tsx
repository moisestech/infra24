import type { Metadata } from 'next';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { SiteFooter } from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: { default: 'Infra24', template: '%s | Infra24' },
  description:
    'Updateable public communication systems for nonprofits and cultural organizations—smart signage, maps, kiosks, portals, and workflows across physical and online space.',
  openGraph: {
    title: 'Infra24',
    description:
      'Infra24 builds communication infrastructure for mission-driven organizations: signs, maps, kiosks, portals, and measurable public-facing systems.',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 antialiased">
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
    </div>
  );
}
