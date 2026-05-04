import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { HomeFaqWebcoreList } from '@/components/marketing/HomeFaqWebcoreList';
import { EraPill } from '@/components/era/EraPill';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { getMarketingFaqAllItems } from '@/lib/marketing/content';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';

const path = '/faq';

export const metadata: Metadata = cdcPageMetadata(path);

export default function MarketingFaqPage() {
  const items = getMarketingFaqAllItems();

  return (
    <>
      <div className="border-b border-[var(--cdc-border)] bg-white pt-6 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EraPill />
        </div>
      </div>
      <PageHero
        eyebrow="DCC Miami"
        title="Common questions"
        description="Straight answers for artists, organizations, and funders. For depth on mission and team, see About."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa] pb-20 dark:bg-neutral-950">
        <div className="cdc-webcore-faq-shell max-w-3xl">
          <HomeFaqWebcoreList items={items} />
        </div>
        <p className="mt-12 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/about" className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
            About Digital Culture Center Miami
          </Link>
          {' · '}
          <Link href="/" className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
            ← Home
          </Link>
        </p>
      </Section>
    </>
  );
}
