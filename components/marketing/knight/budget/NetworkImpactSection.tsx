import { knightBudgetImpactMetrics } from '@/lib/marketing/knight-budget';

export function NetworkImpactSection() {
  return (
    <div className="relative space-y-0">
      <ol className="relative space-y-0">
        {knightBudgetImpactMetrics.map((m, idx) => (
          <li key={m.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-50 text-xs font-bold text-blue-900 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-100">
                {idx + 1}
              </span>
              {idx < knightBudgetImpactMetrics.length - 1 ? (
                <span
                  className="mt-1 w-px flex-1 min-h-[1.25rem] bg-gradient-to-b from-blue-300 to-teal-300 dark:from-blue-700 dark:to-teal-700"
                  aria-hidden
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-neutral-200/90 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-950/80">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{m.name}</p>
                  {m.description ? (
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{m.description}</p>
                  ) : null}
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-teal-800 dark:text-teal-200">
                  {m.target}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
