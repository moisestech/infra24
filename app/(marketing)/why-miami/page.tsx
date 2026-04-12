import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { dccWhyMiami } from '@/lib/marketing/content';

const path = '/why-miami';

export const metadata: Metadata = cdcPageMetadata(path);

export default function WhyMiamiPage() {
  return (
    <>
      <PageHero
        eyebrow="Place"
        title={dccWhyMiami.title}
        description={dccWhyMiami.body}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />

      <Section className="bg-[#fafafa] pb-20">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          DCC Miami starts as a pilot platform and distributed programs; a dedicated hub can follow
          traction—not the other way around. For programs, grants, and partnership paths, return to{' '}
          <Link href="/" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Home
          </Link>{' '}
          or{' '}
          <Link href="/grants" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Grants
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
