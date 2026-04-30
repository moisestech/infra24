import { formatUsd, knightBudgetSummary, knightBudgetUseOfFunds } from '@/lib/marketing/knight-budget';

export function BudgetCategoryColorLegend() {
  const total = knightBudgetSummary.totalProjectUsd;

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white/90 p-5 dark:border-neutral-700 dark:bg-neutral-950/80">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Budget color key</h3>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            The same colors appear in the allocation chart, category accordions, and detail tables—so you can scan by
            theme: green for public programs, purple for artists, slate for leadership, cyan for digital infrastructure,
            orange for documentation, gray for admin.
          </p>
        </div>
        <p className="text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
          Total {formatUsd(total)}
        </p>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {knightBudgetUseOfFunds.map((cat) => (
          <li
            key={cat.id}
            className="flex gap-3 rounded-xl border border-neutral-100 bg-[#fafafa] px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <span
              className="mt-0.5 h-10 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: cat.color }}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-snug text-neutral-900 dark:text-neutral-100">{cat.name}</p>
              <p className="mt-1 text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
                {formatUsd(cat.amountUsd)} · {cat.percentOfTotal}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
