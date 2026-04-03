import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getCdcPageByPath, getInfra24LeafSlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getInfra24LeafSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/infra24/${params.slug}`;
  return cdcPageMetadata(path);
}

export default function Infra24SubPage({ params }: Props) {
  const path = `/infra24/${params.slug}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  return (
    <>
      <PageHero
        eyebrow="Infra24"
        title={def.title}
        description={def.description}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Deep-dive copy for this pillar will expand here. The route exists so navigation, grants,
          and partner decks can point to a stable URL.
        </p>
      </Section>
    </>
  );
}
