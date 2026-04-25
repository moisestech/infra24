import type { ChapterLessonSkin, SystemMapLinkSpec, SystemMapNodeSpec } from '@/lib/course/types'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SystemMapPreviewProps = {
  title: string
  description: string
  nodes: SystemMapNodeSpec[]
  links: SystemMapLinkSpec[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

function hasLink(links: SystemMapLinkSpec[], from: string, to: string) {
  return links.some((l) => l.from === from && l.to === to)
}

export function SystemMapPreview({
  title,
  description,
  nodes,
  links,
  sectionId = 'system-map-preview',
  presentation,
}: SystemMapPreviewProps) {
  const diagram = presentation === 'systems-circulation'

  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-28 rounded-[2rem] border p-6 shadow-sm md:p-8',
        diagram
          ? 'border-rose-200/80 bg-gradient-to-br from-rose-50/50 via-white to-fuchsia-50/35 dark:border-rose-900/40 dark:from-rose-950/20 dark:via-neutral-950 dark:to-fuchsia-950/15'
          : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
      )}
    >
      <p
        className={cn(
          'text-sm font-medium uppercase tracking-[0.16em]',
          diagram ? 'text-rose-800 dark:text-rose-200/90' : 'text-neutral-500 dark:text-neutral-400',
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
          diagram ? 'border-rose-100/90 bg-white/70 dark:border-rose-900/35 dark:bg-neutral-950/50' : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40',
        )}
      >
        <div className="flex flex-col items-stretch gap-6 md:flex-row md:flex-wrap md:items-center md:justify-center">
          {nodes.flatMap((node, index) => {
            const next = nodes[index + 1]
            const showArrow =
              next != null && (links.length === 0 || hasLink(links, node.label, next.label))

            const chip = (
              <article
                key={node.label}
                className={cn(
                  'grid min-h-[5.5rem] min-w-[8rem] flex-1 place-items-center rounded-3xl border p-5 shadow-sm',
                  diagram
                    ? 'border-rose-200/80 bg-white dark:border-rose-900/50 dark:bg-neutral-950'
                    : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
                )}
              >
                <div
                  className={cn(
                    'rounded-full border px-5 py-2.5 text-center text-sm font-medium',
                    diagram
                      ? 'border-rose-300/60 bg-rose-50/90 text-rose-950 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-50'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
                  )}
                >
                  {node.label}
                </div>
              </article>
            )

            if (index >= nodes.length - 1) return [chip]

            const arrow = (
              <div
                key={`${node.label}-arrow`}
                className={cn(
                  'flex justify-center py-1 md:px-1 md:py-0',
                  !showArrow && 'opacity-25',
                )}
                aria-hidden
              >
                <ArrowRight
                  className={cn(
                    'h-6 w-6 shrink-0',
                    diagram ? 'text-rose-400 dark:text-rose-400/90' : 'text-neutral-400 dark:text-neutral-500',
                  )}
                />
              </div>
            )

            return [chip, arrow]
          })}
        </div>
      </div>
    </section>
  )
}
