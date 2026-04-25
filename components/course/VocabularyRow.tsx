import Link from 'next/link'
import { BookOpenText } from 'lucide-react'
import type { GlossaryReference } from '@/lib/course/types'

type Props = {
  terms: GlossaryReference[]
  /** e.g. `/workshop/vibe-coding-net-art/glossary` */
  glossaryHref: string
}

export function VocabularyRow({ terms, glossaryHref }: Props) {
  if (!terms.length) return null

  const glossaryRoot = glossaryHref.split('#')[0]

  return (
    <section className="scroll-mt-28 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8" id="vocabulary">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          <BookOpenText className="h-4 w-4 shrink-0" aria-hidden />
          Words to know
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Vocabulary in this chapter
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-neutral-700 dark:text-neutral-300">
          Key terms that shape the lesson. Open the glossary for fuller definitions, patterns, and related terms.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {terms.map((term) => (
          <Link
            key={term.slug}
            href={`${glossaryRoot}#${encodeURIComponent(term.slug)}`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" aria-hidden />
            {term.term}
          </Link>
        ))}
      </div>
    </section>
  )
}
