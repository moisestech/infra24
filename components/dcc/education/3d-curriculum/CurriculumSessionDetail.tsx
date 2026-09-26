import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  THREE_D_SCHOOL_COMING_CTA,
  THREE_D_SCHOOL_INTEREST_CTA,
  THREE_D_SCHOOL_PATH,
  curriculumSessionPath,
  curriculumWorkshopPath,
  type ThreeDCurriculumWorkshop,
} from '@/lib/dcc/education/3d-curriculum'
import { workshopInterestHref } from '@/lib/dcc/education/copy'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { cn } from '@/lib/utils'

export function CurriculumSessionDetail({
  workshop,
  sessionIndex,
}: {
  workshop: ThreeDCurriculumWorkshop
  sessionIndex: number
}) {
  const sessions = workshop.curriculumSessions ?? []
  const session = sessions[sessionIndex]
  if (!session) return null

  const color = getFabricationColor(workshop.colorTokenId)
  const previous = sessions[sessionIndex - 1]
  const next = sessions[sessionIndex + 1]
  const coveredSteps = workshop.pipeline.filter((step) => step.sessionSlug === session.slug)
  const interestHref = workshopInterestHref(workshop.interestSlug)
  const isPilot = workshop.status === 'pilot'

  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
        <Link href={THREE_D_SCHOOL_PATH} className="underline-offset-4 hover:underline">
          DCC 3D School
        </Link>
        <span aria-hidden> · </span>
        <Link
          href={curriculumWorkshopPath(workshop.slug)}
          className="underline-offset-4 hover:underline"
        >
          {workshop.title}
        </Link>
      </p>

      <header className="mt-4 max-w-3xl">
        <p className={cn('font-mono text-[10px] uppercase tracking-[0.16em]', color.chip, 'inline-flex rounded-full border px-3 py-1')}>
          Session {String(sessionIndex + 1).padStart(2, '0')} of {String(sessions.length).padStart(2, '0')}
        </p>
        <h1 className="mt-4 text-[clamp(1.875rem,4.5vw,3.25rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {session.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          {session.body}
        </p>
        <div className="mt-6">
          <Link
            href={interestHref}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-neutral-800 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:active:translate-y-0 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {isPilot ? THREE_D_SCHOOL_INTEREST_CTA : THREE_D_SCHOOL_COMING_CTA}
          </Link>
        </div>
      </header>

      {coveredSteps.length ? (
        <section className="mt-12 border-t border-[var(--cdc-border)] pt-8">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Workflow stages in this session
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {coveredSteps.map((step) => (
              <li
                key={step.label}
                className={cn('rounded-full border px-3 py-1 text-sm', color.chip)}
              >
                {step.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav aria-label="Session order" className="mt-12 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            href={curriculumSessionPath(workshop.slug, previous.slug)}
            className="group flex min-h-24 flex-col justify-between rounded-2xl border border-[var(--cdc-border)] bg-white p-4 transition duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md dark:bg-neutral-950"
          >
            <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
              <ArrowLeft aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:-translate-x-1" />
              Previous
            </span>
            <span className="mt-3 font-semibold text-neutral-900 dark:text-neutral-50">
              {previous.title}
            </span>
          </Link>
        ) : (
          <Link
            href={curriculumWorkshopPath(workshop.slug)}
            className="group flex min-h-24 flex-col justify-between rounded-2xl border border-[var(--cdc-border)] bg-white p-4 transition duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md dark:bg-neutral-950"
          >
            <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
              <ArrowLeft aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:-translate-x-1" />
              Workshop
            </span>
            <span className="mt-3 font-semibold text-neutral-900 dark:text-neutral-50">
              {workshop.title}
            </span>
          </Link>
        )}
        {next ? (
          <Link
            href={curriculumSessionPath(workshop.slug, next.slug)}
            className={cn(
              'group flex min-h-24 flex-col justify-between rounded-2xl border bg-gradient-to-br p-4 transition duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md',
              color.border,
              color.gradient
            )}
          >
            <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
              Next
              <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
            </span>
            <span className="mt-3 font-semibold text-neutral-900 dark:text-neutral-50">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
