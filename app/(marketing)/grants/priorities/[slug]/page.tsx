import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SupportLayout, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcPageByPath, getSupportPrioritySlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getSupportPrioritySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/grants/priorities/${params.slug}`;
  return cdcPageMetadata(path);
}

export default function SupportPriorityPage({ params }: Props) {
  const path = `/grants/priorities/${params.slug}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Detailed budget narrative and milestones for this priority will be added alongside active
          grant applications. Use the funder contact for a tailored summary.
        </p>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Discuss this priority"
          body="We can align language to your program areas and reporting needs."
          primaryLabel="Funder contact"
          primaryHref="/contact/funders"
          secondaryLabel="All priorities"
          secondaryHref="/grants/priorities"
        />
      </Section>
    </SupportLayout>
  );
}
