import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { Section } from './Section';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';

type ProgramLayoutProps = {
  path: string;
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function ProgramLayout({ path, title, description, eyebrow, children }: ProgramLayoutProps) {
  const breadcrumbs = getCdcBreadcrumbs(path);

  return (
    <>
      <PageHero
        eyebrow={eyebrow ?? 'Programs'}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      {children ?? (
        <Section className="bg-[#fafafa]">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Program details and scheduling will appear here as offerings are announced. For
            partnerships or grant-aligned pilots, use{' '}
            <a href="/contact/partnerships" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              partnership contact
            </a>
            .
          </p>
        </Section>
      )}
    </>
  );
}
