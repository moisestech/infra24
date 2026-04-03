import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, Section, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getCdcPageByPath, getPartnerSegmentSlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { segment: string } };

export function generateStaticParams() {
  return getPartnerSegmentSlugs().map((segment) => ({ segment }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/partners/${params.segment}`;
  return cdcPageMetadata(path);
}

export default function PartnerSegmentPage({ params }: Props) {
  const path = `/partners/${params.segment}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title={def.title}
        description={def.description}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Partnership formats, MOUs, and pilot scopes are shaped to your venue or organization. Use
          the contact path to share capacity, audience, and timing.
        </p>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Talk with us"
          body="We will route your note to the right conversation—programs, pilots, or sponsorship."
          primaryLabel="Partnership inquiry"
          primaryHref="/contact/partnerships"
          secondaryLabel="All contact options"
          secondaryHref="/contact"
        />
      </Section>
    </>
  );
}
