import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditorialDetail } from '@/components/dcc/culture/EditorialDetail';
import { PageHero, Section, cdcSectionMuted, cdcSectionPaper } from '@/components/marketing/cdc';
import { getAllJournalPosts, getCdcBreadcrumbs, getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  culturePageMetadata,
  getEditorialPublicPath,
  getPublishedEditorialBySlug,
} from '@/lib/dcc/culture';
import { compileEditorialBody } from '@/lib/dcc/culture/load-editorial-body';

type Props = { params: { category: string; slug: string } };

export function generateStaticParams() {
  return getAllJournalPosts().map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cultureEntry = getPublishedEditorialBySlug(params.slug);
  if (cultureEntry) {
    const path = getEditorialPublicPath(cultureEntry);
    const description =
      cultureEntry.seoDescription ??
      cultureEntry.dek ??
      cultureEntry.excerpt ??
      cultureEntry.title;
    const seoTitle = cultureEntry.seoTitle ?? cultureEntry.title;
    return {
      ...culturePageMetadata({
        title: seoTitle,
        description,
        path,
        image: cultureEntry.heroImage,
      }),
      title: { absolute: seoTitle },
    };
  }

  const path = `/journal/${params.category}/${params.slug}`;
  return cdcPageMetadata(path);
}

export default async function JournalPostPage({ params }: Props) {
  const cultureEntry = getPublishedEditorialBySlug(params.slug);
  if (cultureEntry) {
    const mdx = await compileEditorialBody(cultureEntry);
    return <EditorialDetail entry={cultureEntry} mdx={mdx} />;
  }

  const path = `/journal/${params.category}/${params.slug}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={def.title}
        description={def.description}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className={cdcSectionMuted}>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Full article body will live here (MDX or CMS). This route is scaffolded for SEO, grants,
          and editorial workflow.
        </p>
      </Section>
      <Section className={`${cdcSectionPaper} pb-16`}>
        <a
          href="/journal"
          className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
        >
          ← Journal home
        </a>
      </Section>
    </>
  );
}
