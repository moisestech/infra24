'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { dccServices } from '@/lib/marketing/dcc-services';
import { ServiceTabNav } from './ServiceTabNav';
import { ServiceContentPanel } from './ServiceContentPanel';

export type ServiceEvidenceSectionProps = {
  /**
   * Suffix for tab panel `id` / `aria-controls` when more than one instance exists
   * (e.g. homepage + `/knight`). Use `knight` on the packet page.
   */
  instanceId?: string;
  /** Hide the closing request/partner strip (e.g. when the page already has a contact block). */
  showBottomCta?: boolean;
  /** Tighter heading stack for embedded contexts like the Knight packet. */
  headingDensity?: 'default' | 'compact';
  className?: string;
};

export function ServiceEvidenceSection({
  instanceId = '',
  showBottomCta = true,
  headingDensity = 'default',
  className,
}: ServiceEvidenceSectionProps) {
  const [activeServiceId, setActiveServiceId] = useState(dccServices[0].id);

  const activeService = useMemo(() => {
    return dccServices.find((s) => s.id === activeServiceId) ?? dccServices[0];
  }, [activeServiceId]);

  const panelId =
    instanceId.length > 0
      ? (`dcc-service-evidence-panel--${instanceId}` as const)
      : ('dcc-service-evidence-panel' as const);

  const compact = headingDensity === 'compact';

  return (
    <div className={cn('relative', className)}>
      <div
        className="pointer-events-none absolute -inset-x-6 -top-4 bottom-0 opacity-40 dark:opacity-30 sm:-inset-x-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.06] via-transparent to-violet-500/[0.05] dark:from-cyan-500/10 dark:to-violet-500/10" />
      </div>

      <div className={cn('relative', compact ? 'mb-6 sm:mb-8' : 'mb-8 sm:mb-10')}>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
          What DCC does
        </p>
        <h2
          className={cn(
            'max-w-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100',
            compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'
          )}
        >
          Services, workshops, and real-world support
        </h2>
        <p
          className={cn(
            'max-w-3xl text-neutral-600 dark:text-neutral-400',
            compact ? 'mt-3 text-sm leading-relaxed' : 'mt-4 text-sm leading-relaxed sm:text-base'
          )}
        >
          DCC combines direct artist support, public learning, and practical cultural infrastructure.
          Explore each area through real examples, documentation, and past work.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
          Swipe images · Explore by category · Used in practice
        </p>
      </div>

      <ServiceTabNav
        services={dccServices}
        activeServiceId={activeServiceId}
        onChange={setActiveServiceId}
        panelId={panelId}
      />

      <div className="mt-8">
        <ServiceContentPanel service={activeService} panelId={panelId} />
      </div>

      {showBottomCta ? (
        <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50/90 p-5 dark:border-neutral-700 dark:bg-neutral-900/80 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Interested in support, collaboration, or hosting a session?
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
                DCC is building a distributed support model for artists and cultural organizations in Miami.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                Request support
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
              >
                Become a partner
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
