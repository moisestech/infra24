import {
  PENDING_TECHNICAL_REVIEW,
  sprintContributionReady,
  sprintKnownCostUsd,
  sprintPendingRows,
  type QuoteSprintEntry,
} from '@/lib/dcc/fabrication/sprint/quote-sprint'

function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function SprintEstimatePanel({ entry }: { entry: QuoteSprintEntry }) {
  const known = sprintKnownCostUsd(entry.rows)
  const pending = sprintPendingRows(entry.rows)
  const contributionReady = sprintContributionReady(entry.rows)

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Working allowance"
          value={entry.workingAllowanceUsd == null ? 'None' : formatUsd(entry.workingAllowanceUsd)}
        />
        <Metric label="Confidence" value={entry.confidence} />
        <Metric
          label="Known internal cost"
          value={entry.rows.length === 0 ? '—' : formatUsd(known)}
        />
        <Metric
          label="Contribution"
          value={contributionReady ? 'Ready to calculate' : PENDING_TECHNICAL_REVIEW}
        />
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {entry.quoteReadiness} Client-facing allowances are not internal costs. Pending
        rows are omitted from the known-cost total.
      </p>

      {entry.rows.length ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--cdc-border)]">
          <p className="border-b border-[var(--cdc-border)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Internal cost buckets
          </p>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cdc-border)] bg-neutral-50 dark:bg-neutral-900/40">
              <tr>
                <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Bucket
                </th>
                <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Rate frame
                </th>
                <th className="px-4 py-2 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cdc-border)]">
              {entry.rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 text-neutral-800 dark:text-neutral-200">
                    {row.label}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {row.internalRate != null ? formatUsd(row.internalRate) : '—'}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-neutral-900 dark:text-neutral-100">
                    {row.costUsd == null ? PENDING_TECHNICAL_REVIEW : formatUsd(row.costUsd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {pending.length ? (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {pending.length} bucket{pending.length === 1 ? '' : 's'} still need technical
          review. Founder hours are unset, so founder margin is not calculated.
        </p>
      ) : null}

      <section className="rounded-2xl border border-[var(--cdc-border)] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          Next action
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
          {entry.nextAction}
        </p>
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--cdc-border)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
    </article>
  )
}
