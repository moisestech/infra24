import {
  clientFacingJobStatus,
  type FabricationJobStatus,
} from '@/lib/dcc/fabrication/job-status'
import {
  PRICE_REFERENCE_DISCLAIMER,
  type ClientProposal,
  type Material,
  type Machine,
  type OwnershipSplit,
  type QuoteLineItem,
} from '@/lib/dcc/fabrication/schema'
import { getClientVisibleQuoteLines } from '@/lib/dcc/fabrication/client-quote-view'
import { sumQuoteLineAmounts } from '@/lib/dcc/fabrication/quote-economics'
import { materialPriceLabel } from '@/lib/dcc/fabrication/materials'
import { machineAccessLabel } from '@/lib/dcc/fabrication/machines-catalog'
import { cn } from '@/lib/utils'

export function ProposalSection({
  id,
  kicker,
  title,
  children,
}: {
  id?: string
  kicker?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-32 lg:scroll-mt-24">
      {kicker ? (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </section>
  )
}

export function ProposalHero({
  kicker,
  title,
  dek,
  children,
}: {
  kicker: string
  title: string
  dek: string
  children?: React.ReactNode
}) {
  return (
    <header className="mt-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
        {kicker}
      </p>
      <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
        {dek}
      </p>
      {children ? <div className="mt-6 space-y-4">{children}</div> : null}
    </header>
  )
}

export function ProjectGoal({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>
}

export function ProjectStatus({ status }: { status: FabricationJobStatus }) {
  return (
    <p className="inline-flex items-center rounded-full border border-[var(--cdc-border)] bg-neutral-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-200">
      Status · {clientFacingJobStatus(status)}
    </p>
  )
}

export function TechnicalSnapshot({
  rows,
  caveat,
}: {
  rows: { label: string; value: string }[]
  caveat?: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--cdc-border)]">
      <dl className="divide-y divide-[var(--cdc-border)]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              {row.label}
            </dt>
            <dd className="font-mono text-sm text-neutral-800 dark:text-neutral-200">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {caveat ? (
        <p className="border-t border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          {caveat}
        </p>
      ) : null}
    </div>
  )
}

export function MaterialCard({ material }: { material: Material }) {
  return (
    <article className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-4 dark:bg-neutral-900/40">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        Material
      </p>
      <h3 className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {material.productName}
      </h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {material.manufacturer}
        {material.materialType ? ` · ${material.materialType}` : ''}
      </p>
      {material.color ? (
        <p className="mt-2 text-sm">Color: {material.color}</p>
      ) : null}
      {material.translucency ? (
        <p className="text-sm">Translucency: {material.translucency}</p>
      ) : null}
      <p className="mt-3 font-mono text-sm text-neutral-800 dark:text-neutral-200">
        {materialPriceLabel(material)}
      </p>
      {material.pendingConfirmation ? (
        <p className="mt-3 text-sm text-amber-900 dark:text-amber-200">
          Pending confirmation — a specific product has not been approved. Do not
          purchase resin until DCC confirms the bottle.
        </p>
      ) : null}
      <p className="mt-3 text-xs text-neutral-500">{PRICE_REFERENCE_DISCLAIMER}</p>
    </article>
  )
}

export function MaterialPurchaseCard({
  clientSupplied,
  note,
  material,
}: {
  clientSupplied: boolean
  note?: string
  material?: Material
}) {
  const purchaseHref = material?.productUrl || material?.supplierUrl

  return (
    <article className="rounded-2xl border border-[var(--cdc-border)] p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        Purchase
      </p>
      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
        {clientSupplied
          ? 'Client-supplied after DCC approval.'
          : 'Supply path will be written once material is scoped.'}
      </p>
      {note ? <p className="mt-2 text-sm">{note}</p> : null}
      {material?.supplierName && purchaseHref ? (
        <p className="mt-2 text-sm">
          <a
            href={purchaseHref}
            className="text-[var(--cdc-teal)] underline"
            rel="noreferrer"
          >
            {material.supplierName}
          </a>
        </p>
      ) : (
        <p className="mt-2 text-sm text-neutral-500">
          No supplier or SKU is listed yet. DCC will send a purchase reference after
          approval.
        </p>
      )}
      <p className="mt-3 text-xs text-neutral-500">{PRICE_REFERENCE_DISCLAIMER}</p>
    </article>
  )
}

export function ProcessFlow({
  steps,
  current,
}: {
  steps: string[]
  current?: string
}) {
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {steps.map((step, index) => {
        const active = current != null && step === current
        return (
          <li key={`${step}-${index}`} className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex rounded-xl border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em]',
                active
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-[var(--cdc-border)] bg-neutral-50 text-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-200'
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden className="hidden text-neutral-400 sm:inline">
                →
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

export function ScopeList({
  included,
  excluded,
}: {
  included: string[]
  excluded: string[]
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          Included
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          Excluded
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {excluded.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function FinishCheckpoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--cdc-border)] p-4">
      {children}
    </div>
  )
}

export function PrototypeIteration({
  designation,
  inQuote,
  children,
}: {
  designation: string
  inQuote: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[var(--cdc-border)] p-4">
      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
        {designation}
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
        {inQuote ? 'Included in this quote' : 'Not included in this quote'}
      </p>
      {children ? <div className="mt-3 space-y-2">{children}</div> : null}
    </div>
  )
}

function formatUsd(amount: number): string {
  return `$${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`
}

export function ClientQuoteBreakdown({
  proposal,
  material,
}: {
  proposal: Pick<
    ClientProposal,
    'quoteLineItems' | 'clientMaterialOutlayUsd' | 'pricing'
  >
  material?: Material
}) {
  const lines = getClientVisibleQuoteLines(proposal)
  const total =
    proposal.pricing?.amountUsd ??
    sumQuoteLineAmounts(lines, { clientVisibleOnly: true })
  const materialOutlay = proposal.clientMaterialOutlayUsd
  const estimatedOutlay =
    total != null && materialOutlay != null ? total + materialOutlay : undefined

  if (lines.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          What am I paying for?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          This fee is not printer runtime alone. It covers technical preflight,
          production on the approved machine, post-processing, QA and a findings
          record, and project handoff — scoped to one Prototype 1 attempt.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600 dark:text-neutral-400">
          {lines.map((line, index) => (
            <span key={line.id} className="flex items-center gap-2">
              <span className="rounded-lg border border-[var(--cdc-border)] bg-neutral-50 px-2 py-1 dark:bg-neutral-900/40">
                {line.shortLabel} {formatUsd(line.amount)}
              </span>
              {index < lines.length - 1 ? (
                <span aria-hidden className="text-neutral-400">
                  →
                </span>
              ) : null}
            </span>
          ))}
          <span aria-hidden className="text-neutral-400">
            →
          </span>
          <span className="rounded-lg border border-neutral-900 bg-neutral-900 px-2 py-1 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900">
            {total != null ? formatUsd(total) : '—'}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--cdc-border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--cdc-border)] bg-neutral-50 dark:bg-neutral-900/40">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Line
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cdc-border)]">
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                  {line.label}
                </td>
                <td className="px-4 py-3 text-right font-mono text-neutral-900 dark:text-neutral-100">
                  {formatUsd(line.amount)}
                </td>
              </tr>
            ))}
            <tr className="bg-neutral-50 font-semibold dark:bg-neutral-900/40">
              <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                Fabrication service total
              </td>
              <td className="px-4 py-3 text-right font-mono text-neutral-900 dark:text-neutral-100">
                {total != null ? formatUsd(total) : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        {lines.map((line) => (
          <QuoteLineDetails key={line.id} line={line} />
        ))}
      </div>

      {material && materialOutlay != null ? (
        <article className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-900 dark:text-amber-200">
            Not charged by DCC
          </p>
          <h3 className="mt-2 text-base font-semibold text-amber-950 dark:text-amber-50">
            {material.productName}
            {material.bottleSize ? ` · ${material.bottleSize}` : ''}
          </h3>
          <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-100/90">
            Reference price {formatUsd(materialOutlay)} — purchased directly by
            you after DCC approval. Unused resin stays yours.
          </p>
          {material.productUrl ? (
            <p className="mt-2 text-sm">
              <a
                href={material.productUrl}
                className="font-medium text-[var(--cdc-teal)] underline"
                rel="noreferrer"
              >
                View product
              </a>
            </p>
          ) : null}
          {material.pendingConfirmation ? (
            <p className="mt-3 text-sm text-amber-900 dark:text-amber-100">
              Pending confirmation — verify SKU and shipping before purchase.
            </p>
          ) : null}
          <p className="mt-3 text-xs text-amber-900/80 dark:text-amber-100/80">
            {PRICE_REFERENCE_DISCLAIMER}
          </p>
        </article>
      ) : null}

      {estimatedOutlay != null ? (
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            Estimated project cash outlay:
          </span>{' '}
          {formatUsd(total ?? 0)} service fee + ~{formatUsd(materialOutlay ?? 0)}{' '}
          resin ≈ ~{formatUsd(Math.round(estimatedOutlay))} before tax and
          shipping.
        </p>
      ) : null}
    </div>
  )
}

