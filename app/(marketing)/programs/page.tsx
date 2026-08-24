import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { PageHero, Section, CardGrid, CtaBlock } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { CultureRecordCard } from '@/components/dcc/culture/CultureRecordCard';
import { getCdcBreadcrumbs, getProgramCategories } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  formatCultureDateRange,
  getArtistsForProgram,
  getProgramPublicPath,
  listCurrentOrUpcomingPrograms,
  listPastPrograms,
  PROGRAM_TYPE_LABEL,
  PROGRAMS_CULTURAL_INTRO,
} from '@/lib/dcc/culture';

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
  const current = listCurrentOrUpcomingPrograms();
  const past = listPastPrograms();

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
        description="Workshops, salons, artist support, exhibitions, and institutional offerings—structured so partners and funders can see a real programmatic arm, not only consulting."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      {current.length > 0 || past.length > 0 ? (
        <Section className="bg-white">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {PROGRAMS_CULTURAL_INTRO}
          </p>
          {current.length > 0 ? (
            <div className="mt-10">
              <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Current / Upcoming
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {current.map((program) => {
                  const artists = getArtistsForProgram(program);
                  return (
                    <CultureRecordCard
                      key={program.id}
                      href={getProgramPublicPath(program)}
                      title={program.title}
                      eyebrow={PROGRAM_TYPE_LABEL[program.type]}
                      meta={[
                        formatCultureDateRange(program.startDate, program.endDate),
                        program.locationName,
                        artists.map((artist) => artist.name).join(', ') || undefined,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                      description={program.shortDescription}
                      image={program.heroImage}
                      imageAlt={program.heroImageAlt ?? program.title}
                      fallbackLabel="Documentation forthcoming"
                    />
                  );
                })}
              </ul>
            </div>
          ) : null}
          {past.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Past
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {past.map((program) => (
                  <CultureRecordCard
                    key={program.id}
                    href={getProgramPublicPath(program)}
                    title={program.title}
                    eyebrow={PROGRAM_TYPE_LABEL[program.type]}
                    meta={formatCultureDateRange(program.startDate, program.endDate)}
                    description={program.shortDescription}
                    image={program.heroImage}
                    imageAlt={program.heroImageAlt ?? program.title}
                    fallbackLabel="Documentation forthcoming"
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </Section>
      ) : null}
      <Section className="bg-[#fafafa]">
        <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          Program areas
        </h2>
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
