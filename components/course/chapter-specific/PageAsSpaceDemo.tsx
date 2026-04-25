import type { ChapterLessonSkin, PageAsSpaceVariant } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type PageAsSpaceDemoProps = {
  title: string
  description: string
  variants: PageAsSpaceVariant[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function PageAsSpaceDemo({
  title,
  description,
  variants,
  sectionId = 'page-as-space-demo',
  presentation,
}: PageAsSpaceDemoProps) {
  const formal = presentation === 'browser-as-medium'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        formal
          ? 'border-violet-200/80 bg-gradient-to-br from-white via-violet-50/35 to-slate-50/30 dark:border-violet-800/45 dark:from-neutral-950 dark:via-violet-950/15 dark:to-slate-950/20'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          formal ? 'text-violet-800 dark:text-violet-200/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Spatial comparison
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {variants.map((variant, index) => (
          <article
            key={variant.label}
            className={cn(
              'rounded-3xl border p-5',
              formal ? 'border-violet-200/70 bg-white/80 dark:border-violet-900/45 dark:bg-neutral-950/80' : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {variant.label}
            </p>

            <div
              className={cn(
                'mt-4 rounded-2xl border p-4',
                formal ? 'border-violet-100 bg-violet-50/50 dark:border-violet-900/40 dark:bg-violet-950/25' : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40',
              )}
            >
              <div
                className={cn(
                  'rounded-2xl border bg-white dark:border-neutral-800 dark:bg-neutral-950',
                  index === 0 ? 'h-40' : index === 1 ? 'grid h-40 place-items-center' : 'space-y-2 p-3',
                )}
              >
                {index === 0 ? (
                  <div className="h-full rounded-2xl bg-neutral-100 dark:bg-neutral-800/80" />
                ) : index === 1 ? (
                  <div className="h-20 w-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80" />
                ) : (
                  <>
                    <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/80" />
                    <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/80" />
                    <div className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/80" />
                  </>
                )}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{variant.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
