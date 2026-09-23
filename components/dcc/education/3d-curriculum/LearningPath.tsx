import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  THREE_D_LEARNING_PATH,
  curriculumWorkshopPath,
  getCurriculumWorkshopById,
} from '@/lib/dcc/education/3d-curriculum'

export function LearningPath({ className }: { className?: string }) {
  return (
    <section
      id="path"
      className={cn('scroll-mt-24', className)}
      aria-labelledby="path-heading"
    >
      <h2
        id="path-heading"
        className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
      >
        A path beyond taking a class
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        Start with literacy. Choose a modeling direction. Specialize later. Fabrication is the shared competency. Operator verification is a future pathway, not a certificate DCC issues today.
      </p>

      <ol className="mt-8 space-y-3">
        {THREE_D_LEARNING_PATH.map((stage, index) => (
          <li key={stage.id}>
            <div
              className={cn(
                'rounded-2xl border border-[var(--cdc-border)] bg-white p-4 dark:bg-neutral-950 sm:p-5',
                stage.future && 'border-dashed'
              )}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                {String(index + 1).padStart(2, '0')} · {stage.kicker}
                {stage.future ? ' · Future' : ''}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {stage.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {stage.body}
              </p>
              {stage.workshopIds?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {stage.workshopIds.map((id) => {
                    const workshop = getCurriculumWorkshopById(id)
                    if (!workshop) return null
                    return (
                      <li key={id}>
                        <Link
                          href={curriculumWorkshopPath(workshop.slug)}
                          className="inline-flex min-h-10 items-center rounded-full border border-[var(--cdc-border)] bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                        >
                          {workshop.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
            {index < THREE_D_LEARNING_PATH.length - 1 ? (
              <div className="flex justify-center py-1" aria-hidden>
                <ArrowDown className="h-4 w-4 text-neutral-400" />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
