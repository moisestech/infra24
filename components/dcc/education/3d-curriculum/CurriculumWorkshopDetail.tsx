import Link from 'next/link'
import {
  CURRICULUM_ICONS,
  THREE_D_SCHOOL_COMING_CTA,
  THREE_D_SCHOOL_FABRICATE_HEADING,
  THREE_D_SCHOOL_FABRICATE_LEAD,
  THREE_D_SCHOOL_INTEREST_CTA,
  THREE_D_SCHOOL_LEVEL_LABEL,
  THREE_D_SCHOOL_PATH,
  THREE_D_SCHOOL_STATUS_LABEL,
  curriculumWorkshopPath,
  getCurriculumWorkshopById,
  type ThreeDCurriculumWorkshop,
} from '@/lib/dcc/education/3d-curriculum'
import { workshopInterestHref } from '@/lib/dcc/education/copy'
import { getStudioService } from '@/lib/dcc/fabrication/studio-services'
import { cn } from '@/lib/utils'
import { CurriculumMedia } from '@/components/dcc/education/3d-curriculum/CurriculumMedia'
import { WorkflowStrip } from '@/components/dcc/education/3d-curriculum/WorkflowStrip'

function MetaChip({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <p className="rounded-full border border-[var(--cdc-border)] bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
      <span className="text-neutral-400">{label} · </span>
      {value}
    </p>
  )
}

export function CurriculumWorkshopDetail({
  workshop,
}: {
  workshop: ThreeDCurriculumWorkshop
}) {
  const Icon = CURRICULUM_ICONS[workshop.mentalModel]
  const interestHref = workshopInterestHref(workshop.interestSlug)
  const isPilot = workshop.status === 'pilot'
  const related = workshop.relatedWorkshopIds
    .map((id) => getCurriculumWorkshopById(id))
    .filter((row): row is ThreeDCurriculumWorkshop => Boolean(row))
  const services = workshop.relatedServiceIds.map((id) => getStudioService(id))

  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
        <Link href={THREE_D_SCHOOL_PATH} className="underline-offset-4 hover:underline">
          DCC 3D School
        </Link>
      </p>

      <header className="mt-4 grid min-w-0 items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            {workshop.mentalModelLabel}
          </p>
          <h1 className="mt-2 text-[clamp(1.875rem,4.5vw,3.25rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {workshop.title}
          </h1>
          {workshop.subtitle ? (
            <p className="mt-3 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              {workshop.subtitle}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <MetaChip label="Status" value={THREE_D_SCHOOL_STATUS_LABEL[workshop.status]} />
            <MetaChip label="Level" value={THREE_D_SCHOOL_LEVEL_LABEL[workshop.level]} />
            <MetaChip label="Time" value={workshop.duration} />
            {workshop.software.length ? (
              <MetaChip label="Software" value={workshop.software.join(', ')} />
            ) : (
              <MetaChip label="Software" value="Tool TBD" />
            )}
          </div>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {workshop.whatYouMake}
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {isPilot ? (
              <Link
                href={interestHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
              >
                {THREE_D_SCHOOL_INTEREST_CTA}
              </Link>
            ) : (
              <Link
                href={interestHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
              >
                {THREE_D_SCHOOL_COMING_CTA}
              </Link>
            )}
            <Link
              href="/fabricate/services"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              I already have a file
            </Link>
          </div>
          {!isPilot ? (
            <p className="mt-3 text-sm text-neutral-500">
              Coming soon. Dates and instructors are not listed until they are confirmed.
            </p>
          ) : null}
        </div>
        <CurriculumMedia
          assetId={workshop.heroAssetId}
          colorTokenId={workshop.colorTokenId}
          priority
        />
      </header>

      <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          What you’ll make
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {workshop.projectPrompt ?? workshop.whatYouMake}
        </p>
        {workshop.galleryAssetIds[0] ? (
          <div className="mt-6 max-w-xl">
            <CurriculumMedia
              assetId={workshop.galleryAssetIds[0]}
              colorTokenId={workshop.colorTokenId}
            />
          </div>
        ) : null}
      </section>

      <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          What you’ll learn
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {workshop.outcomes.map((outcome) => (
            <li
              key={outcome}
              className="rounded-2xl border border-[var(--cdc-border)] bg-white p-4 dark:bg-neutral-950"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                <Icon aria-hidden className="h-4 w-4" />
              </span>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {outcome}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          The workflow
        </h2>
        <div className="mt-6">
          <WorkflowStrip steps={workshop.pipeline} />
        </div>
        {workshop.diagramAssetIds.map((assetId) => (
          <div key={assetId} className="mt-6">
            <CurriculumMedia assetId={assetId} colorTokenId={workshop.colorTokenId} />
          </div>
        ))}
      </section>

      {workshop.curriculumSessions?.length ? (
        <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Curriculum
          </h2>
          {workshop.formatNote ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {workshop.formatNote}
            </p>
          ) : null}
          <div className="mt-6 space-y-3">
            {workshop.curriculumSessions.map((session, index) => (
              <details
                key={session.title}
                className="group rounded-2xl border border-[var(--cdc-border)] bg-white px-4 py-3 dark:bg-neutral-950"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 marker:content-none dark:text-neutral-50">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="ml-3">{session.title}</span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {session.body}
                </p>
              </details>
            ))}
          </div>
        </section>
      ) : workshop.formatNote ? (
        <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Format
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {workshop.formatNote}
          </p>
        </section>
      ) : null}

      <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Tools & materials
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Software
            </dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              {workshop.softwareRequirements.join(', ') || 'To be confirmed'}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Equipment
            </dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              {workshop.equipment.join(', ')}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Files you receive
            </dt>
            <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              {workshop.participantFiles.join(', ')}
            </dd>
          </div>
          {workshop.prerequisites.length ? (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Prerequisites
              </dt>
              <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                {workshop.prerequisites.join('; ')}
              </dd>
            </div>
          ) : null}
        </dl>
        {workshop.topics.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {workshop.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-[var(--cdc-border)] px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300"
              >
                {topic}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Where this skill goes next
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {workshop.skillNext.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {workshop.applications.length ? (
          <p className="mt-4 text-sm text-neutral-500">
            Also useful for: {workshop.applications.join(', ')}.
          </p>
        ) : null}
      </section>

      <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {THREE_D_SCHOOL_FABRICATE_HEADING}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {THREE_D_SCHOOL_FABRICATE_LEAD}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              {service.label}
            </Link>
          ))}
          <Link
            href="/fabricate/start"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Start a fabrication inquiry
          </Link>
        </div>
        {workshop.relatedExistingPages.length ? (
          <ul className="mt-6 flex flex-wrap gap-3 text-sm">
            {workshop.relatedExistingPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="underline-offset-4 hover:underline"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {related.length ? (
        <section className="mt-14 border-t border-[var(--cdc-border)] pt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Related workshops
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((row) => (
              <li key={row.id}>
                <Link
                  href={curriculumWorkshopPath(row.slug)}
                  className={cn(
                    'flex h-full flex-col rounded-2xl border border-[var(--cdc-border)] p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    {THREE_D_SCHOOL_STATUS_LABEL[row.status]}
                  </span>
                  <span className="mt-2 font-semibold text-neutral-900 dark:text-neutral-50">
                    {row.title}
                  </span>
                  <span className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {row.mentalModelLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
