import {
  DCC_IN_DEVELOPMENT_HEADING,
  DCC_IN_DEVELOPMENT_LEAD,
  DCC_SESSIONS_EYEBROW,
  DCC_SESSIONS_HEADING,
  DCC_SESSIONS_LEAD,
  DCC_WORKSHOP_TRACK_LABEL,
  listInDevelopmentWorkshopOfferings,
  listWorkshopOfferings,
} from '@/lib/dcc/education'
import type { DccWorkshopTrackGroup } from '@/lib/dcc/education/types'
import { DccWorkshopOfferingCard } from '@/components/dcc/education/DccWorkshopOfferingCard'
import { CdcWebcoreSectionMark } from '@/components/marketing/cdc'

const TRACK_ORDER: DccWorkshopTrackGroup[] = [
  'presence',
  'ai-literacy',
  'practice-language',
  'archives',
]

export function DccWorkshopOfferingsBand() {
  const live = listWorkshopOfferings()
  const inDevelopment = listInDevelopmentWorkshopOfferings()
  const grouped = TRACK_ORDER.map((track) => ({
    track,
    label: DCC_WORKSHOP_TRACK_LABEL[track],
    offerings: inDevelopment.filter((offering) => offering.trackGroup === track),
  })).filter((group) => group.offerings.length > 0)

  return (
    <>
      <section
        id="offerings"
        className="scroll-mt-24 border-b border-[var(--cdc-border)] bg-white py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CdcWebcoreSectionMark eyebrow={DCC_SESSIONS_EYEBROW} />
          <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            {DCC_SESSIONS_HEADING}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {DCC_SESSIONS_LEAD}
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {live.map((offering) => (
              <li key={offering.id} className="min-h-0">
                <DccWorkshopOfferingCard offering={offering} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="in-development"
        className="scroll-mt-24 border-b border-[var(--cdc-border)] bg-neutral-50 py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CdcWebcoreSectionMark eyebrow="Next syllabi" />
          <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            {DCC_IN_DEVELOPMENT_HEADING}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {DCC_IN_DEVELOPMENT_LEAD}
          </p>

          <div className="mt-10 space-y-12">
            {grouped.map((group) => (
              <div key={group.track}>
                <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--cdc-teal)]">
                  {group.label}
                </h3>
                <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.offerings.map((offering) => (
                    <li key={offering.id} className="min-h-0">
                      <DccWorkshopOfferingCard offering={offering} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
