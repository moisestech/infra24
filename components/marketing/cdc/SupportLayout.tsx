import type { ReactNode } from 'react';
import { PageHero } from './PageHero';
import { Section } from './Section';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cn } from '@/lib/utils';

type SupportLayoutProps = {
  path: string;
  title: string;
  description: string;
  children?: ReactNode;
  /** Rendered above the hero (e.g. brand banner strip). */
  topSlot?: ReactNode;
  heroEyebrow?: string;
  heroTitleTone?: 'default' | 'knight';
  heroFoundationLogoSrc?: string;
  heroClassName?: string;
  heroAnchorId?: string;
};

export function SupportLayout({
  path,
  title,
  description,
  children,
  topSlot,
  heroEyebrow = 'Grants',
  heroTitleTone = 'default',
  heroFoundationLogoSrc,
  heroClassName,
  heroAnchorId,
}: SupportLayoutProps) {
  const breadcrumbs = getCdcBreadcrumbs(path);

  return (
    <>
      {topSlot}
      <PageHero
        anchorId={heroAnchorId}
        eyebrow={heroEyebrow}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        titleTone={heroTitleTone}
        foundationLogoSrc={heroFoundationLogoSrc}
        className={cn(heroClassName)}
      />
      {children ?? (
        <Section className="bg-[#fafafa] dark:bg-neutral-900/35">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Funding narrative and downloadable materials are being prepared. For grantmaker
            conversations, email through{' '}
            <a
              href="/contact/funders"
              className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
            >
              funder contact
            </a>
            .
          </p>
        </Section>
      )}
    </>
  );
}
