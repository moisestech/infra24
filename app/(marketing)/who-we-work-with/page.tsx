import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { dccAudiencePathways } from '@/lib/marketing/content';
import { dccHomePathwaysSection } from '@/lib/marketing/dcc-pilot-home-content';

const path = '/who-we-work-with';

const HomePathwayWebcoreGrid = dynamic(
  () =>
    import('@/components/marketing/HomePathwayWebcoreGrid').then((m) => m.HomePathwayWebcoreGrid),
  { ssr: true }
);

export const metadata: Metadata = cdcPageMetadata(path);

export default function WhoWeWorkWithPage() {
  return (
    <>
      <div className="border-b border-[var(--cdc-border)] bg-white pt-6 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EraPill />
        </div>
      </div>
      <PageHero
        eyebrow="DCC Miami pilot"
        title={dccHomePathwaysSection.title}
        description={dccHomePathwaysSection.teaser}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-white dark:bg-neutral-950">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          We are prioritizing{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">grantmakers</strong> and{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">
            small cultural organizations
          </strong>{' '}
          first; artists stay central through programs and workshops. For audits, signage systems, and implementation
          detail, start with{' '}
          <Link
            href="/powered-by-infra24"
            className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
          >
            Powered by Infra24
          </Link>{' '}
          or the full{' '}
          <Link
            href="/infra24"
            className="font-medium text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-200"
          >
            Infra24 product overview
          </Link>
          .
        </p>
        <div className="mt-10">
          <HomePathwayWebcoreGrid
            items={[...dccAudiencePathways]}
            columnsClassName="lg:grid-cols-3"
          />
        </div>
      </Section>
    </>
  );
}
