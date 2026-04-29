import type { Metadata } from 'next';
import Link from 'next/link';
import { SupportLayout, Section, PacketDownloadList } from '@/components/marketing/cdc';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { funderMaterialDownloadRows } from '@/lib/marketing/knight-packet';

const path = '/grants/materials';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportMaterialsPage() {
  const def = getCdcPageByPath(path)!;

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm text-neutral-600">
          Files are linked here as they are finalized. For Knight Foundation–aligned review, the same
          download list is surfaced on the short hub{' '}
          <Link href="/knight" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            dcc.miami/knight
          </Link>{' '}
          alongside the full narrative and context links.
        </p>
        <PacketDownloadList
          rows={funderMaterialDownloadRows}
          intro="For urgent grant deadlines, use the funder contact and we can send materials directly."
          className="mt-2"
        />
      </Section>
      <Section className="bg-white pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <Link
            href="/knight"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Knight pilot packet (hub) →
          </Link>
          <Link
            href="/contact/funders"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
          >
            Request materials by email →
          </Link>
        </div>
      </Section>
    </SupportLayout>
  );
}
