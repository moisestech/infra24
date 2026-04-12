import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, Section, CardGrid } from '@/components/marketing/cdc';
import {
  getCdcBreadcrumbs,
  getCdcPageByPath,
  getJournalCategorySlugs,
  getJournalPostsForCategory,
} from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

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

  const posts = getJournalPostsForCategory(params.category);
  const items = posts.map((post) => ({
    href: `/journal/${post.category}/${post.slug}`,
    title: post.title,
    description: 'Field note or essay from Digital Culture Center Miami.',
  }));

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={def.title}
        description={def.description}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        {items.length > 0 ? (
          <CardGrid items={items} columnsClassName="sm:grid-cols-2" />
        ) : (
          <p className="text-sm text-neutral-600">Posts in this category are coming soon.</p>
        )}
      </Section>
    </>
  );
}
