import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  THREE_D_CURRICULUM_INTENTS,
  THREE_D_SCHOOL_INTENT_HEADING,
  THREE_D_SCHOOL_STATUS_LABEL,
  curriculumWorkshopPath,
  getCurriculumWorkshopById,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import {
  curriculumCardInteractive,
  curriculumIconBadge,
} from '@/components/dcc/education/3d-curriculum/interactive'

export function IntentSelector({
  className,
  embedded = false,
}: {
  className?: string
  embedded?: boolean
}) {
  const list = (
    <ul className={cn(!embedded && 'mt-8', 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3')}>
      {THREE_D_CURRICULUM_INTENTS.map((intent) => {
        const workshop = getCurriculumWorkshopById(intent.recommendedWorkshopId)
        if (!workshop) return null
        const color = getFabricationColor(workshop.colorTokenId)
        const Icon = CURRICULUM_ICONS[workshop.mentalModel]
        return (
          <li key={intent.id}>
            <Link
              href={curriculumWorkshopPath(workshop.slug)}
              className={cn(
                'group flex h-full min-h-[12rem] flex-col rounded-2xl border p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900',
                curriculumCardInteractive(color)
              )}
            >
              <span className={curriculumIconBadge(color)}>
                <Icon aria-hidden className="h-6 w-6" />
              </span>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {THREE_D_SCHOOL_STATUS_LABEL[workshop.status]}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {intent.label}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {intent.summary}
              </p>
              <p
                className={cn(
                  'mt-4 inline-flex items-center gap-2 text-sm font-medium',
                  color.heading
                )}
              >
                Recommended: {workshop.title}
                <ArrowRight
                  aria-hidden
                  className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                />
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )

  if (embedded) return list

  return (
    <section
      id="intent"
      className={cn('scroll-mt-24', className)}
      aria-labelledby="intent-heading"
    >
      <h2
        id="intent-heading"
        className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
      >
        {THREE_D_SCHOOL_INTENT_HEADING}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        You do not need every program. Pick the object, then the tool.
      </p>
      {list}
    </section>
  )
}
