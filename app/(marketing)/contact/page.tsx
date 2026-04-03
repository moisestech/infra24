import type { Metadata } from 'next';
import { PageHero, Section, CardGrid } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getContactAudienceSlugs } from '@/lib/cdc/routes';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/contact';

export const metadata: Metadata = cdcPageMetadata(path);

export default function ContactHubPage() {
  const items = getContactAudienceSlugs()
    .map((slug) => {
      const def = getCdcPageByPath(`/contact/${slug}`);
      if (!def) return null;
      return { href: def.path, title: def.title, description: def.description };
    })
    .filter(Boolean) as { href: string; title: string; description: string }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Choose a path"
        description="Routing intake by audience keeps grantmaker, press, and artist conversations clear—and helps us respond faster."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <CardGrid items={items} columnsClassName="sm:grid-cols-2" />
      </Section>
    </>
  );
}
