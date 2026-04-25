import type { Chapter } from '@/lib/course/types'

type Props = {
  chapter: Chapter
}

function formatModuleLabel(module: string) {
  return module.replace(/-/g, ' ')
}

export function ChapterHeader({ chapter }: Props) {
  const chapterBadge = chapter.chapterSequenceLabel ?? `Chapter ${chapter.number}`

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          {chapterBadge}
        </span>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          {formatModuleLabel(chapter.module)}
        </span>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          {chapter.estimatedTime}
        </span>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          {chapter.difficulty}
        </span>
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-5xl">
        {chapter.title}
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 md:text-2xl">{chapter.subtitle}</p>
      <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-700 dark:text-neutral-300 md:text-lg">
        {chapter.summary}
      </p>
    </section>
  )
}
