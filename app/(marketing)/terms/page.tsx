import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/terms';

export const metadata: Metadata = cdcPageMetadata(path);

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of use" breadcrumbs={getCdcBreadcrumbs(path)} />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Terms governing use of this website and public materials will appear here.
        </p>
      </Section>
    </>
  );
}
