import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { Section } from './Section';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';

const PLACEHOLDER_SECTIONS = [
  { heading: 'Context', body: 'Where this work lived and what constraints shaped it.' },
  { heading: 'Problem', body: 'What was breaking for staff, artists, or the public.' },
  { heading: 'What we built', body: 'Interfaces, workflows, and systems put in place.' },
  { heading: 'Who it served', body: 'Primary users and communities of use.' },
  { heading: 'Public value', body: 'Why this matters beyond a single institution.' },
  { heading: 'Technical layer', body: 'How Infra24 implements maintainable infrastructure.' },
  { heading: 'Lessons & next phase', body: 'What we learned and what could scale citywide.' },
] as const;

type CaseStudyLayoutProps = {
  path: string;
  title: string;
  description: string;
  infra24Note?: string;
  isCollection?: boolean;
  children?: ReactNode;
};

export function CaseStudyLayout({
  path,
  title,
  description,
  infra24Note,
  isCollection,
  children,
}: CaseStudyLayoutProps) {
  const breadcrumbs = getCdcBreadcrumbs(path);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      {children ??
        (isCollection ? (
          <Section className="bg-[#fafafa]">
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
              Browse case studies and pilots in this category from the projects index, or jump to{' '}
              <a href="/grants/funders" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
                funder materials
              </a>
              .
            </p>
          </Section>
        ) : (
          <>
            {infra24Note && (
              <Section className="border-b border-neutral-100 bg-white">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Infra24 layer
                </p>
                <p className="mt-2 max-w-2xl text-sm text-neutral-700">{infra24Note}</p>
              </Section>
            )}
            {PLACEHOLDER_SECTIONS.map((block, i) => (
              <Section
                key={block.heading}
                className={i % 2 === 0 ? 'bg-[#fafafa]' : 'bg-white'}
              >
                <h2 className="text-lg font-semibold text-neutral-900">{block.heading}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                  {block.body}
                </p>
              </Section>
            ))}
          </>
        ))}
    </>
  );
}
