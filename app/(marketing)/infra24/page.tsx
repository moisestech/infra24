import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, CardGrid, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getCdcPageByPath, getInfra24LeafSlugs } from '@/lib/cdc/routes';
import { cdcSiteMeta } from '@/lib/marketing/content';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/infra24';

export const metadata: Metadata = cdcPageMetadata(path);

export default function Infra24IndexPage() {
  const items = getInfra24LeafSlugs()
    .map((slug) => {
      const def = getCdcPageByPath(`/infra24/${slug}`);
      if (!def) return null;
      return { href: def.path, title: def.title, description: def.description };
    })
    .filter(Boolean) as { href: string; title: string; description: string }[];

  return (
    <>
      <PageHero
        eyebrow={cdcSiteMeta.poweredByLine}
        title="Infra24"
        description={cdcSiteMeta.infra24Descriptor}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">How Infra24 supports CDC</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          CDC is the public mission and program frame. Infra24 is the practice that ships systems:
          interfaces, workflows, documentation, and the technical judgment to keep public
          information maintainable.
        </p>
        <div className="mt-8">
          <CardGrid items={items} columnsClassName="sm:grid-cols-2" />
        </div>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Institutional technical conversations"
          body="For RFP-style or IT-adjacent questions, start with contact and note “Infra24 / systems.”"
          primaryLabel="Contact"
          primaryHref="/contact/general"
          secondaryLabel="Projects"
          secondaryHref="/projects"
        />
        <p className="mt-8 text-sm text-neutral-600">
          Product and tenant areas:{' '}
          <Link href="/platform" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Platform overview
          </Link>
        </p>
      </Section>
    </>
  );
}
