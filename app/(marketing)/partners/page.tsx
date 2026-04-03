import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, CardGrid, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs, getCdcPageByPath, getPartnerSegmentSlugs } from '@/lib/cdc/routes';
import { cdcInfra24TenantOrgs } from '@/lib/marketing/content';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/partners';

export const metadata: Metadata = cdcPageMetadata(path);

export default function PartnersIndexPage() {
  const items = getPartnerSegmentSlugs()
    .map((slug) => {
      const def = getCdcPageByPath(`/partners/${slug}`);
      if (!def) return null;
      return { href: def.path, title: def.title, description: def.description };
    })
    .filter(Boolean) as { href: string; title: string; description: string }[];

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Collaborate on pilots and programs"
        description="We work with cultural organizations, artists, schools, civic partners, and space sponsors to host workshops, public interfaces, and Miami-focused experiments."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa]">
        <CardGrid items={items} />
      </Section>
      <Section className="bg-white">
        <h2 className="text-lg font-semibold text-neutral-900">Organizations on the Infra24 platform</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Partner cultural organizations each have their own workspace, branding, and tools at a path
          like <span className="font-mono text-xs text-neutral-800">/o/your-org-slug</span>. That
          product layer is unchanged by the CDC public site—it is how Infra24 delivers calendars,
          workshops, signage, and org-specific experiences.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {cdcInfra24TenantOrgs.map((org) => (
            <li key={org.href}>
              <Link
                href={org.href}
                className="font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {org.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="bg-[#fafafa] pb-16">
        <CtaBlock
          headline="Start a conversation"
          body="Tell us whether you are exploring a hosted workshop, a signage pilot, or a neighborhood activation."
          primaryLabel="Partnership contact"
          primaryHref="/contact/partnerships"
          secondaryLabel="General contact"
          secondaryHref="/contact/general"
        />
      </Section>
    </>
  );
}
