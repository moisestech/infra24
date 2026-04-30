'use client';

import { cn } from '@/lib/utils';
import type { DccServiceItem } from '@/lib/marketing/dcc-services';
import { getDccServiceIcon } from './service-icons';

type ServiceTabNavProps = {
  services: DccServiceItem[];
  activeServiceId: string;
  onChange: (id: string) => void;
  /** Stable id for the single tabpanel (only one panel is mounted at a time). */
  panelId?: string;
};

export function ServiceTabNav({
  services,
  activeServiceId,
  onChange,
  panelId = 'dcc-service-evidence-panel',
}: ServiceTabNavProps) {
  return (
    <div
      className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]"
      role="tablist"
      aria-label="DCC service areas"
    >
      <div className="flex min-w-max gap-2 sm:gap-3">
        {services.map((service) => {
          const Icon = getDccServiceIcon(service.iconId);
          const isActive = service.id === activeServiceId;

          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              id={`tab-${service.id}`}
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => onChange(service.id)}
              className={cn(
                'group inline-flex max-w-[min(100vw-2rem,22rem)] items-center gap-2.5 rounded-full border px-3 py-2.5 text-left transition sm:gap-3 sm:px-4 sm:py-3',
                isActive
                  ? 'border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900'
                  : 'border-neutral-200 bg-neutral-50/80 hover:border-neutral-300 hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/60 dark:hover:border-neutral-600 dark:hover:bg-neutral-900'
              )}
            >
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition',
                  isActive
                    ? 'border-neutral-200 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800'
                    : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-950'
                )}
              >
                <Icon className={cn('h-4 w-4', service.accentClass)} aria-hidden />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-500 sm:text-[10px] sm:tracking-[0.18em]">
                  [{service.shortLabel}]
                </span>
                <span className="line-clamp-2 text-xs font-medium text-neutral-900 dark:text-neutral-100 sm:text-sm">
                  {service.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
