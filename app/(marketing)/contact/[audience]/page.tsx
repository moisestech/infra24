import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getCdcPageByPath, getContactAudienceSlugs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

type Props = { params: { audience: string } };

export function generateStaticParams() {
  return getContactAudienceSlugs().map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/contact/${params.audience}`;
  return cdcPageMetadata(path);
}

export default function ContactAudiencePage({ params }: Props) {
  const path = `/contact/${params.audience}`;
  const def = getCdcPageByPath(path);
  if (!def) notFound();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={def.title}
        description={def.description}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Wire this section to your form provider or mailto. Suggested subject line prefix:{' '}
          <span className="font-mono text-neutral-800">[{def.title}]</span>
        </p>
        <p className="mt-6 text-sm">
          <a href="/contact" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            ← All contact paths
          </a>
        </p>
      </Section>
    </>
  );
}
