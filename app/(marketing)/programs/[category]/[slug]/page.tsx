import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProgramDetail } from '@/components/dcc/culture/ProgramDetail';
import { ProgramLayout, Section } from '@/components/marketing/cdc';
import { getCdcPageByPath, getProgramCategorySlugs, getProgramLeaves } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { getListedProgramBySlug } from '@/lib/dcc/culture';

type Props = { params: { category: string; slug: string } };

/**
 * Slugs that have a literal static page file under `app/(marketing)/programs/<category>/<slug>/page.tsx`.
 * Static routes win in Next.js routing, but excluding them from `generateStaticParams` here keeps the
 * build clean and avoids accidentally pre-rendering the generic shell for an overridden surface.
 */
const STATIC_OVERRIDES: ReadonlyArray<{ category: string; slug: string }> = [
  { category: 'public-programs', slug: 'open-lab' },
];

export function generateStaticParams() {
  const out: { category: string; slug: string }[] = [];
  for (const category of getProgramCategorySlugs()) {
    for (const leaf of getProgramLeaves(category)) {
      const overridden = STATIC_OVERRIDES.some(
        (o) => o.category === category && o.slug === leaf.slug
      );
      if (overridden) continue;
      out.push({ category, slug: leaf.slug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cultureProgram = getListedProgramBySlug(params.slug);
  if (cultureProgram) {
    return cdcPageMetadata(`/programs/${params.category}/${params.slug}`);
  }
  const path = `/programs/${params.category}/${params.slug}`;
  return cdcPageMetadata(path);
}

export default function ProgramLeafPage({ params }: Props) {
  const cultureProgram = getListedProgramBySlug(params.slug);
  if (cultureProgram) {
    return <ProgramDetail program={cultureProgram} />;
  }

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
