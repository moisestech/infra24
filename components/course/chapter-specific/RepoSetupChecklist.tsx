import type { ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type RepoSetupChecklistProps = {
  title: string
  description: string
  items: string[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function RepoSetupChecklist({
  title,
  description,
  items,
  sectionId = 'repo-setup-checklist',
  presentation,
}: RepoSetupChecklistProps) {
  const themed = presentation === 'getting-started'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        themed
          ? 'border-blue-200/70 bg-white dark:border-blue-900/35 dark:bg-neutral-950'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          themed ? 'text-blue-900/75 dark:text-blue-200/85' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Setup checklist
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div
        className={cn(
          'mt-8 rounded-3xl border p-5',
          themed ? 'border-slate-200/90 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40' : 'border-neutral-200 dark:border-neutral-700',
        )}
      >
        <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className={cn(
                  'mt-[0.45rem] h-4 w-4 shrink-0 rounded border',
                  themed ? 'border-blue-300/70 dark:border-blue-700/50' : 'border-neutral-300 dark:border-neutral-600',
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
