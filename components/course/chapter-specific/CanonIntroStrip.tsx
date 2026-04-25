import type { ChapterLessonSkin, CanonIntroStripItem } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type CanonIntroStripProps = {
  title: string
  description: string
  items: CanonIntroStripItem[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function CanonIntroStrip({
  title,
  description,
  items,
  sectionId = 'canon-intro-strip',
  presentation,
}: CanonIntroStripProps) {
  const canon = presentation === 'canon-entry'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        canon
          ? 'border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:border-slate-700 dark:from-slate-950 dark:via-neutral-950 dark:to-blue-950/20'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          canon ? 'text-blue-800/80 dark:text-blue-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Chapter-specific demo
      </p>
      <h2
        className={cn(
          'mt-3 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50',
          canon ? 'text-2xl md:text-3xl' : 'text-2xl',
        )}
      >
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={`${item.label}-${item.value}`}
            className={cn(
              'rounded-3xl border p-5 shadow-sm',
              canon
                ? 'border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-neutral-900/70'
                : 'border-neutral-200 dark:border-neutral-800',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {item.label}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">{item.value}</h3>
            {item.note ? <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{item.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
