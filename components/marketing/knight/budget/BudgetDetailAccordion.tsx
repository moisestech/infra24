'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { formatUsd, knightBudgetCategories, knightBudgetUseOfFunds } from '@/lib/marketing/knight-budget';

const colorByCategoryId = Object.fromEntries(knightBudgetUseOfFunds.map((c) => [c.id, c.color])) as Record<
  string,
  string
>;

export function BudgetDetailAccordion() {
  return (
    <Accordion type="multiple" className="space-y-3">
      {knightBudgetCategories.map((cat) => {
        const catTotal = cat.lines.reduce((a, l) => a + l.amountUsd, 0);
        const catKnight = cat.lines.reduce((a, l) => a + l.knightPortionUsd, 0);
        const dot = colorByCategoryId[cat.id] ?? '#737373';

        return (
          <AccordionItem
            key={cat.id}
            value={cat.id}
            className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white dark:border-neutral-700 dark:bg-neutral-950/80"
          >
            <AccordionTrigger
              className={cn(
                'px-4 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-neutral-100 dark:[&[data-state=open]]:border-neutral-800'
              )}
            >
              <div className="flex w-full flex-col gap-3 text-left sm:flex-row sm:items-center sm:gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-neutral-200/80 dark:border-neutral-600"
                    style={{ backgroundColor: dot }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{cat.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {cat.lines.length} line items — expand for breakdown
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Pilot cost
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                      {formatUsd(catTotal)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Knight share
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-teal-800 dark:text-teal-200">
                      {formatUsd(catKnight)}
                    </p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-0 pt-0">
              <div className="overflow-x-auto border-t border-neutral-100 dark:border-neutral-800">
                <table className="min-w-[32rem] w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-left dark:border-neutral-700 dark:bg-neutral-900/80">
                      <th scope="col" className="px-4 py-3 font-medium text-neutral-700 dark:text-neutral-300">
                        Line
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Pilot cost
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Knight portion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.lines.map((line) => (
                      <tr
                        key={line.id}
                        className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                      >
                        <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                          <span className="font-medium">{line.label}</span>
                          {line.note ? (
                            <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-500">
                              {line.note}
                            </span>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-neutral-800 dark:text-neutral-200">
                          {formatUsd(line.amountUsd)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-neutral-800 dark:text-neutral-200">
                          {formatUsd(line.knightPortionUsd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-neutral-200 bg-neutral-50/90 font-medium dark:border-neutral-700 dark:bg-neutral-900/90">
                      <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">Category subtotal</td>
                      <td className="px-4 py-3 text-right tabular-nums text-neutral-900 dark:text-neutral-100">
                        {formatUsd(catTotal)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-neutral-900 dark:text-neutral-100">
                        {formatUsd(catKnight)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
