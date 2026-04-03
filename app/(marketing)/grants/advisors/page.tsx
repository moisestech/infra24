import type { Metadata } from 'next';
import { SupportLayout, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/grants/advisors';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportAdvisorsPage() {
  const def = getCdcPageByPath(path)!;

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          We are building an advisory circle across arts, civic technology, philanthropy, and Miami
          neighborhood leadership. Advisors help stress-test narrative, partners, and risk—without
          day-to-day operations burden.
        </p>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Advisory interest"
          body="Share your domain and how you prefer to engage (quarterly conversation, email reviews, hosted intros)."
          primaryLabel="General contact"
          primaryHref="/contact/general"
          secondaryLabel="Partnerships"
          secondaryHref="/contact/partnerships"
        />
      </Section>
    </SupportLayout>
  );
}
