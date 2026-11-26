import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProgramLayout, Section, CardGrid } from '@/components/marketing/cdc';
import {
  getCdcPageByPath,
  getProgramCategorySlugs,
  getProgramLeaves,
} from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return getProgramCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params: pendingParams }: Props): Promise<Metadata> {
  const params = await pendingParams
  const path = `/programs/${params.category}`;
  return cdcPageMetadata(path);
}

export default async function ProgramCategoryPage({ params: pendingParams }: Props) {
  const params = await pendingParams
  const path = `/programs/${params.category}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  const leaves = getProgramLeaves(params.category);
  const items = leaves.map((leaf) => ({
    href: `${path}/${leaf.slug}`,
    title: leaf.title,
    description: leaf.description,
  }));

  return (
    <ProgramLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <CardGrid items={items} />
      </Section>
    </ProgramLayout>
  );
}
