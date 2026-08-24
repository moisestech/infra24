import type { Metadata } from 'next';
import { PageHero, Section, CardGrid } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { CultureRecordCard } from '@/components/dcc/culture/CultureRecordCard';
import { getCdcBreadcrumbs, getJournalCategorySlugs } from '@/lib/cdc/routes';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  EDITORIAL_TYPE_LABEL,
  JOURNAL_EMPTY_CONVERSATIONS,
  JOURNAL_INTRO,
  formatCultureDate,
  getEditorialPublicPath,
  listEditorial,
} from '@/lib/dcc/culture';

const path = '/journal';

export const metadata: Metadata = cdcPageMetadata(path);

export default function JournalIndexPage() {
  const published = listEditorial();
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
        title="Journal"
        description={JOURNAL_INTRO}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-white">
        {published.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {published.map((entry) => (
              <CultureRecordCard
                key={entry.id}
                href={getEditorialPublicPath(entry)}
                title={entry.title}
                eyebrow={EDITORIAL_TYPE_LABEL[entry.type]}
                meta={entry.publishedAt ? formatCultureDate(entry.publishedAt) : undefined}
                description={entry.dek ?? entry.excerpt}
                image={entry.heroImage}
                imageAlt={entry.heroImageAlt ?? entry.title}
                fallbackLabel="Image forthcoming"
              />
            ))}
          </ul>
        ) : (
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {JOURNAL_EMPTY_CONVERSATIONS}
          </p>
        )}
      </Section>
      <Section className="bg-[#fafafa] pb-16">
        <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          Sections
        </h2>
        <CardGrid items={items} columnsClassName="sm:grid-cols-2 lg:grid-cols-3" />
      </Section>
    </>
  );
}
