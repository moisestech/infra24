import type { Metadata } from 'next';
import { SupportLayout, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/grants/sponsors';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportSponsorsPage() {
  const def = getCdcPageByPath(path)!;

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Sponsorship can underwrite public programs, visible interfaces, or documentation bundles.
          We align recognition and reporting with your brand standards and community commitments.
        </p>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Explore sponsorship"
          body="Tell us whether you care most about neighborhood visibility, artist access, or civic interfaces."
          primaryLabel="Contact partnerships"
          primaryHref="/contact/partnerships"
          secondaryLabel="Grants home"
          secondaryHref="/grants"
        />
      </Section>
    </SupportLayout>
  );
}
