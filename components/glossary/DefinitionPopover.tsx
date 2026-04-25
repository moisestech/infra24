import Link from 'next/link'
import { glossaryIconForPopover } from '@/lib/course/glossary-icons'

type DefinitionPopoverProps = {
  slug?: string
  term: string
  definition: string
  type: string
  href: string
}

export function DefinitionPopover({ slug, term, definition, type, href }: DefinitionPopoverProps) {
  const Icon = glossaryIconForPopover(slug, type)
  const typeLabel = type.replace(/-/g, ' ')

  return (
    <span className="group relative inline-block cursor-help">
      <span className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4">
        <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-600 dark:text-neutral-400" aria-hidden />
        {term}
      </span>
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-3 hidden w-80 rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-lg group-hover:block dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-neutral-200 p-2 dark:border-neutral-600">
            <Icon className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
          </div>
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {typeLabel}
            </span>
            <span className="mt-1 block font-medium text-neutral-900 dark:text-neutral-50">{term}</span>
            <span className="mt-2 block leading-6 text-neutral-700 dark:text-neutral-300">{definition}</span>
            <Link
              href={href}
              className="pointer-events-auto mt-3 inline-block text-xs font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
            >
              Open glossary
            </Link>
          </div>
        </div>
      </span>
    </span>
  )
}
