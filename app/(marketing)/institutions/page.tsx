import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/cdc';
import { InstitutionalFamilyNav } from '@/components/marketing/institutions/InstitutionalFamilyNav';
import { InstitutionsHub } from '@/components/marketing/institutions/InstitutionsHub';
import { OfferLink } from '@/components/marketing/institutions/OfferLink';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { institutionsHub } from '@/lib/marketing/institutions/hub';
import { media } from '@/lib/marketing/institutions/media';

const path = '/institutions';

export const metadata: Metadata = {
  ...cdcPageMetadata(path, { absoluteTitle: institutionsHub.meta.title }),
  openGraph: {
    ...cdcPageMetadata(path, { absoluteTitle: institutionsHub.meta.title }).openGraph,
    images: [{ url: media.digilab360.src, alt: media.digilab360.alt }],
  },
};

export default function InstitutionsPage() {
  const H = institutionsHub;
  return (
    <>
      <InstitutionalFamilyNav active="institutions" />
      <section
        id="top"
        className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-44 border-b border-[var(--cdc-border)]"
      >
        <PageHero
          surface="mesh"
          eyebrow={H.hero.eyebrow}
          title={H.hero.headline}
          description={`${H.hero.lead} ${H.hero.availability}`}
          breadcrumbs={getCdcBreadcrumbs(path)}
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-10 sm:flex-row sm:px-6 lg:px-8">
          <OfferLink
            href={H.hero.primaryCta.href}
            className="inline-flex justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            {H.hero.primaryCta.label}
          </OfferLink>
          <OfferLink
            href={H.hero.secondaryCta.href}
            className="inline-flex justify-center text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            {H.hero.secondaryCta.label}
          </OfferLink>
        </div>
      </section>
      <InstitutionsHub />
    </>
  );
}
