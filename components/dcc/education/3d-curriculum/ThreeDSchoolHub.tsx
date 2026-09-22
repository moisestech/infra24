import Link from 'next/link'
import {
  THREE_D_SCHOOL_EYEBROW,
  THREE_D_SCHOOL_HEADLINE,
  THREE_D_SCHOOL_LEAD,
  THREE_D_SCHOOL_PRIMARY_CTA,
  THREE_D_SCHOOL_SECONDARY_CTA,
  THREE_D_SCHOOL_SECONDARY_HREF,
  listPilotWorkshops,
  listUpcomingCurriculumWorkshops,
} from '@/lib/dcc/education/3d-curriculum'
import { CurriculumFlywheel } from '@/components/dcc/education/3d-curriculum/CurriculumFlywheel'
import { CurriculumMap } from '@/components/dcc/education/3d-curriculum/CurriculumMap'
import { CurriculumMedia } from '@/components/dcc/education/3d-curriculum/CurriculumMedia'
import { CurriculumWorkshopCard } from '@/components/dcc/education/3d-curriculum/CurriculumWorkshopCard'
import { IntentSelector } from '@/components/dcc/education/3d-curriculum/IntentSelector'
import { LearningPath } from '@/components/dcc/education/3d-curriculum/LearningPath'

export function ThreeDSchoolHub() {
  const pilot = listPilotWorkshops()
  const upcoming = listUpcomingCurriculumWorkshops()

  return (
    <div>
      <header className="grid min-w-0 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            {THREE_D_SCHOOL_EYEBROW}
          </p>
          <h1 className="mt-2 text-[clamp(1.875rem,4.5vw,3.25rem)] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {THREE_D_SCHOOL_HEADLINE}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
            {THREE_D_SCHOOL_LEAD}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a
              href="#curriculum"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
            >
              {THREE_D_SCHOOL_PRIMARY_CTA}
            </a>
            <Link
              href={THREE_D_SCHOOL_SECONDARY_HREF}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              {THREE_D_SCHOOL_SECONDARY_CTA}
            </Link>
          </div>
        </div>
        <CurriculumMedia assetId="3D-HERO-001" colorTokenId="teal" priority />
      </header>

      <div className="mt-16">
        <CurriculumMap />
      </div>

      <div className="mt-16">
        <IntentSelector />
      </div>

      <section
        id="curriculum"
        className="mt-16 scroll-mt-24"
        aria-labelledby="curriculum-heading"
      >
        <h2
          id="curriculum-heading"
          className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
        >
          Pilot workshops
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          Three published curricula. Register interest — session dates are not listed until they are scheduled.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {pilot.map((workshop) => (
            <li key={workshop.id}>
              <CurriculumWorkshopCard workshop={workshop} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="upcoming-heading">
        <h2
          id="upcoming-heading"
          className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
        >
          Coming / in development
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          These records exist so the school can grow without a redesign. They are not confirmed offerings.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {upcoming.map((workshop) => (
            <li key={workshop.id}>
              <CurriculumWorkshopCard workshop={workshop} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16">
        <LearningPath />
      </div>

      <div className="mt-16">
        <CurriculumFlywheel />
      </div>

      <section className="mt-16 rounded-2xl border border-[var(--cdc-border)] bg-white p-6 dark:bg-neutral-950 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          File → preparation → quote → fabrication
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          If you already have geometry — or an idea that needs modeling — DCC fabrication is the service path that sits next to this school.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/fabricate/start"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            Start a fabrication inquiry
          </Link>
          <Link
            href="/fabricate/services"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Explore services
          </Link>
        </div>
      </section>
    </div>
  )
}
