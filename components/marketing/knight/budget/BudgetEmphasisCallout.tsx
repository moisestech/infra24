import { knightBudgetEmphasis } from '@/lib/marketing/knight-budget';

export function BudgetEmphasisCallout() {
  const e = knightBudgetEmphasis;

  return (
    <aside className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-neutral-900 dark:to-violet-950/20">
      <div className="relative max-w-3xl">
        <p className="text-4xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300 sm:text-5xl">{e.primaryStat}</p>
        <p className="mt-2 text-lg font-medium leading-snug text-neutral-900 dark:text-neutral-100">{e.primaryLabel}</p>
        <p className="mt-4 text-base font-medium text-cyan-800 dark:text-cyan-200">{e.secondaryLine}</p>
        <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{e.supporting}</p>
      </div>
    </aside>
  );
}
