import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/accessibility';

export const metadata: Metadata = cdcPageMetadata(path);

export default function AccessibilityPage() {
  return (
    <>
      <PageHero title="Accessibility" breadcrumbs={getCdcBreadcrumbs(path)} />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          We aim for WCAG-minded defaults on public pages and program materials. If you encounter a
          barrier, please reach out so we can fix it.
        </p>
      </Section>
    </>
  );
}
