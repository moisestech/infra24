import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, Section, cdcSectionMuted, cdcSectionPaper } from '@/components/marketing/cdc';
import { CultureRecordCard } from '@/components/dcc/culture/CultureRecordCard';
import {
  getCdcBreadcrumbs,
  getCdcPageByPath,
  getJournalCategorySlugs,
} from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  EDITORIAL_TYPE_LABEL,
  JOURNAL_EMPTY_CONVERSATIONS,
  formatCultureDate,
  getEditorialPublicPath,
  listEditorialForJournalCategory,
} from '@/lib/dcc/culture';

type Props = { params: { category: string } };

export function generateStaticParams() {
  return getJournalCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/journal/${params.category}`;
  return cdcPageMetadata(path);
}

export default function JournalCategoryPage({ params }: Props) {
  const path = `/journal/${params.category}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  const published = listEditorialForJournalCategory(params.category);

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={def.title}
        description={def.description}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section
        className={`${published.length > 0 ? cdcSectionPaper : cdcSectionMuted} border-t border-neutral-200 pb-16 dark:border-neutral-800`}
      >
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
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {params.category === 'conversations'
              ? JOURNAL_EMPTY_CONVERSATIONS
              : 'Posts in this category are coming soon.'}
          </p>
        )}
      </Section>
    </>
  );
}
