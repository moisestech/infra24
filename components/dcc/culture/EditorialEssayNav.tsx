import Link from 'next/link'
import {
  EDITORIAL_TYPE_LABEL,
  getEditorialPublicPath,
  journalSequenceItemFor,
  type DccEditorial,
  type JournalOpeningSequenceItem,
} from '@/lib/dcc/culture'

function adjacentLabel(entry: DccEditorial): string {
  const sequence = journalSequenceItemFor(entry.id)
  if (sequence) return `${sequence.n} · ${sequence.scale}`
  return EDITORIAL_TYPE_LABEL[entry.type]
}

export function EditorialSequenceChrome({
  sequenceItem,
}: {
  sequenceItem: JournalOpeningSequenceItem | null
}) {
  if (!sequenceItem) return null

  return (
    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
      {sequenceItem.n}
      <span className="mx-2 text-neutral-300 dark:text-neutral-600">·</span>
      {sequenceItem.scale}
      <span className="mx-2 text-neutral-300 dark:text-neutral-600">·</span>
      Opening sequence
    </p>
  )
}

export function EditorialEssayPager({
  prev,
  next,
}: {
  prev: DccEditorial | null
  next: DccEditorial | null
}) {
  return (
    <nav
      aria-label="Essay sequence"
      data-journal-pager=""
      className="mt-14 border-t border-neutral-200 pt-10 dark:border-neutral-800"
    >
      <div className="grid gap-8 sm:grid-cols-3 sm:items-start">
        <div>
          {prev ? (
            <Link
              href={getEditorialPublicPath(prev)}
              className="group block max-w-sm underline-offset-4 hover:underline"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                Previous
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                {adjacentLabel(prev)}
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {prev.title}
              </p>
            </Link>
          ) : (
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-600">
              Beginning
            </p>
          )}
        </div>
        <p className="sm:text-center">
          <Link
            href="/journal"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            All essays
          </Link>
        </p>
        <div className="sm:text-right">
          {next ? (
            <Link
              href={getEditorialPublicPath(next)}
              className="group ml-auto block max-w-sm underline-offset-4 hover:underline sm:ml-auto"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                Next
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                {adjacentLabel(next)}
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {next.title}
              </p>
            </Link>
          ) : (
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-600">
              End
            </p>
          )}
        </div>
      </div>
    </nav>
  )
}
