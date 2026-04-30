import { formatUsd, knightBudgetSummary } from '@/lib/marketing/knight-budget';

export function BudgetKpiCards() {
  const s = knightBudgetSummary;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-2xl border border-neutral-200/90 bg-[#fafafa] p-5 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900/80">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Total year-one budget
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {formatUsd(s.totalProjectUsd)}
        </p>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">Year-one managed pilot envelope.</p>
      </div>
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/90 to-white p-5 transition-shadow hover:shadow-md dark:border-blue-900/50 dark:from-blue-950/35 dark:to-neutral-900/90">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-900 dark:text-blue-200">
          Knight Foundation request
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-blue-950 dark:text-blue-50">
          {formatUsd(s.knightFoundationAskUsd)}
        </p>
        <p className="mt-2 text-xs text-blue-900/80 dark:text-blue-200/80">Anchor funding for the pilot.</p>
      </div>
      <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50/80 to-white p-5 transition-shadow hover:shadow-md dark:border-teal-800/50 dark:from-teal-950/40 dark:to-neutral-900/90">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-800 dark:text-teal-200">
          Match / in-kind / other support
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-teal-950 dark:text-teal-50">
          {formatUsd(s.counterpartFundingUsd)}
        </p>
        <p className="mt-2 text-xs text-teal-900/80 dark:text-teal-200/80">Partners, earned revenue, sponsorships, in-kind.</p>
      </div>
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900/80">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Pilot duration
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {s.pilotDurationMonths} months
        </p>
      </div>
      <div className="rounded-2xl border border-emerald-200/70 bg-white p-5 transition-shadow hover:shadow-md dark:border-emerald-900/40 dark:bg-neutral-900/80">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
          Core priority
        </p>
        <p className="mt-2 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          Public programs + network growth
        </p>
      </div>
      <div className="rounded-2xl border border-cyan-200/70 bg-white p-5 transition-shadow hover:shadow-md dark:border-cyan-900/40 dark:bg-neutral-900/80">
        <p className="text-xs font-medium uppercase tracking-wide text-cyan-800 dark:text-cyan-200">
          Infrastructure layer
        </p>
        <p className="mt-2 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          CRM, portal, analytics, online school
        </p>
      </div>
    </div>
  );
}
