import type { ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type WebMaterialsLayer = {
  label: string
  body: string
}

export type WebMaterialsStackProps = {
  title: string
  description: string
  layers: WebMaterialsLayer[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function WebMaterialsStack({
  title,
  description,
  layers,
  sectionId = 'web-materials-stack',
  presentation,
}: WebMaterialsStackProps) {
  const themed = presentation === 'getting-started'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        themed
          ? 'border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 dark:border-slate-800 dark:from-neutral-950 dark:to-slate-950/40'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          themed ? 'text-slate-700 dark:text-slate-300' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Materials stack
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 space-y-4">
        {layers.map((layer, index) => (
          <article
            key={layer.label}
            className={cn(
              'rounded-3xl border p-5',
              index === 0
                ? 'border-orange-200/80 bg-orange-50/80 dark:border-orange-900/40 dark:bg-orange-950/25'
                : index === 1
                  ? themed
                    ? 'border-blue-200/80 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/25'
                    : 'border-blue-200/80 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/25'
                  : 'border-amber-200/80 bg-amber-50/80 dark:border-amber-900/35 dark:bg-amber-950/20',
            )}
          >
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{layer.label}</h3>
            <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{layer.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
