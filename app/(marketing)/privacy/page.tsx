import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/privacy';

export const metadata: Metadata = cdcPageMetadata(path);

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy" breadcrumbs={getCdcBreadcrumbs(path)} />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Privacy practices for this marketing site will be published here. Until then, contact us
          with questions about data handling for programs you join.
        </p>
      </Section>
    </>
  );
}
