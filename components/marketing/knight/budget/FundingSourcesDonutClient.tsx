'use client'

import dynamic from 'next/dynamic'

export const FundingSourcesDonut = dynamic(
  () =>
    import('@/components/marketing/knight/budget/FundingSourcesDonut').then((m) => ({
      default: m.FundingSourcesDonut,
    })),
  { ssr: false, loading: () => <ChartFallback /> }
);

function ChartFallback() {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400">
      Loading chart…
    </div>
  );
}

