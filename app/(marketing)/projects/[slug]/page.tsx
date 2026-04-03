import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyLayout } from '@/components/marketing/cdc';
import { getCdcPageByPath, getProjectEntry, getProjectSlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/projects/${params.slug}`;
  return cdcPageMetadata(path);
}

export default function ProjectPage({ params }: Props) {
  const path = `/projects/${params.slug}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();
  const entry = getProjectEntry(params.slug);
  const isCollection = entry?.kind === 'collection';

  return (
    <CaseStudyLayout
      path={path}
      title={def.title}
      description={def.description}
      infra24Note={def.infra24Note}
      isCollection={isCollection}
    />
  );
}
