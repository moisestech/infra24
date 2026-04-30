import { formatUsd, knightBudgetUseOfFunds } from '@/lib/marketing/knight-budget';

/** Full-width proportional strip — quick visual of category mix (same colors as charts). */
export function BudgetAllocationStrip() {
  const sorted = [...knightBudgetUseOfFunds].sort((a, b) => b.amountUsd - a.amountUsd);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Share of pilot budget by category
      </p>
      <div
        className="flex h-4 w-full overflow-hidden rounded-full border border-neutral-200/80 shadow-inner dark:border-neutral-700"
        role="img"
        aria-label="Budget allocation by category, proportional bar"
      >
        {sorted.map((cat) => (
          <div
            key={cat.id}
            className="h-full min-w-[3px] transition-[flex-grow] duration-300 first:rounded-l-full last:rounded-r-full"
            style={{
              backgroundColor: cat.color,
              flexGrow: cat.amountUsd,
            }}
            title={`${cat.name}: ${formatUsd(cat.amountUsd)} (${cat.percentOfTotal}%)`}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
        {sorted.map((cat) => (
          <li key={cat.id} className="flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} aria-hidden />
            <span className="max-w-[10rem] truncate sm:max-w-none">{cat.name}</span>
            <span className="tabular-nums text-neutral-500 dark:text-neutral-500">({cat.percentOfTotal}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
