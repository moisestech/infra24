import type { ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type VibecodingQuadrantItem = {
  title: string
  subtitle: string
  note: string
}

export type VibecodingQuadrantProps = {
  title: string
  description: string
  quadrants: VibecodingQuadrantItem[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function VibecodingQuadrant({
  title,
  description,
  quadrants,
  sectionId = 'vibecoding-quadrant',
  presentation,
}: VibecodingQuadrantProps) {
  const themed = presentation === 'getting-started'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        themed
          ? 'border-blue-200/80 bg-gradient-to-br from-blue-50/60 via-white to-slate-50/40 dark:border-blue-900/40 dark:from-blue-950/25 dark:via-neutral-950 dark:to-slate-950/20'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          themed ? 'text-blue-900/80 dark:text-blue-200/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Positioning map
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {quadrants.map((item, index) => (
          <article
            key={`${item.title}-${item.subtitle}`}
            className={cn(
              'rounded-3xl border p-5',
              index === 2
                ? themed
                  ? 'border-blue-300/80 bg-blue-50/90 dark:border-blue-700/50 dark:bg-blue-950/35'
                  : 'border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30'
                : 'border-neutral-200/90 bg-white dark:border-neutral-700 dark:bg-neutral-950/60',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {item.title}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">{item.subtitle}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
