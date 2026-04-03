import type { Metadata } from 'next';
import { SupportLayout, Section, CardGrid } from '@/components/marketing/cdc';
import { getCdcPageByPath, getSupportPrioritySlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/grants/priorities';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportPrioritiesIndexPage() {
  const def = getCdcPageByPath(path)!;
  const items = getSupportPrioritySlugs()
    .map((slug) => {
      const d = getCdcPageByPath(`/grants/priorities/${slug}`);
      if (!d) return null;
      return { href: d.path, title: d.title, description: d.description };
    })
    .filter(Boolean) as { href: string; title: string; description: string }[];

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa] pb-16">
        <CardGrid items={items} columnsClassName="sm:grid-cols-2" />
      </Section>
    </SupportLayout>
  );
}
