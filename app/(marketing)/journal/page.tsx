import type { Metadata } from 'next';
import { PageHero, Section, CardGrid } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { getCdcBreadcrumbs, getJournalCategorySlugs } from '@/lib/cdc/routes';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/journal';

export const metadata: Metadata = cdcPageMetadata(path);

export default function JournalIndexPage() {
  const items = getJournalCategorySlugs()
    .map((slug) => {
      const def = getCdcPageByPath(`/journal/${slug}`);
      if (!def) return null;
      return { href: def.path, title: def.title, description: def.description };
    })
    .filter(Boolean) as { href: string; title: string; description: string }[];

  return (
    <>
      <div className="bg-white pt-6 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EraPill />
        </div>
      </div>
      <PageHero
        eyebrow="Journal"
        title="Notes from the field"
        description="Essays, pilot documentation, workshop reflections, and Miami-focused writing—evidence that this is a living practice, not a static brochure."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <CardGrid items={items} columnsClassName="sm:grid-cols-2 lg:grid-cols-3" />
      </Section>
    </>
  );
}
