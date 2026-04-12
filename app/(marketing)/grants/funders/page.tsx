import type { Metadata } from 'next';
import { SupportLayout, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/grants/funders';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportFundersPage() {
  const def = getCdcPageByPath(path)!;

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Why now</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Artists and cultural organizations are expected to operate in digital public space, but
          lack maintainable systems, shared methods, and civic-visible interfaces. Miami is a strong
          place to prove a repeatable model.
        </p>
      </Section>
      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Why Miami</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Place-based cultural life here intersects tourism, neighborhood identity, multilingual
          publics, and a dense field of small organizations that need legible infrastructure.
        </p>
      </Section>
      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Pilot model</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Scoped deployments (interfaces, workshops, documentation) with agreed indicators—not a
          vague “platform” promise. Infra24 provides implementation discipline and reuse patterns.
        </p>
      </Section>
      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Fiscal sponsorship</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          DCC Miami does not currently have a fiscal sponsor. If you represent a 501(c)(3) that sponsors
          arts or civic initiatives, we would like to explore whether your umbrella can help
          foundations and donors support this work with clean grant and gift mechanics—while DCC Miami
          stays focused on pilots, documentation, and public outcomes.
        </p>
      </Section>
      <Section className="bg-[#fafafa] pb-16">
        <CtaBlock
          headline="Materials & next steps"
          body="Request the one-pager, deck, and pilot summary as they are finalized."
          primaryLabel="Funder contact"
          primaryHref="/contact/funders"
          secondaryLabel="Materials hub"
          secondaryHref="/grants/materials"
        />
      </Section>
    </SupportLayout>
  );
}
