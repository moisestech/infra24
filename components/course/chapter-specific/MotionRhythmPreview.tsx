import type { ChapterLessonSkin, MotionRhythmItem } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type MotionRhythmPreviewProps = {
  title: string
  description: string
  rhythms: MotionRhythmItem[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

const barWidthClass = ['w-8', 'w-16', 'w-10', 'w-14'] as const

export function MotionRhythmPreview({
  title,
  description,
  rhythms,
  sectionId = 'motion-rhythm-preview',
  presentation,
}: MotionRhythmPreviewProps) {
  const live = presentation === 'interaction-motion'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        live
          ? 'border-fuchsia-200/60 bg-white dark:border-fuchsia-900/40 dark:bg-neutral-950'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          live ? 'text-fuchsia-700 dark:text-fuchsia-300' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Timing preview
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rhythms.map((rhythm, index) => (
          <article key={rhythm.label} className="rounded-3xl border border-neutral-200 p-5 dark:border-neutral-800">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {rhythm.label}
            </p>
            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/60">
              <div
                className={cn(
                  'h-3 rounded-full bg-violet-400 motion-reduce:opacity-90 dark:bg-violet-500',
                  barWidthClass[Math.min(index, barWidthClass.length - 1)],
                  live && 'motion-safe:animate-pulse',
                )}
                style={
                  live
                    ? {
                        animationDuration: `${1.05 + index * 0.55}s`,
                      }
                    : undefined
                }
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{rhythm.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
