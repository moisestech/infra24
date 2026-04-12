import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, CardGrid, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/grants';

const baseMeta = cdcPageMetadata(path);
export const metadata: Metadata = {
  ...baseMeta,
  title: 'Grants | DCC Miami Pilot and Funding Priorities',
  openGraph: {
    ...baseMeta.openGraph,
    title: 'Grants | DCC Miami Pilot and Funding Priorities',
  },
  twitter: {
    ...baseMeta.twitter,
    title: 'Grants | DCC Miami Pilot and Funding Priorities',
  },
};

const grantCards = [
  {
    href: '/grants/funders',
    title: 'For funders',
    description: 'Grantmaker narrative, impact framing, and Miami pilot case.',
  },
  {
    href: '/grants/sponsors',
    title: 'For sponsors',
    description: 'Commercial, technology, and neighborhood visibility partnerships.',
  },
  {
    href: '/grants/advisors',
    title: 'For advisors',
    description: 'Board-in-formation, curatorial, and civic connectors.',
  },
  {
    href: '/grants/priorities',
    title: 'Funding priorities',
    description: 'Current buckets: pilots, workshops, interfaces, documentation, space, equipment.',
  },
  {
    href: '/grants/materials',
    title: 'Materials',
    description: 'One-pager, bios, deck, and press-ready descriptions (as they are published).',
  },
] as const;

export default function GrantsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Grants"
        title="Fund public digital culture in Miami"
        description="Grants and sponsorships fuel workshops, small-organization pilots, public interfaces, and documentation—not generic tech support. DCC Miami does not yet have a fiscal sponsor; we welcome conversations with 501(c)(3) fiscal sponsors and institutional partners who want to strengthen how Miami’s cultural field shows up in digital public space."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Fiscal sponsorship & partners</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          If your organization provides fiscal sponsorship or grant administration for arts and civic
          initiatives, reach out through{' '}
          <Link href="/contact/partnerships" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            partnerships
          </Link>{' '}
          or{' '}
          <Link href="/contact/funders" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            funders
          </Link>
          . Clear sponsorship pathways help foundations and donors move faster.
        </p>
      </Section>
      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Grant & sponsorship funnel</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Pick the path that matches how you work—foundation program officer, corporate citizenship,
          or individual ally.
        </p>
        <div className="mt-8">
          <CardGrid items={[...grantCards]} />
        </div>
      </Section>
      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">What funding enables</h2>
        <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm text-neutral-600">
          <li>Miami pilot programs with measurable local impact</li>
          <li>Bilingual and accessible workshops on digital culture</li>
          <li>Public smart signage, maps, and kiosk experiments</li>
          <li>Documentation so the model can travel across institutions</li>
        </ul>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Start a funder conversation"
          body="We can share priorities, timelines, and how Infra24 implements the technical layer."
          primaryLabel="Contact funders"
          primaryHref="/contact/funders"
          secondaryLabel="Download hub"
          secondaryHref="/grants/materials"
        />
        <p className="mt-8 text-sm text-neutral-500">
          Legacy reference:{' '}
          <Link href="/grant/knight-foundation" className="underline-offset-4 hover:underline">
            Knight Miami pilot note
          </Link>
        </p>
      </Section>
    </>
  );
}
