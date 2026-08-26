'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  FABRICATION_QUEUE_TIERS,
  FABRICATION_RATE_CARDS,
  PLANNING_ESTIMATE_SEED,
  buildPlanningEstimateNote,
  buildQuoteHandoffHref,
  estimateQuote,
  formatUsd,
  rushPercentageForQueue,
  type FabricationRateTierId,
  type QueueTierId,
} from '@/lib/dcc/fabrication'

const field =
  'mt-1 w-full rounded-lg border border-[var(--cdc-border)] bg-white px-3 py-2.5 text-sm dark:bg-neutral-950'

export function FabricateEstimateCalculator() {
  const [tier, setTier] = useState<FabricationRateTierId>(PLANNING_ESTIMATE_SEED.tier)
  const [printHours, setPrintHours] = useState(String(PLANNING_ESTIMATE_SEED.printHours))
  const [materialGrams, setMaterialGrams] = useState(
    String(PLANNING_ESTIMATE_SEED.materialGrams)
  )
  const [laborHours, setLaborHours] = useState(String(PLANNING_ESTIMATE_SEED.laborHours))
  const [queue, setQueue] = useState<QueueTierId>(PLANNING_ESTIMATE_SEED.queue)

  const hours = Math.max(0, Number(printHours) || 0)
  const grams = Math.max(0, Number(materialGrams) || 0)
  const labor = Math.max(0, Number(laborHours) || 0)
  const rushPercentage = rushPercentageForQueue(queue)

  const breakdown = useMemo(
    () =>
      estimateQuote({
        tier,
        printHours: hours,
        materialGrams: grams,
        laborHours: labor,
        rushPercentage,
      }),
    [tier, hours, grams, labor, rushPercentage]
  )

  const quoteHref = buildQuoteHandoffHref({
    tier,
    printHours: hours,
    materialGrams: grams,
    laborHours: labor,
    queue,
  })

  const estimateNote = buildPlanningEstimateNote({
    tier,
    printHours: hours,
    materialGrams: grams,
    laborHours: labor,
    queue,
    total: breakdown.total,
  })

  const lines = [
    { label: 'Setup', value: breakdown.setup },
    { label: 'Machine', value: breakdown.machine },
    { label: 'Material', value: breakdown.material },
    { label: 'Human labor', value: breakdown.labor },
    ...(breakdown.rushFee > 0
      ? [{ label: 'Priority / rush', value: breakdown.rushFee }]
      : []),
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Service rate
          </span>
          <select
            className={field}
            value={tier}
            onChange={(e) => setTier(e.target.value as FabricationRateTierId)}
          >
            {FABRICATION_RATE_CARDS.map((card) => (
              <option key={card.id} value={card.id}>
                {card.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              Print time
            </span>
            <input
              className={field}
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              value={printHours}
              onChange={(e) => setPrintHours(e.target.value)}
            />
            <span className="mt-1 block text-xs text-neutral-500">Hours</span>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              Material
            </span>
            <input
              className={field}
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={materialGrams}
              onChange={(e) => setMaterialGrams(e.target.value)}
            />
            <span className="mt-1 block text-xs text-neutral-500">Grams</span>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              Human labor
            </span>
            <input
              className={field}
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              value={laborHours}
              onChange={(e) => setLaborHours(e.target.value)}
            />
            <span className="mt-1 block text-xs text-neutral-500">Hours</span>
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Priority
          </span>
          <select
            className={field}
            value={queue}
            onChange={(e) => setQueue(e.target.value as QueueTierId)}
          >
            {FABRICATION_QUEUE_TIERS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label}
                {q.surcharge ? ` (${q.pricing})` : ''}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-4 font-mono text-sm dark:bg-neutral-900/40 sm:p-5">
        <ul className="space-y-2">
          {lines.map((line) => (
            <li key={line.label} className="flex justify-between gap-4">
              <span className="uppercase tracking-wide text-neutral-500">{line.label}</span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {formatUsd(line.value)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between gap-4 border-t border-[var(--cdc-border)] pt-3 text-base font-semibold">
          <span className="uppercase tracking-wide">Estimated total</span>
          <span>{formatUsd(breakdown.total)}</span>
        </div>
        {breakdown.appliedMinimum ? (
          <p className="mt-2 text-xs text-neutral-500">
            Tier minimum of {formatUsd(breakdown.minimum)} applied.
          </p>
        ) : null}
        <p className="mt-4 font-sans text-sm text-neutral-600 dark:text-neutral-400">
          Planning estimate only. DCC reviews the actual file before approving fabrication.
        </p>
        <Link
          href={quoteHref}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 font-sans text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Request project review
        </Link>
        <p className="mt-3 font-sans text-[11px] leading-relaxed text-neutral-500">
          {estimateNote}
        </p>
      </div>
    </div>
  )
}
