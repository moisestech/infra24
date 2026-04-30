import { formatUsd, knightBudgetKnightAllocation } from '@/lib/marketing/knight-budget';

export function KnightAllocationPanel() {
  return (
    <div className="rounded-2xl border border-blue-200/60 bg-white p-5 dark:border-blue-900/40 dark:bg-neutral-900/60">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Knight request allocation</h3>
      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
        How the $200,000 Knight ask maps to the most mission-aligned parts of the pilot.
      </p>
      <ul className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
        {knightBudgetKnightAllocation.map((row) => (
          <li
            key={row.id}
            className="flex items-start justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"
          >
            <span className="text-neutral-700 dark:text-neutral-300">{row.label}</span>
            <span className="shrink-0 tabular-nums font-medium text-neutral-900 dark:text-neutral-100">
              {formatUsd(row.amountUsd)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
