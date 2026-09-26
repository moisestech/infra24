import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { StaffPage } from '@/components/dcc/backoffice/StaffSection'
import { readJobs, readPeople } from '@/lib/dcc/backoffice/crm-reads'
import { noticeFromRead } from '@/lib/dcc/backoffice/table-read'
import type { DccJob } from '@/lib/dcc/jobs'

export const dynamic = 'force-dynamic'

type JobDetailPageProps = {
  params: { id: string }
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  return { title: `Job ${params.id}` }
}

function money(amount: number | null | undefined): string | undefined {
  if (amount == null) return undefined
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function facts(job: DccJob): { label: string; value: string }[] {
  return [
    { label: 'Status', value: job.stage },
    { label: 'Source', value: job.requestSource },
    { label: 'Contact', value: job.contactName },
    { label: 'Email', value: job.email },
    { label: 'Needed by', value: job.dueDate?.slice(0, 10) },
    { label: 'Material', value: job.material },
    { label: 'Quantity', value: job.quantity != null ? String(job.quantity) : undefined },
    { label: 'Budget range', value: job.budgetRange },
    { label: 'Quote', value: money(job.quoteAmount) },
    { label: 'Deposit required', value: money(job.depositRequired) },
    { label: 'File', value: job.fileLink },
    { label: 'Current blocker', value: job.blocker },
    { label: 'Description', value: job.description },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value))
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const [read, people] = await Promise.all([readJobs(), readPeople()])
  const notice = noticeFromRead(read)
  const job = read.status === 'records' ? read.records.find((row) => row.id === params.id) : undefined
  const person =
    job && people.status === 'records'
      ? people.records.find((row) => {
          const name = row.name.trim().toLowerCase()
          if (name.length < 3) return false
          return `${job.jobName} ${job.contactName ?? ''}`.toLowerCase().includes(name)
        })
      : undefined

  return (
    <StaffPage
      title={job?.jobName ?? 'Job'}
      lede="Staff detail from DCC CRM. A quote amount is the stored quote, not money collected. The person match is by name until Jobs has a People link field."
      icon={Briefcase}
      token="cyan"
      notices={notice ? [notice] : []}
    >
      <p className="mt-6">
        <Link href="/backoffice/jobs" className="text-sm font-medium text-neutral-700 underline dark:text-neutral-200">
          All jobs
        </Link>
      </p>
      {read.status === 'records' && !job ? (
        <p className="mt-6 rounded-2xl border border-[var(--cdc-border)] px-4 py-6 text-sm text-neutral-600 dark:text-neutral-300">
          This job is not in the current DCC CRM read.
        </p>
      ) : null}
      {job ? (
        <dl className="mt-6 space-y-3">
          {person ? (
            <div className="rounded-2xl border border-[var(--cdc-border)] px-4 py-4">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">DCC person</dt>
              <dd className="mt-1 text-base text-neutral-950 dark:text-neutral-50">
                <Link href="/backoffice/people" className="underline">
                  {person.name}
                </Link>
              </dd>
            </div>
          ) : null}
          {facts(job).map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-[var(--cdc-border)] px-4 py-4">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">{fact.label}</dt>
              <dd className="mt-1 text-base text-neutral-950 dark:text-neutral-50">
                {fact.label === 'File' ? (
                  <a href={fact.value} className="underline">
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </StaffPage>
  )
}
