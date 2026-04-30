'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { DccServiceItem } from '@/lib/marketing/dcc-services';
import { getDccServiceIcon } from './service-icons';
import { ServiceCarousel } from './ServiceCarousel';

type ServiceContentPanelProps = {
  service: DccServiceItem;
  panelId?: string;
};

export function ServiceContentPanel({
  service,
  panelId = 'dcc-service-evidence-panel',
}: ServiceContentPanelProps) {
  const Icon = getDccServiceIcon(service.iconId);

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={`tab-${service.id}`}
      className={cn(
        'grid gap-6 rounded-[2rem] border p-5 sm:p-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)] lg:gap-8 lg:p-8',
        'border-neutral-200/90 bg-white/90 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-950/70',
        service.panelClass
      )}
    >
      <div className="order-2 flex flex-col lg:order-1">
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50/90 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900/80">
          <Icon className={cn('h-4 w-4', service.accentClass)} aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {service.shortLabel}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl lg:text-3xl">
          {service.title}
        </h3>

        <p className="mt-3 text-sm font-medium text-neutral-800 dark:text-neutral-200 sm:text-base">
          {service.descriptor}
        </p>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
          {service.description}
        </p>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
          Miami · Documentation · {service.shortLabel} · 2025–2026
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {service.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-700 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-7">
          <Link
            href={service.ctaHref}
            className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:border-neutral-100 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            {service.ctaLabel}
          </Link>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <ServiceCarousel
          key={service.id}
          slides={service.slides}
          accentClass={service.accentClass}
          serviceTitle={service.title}
        />
      </div>
    </div>
  );
}
