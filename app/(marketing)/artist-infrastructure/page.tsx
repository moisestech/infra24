import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/cdc';
import { ArtistInfrastructureHub } from '@/components/marketing/institutions/ArtistInfrastructureHub';
import { InstitutionalFamilyNav } from '@/components/marketing/institutions/InstitutionalFamilyNav';
import { OfferLink } from '@/components/marketing/institutions/OfferLink';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { artistInfrastructurePage } from '@/lib/marketing/institutions/artistInfrastructure';

const path = '/artist-infrastructure';

export const metadata: Metadata = {
  ...cdcPageMetadata(path, { absoluteTitle: artistInfrastructurePage.meta.title }),
  openGraph: {
    ...cdcPageMetadata(path, { absoluteTitle: artistInfrastructurePage.meta.title }).openGraph,
    images: [
      {
        url: artistInfrastructurePage.meta.ogImage,
        alt: 'Oolite Arts Digital Lab — creative infrastructure for artists',
      },
    ],
  },
};

export default function ArtistInfrastructurePage() {
  const P = artistInfrastructurePage;
  return (
    <>
      <InstitutionalFamilyNav active="artist-infrastructure" />
      <section className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-44 border-b border-[var(--cdc-border)]">
        <PageHero
          surface="mesh"
          eyebrow={P.hero.category}
          title={P.hero.headline}
          description={`${P.hero.subhead} ${P.hero.availability}`}
          breadcrumbs={getCdcBreadcrumbs(path)}
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-10 sm:flex-row sm:px-6 lg:px-8">
          <OfferLink
            href={P.hero.primaryCta.href}
            className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            {P.hero.primaryCta.label}
          </OfferLink>
          <OfferLink
            href={P.hero.secondaryCta.href}
            className="inline-flex justify-center text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            {P.hero.secondaryCta.label}
          </OfferLink>
        </div>
      </section>
      <ArtistInfrastructureHub />
    </>
  );
}
