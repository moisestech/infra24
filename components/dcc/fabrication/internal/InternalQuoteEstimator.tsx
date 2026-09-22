'use client'

import { useMemo, useState } from 'react'
import {
  FOUNDER_MARGIN_WARNING_USD,
  MACHINE_HOURLY_USD,
  OPERATOR_HOURLY_USD,
} from '@/lib/dcc/fabrication/economics-defaults'
import { calculateQuoteEconomics } from '@/lib/dcc/fabrication/quote-economics'
import {
  buildHeatherCostLineItems,
  HEATHER_DEFAULT_COST_INPUTS,
  HEATHER_QUOTE_TOTAL_USD,
  type HeatherCostInputs,
} from '@/lib/dcc/fabrication/proposals/heather-quote'
import type { ClientProposal } from '@/lib/dcc/fabrication/schema'

function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

type Props = {
  proposal: ClientProposal
}

export function InternalQuoteEstimator({ proposal }: Props) {
  const quoteTotal = proposal.pricing?.amountUsd ?? HEATHER_QUOTE_TOTAL_USD
  const defaultFounderHours = proposal.defaultFounderHours ?? 2.5

  const [machineHours, setMachineHours] = useState(
    HEATHER_DEFAULT_COST_INPUTS.machineHours
  )
  const [operatorHours, setOperatorHours] = useState(
    HEATHER_DEFAULT_COST_INPUTS.operatorHours
  )
  const [consumablesUsd, setConsumablesUsd] = useState(
    HEATHER_DEFAULT_COST_INPUTS.consumablesUsd
  )
  const [founderHours, setFounderHours] = useState(defaultFounderHours)

  const costInputs: HeatherCostInputs = useMemo(
    () => ({
      machineHours,
      operatorHours,
      consumablesUsd,
      quoteTotal,
    }),
    [machineHours, operatorHours, consumablesUsd, quoteTotal]
  )

  const costLineItems = useMemo(
    () => buildHeatherCostLineItems(costInputs),
    [costInputs]
  )

  const economics = useMemo(
    () =>
      calculateQuoteEconomics({
        quoteTotal,
        costLineItems,
        founderHours,
      }),
    [quoteTotal, costLineItems, founderHours]
  )

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Client price" value={formatUsd(economics.quoteTotal)} />
        <MetricCard label="Direct cost" value={formatUsd(economics.directCost)} />
        <MetricCard
          label="Contribution"
          value={formatUsd(economics.contribution)}
          highlight
        />
        <MetricCard
          label="Founder margin / hr"
          value={formatUsd(economics.founderMarginPerHour)}
          warn={economics.belowFounderThreshold}
        />
      </div>

      {economics.belowFounderThreshold ? (
        <div className="rounded-2xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-100">
          Founder margin is below {formatUsd(FOUNDER_MARGIN_WARNING_USD)}/hr at{' '}
          {founderHours} founder hours. Tighten scope, adjust quote, or reduce
          founder time before accepting.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="rounded-2xl border border-[var(--cdc-border)] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Assumptions
          </p>
          <div className="mt-4 space-y-4">
            <NumberField
              label="Machine hours"
              value={machineHours}
              step={0.5}
              onChange={setMachineHours}
              hint={`× ${formatUsd(MACHINE_HOURLY_USD)}/hr internal`}
            />
            <NumberField
              label="Operator hours"
              value={operatorHours}
              step={0.5}
              onChange={setOperatorHours}
              hint={`× ${formatUsd(OPERATOR_HOURLY_USD)}/hr internal`}
            />
            <NumberField
              label="Consumables (USD)"
              value={consumablesUsd}
              step={1}
              onChange={setConsumablesUsd}
            />
            <NumberField
              label="Founder hours"
              value={founderHours}
              step={0.25}
              onChange={setFounderHours}
              hint={`Warning below ${formatUsd(FOUNDER_MARGIN_WARNING_USD)}/hr`}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--cdc-border)]">
          <p className="border-b border-[var(--cdc-border)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            Direct cost lines
          </p>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cdc-border)] bg-neutral-50 dark:bg-neutral-900/40">
              <tr>
                <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Category
                </th>
                <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Qty
                </th>
                <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Rate
                </th>
                <th className="px-4 py-2 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cdc-border)]">
              {costLineItems.map((line) => (
                <tr key={line.id}>
                  <td className="px-4 py-2 text-neutral-800 dark:text-neutral-200">
                    {line.label ?? line.category}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {line.quantity != null
                      ? `${line.quantity}${line.unit ? ` ${line.unit}` : ''}`
                      : '—'}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {line.internalRate != null
                      ? formatUsd(line.internalRate)
                      : line.notes ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-neutral-900 dark:text-neutral-100">
                    {formatUsd(line.cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <p className="text-xs text-neutral-500">
        Not a live books system. Assumptions for {proposal.job.jobNumber} — client
        packaging ({formatUsd(quoteTotal)} in five lines) differs from internal
        allocation. Simple known file might be ~$240; this job is{' '}
        {formatUsd(quoteTotal)}; complex scopes can run $1,200+.
      </p>
    </div>
  )
}

function MetricCard({
  label,
  value,
  highlight,
  warn,
}: {
  label: string
  value: string
  highlight?: boolean
  warn?: boolean
}) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        warn
          ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30'
          : highlight
            ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
            : 'border-[var(--cdc-border)] bg-neutral-50 dark:bg-neutral-900/40'
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </article>
  )
}

function NumberField({
  label,
  value,
  step,
  hint,
  onChange,
}: {
  label: string
  value: number
  step: number
  hint?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-neutral-900 dark:text-neutral-100">
        {label}
      </span>
      <input
        type="number"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-xl border border-[var(--cdc-border)] bg-white px-3 py-2 font-mono text-sm dark:bg-neutral-950"
      />
      {hint ? (
        <span className="mt-1 block text-xs text-neutral-500">{hint}</span>
      ) : null}
    </label>
  )
}
