import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  PENDING_TECHNICAL_REVIEW,
  QUOTE_SPRINT,
  sprintPendingRows,
  type QuoteSprintEntry,
} from '@/lib/dcc/fabrication/sprint/quote-sprint'
import { hasScaleUpAccess } from '@/lib/dcc/scale-up-auth'

export const metadata: Metadata = {
  title: 'Quote sprint',
  robots: { index: false, follow: false },
}

export default async function QuoteSprintPage() {
  const scaleUpOk = await hasScaleUpAccess()
  const flag = process.env.DCC_CEO_DASHBOARD_ENABLED === 'true'
  if (!scaleUpOk && !flag && process.env.NODE_ENV === 'production') {
    notFound()
  }

  const active = QUOTE_SPRINT.filter((entry) => entry.role === 'active')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
        Staff only · Quote sprint
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Four open inquiries
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {active.length} inquiries can be scoped at once. None of them is a paid job.
        Concurrent production stays capped until a quote is accepted and a machine slot
        is confirmed. Change assumptions in the quote-sprint registry, not in each page.
      </p>
      <ul className="mt-8 space-y-4">
        {QUOTE_SPRINT.map((entry) => (
          <li key={entry.slug}>
            <SprintCard entry={entry} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SprintCard({ entry }: { entry: QuoteSprintEntry }) {
  const pending = sprintPendingRows(entry.rows)
  const proposalHref =
    entry.role === 'candidate' ? null : `/fabricate/proposals/${entry.slug}`
  const economicsHref = entry.role === 'active' ? `/fabricate/internal/${entry.slug}` : null

  return (
    <article className="rounded-2xl border border-[var(--cdc-border)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {entry.clientName}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          {entry.role} · {entry.stage}
        </p>
      </div>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{entry.projectTitle}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Field
          label="Working allowance"
          value={
            entry.workingAllowanceUsd == null
              ? 'None'
              : `$${entry.workingAllowanceUsd} planning allowance · ${entry.confidence} confidence`
          }
        />
        <Field label="Quote readiness" value={entry.quoteReadiness} />
        <Field label="Operator" value={entry.proposedOperator} />
        <Field label="Machine" value={entry.proposedMachine} />
        <Field
          label="Airtable job"
          value={entry.airtableRecordId ?? 'No job record'}
        />
        <Field label="Last confirmed contact" value={entry.lastConfirmedClientContact} />
        <Field label="Documentation" value={entry.documentationPermission} />
        <Field
          label="Technical review"
          value={
            entry.rows.length === 0
              ? 'No cost model on this card'
              : pending.length
                ? `${pending.length} buckets · ${PENDING_TECHNICAL_REVIEW}`
                : 'Cost buckets priced'
          }
        />
      </dl>
      {entry.missingInputs.length ? (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Missing inputs
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {entry.missingInputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {entry.constraints.length ? (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Constraints
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {entry.constraints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mt-4 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <span className="font-medium">Next action. </span>
        {entry.nextAction}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {economicsHref ? (
          <Link href={economicsHref} className="underline-offset-4 hover:underline">
            Internal estimate
          </Link>
        ) : null}
        {proposalHref ? (
          <Link href={proposalHref} className="underline-offset-4 hover:underline">
            Client proposal
          </Link>
        ) : null}
      </div>
    </article>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{label}</dt>
      <dd className="mt-1 text-neutral-800 dark:text-neutral-200">{value}</dd>
    </div>
  )
}
