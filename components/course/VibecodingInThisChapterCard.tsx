import Link from 'next/link'
import { Bot, Code2, FileCode2, FolderGit2, Sparkles } from 'lucide-react'
import type { VibecodingChapterBridge } from '@/lib/course/types'

export type VibecodingInThisChapterCardProps = {
  vibecoding: VibecodingChapterBridge
  sectionId?: string
}

export function VibecodingInThisChapterCard({
  vibecoding,
  sectionId = 'vibecoding-in-chapter',
}: VibecodingInThisChapterCardProps) {
  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Vibecoding in this chapter
        </p>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Build move</h3>
          </div>
          <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{vibecoding.buildMove}</p>
        </article>
        <article className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Prompt move</h3>
          </div>
          <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{vibecoding.promptMove}</p>
        </article>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">CodePen path</h3>
          </div>
          <ul className="mt-3 space-y-3 text-neutral-700 dark:text-neutral-300">
            {vibecoding.codepenPath.map((step, i) => (
              <li key={`codepen-${i}`} className="flex gap-3">
                <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <span className="leading-7">{step}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">GitHub + Cursor path</h3>
          </div>
          <ul className="mt-3 space-y-3 text-neutral-700 dark:text-neutral-300">
            {vibecoding.githubCursorPath.map((step, i) => (
              <li key={`gh-${i}`} className="flex gap-3">
                <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <span className="leading-7">{step}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
      {vibecoding.templateLinks.length ? (
        <article className="mt-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Template links</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {vibecoding.templateLinks.map((link) => (
              <Link
                key={`${link.kind}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </article>
      ) : null}
      <article className="mt-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Output</h3>
        <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{vibecoding.output}</p>
      </article>
    </section>
  )
}
