import type { ChapterLessonSkin, InterfaceBreakDemoSide } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type InterfaceBreakDemoProps = {
  title: string
  description: string
  left: InterfaceBreakDemoSide
  right: InterfaceBreakDemoSide
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function InterfaceBreakDemo({
  title,
  description,
  left,
  right,
  sectionId = 'interface-break-demo',
  presentation,
}: InterfaceBreakDemoProps) {
  const charged = presentation === 'interface-glitch'
  const sides: InterfaceBreakDemoSide[] = [left, right]

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        charged
          ? 'border-violet-900/25 bg-gradient-to-br from-neutral-950 via-violet-950/40 to-neutral-950 text-neutral-50 dark:border-violet-700/35'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          charged ? 'text-violet-200/80' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Chapter-specific demo
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      <p
        className={cn(
          'mt-4 max-w-3xl leading-7',
          charged ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-300',
        )}
      >
        {description}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sides.map((side, index) => (
          <article
            key={side.label}
            className={cn(
              'rounded-3xl border p-5',
              index === 0
                ? charged
                  ? 'border-white/10 bg-white/5'
                  : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50'
                : charged
                  ? 'border-rose-500/25 bg-rose-950/30'
                  : 'border-violet-200 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/30',
            )}
          >
            <p
              className={cn(
                'text-xs font-medium uppercase tracking-[0.16em]',
                charged ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400',
              )}
            >
              {side.label}
            </p>

            <div
              className={cn(
                'mt-4 rounded-2xl border p-4 shadow-sm',
                charged ? 'border-white/10 bg-black/30' : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
              )}
            >
              <div className="space-y-2">
                <div
                  className={cn(
                    'h-3 rounded-full',
                    charged ? 'bg-white/15' : 'bg-neutral-100 dark:bg-neutral-800',
                  )}
                />
                <div
                  className={cn(
                    'h-3 max-w-[85%] rounded-full',
                    charged ? 'bg-white/12' : 'bg-neutral-100 dark:bg-neutral-800',
                  )}
                />
                <div
                  className={cn(
                    'h-16 rounded-2xl',
                    index === 0
                      ? charged
                        ? 'bg-white/10'
                        : 'bg-neutral-100 dark:bg-neutral-800'
                      : charged
                        ? 'border border-dashed border-rose-400/50 bg-rose-500/10'
                        : 'border border-dashed border-violet-400 bg-violet-100/60 dark:border-violet-500 dark:bg-violet-950/40',
                  )}
                />
              </div>
            </div>

            <ul
              className={cn(
                'mt-4 space-y-3',
                charged ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-300',
              )}
            >
              {side.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className={cn(
                      'mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full',
                      charged ? 'bg-violet-300/80' : 'bg-neutral-400 dark:bg-neutral-500',
                    )}
                    aria-hidden
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
