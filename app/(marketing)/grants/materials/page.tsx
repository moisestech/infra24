import type { Metadata } from 'next';
import { SupportLayout, Section } from '@/components/marketing/cdc';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/grants/materials';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportMaterialsPage() {
  const def = getCdcPageByPath(path)!;

  const placeholders = [
    { label: 'One-page overview (PDF)', status: 'In preparation' },
    { label: 'Founder bios', status: 'In preparation' },
    { label: 'Funder deck', status: 'In preparation' },
    { label: 'Pilot & impact summary', status: 'In preparation' },
    { label: 'Press-ready description', status: 'In preparation' },
    { label: 'Logo / visual kit', status: 'In preparation' },
  ] as const;

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm text-neutral-600">
          Files will be linked here as they are finalized. For urgent grant deadlines, use the
          funder contact and we will send materials directly.
        </p>
        <ul className="mt-8 space-y-3">
          {placeholders.map((row) => (
            <li
              key={row.label}
              className="flex flex-col gap-1 border-b border-neutral-200 pb-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-neutral-900">{row.label}</span>
              <span className="text-neutral-500">{row.status}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="bg-white pb-16">
        <a
          href="/contact/funders"
          className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          Request materials by email →
        </a>
      </Section>
    </SupportLayout>
  );
}
