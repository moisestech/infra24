import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PageHero,
  Section,
  PacketDownloadList,
  CtaBlock,
} from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  funderMaterialDownloadRows,
  knightFullNarrativeLink,
  knightPacketContextLinks,
} from '@/lib/marketing/knight-packet';

const path = '/knight';

export const metadata: Metadata = cdcPageMetadata(path);

export default function KnightPilotPacketPage() {
  return (
    <>
      <PageHero
        eyebrow="Grants · Knight Foundation"
        title="Knight pilot packet"
        description="One place for reviewers: DCC identity, the full narrative, downloadable materials as they ship, evidence of work, and contact. For the long-form story, start with the Knight-aligned page below."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Narrative (read on web)</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          The detailed pilot framing—public communication infrastructure, outcomes, and Miami
          rationale—lives on a dedicated page so this hub stays scannable.
        </p>
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-sm font-semibold text-neutral-900">{knightFullNarrativeLink.title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">{knightFullNarrativeLink.description}</p>
          <Link
            href={knightFullNarrativeLink.href}
            className="mt-4 inline-flex text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Open full narrative →
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">DCC overview and public identity</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Same destinations linked from the general materials hub—grouped here for reviewers.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {knightPacketContextLinks.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-neutral-200 bg-[#fafafa] p-5 text-sm shadow-sm"
            >
              <Link
                href={item.href}
                className="font-medium text-neutral-900 underline-offset-4 hover:underline"
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.title}
              </Link>
              <p className="mt-2 text-neutral-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-[#fafafa]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Downloads and credentials</h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">
              PDFs and files appear here and on{' '}
              <Link href="/grants/materials" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
                /grants/materials
              </Link>{' '}
              as they are finalized—one shared list.
            </p>
          </div>
        </div>
        <PacketDownloadList rows={funderMaterialDownloadRows} className="mt-2" />
      </Section>

      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Contact"
          body="Pilot partner conversations, the project brief, or grantmaker follow-up—use the path that matches urgency."
          primaryLabel="Discuss a pilot partner site"
          primaryHref="/contact?interest=knight-pilot"
          secondaryLabel="Request the project brief"
          secondaryHref="/contact?interest=knight-brief"
        />
        <p className="mt-8 text-sm text-neutral-500">
          <Link href="/contact/funders" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
            Funder inbox
          </Link>
          {' · '}
          <Link href="/contact" className="font-medium text-neutral-700 underline-offset-4 hover:underline">
            General contact
          </Link>
        </p>
      </Section>
    </>
  );
}
