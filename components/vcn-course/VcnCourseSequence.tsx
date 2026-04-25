import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { VcnCourseIndexRow } from '@/lib/course/vibe-net-art/types'
import { VCN_MODULES } from '@/lib/course/vibe-net-art/modules'

const moduleTitle: Record<VcnCourseIndexRow['module'], string> = Object.fromEntries(
  VCN_MODULES.map((m) => [m.key, m.title])
) as Record<VcnCourseIndexRow['module'], string>

type Props = {
  rows: VcnCourseIndexRow[]
  basePath: string
}

export function VcnCourseSequence({ rows, basePath }: Props) {
  return (
    <section className="space-y-4" id="course-sequence">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Course sequence</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Pedagogical chapters 0–11. Open any row for the full lesson reader.
        </p>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => {
          const href = row.chapterSlug
            ? `${basePath}chapters/${encodeURIComponent(row.chapterSlug)}`
            : `${basePath}#advanced-tool-pathways`
          return (
            <Link key={row.number} href={href} className="block">
              <Card className="border-neutral-200 p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03] dark:border-neutral-800 dark:hover:border-primary/40">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
                      {row.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{row.title}</h3>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{row.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">{moduleTitle[row.module]}</Badge>
                        {row.estimatedTimeLabel ? (
                          <Badge variant="outline">{row.estimatedTimeLabel}</Badge>
                        ) : null}
                        {row.difficultyLabel ? (
                          <Badge variant="outline">{row.difficultyLabel}</Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary sm:pt-1">
                    {row.chapterSlug ? 'Open lesson →' : 'View on this page →'}
                  </span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
