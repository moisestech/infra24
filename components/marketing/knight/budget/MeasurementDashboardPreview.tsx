'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { knightBudgetMeasurementAreas } from '@/lib/marketing/knight-budget';

type Tab = 'targets' | 'live' | 'quarterly';

const TAB_COPY: Record<
  Tab,
  { label: string; blurb: string }
> = {
  targets: {
    label: 'Targets',
    blurb: 'Year-one targets and definitions above—mapped to CRM, programs, and reporting workflows.',
  },
  live: {
    label: 'Live data',
    blurb:
      'During the pilot, dashboards will pull from the CRM, portals, ticketing, and learning tools as integrations go live.',
  },
  quarterly: {
    label: 'Quarterly reports',
    blurb: 'Funders and partners receive rolling summaries tied to milestones—not only a single end-of-year snapshot.',
  },
};

export function MeasurementDashboardPreview() {
  const [tab, setTab] = useState<Tab>('targets');

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Measurement view"
      >
        {(Object.keys(TAB_COPY) as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors',
              tab === key
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
            )}
            onClick={() => setTab(key)}
          >
            {TAB_COPY[key].label}
          </button>
        ))}
      </div>
      <p className="max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">{TAB_COPY[tab].blurb}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {knightBudgetMeasurementAreas.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-neutral-200/90 bg-[#fafafa] p-4 dark:border-neutral-700 dark:bg-neutral-950/80"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              {row.area}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{row.measures}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
