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
};

export function PageHero({ eyebrow, title, description, breadcrumbs, className }: PageHeroProps) {
  return (
    <header
      className={cn(
        'border-b border-neutral-200 bg-white pb-10 pt-12 sm:pb-12 sm:pt-16',
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
        )}
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          <Balancer>{title}</Balancer>
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
