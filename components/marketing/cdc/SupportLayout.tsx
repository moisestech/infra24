import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { Section } from './Section';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';

type SupportLayoutProps = {
  path: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function SupportLayout({ path, title, description, children }: SupportLayoutProps) {
  const breadcrumbs = getCdcBreadcrumbs(path);

  return (
    <>
      <PageHero
        eyebrow="Grants"
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      {children ?? (
        <Section className="bg-[#fafafa]">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Funding narrative and downloadable materials are being prepared. For grantmaker
            conversations, email through{' '}
            <a href="/contact/funders" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              funder contact
            </a>
            .
          </p>
        </Section>
      )}
    </>
  );
}
