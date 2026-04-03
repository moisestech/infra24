import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProgramLayout, Section } from '@/components/marketing/cdc';
import { getCdcPageByPath, getProgramCategorySlugs, getProgramLeaves } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { category: string; slug: string } };

export function generateStaticParams() {
  const out: { category: string; slug: string }[] = [];
  for (const category of getProgramCategorySlugs()) {
    for (const leaf of getProgramLeaves(category)) {
      out.push({ category, slug: leaf.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/programs/${params.category}/${params.slug}`;
  return cdcPageMetadata(path);
}

export default function ProgramLeafPage({ params }: Props) {
  const path = `/programs/${params.category}/${params.slug}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  return (
    <ProgramLayout path={path} title={def.title} description={def.description}>
      <Section className="bg-[#fafafa]">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Full curriculum, schedule, and enrollment links will be published here or cross-linked from
          partner organizations as programs go live.
        </p>
      </Section>
    </ProgramLayout>
  );
}
