import type { GlossaryTerm } from '@/lib/course/types'
import { resolveGlossaryPattern, resolveGlossaryTermIcon } from '@/lib/course/glossary-icons'
import { RelatedTerms } from '@/components/glossary/RelatedTerms'
import { UsedInChapters } from '@/components/glossary/UsedInChapters'
import { GlossaryPatternBackground } from '@/components/glossary/GlossaryPatternBackground'

function formatTypeLabel(type: string) {
  return type.replace(/-/g, ' ')
}

export type GlossaryEntryCardProps = {
  term: GlossaryTerm
  /** Full path to glossary page, e.g. `/workshop/slug/glossary` (used for “see also” deep links). */
  glossaryPageHref: string
}

export function GlossaryEntryCard({ term, glossaryPageHref }: GlossaryEntryCardProps) {
  const Icon = resolveGlossaryTermIcon(term)
  const pattern = resolveGlossaryPattern(term)

  return (
    <article
      id={term.slug}
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <GlossaryPatternBackground pattern={pattern} />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-neutral-200 bg-white/80 p-3 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-950/60">
              <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-950 dark:text-neutral-50">{term.term}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {formatTypeLabel(term.type)}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 leading-7 text-neutral-800 dark:text-neutral-200">{term.shortDefinition}</p>
        {term.longDefinition ? (
          <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">{term.longDefinition}</p>
        ) : null}
        {term.sourceNote ? (
          <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{term.sourceNote}</p>
        ) : null}
        <RelatedTerms slugs={term.related} glossaryPageHref={glossaryPageHref} />
        <UsedInChapters chapterNumbers={term.usedInChapters} />
      </div>
    </article>
  )
}
