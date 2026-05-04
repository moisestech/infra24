import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageHero, Section, CtaBlock } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { dccSystemsIntro } from '@/lib/marketing/content';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { homeVisualInfra24Band } from '@/lib/marketing/home-visual-assets';

const path = '/powered-by-infra24';

const HomeWebcoreVisualGrid = dynamic(
  () =>
    import('@/components/marketing/HomeWebcoreVisualGrid').then((m) => m.HomeWebcoreVisualGrid),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[200px] animate-pulse rounded-xl bg-neutral-100/90 dark:bg-neutral-800/90" aria-hidden />
    ),
  }
);

export const metadata: Metadata = cdcPageMetadata(path);

export default function PoweredByInfra24Page() {
  return (
    <>
      <div className="border-b border-[var(--cdc-border)] bg-white pt-6 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EraPill />
        </div>
      </div>
      <PageHero
        eyebrow="Implementation layer"
        title="Powered by Infra24"
        description={dccSystemsIntro}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa] dark:bg-neutral-950">
        <div className="max-w-3xl">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualInfra24Band]} />
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Infra24 is the systems studio behind DCC Miami: methodology, deployment, and documentation so public
          interfaces stay maintainable across partners and funding cycles.
        </p>
      </Section>

      <Section className="bg-white pb-20 dark:bg-neutral-900">
        <CtaBlock
          headline="Go deeper on the product"
          body="Method, systems plane, case studies, and how organizations start with an audit or pilot."
          primaryLabel="Infra24 overview"
          primaryHref="/infra24"
          secondaryLabel="Method"
          secondaryHref="/infra24/method"
        />
        <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
            ← Back to home
          </Link>
        </p>
      </Section>
    </>
  );
}
