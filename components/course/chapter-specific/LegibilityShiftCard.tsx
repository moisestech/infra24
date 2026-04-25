import type { ChapterLessonSkin, LegibilityShiftStage } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type LegibilityShiftCardProps = {
  title: string
  description: string
  stages: LegibilityShiftStage[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function LegibilityShiftCard({
  title,
  description,
  stages,
  sectionId = 'legibility-shift-card',
  presentation,
}: LegibilityShiftCardProps) {
  const charged = presentation === 'interface-glitch'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        charged
          ? 'border-violet-900/30 bg-gradient-to-br from-neutral-950 via-neutral-900 to-violet-950/35 text-neutral-50 dark:border-violet-800/40'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          charged ? 'text-violet-200/85' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Legibility preview
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

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stages.map((stage, index) => (
          <article
            key={stage.label}
            className={cn(
              'rounded-3xl border p-5',
              charged ? 'border-white/10 bg-white/5' : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
            )}
          >
            <p
              className={cn(
                'text-xs font-medium uppercase tracking-[0.16em]',
                charged ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400',
              )}
            >
              {stage.label}
            </p>

            <div
              className={cn(
                'mt-4 rounded-2xl border p-4',
                charged ? 'border-white/10 bg-black/25' : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50',
              )}
            >
              <div
                className={cn(
                  'space-y-2',
                  index === 1 && 'opacity-80',
                  index === 2 && 'opacity-70',
                )}
              >
                <div
                  className={cn(
                    'h-3 rounded-full',
                    charged ? 'bg-white/20' : 'bg-neutral-200 dark:bg-neutral-700',
                  )}
                />
                <div
                  className={cn(
                    'h-3 max-w-[84%] rounded-full',
                    charged ? 'bg-white/18' : 'bg-neutral-200 dark:bg-neutral-700',
                  )}
                />
                <div
                  className={cn(
                    'h-3 rounded-full',
                    charged ? 'bg-white/16' : 'bg-neutral-200 dark:bg-neutral-700',
                    index === 2 && 'translate-x-1 rotate-1',
                  )}
                />
              </div>
            </div>

            <p
              className={cn(
                'mt-4 text-sm leading-6',
                charged ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-300',
              )}
            >
              {stage.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
