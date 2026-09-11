import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditorialDetail } from '@/components/dcc/culture/EditorialDetail';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getAllJournalPosts, getCdcBreadcrumbs, getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  culturePageMetadata,
  getEditorialPublicPath,
  getPublishedEditorialBySlug,
} from '@/lib/dcc/culture';

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

export default function JournalPostPage({ params }: Props) {
  const cultureEntry = getPublishedEditorialBySlug(params.slug);
  if (cultureEntry) {
    return <EditorialDetail entry={cultureEntry} />;
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
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Full article body will live here (MDX or CMS). This route is scaffolded for SEO, grants,
          and editorial workflow.
        </p>
      </Section>
      <Section className="bg-white pb-16">
        <a
          href="/journal"
          className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          ← Journal home
        </a>
      </Section>
    </>
  );
}
