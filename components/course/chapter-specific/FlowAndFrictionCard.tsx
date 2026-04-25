import type { ChapterLessonSkin, InterfaceBreakDemoSide } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type FlowAndFrictionCardProps = {
  title: string
  description: string
  left: InterfaceBreakDemoSide
  right: InterfaceBreakDemoSide
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function FlowAndFrictionCard({
  title,
  description,
  left,
  right,
  sectionId = 'flow-and-friction-card',
  presentation,
}: FlowAndFrictionCardProps) {
  const diagram = presentation === 'systems-circulation'
  const sides: InterfaceBreakDemoSide[] = [left, right]

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        diagram
          ? 'border-fuchsia-200/70 bg-gradient-to-br from-white via-rose-50/40 to-fuchsia-50/30 dark:border-fuchsia-900/35 dark:from-neutral-950 dark:via-rose-950/15 dark:to-fuchsia-950/15'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          diagram ? 'text-rose-800 dark:text-rose-200/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Circulation comparison
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
              index === 0
                ? diagram
                  ? 'border-rose-200/80 bg-white/90 dark:border-rose-900/45 dark:bg-neutral-950/80'
                  : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50'
                : diagram
                  ? 'border-fuchsia-200/80 bg-fuchsia-50/80 dark:border-fuchsia-900/45 dark:bg-fuchsia-950/25'
                  : 'border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/25',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {side.label}
            </p>

            <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
              {side.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className={cn(
                      'mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full',
                      diagram && index === 1 ? 'bg-fuchsia-500 dark:bg-fuchsia-400' : 'bg-neutral-400 dark:bg-neutral-500',
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
