import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  PENDING_TECHNICAL_REVIEW,
  QUOTE_SPRINT,
  sprintPendingRows,
  type QuoteSprintEntry,
} from '@/lib/dcc/fabrication/sprint/quote-sprint'
import { hasFabricationInternalAccess } from '@/lib/dcc/scale-up-auth'
import {
  airtableJobHref,
  HEATHER_GLASS_JOB_ID,
  readQuoteSprintJobs,
  registryStage,
  sprintOperatingCounts,
  filterSprintEntries,
  type QuoteSprintLiveRead,
} from '@/lib/dcc/fabrication/sprint/live-jobs'

export const metadata: Metadata = {
  title: 'Quote sprint',
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams?: Promise<{ stage?: string; readiness?: string }>
}

export default async function QuoteSprintPage({ searchParams }: PageProps) {
  if (!(await hasFabricationInternalAccess())) notFound()

  const filters = (await searchParams) ?? {}
  const live = await readQuoteSprintJobs()
  const visible = filterSprintEntries(QUOTE_SPRINT, live, filters)
  const counts = sprintOperatingCounts(QUOTE_SPRINT, live)
  const active = QUOTE_SPRINT.filter((entry) => entry.role === 'active')
  const glass = live.jobs[HEATHER_GLASS_JOB_ID]

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
        Production stays capped at {counts.productionCap} jobs. {live.detail}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Count label="Scopes prepared" value={counts.scopesPrepared} />
        <Count label="Quotes issued" value={counts.quotesIssued} />
        <Count label="Accepted" value={counts.accepted} />
        <Count label="Paid" value={counts.paid} />
        <Count label="In production" value={`${counts.inProduction}/${counts.productionCap}`} />
        <Count label="Delivered" value={counts.delivered} />
        <Count label="Documented" value={counts.documented} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <FilterLink href="/fabricate/internal/quote-sprint" label="All" />
        <FilterLink href="/fabricate/internal/quote-sprint?readiness=blocked" label="Blocked" />
        <FilterLink href="/fabricate/internal/quote-sprint?readiness=ready" label="Ready to quote" />
        <FilterLink href="/fabricate/internal/quote-sprint?stage=Inquiry" label="Inquiry" />
        <FilterLink href="/fabricate/internal/quote-sprint?stage=Scoped" label="Scoped" />
        <FilterLink href="/fabricate/internal/quote-sprint?stage=Scoping" label="Registry scoping" />
      </div>

      {glass ? (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          {`Separate Heather lighting row is ${glass.airtableStatus}. It is not a sprint job.`}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--cdc-border)]">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-[var(--cdc-border)] bg-neutral-50 dark:bg-neutral-900/40">
            <tr>
              {['Client', 'Stage', 'Release', 'Missing', 'Operator', 'Machine', 'Payment', 'Docs', 'Next'].map((heading) => (
                <th
                  key={heading}
                  className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cdc-border)]">
            {visible.map((entry) => {
              const job = entry.airtableRecordId ? live.jobs[entry.airtableRecordId] : undefined
              return (
                <tr key={entry.slug}>
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    <span className="block">{entry.clientName}</span>
                    <span className="mt-1 flex flex-wrap gap-2 text-xs">
                      {entry.role !== 'candidate' ? (
                        <Link href={`/fabricate/proposals/${entry.slug}`} className="underline-offset-4 hover:underline">
                          Proposal
                        </Link>
                      ) : null}
                      {entry.airtableRecordId ? (
                        <a href={airtableJobHref(entry.airtableRecordId)} className="underline-offset-4 hover:underline" rel="noreferrer">
                          Airtable
                        </a>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                    {registryStage(entry, live)}
                    {job ? '' : ' · registry'}
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                    {job?.proposalReleaseStage ?? 'Not in Airtable'}
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                    {entry.missingInputs.length ? entry.missingInputs.join('; ') : 'None listed'}
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{entry.proposedOperator}</td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{entry.proposedMachine}</td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                    {job?.paymentStatus ?? 'Not confirmed in accounting'}
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                    {job?.documentationStatus ?? entry.documentationPermission}
                  </td>
                  <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{entry.nextAction}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-8 space-y-4">
        {visible.map((entry) => (
          <li key={entry.slug}>
            <SprintCard entry={entry} live={live} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SprintCard({ entry, live }: { entry: QuoteSprintEntry; live: QuoteSprintLiveRead }) {
  const pending = sprintPendingRows(entry.rows)
  const job = entry.airtableRecordId ? live.jobs[entry.airtableRecordId] : undefined
  const proposalHref =
    entry.role === 'candidate' ? null : `/fabricate/proposals/${entry.slug}`
  const economicsHref = entry.role === 'active' ? `/fabricate/internal/${entry.slug}` : null
  const airtableHref = entry.airtableRecordId ? airtableJobHref(entry.airtableRecordId) : null

  return (
    <article className="rounded-2xl border border-[var(--cdc-border)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {entry.clientName}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          {entry.role} · {registryStage(entry, live)}
          {job ? '' : ' · registry'}
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
        <Field label="Release stage" value={job?.proposalReleaseStage ?? 'Not in Airtable'} />
        <Field label="Proposal route" value={job?.proposalRoute ?? 'Not in Airtable'} />
        <Field label="Payment" value={job?.paymentStatus ?? 'Not confirmed in accounting'} />
        {job?.budgetRange ? <Field label="Budget range" value={job.budgetRange} /> : null}
        <Field label="Production" value={job?.productionStatus ?? 'Not in production'} />
        <Field
          label="Documentation"
          value={job?.documentationStatus ?? entry.documentationPermission}
        />
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
      {job?.blocker ? (
        <p className="mt-4 text-sm text-neutral-800 dark:text-neutral-200">
          <span className="font-medium">Blocker. </span>
          {job.blocker}
        </p>
      ) : null}
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
        {airtableHref ? (
          <a href={airtableHref} className="underline-offset-4 hover:underline" rel="noreferrer">
            Airtable job
          </a>
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

function Count({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-[var(--cdc-border)] px-3 py-2">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{value}</dd>
    </div>
  )
}

function FilterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center rounded-full border border-[var(--cdc-border)] px-3 text-neutral-800 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-900"
    >
      {label}
    </Link>
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
