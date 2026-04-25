import type { ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type AvatarPresenceCardProps = {
  title: string
  description: string
  points: string[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function AvatarPresenceCard({
  title,
  description,
  points,
  sectionId = 'avatar-presence-card',
  presentation,
}: AvatarPresenceCardProps) {
  const intimate = presentation === 'identity-networked'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        intimate
          ? 'border-rose-200/60 bg-white/95 dark:border-rose-900/30 dark:bg-neutral-950/90'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          intimate ? 'text-violet-700 dark:text-violet-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Presence study
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div
          className={cn(
            'rounded-3xl border p-6',
            intimate
              ? 'border-rose-200/50 bg-gradient-to-br from-rose-100/90 via-violet-100/70 to-white dark:border-rose-900/40 dark:from-rose-950/40 dark:via-violet-950/30 dark:to-neutral-950'
              : 'border-neutral-200 bg-gradient-to-br from-rose-100 via-violet-100 to-white dark:border-neutral-700 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950',
          )}
        >
          <div
            className={cn(
              'mx-auto aspect-square max-w-[180px] rounded-full border bg-white shadow-sm dark:bg-neutral-900',
              intimate && 'ring-2 ring-rose-200/40 ring-offset-2 ring-offset-rose-50 dark:ring-rose-800/50 dark:ring-offset-neutral-950',
            )}
          />
          <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-white/90 px-4 py-2 text-center text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
            Avatar presence
          </div>
        </div>
        <article
          className={cn(
            'rounded-3xl border p-5',
            intimate ? 'border-violet-200/40 bg-violet-50/20 dark:border-violet-900/30 dark:bg-violet-950/15' : 'border-neutral-200 dark:border-neutral-800',
          )}
        >
          <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
            {points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 dark:bg-violet-500" />
                <span className="leading-7">{point}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
