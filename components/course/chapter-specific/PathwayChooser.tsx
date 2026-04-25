import type { ChapterLessonSkin, PathwayChooserItem } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type PathwayChooserProps = {
  title: string
  description: string
  items: PathwayChooserItem[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function PathwayChooser({
  title,
  description,
  items,
  sectionId = 'pathway-chooser',
  presentation,
}: PathwayChooserProps) {
  const lab = presentation === 'advanced-pathways'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        lab
          ? 'border-emerald-200/70 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 dark:border-emerald-900/40 dark:from-emerald-950/25 dark:via-neutral-950 dark:to-teal-950/20'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          lab ? 'text-emerald-800 dark:text-emerald-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Lab chooser
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={cn(
              'rounded-3xl border p-5 transition-shadow',
              lab
                ? 'border-emerald-200/60 bg-white/90 shadow-sm dark:border-emerald-900/50 dark:bg-neutral-950/80'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
              lab && index === 1 && 'ring-1 ring-emerald-300/25 dark:ring-emerald-700/30',
            )}
          >
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-xl">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{item.focus}</p>

            <ul className="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              {item.bestFor.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className={cn(
                      'mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full',
                      lab ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-neutral-400 dark:bg-neutral-500',
                    )}
                  />
                  <span className="leading-6">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
