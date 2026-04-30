import { knightBudgetPhases } from '@/lib/marketing/knight-budget';
import { budgetPhaseIcons } from '@/components/marketing/knight/budget/budget-section-meta';

/** Months per phase in Year 1 — drives proportional strip (2 + 4 + 4 + 2 = 12). */
const PHASE_MONTH_WEIGHTS = [2, 4, 4, 2] as const;

const PHASE_STRIP_COLORS = [
  'bg-teal-500 dark:bg-teal-600',
  'bg-blue-500 dark:bg-blue-600',
  'bg-violet-500 dark:bg-violet-600',
  'bg-amber-500 dark:bg-amber-600',
] as const;

export function BudgetPhaseTimeline() {
  const totalMonths = PHASE_MONTH_WEIGHTS.reduce((a, n) => a + n, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Twelve-month deployment (by phase length)
        </p>
        <div
          className="flex h-6 w-full overflow-hidden rounded-full border border-neutral-200/90 shadow-inner dark:border-neutral-700"
          role="img"
          aria-label="Budget and activity weighted across four pilot phases"
        >
          {PHASE_MONTH_WEIGHTS.map((months, i) => (
            <div
              key={knightBudgetPhases[i]?.id ?? i}
              className={`${PHASE_STRIP_COLORS[i]} flex items-center justify-center text-[10px] font-bold text-white/95`}
              style={{ width: `${(months / totalMonths) * 100}%` }}
              title={`Phase ${i + 1}: ${months} months`}
            >
              <span className="sr-only">
                Phase {i + 1}: {months} of {totalMonths} months
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
          {knightBudgetPhases.map((phase, i) => (
            <span key={phase.id} className="tabular-nums">
              <span className={`inline-block h-2 w-2 rounded-full ${PHASE_STRIP_COLORS[i]} align-middle`} aria-hidden />{' '}
              {phase.months}
            </span>
          ))}
        </div>
      </div>

      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {knightBudgetPhases.map((phase, i) => {
          const Icon = budgetPhaseIcons[i] ?? budgetPhaseIcons[0];
          return (
            <li
              key={phase.id}
              className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white dark:border-neutral-700 dark:bg-neutral-900/60"
            >
              <div
                className={`h-1 w-full ${PHASE_STRIP_COLORS[i]}`}
                aria-hidden
              />
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-[#fafafa] dark:border-neutral-700 dark:bg-neutral-950/80`}
                  >
                    <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold tabular-nums text-blue-700 dark:text-blue-300">
                      Phase {i + 1}
                    </span>
                    <h3 className="mt-0.5 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      {phase.label}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {phase.months}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{phase.description}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Focus
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-neutral-700 dark:text-neutral-300">
                  {phase.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
