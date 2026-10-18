import type { PilotEstimatePlan } from '@/lib/dcc/fabrication/proposals/pilot-estimates'
import { pilotEstimateLinesTotal } from '@/lib/dcc/fabrication/proposals/pilot-estimates'

function money(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function Items({ title, items }: { title: string; items: ReadonlyArray<string> }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        {title}
      </h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

/** Planning-only: requires an approved fixed scope before it can become a quote. */
export function PilotEstimate({ plan }: { plan: PilotEstimatePlan }) {
  if (pilotEstimateLinesTotal(plan) !== plan.amountUsd) {
    throw new Error('Pilot planning allowance does not match its line items')
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--cdc-border)]">
      <div className="border-b border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/50">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--cdc-teal)]">
          Provisional planning allowance · not an approved quotation
        </p>
        <h3 className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {plan.label}
        </h3>
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-100">
          {money(plan.amountUsd)}
        </p>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          No deposit is due. This is a budgeting scenario, not an invoice or an offer to start fabrication.
        </p>
      </div>

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--cdc-border)] font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                <th className="pb-3 font-medium">Planning line</th>
                <th className="pb-3 text-right font-medium">Allowance</th>
              </tr>
            </thead>
            <tbody>
              {plan.lines.map((line) => (
                <tr key={line.label} className="border-b border-[var(--cdc-border)]">
                  <td className="py-3 pr-4">{line.label}</td>
                  <td className="py-3 text-right font-mono tabular-nums">{money(line.amountUsd)}</td>
                </tr>
              ))}
              <tr className="font-semibold text-neutral-900 dark:text-neutral-100">
                <td className="pt-3">Total, subject to scope</td>
                <td className="pt-3 text-right font-mono tabular-nums">{money(plan.amountUsd)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <dl className="mt-6 grid gap-4 rounded-xl border border-[var(--cdc-border)] p-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
              Indicative production window
            </dt>
            <dd className="mt-1 font-semibold">{plan.turnaround}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
              If a fixed quote later uses 50% deposit
            </dt>
            <dd className="mt-1 font-semibold">{money(plan.depositIllustrationUsd)} · illustration only</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
          Timeline begins {plan.timelineStartsWhen}. No start date or printer reservation is promised.
        </p>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <Items title="Planned equipment" items={plan.equipment} />
          <Items title="Included in this scenario" items={plan.includes} />
          <Items title="Confirm before final quote" items={plan.dependencies} />
          <Items title="Not included" items={plan.exclusions} />
        </div>
        <p className="mt-6 border-t border-[var(--cdc-border)] pt-4 text-xs text-neutral-500">
          DCC will issue a separate fixed quote for approval after technical review. This page cannot accept payment or approve the job.
        </p>
      </div>
    </article>
  )
}
