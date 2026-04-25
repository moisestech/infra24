import type { ChapterLessonSkin, TraceVsPortraitSide } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type TraceVsPortraitDemoProps = {
  title: string
  description: string
  left: TraceVsPortraitSide
  right: TraceVsPortraitSide
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function TraceVsPortraitDemo({
  title,
  description,
  left,
  right,
  sectionId = 'trace-vs-portrait-demo',
  presentation,
}: TraceVsPortraitDemoProps) {
  const intimate = presentation === 'identity-networked'
  const sides = [left, right]

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        intimate
          ? 'border-rose-200/70 bg-gradient-to-br from-rose-50/90 via-white to-violet-50/30 dark:border-rose-900/35 dark:from-rose-950/25 dark:via-neutral-950 dark:to-violet-950/15'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          intimate ? 'text-rose-700 dark:text-rose-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Chapter-specific demo
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sides.map((side, index) => (
          <article
            key={side.label}
            className={cn(
              'rounded-3xl border p-5',
              index === 0 && 'bg-neutral-50 dark:bg-neutral-900/60',
              index === 1 && 'bg-rose-50 dark:bg-rose-950/30',
              intimate && index === 1 && 'ring-1 ring-rose-200/50 dark:ring-rose-800/40',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {side.label}
            </p>
            <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-950">
              <div className="space-y-2">
                <div
                  className={cn(
                    'h-3 rounded-full',
                    index === 0 ? 'w-full max-w-[85%] bg-neutral-200 dark:bg-neutral-700' : 'w-full bg-rose-200/80 dark:bg-rose-900/50',
                  )}
                />
                <div
                  className={cn(
                    'h-3 rounded-full',
                    index === 0 ? 'w-full max-w-[65%] bg-neutral-100 dark:bg-neutral-800' : 'w-full max-w-[70%] bg-rose-100 dark:bg-rose-900/40',
                  )}
                />
                <div
                  className={cn(
                    'h-16 rounded-2xl border border-dashed',
                    index === 0
                      ? 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/80'
                      : 'border-rose-200/80 bg-gradient-to-br from-white to-rose-50/60 dark:border-rose-800/50 dark:from-neutral-900 dark:to-rose-950/30',
                  )}
                />
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
              {side.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className={cn(
                      'mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full',
                      intimate && index === 1 ? 'bg-rose-400 dark:bg-rose-500' : 'bg-neutral-400 dark:bg-neutral-500',
                    )}
                  />
                  <span className="leading-7">{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
