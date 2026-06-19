import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, Section, CtaBlock } from '@/components/marketing/cdc'
import type { CardGridItem } from '@/components/marketing/cdc'
import { CardGrid } from '@/components/marketing/cdc'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import {
  OPPORTUNITIES_INDEX_PATH,
  opportunitiesBySection,
  opportunityStatusLabel,
  type OpportunityEntry,
} from '@/lib/marketing/opportunities-index'

const path = OPPORTUNITIES_INDEX_PATH

const baseMeta = cdcPageMetadata(path)
export const metadata: Metadata = {
  ...baseMeta,
  title: 'Opportunities | DCC Miami — Programs, Exhibitions & Roles',
  openGraph: {
    ...baseMeta.openGraph,
    title: 'Opportunities | DCC Miami — Programs, Exhibitions & Roles',
  },
  twitter: {
    ...baseMeta.twitter,
    title: 'Opportunities | DCC Miami — Programs, Exhibitions & Roles',
  },
}

function toCardItems(entries: OpportunityEntry[]): CardGridItem[] {
  return entries.map((entry) => ({
    href: entry.href,
    title: entry.title,
    description: [
      entry.description,
      entry.deadline ? ` · ${entry.deadline}` : '',
      entry.status !== 'open' ? ` · ${opportunityStatusLabel(entry.status)}` : '',
    ].join(''),
  }))
}

export default function OpportunitiesIndexPage() {
  const cultural = opportunitiesBySection('cultural')
  const career = opportunitiesBySection('career')

  return (
    <>
      <PageHero
        eyebrow="Opportunities"
        title="Find your pathway in Miami's digital culture field"
        description="Workshops, exhibitions, public programs, and ways to join the network — plus selected career and role conversations hosted on DCC. Grants and funder materials live separately under Grants."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Cultural opportunities
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Apply, join, learn, and show up — artist-centered programs, events, and exhibitions supported
          by Digital Culture Center Miami and partners.
        </p>
        <div className="mt-8">
          <CardGrid items={toCardItems(cultural)} />
        </div>
      </Section>

      <Section className="bg-white dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Career & role opportunities
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Selected role explorations and concept demos — not affiliated with listed employers unless
          noted on the page.
        </p>
        <div className="mt-8">
          <CardGrid items={toCardItems(career)} />
        </div>
      </Section>

      <Section className="bg-[#fafafa] dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Indexing & discovery
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          This page is public and indexable. Some linked pathways stay{' '}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">unlisted in search</span>{' '}
          until dates or roles are confirmed — for example, Touching Grass at Edge Zones remains
          reachable by link but not in the sitemap until exhibition dates are set.
        </p>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Looking for funder or sponsorship materials? See{' '}
          <Link href="/grants" className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
            Grants
          </Link>
          .
        </p>
      </Section>

      <Section className="bg-white pb-16 dark:bg-neutral-950">
        <CtaBlock
          headline="Join the network"
          body="The fastest way to hear about workshops, programs, and new opportunities in Miami."
          primaryLabel="Join the DCC Index"
          primaryHref="/network/signup?pathway=index"
          secondaryLabel="Subscribe to the newsletter"
          secondaryHref="/newsletter"
        />
      </Section>
    </>
  )
}
