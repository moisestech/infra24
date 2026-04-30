import { knightBudgetImpactFlow } from '@/lib/marketing/knight-budget';

export function BudgetSteppedFlow() {
  const { columns, narrativeBlocks, footnotes } = knightBudgetImpactFlow;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <section
            key={col.title}
            className="rounded-2xl border border-neutral-200/90 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900/60"
          >
            <h3 className="text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {col.items.map((item) => (
                <li
                  key={item.label}
                  className="rounded-lg border border-neutral-100 bg-[#fafafa] px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950/80"
                >
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.label}</p>
                  {item.hint ? (
                    <p className="mt-0.5 text-xs tabular-nums text-neutral-600 dark:text-neutral-400">{item.hint}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {narrativeBlocks.map((block) => (
          <div
            key={block.title}
            className="rounded-2xl border border-neutral-200/80 bg-[#fafafa] p-5 dark:border-neutral-700 dark:bg-neutral-950/80"
          >
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{block.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{block.body}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-2 border-l-2 border-blue-200 pl-4 text-sm text-neutral-700 dark:border-blue-900 dark:text-neutral-300">
        {footnotes.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
