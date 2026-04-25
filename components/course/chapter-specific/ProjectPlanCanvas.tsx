import type { ChapterLessonSkin, ProjectPlanCanvasSection } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type ProjectPlanCanvasProps = {
  title: string
  description: string
  sections: ProjectPlanCanvasSection[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function ProjectPlanCanvas({
  title,
  description,
  sections,
  sectionId = 'project-plan-canvas',
  presentation,
}: ProjectPlanCanvasProps) {
  const cap = presentation === 'final-capstone'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        cap
          ? 'border-emerald-200/70 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/35 dark:border-emerald-900/40 dark:from-emerald-950/25 dark:via-neutral-950 dark:to-teal-950/15'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          cap ? 'text-emerald-800 dark:text-emerald-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Project planning
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <article
            key={section.label}
            className={cn(
              'rounded-3xl border p-5',
              cap
                ? 'border-emerald-200/50 bg-white/90 dark:border-emerald-900/45 dark:bg-neutral-950/70'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {section.label}
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{section.prompt}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
