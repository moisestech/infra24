import type { ChapterLessonSkin, BrowserFrameAnatomyLayer } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type BrowserFrameAnatomyProps = {
  title: string
  description: string
  layers: BrowserFrameAnatomyLayer[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function BrowserFrameAnatomy({
  title,
  description,
  layers,
  sectionId = 'browser-frame-anatomy',
  presentation,
}: BrowserFrameAnatomyProps) {
  const formal = presentation === 'browser-as-medium'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        formal
          ? 'border-violet-200/80 bg-gradient-to-br from-violet-50/50 via-white to-slate-50/40 dark:border-violet-800/45 dark:from-violet-950/20 dark:via-neutral-950 dark:to-slate-950/25'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          formal ? 'text-violet-800 dark:text-violet-200/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Chapter-specific demo
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div
        className={cn(
          'mt-8 rounded-[2rem] border p-6',
          formal ? 'border-violet-200/60 bg-violet-50/30 dark:border-violet-900/40 dark:bg-violet-950/15' : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40',
        )}
      >
        <div
          className={cn(
            'rounded-[2rem] border p-4 shadow-sm',
            formal ? 'border-violet-200/70 bg-white dark:border-violet-900/50 dark:bg-neutral-950' : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
          )}
        >
          <div className="mb-4 flex items-center gap-2" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          </div>

          <div
            className={cn(
              'rounded-[1.5rem] border p-4',
              formal ? 'border-violet-100 bg-violet-50/40 dark:border-violet-900/35 dark:bg-violet-950/20' : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50',
            )}
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {layers.map((layer) => (
                <article
                  key={layer.label}
                  className={cn(
                    'rounded-2xl border p-4',
                    formal
                      ? 'border-violet-200/80 bg-white dark:border-violet-900/50 dark:bg-neutral-950'
                      : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    {layer.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{layer.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
