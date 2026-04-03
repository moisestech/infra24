import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/events';

export const metadata: Metadata = cdcPageMetadata(path);

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Public programs & salons"
        description="Upcoming workshops, talks, and community sessions will be listed here and cross-posted from partner venues."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm text-neutral-600">
          Calendar integration can point at your ticketing or events stack. For now, browse{' '}
          <Link href="/programs" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Programs
          </Link>{' '}
          or{' '}
          <Link href="/journal" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Journal
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
