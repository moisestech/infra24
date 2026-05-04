import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyLayout } from '@/components/marketing/cdc';
import { getCdcPageByPath, getProjectEntry, getProjectSlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { slug: string } };

/** Slugs that have a literal static page file under `app/(marketing)/projects/<slug>/page.tsx`. */
const STATIC_OVERRIDE_SLUGS: ReadonlyArray<string> = ['public-interfaces'];

export function generateStaticParams() {
  return getProjectSlugs()
    .filter((slug) => !STATIC_OVERRIDE_SLUGS.includes(slug))
    .map((slug) => ({ slug }));
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
