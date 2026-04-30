import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from '@/lib/cdc/routes';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  /**
   * `knight` — theme-aware gradient title for funder-facing packet pages.
   * `default` — solid text that follows light/dark neutrals.
   */
  titleTone?: 'default' | 'knight';
  /**
   * `mesh` — skip solid hero background so `cdc-mesh-hero-bg` (and its dark rules) control fill.
   */
  surface?: 'solid' | 'mesh';
  /** Optional anchor for in-page navigation (e.g. `knight-top`). */
  anchorId?: string;
  /** Small logo beside eyebrow (e.g. Knight Foundation lockup on /knight). */
  foundationLogoSrc?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
  titleTone = 'default',
  surface = 'solid',
  anchorId,
  foundationLogoSrc,
}: PageHeroProps) {
  return (
    <header
      id={anchorId}
      className={cn(
        anchorId ? 'scroll-mt-28' : undefined,
        'border-b border-neutral-200 pb-10 pt-12 sm:pb-12 sm:pt-16 dark:border-neutral-800',
        surface === 'mesh'
          ? 'bg-transparent'
          : 'bg-white dark:bg-neutral-950',
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
        )}
        {(foundationLogoSrc || eyebrow) && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {foundationLogoSrc ? (
              <Image
                src={foundationLogoSrc}
                alt="Knight Foundation"
                width={220}
                height={72}
                className="h-7 w-auto opacity-[0.78] dark:opacity-[0.88] dark:brightness-110 sm:h-8"
              />
            ) : null}
            {eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {eyebrow}
              </p>
            ) : null}
          </div>
        )}
        <h1
          className={cn(
            foundationLogoSrc ? 'mt-4' : 'mt-2',
            'max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl',
            titleTone === 'knight'
              ? 'bg-gradient-to-br from-teal-600 via-neutral-900 to-violet-700 bg-clip-text text-transparent dark:from-teal-300 dark:via-neutral-100 dark:to-cyan-200'
              : 'text-neutral-900 dark:text-neutral-50'
          )}
        >
          <Balancer>{title}</Balancer>
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
