import type { Metadata } from 'next';
import { PageHero, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/press';

export const metadata: Metadata = cdcPageMetadata(path);

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Press"
        title="Media & press"
        description="Boilerplate, high-resolution assets, and interview requests will be centralized here alongside the materials hub."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <CtaBlock
          headline="Press contact"
          body="Use the press intake path so we can route deadlines and spokespeople quickly."
          primaryLabel="Contact press"
          primaryHref="/contact/press"
          secondaryLabel="Grant materials"
          secondaryHref="/grants/materials"
        />
      </Section>
    </>
  );
}
