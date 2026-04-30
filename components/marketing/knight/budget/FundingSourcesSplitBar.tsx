'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  formatUsd,
  knightBudgetFundingExamples,
  knightBudgetSummary,
} from '@/lib/marketing/knight-budget';

const KNIGHT = '#1d4ed8';
const MATCH = '#14b8a6';

export function FundingSourcesSplitBar() {
  const [focus, setFocus] = useState<'knight' | 'match' | null>(null);
  const s = knightBudgetSummary;

  return (
    <div className="space-y-4">
      <div
        className="flex h-14 w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700"
        role="group"
        aria-label="Funding sources fifty-fifty split"
      >
        <button
          type="button"
          className={cn(
            'relative flex min-w-0 flex-1 flex-col justify-center px-4 text-left text-white transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950',
            focus === 'match' && 'opacity-60'
          )}
          style={{ backgroundColor: KNIGHT }}
          onMouseEnter={() => setFocus('knight')}
          onMouseLeave={() => setFocus(null)}
          onFocus={() => setFocus('knight')}
          onBlur={() => setFocus(null)}
          aria-pressed={focus === 'knight'}
        >
          <span className="text-xs font-semibold uppercase tracking-wide opacity-90">Knight Foundation</span>
          <span className="text-sm font-bold tabular-nums">{formatUsd(s.knightFoundationAskUsd)} · 50%</span>
        </button>
        <button
          type="button"
          className={cn(
            'relative flex min-w-0 flex-1 flex-col justify-center px-4 text-left text-white transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950',
            focus === 'knight' && 'opacity-60'
          )}
          style={{ backgroundColor: MATCH }}
          onMouseEnter={() => setFocus('match')}
          onMouseLeave={() => setFocus(null)}
          onFocus={() => setFocus('match')}
          onBlur={() => setFocus(null)}
          aria-pressed={focus === 'match'}
        >
          <span className="truncate text-xs font-semibold uppercase tracking-wide opacity-90">
            Match / in-kind / other
          </span>
          <span className="text-sm font-bold tabular-nums">{formatUsd(s.counterpartFundingUsd)} · 50%</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className={cn(
            'rounded-xl border border-blue-200/70 bg-blue-50/50 p-4 text-sm dark:border-blue-900/50 dark:bg-blue-950/25',
            focus === 'match' && 'opacity-50'
          )}
        >
          <p className="font-semibold text-blue-950 dark:text-blue-100">Knight request examples</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-neutral-800 dark:text-neutral-300">
            {knightBudgetFundingExamples.knight.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div
          className={cn(
            'rounded-xl border border-teal-200/70 bg-teal-50/50 p-4 text-sm dark:border-teal-900/50 dark:bg-teal-950/25',
            focus === 'knight' && 'opacity-50'
          )}
        >
          <p className="font-semibold text-teal-950 dark:text-teal-100">Match &amp; other support examples</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-neutral-800 dark:text-neutral-300">
            {knightBudgetFundingExamples.match.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
        Total pilot envelope {formatUsd(s.totalProjectUsd)} · equal anchor and leverage layers at{' '}
        {formatUsd(s.knightFoundationAskUsd)} each
      </p>
    </div>
  );
}