function QuoteLineDetails({ line }: { line: QuoteLineItem }) {
  return (
    <details className="group rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 open:bg-white dark:bg-neutral-900/40 dark:open:bg-neutral-950/20">
      <summary className="cursor-pointer list-none px-4 py-3 marker:content-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {line.label}
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {line.description}
            </p>
          </div>
          <span className="shrink-0 font-mono text-sm text-neutral-800 dark:text-neutral-200">
            {formatUsd(line.amount)}
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--cdc-teal)] group-open:hidden">
          What you receive · expand
        </p>
      </summary>
      <div className="border-t border-[var(--cdc-border)] px-4 py-3 text-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          What you receive
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-700 dark:text-neutral-300">
          {line.clientReceives.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {line.prevents ? (
          <>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              This prevents
            </p>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300">
              {line.prevents}
            </p>
          </>
        ) : null}
      </div>
    </details>
  )
}

export function PricingCard({
  serviceLabel,
  amountUsd,
  amountStatus,
  materialNote,
}: {
  serviceLabel: string
  amountUsd?: number
  amountStatus: 'quoted' | 'pending'
  materialNote?: string
}) {
  const amount =
    amountStatus === 'quoted' && amountUsd != null ? `$${amountUsd}` : 'To be quoted'

  return (
    <article className="rounded-2xl border border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/40">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        Fabrication service
      </p>
      <h3 className="mt-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {serviceLabel}
      </h3>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {amount}
      </p>
      {materialNote ? (
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          {materialNote}
        </p>
      ) : null}
    </article>
  )
}

