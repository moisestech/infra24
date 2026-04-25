import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { VcnCourseIndexRow } from '@/lib/course/vibe-net-art/types'
import { VCN_MODULES } from '@/lib/course/vibe-net-art/modules'

const moduleTitle: Record<VcnCourseIndexRow['module'], string> = Object.fromEntries(
  VCN_MODULES.map((m) => [m.key, m.title])
) as Record<VcnCourseIndexRow['module'], string>

const moduleAccent: Record<VcnCourseIndexRow['module'], string> = {
  orientation: 'from-violet-500/15 to-transparent',
  'browser-language': 'from-sky-500/15 to-transparent',
  'cultural-social-web': 'from-amber-500/15 to-transparent',
  'public-work-advanced': 'from-emerald-500/15 to-transparent',
}

type Props = {
  rows: VcnCourseIndexRow[]
  basePath: string
}

/** Compact course-wide table of contents — every numbered row with a disk chapter links to the lesson reader. */
export function VcnCourseWideToc({ rows, basePath }: Props) {
  const withChapters = rows.filter((r): r is VcnCourseIndexRow & { chapterSlug: string } => Boolean(r.chapterSlug))

  return (
    <section className="space-y-4" id="course-outline" aria-labelledby="course-outline-heading">
      <div>
        <h2 id="course-outline-heading" className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Course outline
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Jump straight into a chapter. The same order appears in the sequence below.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {withChapters.map((row) => {
          const href = `${basePath}chapters/${encodeURIComponent(row.chapterSlug)}`
          const accent = moduleAccent[row.module] ?? 'from-neutral-500/10 to-transparent'
          return (
            <Link
              key={row.number}
              href={href}
              className={`group relative overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br ${accent} p-3.5 shadow-sm transition hover:border-primary/35 hover:shadow-md dark:border-neutral-800 dark:hover:border-primary/40`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
                    {row.number}
                  </span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
                      {row.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {moduleTitle[row.module]}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition group-hover:text-primary" aria-hidden />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
