import type { ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type SubmissionChecklistProps = {
  title: string
  description: string
  items: string[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function SubmissionChecklist({
  title,
  description,
  items,
  sectionId = 'submission-checklist',
  presentation,
}: SubmissionChecklistProps) {
  const cap = presentation === 'final-capstone'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        cap
          ? 'border-teal-200/60 bg-white/95 dark:border-teal-900/35 dark:bg-neutral-950/90'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          cap ? 'text-teal-800 dark:text-teal-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Final readiness
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div
        className={cn(
          'mt-8 rounded-3xl border p-5',
          cap ? 'border-emerald-200/50 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20' : 'border-neutral-200 dark:border-neutral-800',
        )}
      >
        <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className={cn(
                  'mt-[0.35rem] h-4 w-4 shrink-0 rounded border',
                  cap
                    ? 'border-emerald-400/70 bg-white dark:border-emerald-600 dark:bg-emerald-950/50'
                    : 'border-neutral-300 dark:border-neutral-600',
                )}
                aria-hidden
              />
              <span className="leading-7">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
