import Link from 'next/link'
import { handbookHref } from '@/lib/workshop/handbook-href'

export type ChapterIndexItem = {
  number: number
  slug: string
  title: string
  summary: string
  module: string
  estimatedTime: string
  difficulty: string
}

export type CourseSequenceIndexProps = {
  chapters: ChapterIndexItem[]
  basePath: string
}

function formatModule(module: string) {
  return module.replace(/-/g, ' ')
}

export function CourseSequenceIndex({ chapters, basePath }: CourseSequenceIndexProps) {
  const numbers = chapters.map((c) => c.number)
  const lo = numbers.length ? Math.min(...numbers) : 0
  const hi = numbers.length ? Math.max(...numbers) : 0

  return (
    <section
      id="course-sequence"
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Full course sequence
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Chapters {lo}–{hi}
        </h2>
      </div>
      <div className="mt-8 grid gap-4">
        {chapters.map((chapter) => {
          const href = handbookHref(basePath, `chapters/${encodeURIComponent(chapter.slug)}`)
          return (
            <Link
              key={chapter.slug}
              href={href}
              className="rounded-3xl border border-neutral-200 p-5 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/60"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Chapter {chapter.number}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-neutral-950 dark:text-neutral-50">{chapter.title}</h3>
                  <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{chapter.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:max-w-[240px] md:justify-end">
                  <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
                    {formatModule(chapter.module)}
                  </span>
                  {chapter.estimatedTime ? (
                    <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
                      {chapter.estimatedTime}
                    </span>
                  ) : null}
                  {chapter.difficulty ? (
                    <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
                      {chapter.difficulty}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
