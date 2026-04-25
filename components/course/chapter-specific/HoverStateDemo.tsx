import type { ChapterLessonSkin, HoverStateDemoState } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type HoverStateDemoProps = {
  title: string
  description: string
  states: HoverStateDemoState[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function HoverStateDemo({
  title,
  description,
  states,
  sectionId = 'hover-state-demo',
  presentation,
}: HoverStateDemoProps) {
  const live = presentation === 'interaction-motion'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        live
          ? 'border-violet-300/50 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/40 dark:border-violet-600/40 dark:from-violet-950/30 dark:via-neutral-950 dark:to-fuchsia-950/20'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          live ? 'text-violet-700 dark:text-violet-300' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Chapter-specific demo
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {states.map((state, index) => (
          <article
            key={state.label}
            className={cn(
              'rounded-3xl border p-5',
              index === 0 && 'bg-neutral-50 dark:bg-neutral-900/60',
              index === 1 && 'bg-violet-50 dark:bg-violet-950/35',
              live && index === 1 && 'ring-1 ring-violet-400/30 dark:ring-violet-500/25',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {state.label}
            </p>
            <div
              className={cn(
                'mt-4 rounded-2xl border bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950',
                live && index === 1 && 'group cursor-crosshair',
              )}
            >
              <div
                className={cn(
                  'h-24 rounded-2xl border bg-gradient-to-br from-white to-neutral-100 transition-all duration-300 dark:from-neutral-900 dark:to-neutral-800',
                  live &&
                    index === 1 &&
                    'group-hover:from-violet-100 group-hover:to-fuchsia-100 group-hover:shadow-md dark:group-hover:from-violet-950/80 dark:group-hover:to-fuchsia-950/50',
                )}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{state.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
