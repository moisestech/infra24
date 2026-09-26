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
import { ThreeDSchoolSection } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolSection'

export function ThreeDSchoolHub() {
  const pilot = listPilotWorkshops()
  const upcoming = listUpcomingCurriculumWorkshops()

  return (
    <div>
      <section id="overview" className="scroll-mt-36">
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
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-teal-700 via-cyan-700 to-violet-700 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg hover:from-teal-600 hover:via-cyan-600 hover:to-violet-600"
              >
                {THREE_D_SCHOOL_PRIMARY_CTA}
              </a>
              <Link
                href={THREE_D_SCHOOL_SECONDARY_HREF}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] bg-gradient-to-r from-white via-teal-50 to-cyan-50 px-4 py-2.5 text-sm font-medium text-neutral-900 transition-all duration-300 motion-safe:hover:-translate-y-0.5 dark:from-neutral-950 dark:via-teal-950/40 dark:to-cyan-950/30 dark:text-neutral-100"
              >
                {THREE_D_SCHOOL_SECONDARY_CTA}
              </Link>
            </div>
          </div>
          <CurriculumMedia assetId="3D-HERO-001" colorTokenId="teal" priority />
        </header>

        <div className="mt-10">
          <CurriculumMedia
            assetId="3D-SCHOOL-OVERALL-LANDSCAPE-001"
            colorTokenId="teal"
          />
        </div>
      </section>

      <div className="mt-8">
        <ThreeDSchoolSection id="curriculum-map">
          <CurriculumMap embedded />
          <div className="mt-8">
            <CurriculumMedia assetId="3D-MAP-001" colorTokenId="slate" />
          </div>
        </ThreeDSchoolSection>
      </div>

      <div className="mt-8">
        <ThreeDSchoolSection id="intent">
          <IntentSelector embedded />
        </ThreeDSchoolSection>
      </div>

      <div className="mt-8">
        <ThreeDSchoolSection id="curriculum">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
            Three published curricula. Register interest — session dates are not listed until they are scheduled.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {pilot.map((workshop) => (
              <li key={workshop.id}>
                <CurriculumWorkshopCard workshop={workshop} />
              </li>
            ))}
          </ul>
        </ThreeDSchoolSection>
      </div>

      <div className="mt-8">
        <ThreeDSchoolSection id="upcoming">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
            These records exist so the school can grow without a redesign. They are not confirmed offerings.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {upcoming.map((workshop) => (
              <li key={workshop.id}>
                <CurriculumWorkshopCard workshop={workshop} />
              </li>
            ))}
          </ul>
        </ThreeDSchoolSection>
      </div>

      <div className="mt-8">
        <ThreeDSchoolSection id="path">
          <LearningPath embedded />
        </ThreeDSchoolSection>
      </div>

      <div className="mt-8">
        <ThreeDSchoolSection id="flywheel">
          <CurriculumFlywheel embedded />
        </ThreeDSchoolSection>
      </div>

      <div className="mt-8">
        <ThreeDSchoolSection id="fabricate">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            If you already have geometry — or an idea that needs modeling — DCC fabrication is the service path that sits next to this school.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/fabricate/start"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg"
            >
              Start a fabrication inquiry
            </Link>
            <Link
              href="/fabricate/services"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] bg-gradient-to-r from-white via-orange-50 to-amber-50 px-4 py-2.5 text-sm font-medium text-neutral-900 transition-all duration-300 motion-safe:hover:-translate-y-0.5 dark:from-neutral-950 dark:via-orange-950/30 dark:to-amber-950/20 dark:text-neutral-100"
            >
              Explore services
            </Link>
          </div>
        </ThreeDSchoolSection>
      </div>
    </div>
  )
}