export function PaymentTerms({
  terms,
  includedAttempts,
  reprintNote,
}: {
  terms?: string
  includedAttempts?: string
  reprintNote?: string
}) {
  return (
    <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
      {terms ? <p>{terms}</p> : null}
      {includedAttempts ? <p>{includedAttempts}</p> : null}
      {reprintNote ? <p>{reprintNote}</p> : null}
      <p>
        Payment is arranged offline. This page does not collect payment.
      </p>
    </div>
  )
}

export function ClientInputs({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ApprovalBlock({ nextStep }: { nextStep: string }) {
  return (
    <div className="rounded-2xl border border-neutral-900 bg-neutral-900 p-5 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
        Next step
      </p>
      <p className="mt-2 text-sm leading-relaxed">{nextStep}</p>
    </div>
  )
}

export function MachineNote({ machine }: { machine: Machine }) {
  return (
    <aside className="rounded-2xl border border-[var(--cdc-border)] p-4 text-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        Machine
      </p>
      <p className="mt-2 font-semibold text-neutral-900 dark:text-neutral-100">
        {machine.name}
      </p>
      <p className="mt-1 text-neutral-600 dark:text-neutral-400">
        {machine.manufacturer} · {machine.process}
      </p>
      {machine.location ? (
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">{machine.location}</p>
      ) : null}
      <p className="mt-3 text-xs text-neutral-500">{machineAccessLabel(machine)}</p>
    </aside>
  )
}

export function OwnershipNote({ ownership }: { ownership: OwnershipSplit }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          Client owns
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {ownership.clientOwns.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          DCC retains
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {ownership.dccRetains.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {ownership.publicUseRequiresPermission ? (
        <p className="sm:col-span-2 text-xs text-neutral-500">
          Public use of this project requires permission.
        </p>
      ) : null}
    </div>
  )
}
