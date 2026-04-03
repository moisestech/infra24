import type { Metadata } from 'next';
import { PageHero, Section, CardGrid, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getProjectEntry, getProjectSlugs } from '@/lib/cdc/routes';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/projects';

export const metadata: Metadata = cdcPageMetadata(path);

export default function ProjectsIndexPage() {
  const slugs = getProjectSlugs();
  const items = slugs
    .map((slug) => {
      const entry = getProjectEntry(slug);
      const def = getCdcPageByPath(`/projects/${slug}`);
      if (!def || !entry) return null;
      return {
        href: `/projects/${slug}`,
        title: def.title,
        description: def.description,
        kind: entry.kind,
      };
    })
    .filter(Boolean) as { href: string; title: string; description: string; kind: string }[];

  const cases = items.filter((i) => i.kind === 'case');
  const collections = items.filter((i) => i.kind === 'collection');

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Proof through deployment"
        description="Case studies and pilot types show how Infra24 implements updateable public interfaces, portals, and workflows—so funders see real artifacts, not slides alone."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Case studies & pilots</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Narrative project pages with context, public value, and technical layer.
        </p>
        <div className="mt-8">
          <CardGrid items={cases} columnsClassName="lg:grid-cols-2" />
        </div>
      </Section>
      <Section className="bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-neutral-900">Collections</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Groupings for browsing related work.
        </p>
        <div className="mt-8">
          <CardGrid items={collections} columnsClassName="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </Section>
      <Section className="bg-white pb-16">
        <CtaBlock
          headline="Fund a Miami pilot"
          body="Grants and sponsorships fund public interfaces, workshops, and documentation that make digital culture legible citywide."
          primaryLabel="Grants & pilot"
          primaryHref="/grants"
          secondaryLabel="Funder path"
          secondaryHref="/grants/funders"
        />
      </Section>
    </>
  );
}
