import type { ChapterLessonSkin, ToolComparisonRow } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type ToolComparisonGridProps = {
  title: string
  description: string
  rows: ToolComparisonRow[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function ToolComparisonGrid({
  title,
  description,
  rows,
  sectionId = 'tool-comparison-grid',
  presentation,
}: ToolComparisonGridProps) {
  const lab = presentation === 'advanced-pathways'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        lab
          ? 'border-teal-200/60 bg-white/95 dark:border-teal-900/35 dark:bg-neutral-950/90'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-xs font-medium uppercase tracking-[0.16em]',
          lab ? 'text-teal-800 dark:text-teal-300/90' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Comparison grid
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-neutral-200 dark:border-neutral-800">
        <div className="min-w-[640px]">
          <div
            className={cn(
              'grid grid-cols-4 border-b text-sm font-medium',
              lab
                ? 'border-emerald-200/60 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100'
                : 'border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300',
            )}
          >
            <div className="p-4">Tool</div>
            <div className="p-4">Strength</div>
            <div className="p-4">Complexity</div>
            <div className="p-4">Output</div>
          </div>

          {rows.map((row) => (
            <div
              key={row.tool}
              className="grid grid-cols-4 border-b border-neutral-200 last:border-b-0 dark:border-neutral-800"
            >
              <div className="p-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">{row.tool}</div>
              <div className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{row.strength}</div>
              <div className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{row.complexity}</div>
              <div className="p-4 text-sm text-neutral-700 dark:text-neutral-300">{row.output}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
