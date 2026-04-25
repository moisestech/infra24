import type { ChapterLessonSkin, NetArtVsArtOnlineSide } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type NetArtVsArtOnlineCardProps = {
  title: string
  description: string
  left: NetArtVsArtOnlineSide
  right: NetArtVsArtOnlineSide
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function NetArtVsArtOnlineCard({
  title,
  description,
  left,
  right,
  sectionId = 'net-art-vs-art-online',
  presentation,
}: NetArtVsArtOnlineCardProps) {
  const canon = presentation === 'canon-entry'
  const sides = [left, right]

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        canon
          ? 'border-slate-200/90 bg-white dark:border-slate-700 dark:bg-neutral-950'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          canon ? 'text-blue-800/80 dark:text-blue-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Clarifying comparison
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sides.map((side, i) => (
          <article
            key={side.title}
            className={cn(
              'rounded-3xl border p-5',
              canon && i === 0 && 'border-blue-200/70 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/25',
              canon && i === 1 && 'border-slate-200/80 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-950/40',
              !canon && 'border-neutral-200 dark:border-neutral-800',
            )}
          >
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{side.title}</h3>
            <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
              {side.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/70 dark:bg-blue-400/70" />
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
