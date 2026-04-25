import Link from 'next/link'
import { vcnGlossaryTermHref } from '@/lib/course/vibe-net-art/glossary-link'

type RelatedTermsProps = {
  slugs?: string[]
  glossaryPageHref: string
}

export function RelatedTerms({ slugs, glossaryPageHref }: RelatedTermsProps) {
  if (!slugs?.length) return null
  return (
    <div className="mt-4 border-t border-neutral-200/80 pt-4 dark:border-neutral-700/80">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">See also</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={vcnGlossaryTermHref(glossaryPageHref, slug)}
              className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {slug.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
