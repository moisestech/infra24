import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { PageHero, Section, CardGrid, CtaBlock } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { getCdcBreadcrumbs, getProgramCategories } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/programs';

const ServiceEvidenceSection = dynamic(
  () =>
    import('@/components/marketing/dcc/ServiceEvidenceSection').then((m) => m.ServiceEvidenceSection),
  { ssr: true }
);

export const metadata: Metadata = cdcPageMetadata(path);

export default function ProgramsIndexPage() {
  const categories = getProgramCategories();
  const items = categories.map((c) => ({
    href: `/programs/${c.slug}`,
    title: c.title,
    description: c.description,
  }));

  return (
    <>
      <div className="bg-white pt-6 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EraPill />
        </div>
      </div>
      <PageHero
        eyebrow="Programs"
        title="Public programs for digital culture"
        description="Workshops, salons, artist support, and institutional offerings—structured so partners and funders can see a real programmatic arm, not only consulting."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa]">
        <CardGrid items={items} />
      </Section>
      <MarketingSection
        id="what-dcc-does"
        className="scroll-mt-24 border-y border-[var(--cdc-border)] bg-[#fafafa] py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16 lg:py-24"
      >
        <ServiceEvidenceSection />
      </MarketingSection>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Host or sponsor a program"
          body="Venues, schools, and cultural partners can host workshops or pilots with DCC Miami."
          primaryLabel="Partner with us"
          primaryHref="/partners"
          secondaryLabel="Funder conversation"
          secondaryHref="/grants/funders"
        />
        <p className="mt-8 text-sm text-neutral-600">
          Catalog-style workshop pages for enrollment may live under partner organizations; these pages describe the public program frame.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/workshops/own-your-digital-presence" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Example catalog shortcut (redirects to partner site)
          </Link>
        </p>
      </Section>
    </>
  );
}
