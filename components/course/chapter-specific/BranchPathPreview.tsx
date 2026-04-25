import type { BranchPathPreviewNode, ChapterLessonSkin } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type BranchPathPreviewProps = {
  title: string
  description: string
  nodes: BranchPathPreviewNode[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function BranchPathPreview({
  title,
  description,
  nodes,
  sectionId = 'branch-path-preview',
  presentation,
}: BranchPathPreviewProps) {
  const root = nodes[0]
  const children =
    root?.to?.map((id) => nodes.find((node) => node.id === id)).filter((n): n is BranchPathPreviewNode => Boolean(n)) ??
    []

  const hypertextQuiet = presentation === 'hypertext'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        hypertextQuiet
          ? 'border-white/10 bg-neutral-950 text-white'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          hypertextQuiet ? 'text-white/45' : 'text-neutral-500 dark:text-neutral-400',
        )}
      >
        Structure preview
      </p>
      <h2 className={cn('mt-3 text-2xl font-semibold tracking-tight md:text-3xl', hypertextQuiet ? '' : 'text-neutral-900')}>
        {title}
      </h2>
      <p
        className={cn(
          'mt-4 max-w-3xl leading-7',
          hypertextQuiet ? 'text-white/70' : 'text-neutral-700 dark:text-neutral-300',
        )}
      >
        {description}
      </p>
      <div className="mt-10 flex flex-col items-center gap-6">
        {root ? (
          <div
            className={cn(
              'rounded-full border px-6 py-3 text-center text-sm font-medium',
              hypertextQuiet
                ? 'border-white/15 bg-white/5 text-white/90'
                : 'border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100',
            )}
          >
            {root.label}
          </div>
        ) : null}
        {children.length ? (
          <>
            <div
              className={cn('h-10 w-px', hypertextQuiet ? 'bg-white/20' : 'bg-neutral-300 dark:bg-neutral-600')}
              aria-hidden
            />
            <div className="relative grid gap-6 md:grid-cols-2 md:gap-10">
              {children.map((child) =>
                child ? (
                  <div
                    key={child.id}
                    className={cn(
                      'rounded-full border px-6 py-3 text-center text-sm font-medium shadow-sm',
                      hypertextQuiet
                        ? 'border-white/15 bg-neutral-900/80 text-white/85'
                        : 'border-neutral-200 bg-white text-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100',
                    )}
                  >
                    {child.label}
                  </div>
                ) : null,
              )}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
