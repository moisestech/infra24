import Link from 'next/link'
import { CultureRecordCard } from '@/components/dcc/culture/CultureRecordCard'
import { Section, cdcSectionMuted, cdcSectionPaper } from '@/components/marketing/cdc'
import {
  EDITORIAL_TYPE_LABEL,
  JOURNAL_EMPTY_CONVERSATIONS,
  JOURNAL_INDEX_SECTION_DESCRIPTION,
  JOURNAL_SCALE_LABELS,
  JOURNAL_SCALE_QUESTION,
  JOURNAL_SECONDARY,
  JOURNAL_THESIS,
  JOURNAL_TOPICS,
  formatCultureDate,
  getEditorialPublicPath,
  listJournalArchive,
  listJournalOpeningSequence,
} from '@/lib/dcc/culture'
import { cn } from '@/lib/utils'

export function JournalFrontDoor() {
  const opening = listJournalOpeningSequence()
  const archive = listJournalArchive()

  return (
    <>
      <Section className={`${cdcSectionPaper} pt-6 pb-14 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24`}>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          {JOURNAL_THESIS}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {JOURNAL_SECONDARY}
        </p>
        <p
          className="mt-10 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400"
          aria-label={JOURNAL_SCALE_LABELS.join(' → ')}
        >
          {JOURNAL_SCALE_LABELS.map((label, i) => (
            <span key={label} className="inline-flex items-baseline gap-2 whitespace-nowrap">
              {i > 0 ? <span aria-hidden="true">→</span> : null}
              {label}
            </span>
          ))}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {JOURNAL_SCALE_QUESTION}
        </p>
      </Section>

      {opening.length > 0 ? (
        <Section
          id="start-here"
          className={`${cdcSectionMuted} border-t border-neutral-200 dark:border-neutral-800`}
        >
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Start here
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Three essays. One investigation: artist, then institution, then city.
          </p>
          <ol className="mt-10 space-y-8">
            {opening.map((item) => {
              const href = getEditorialPublicPath(item.entry)
              return (
                <li
                  key={item.id}
                  className={cn(
                    'max-w-3xl border-l-2 pl-5',
                    item.lead
                      ? 'border-[var(--cdc-teal,#00d4aa)] py-1'
                      : 'border-neutral-200 dark:border-neutral-700'
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {item.n}
                    <span className="mx-2 text-neutral-300 dark:text-neutral-600">·</span>
                    {item.scale}
                  </p>
                  <h3
                    className={cn(
                      'mt-2 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50',
                      item.lead ? 'text-2xl sm:text-3xl' : 'text-xl'
                    )}
                  >
                    <Link href={href} className="underline-offset-4 hover:underline">
                      {item.entry.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                    {item.question}
                  </p>
                </li>
              )
            })}
          </ol>
        </Section>
      ) : null}

      <Section
        id="essays"
        className={`${cdcSectionPaper} border-t border-neutral-200 dark:border-neutral-800`}
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              <Link href="/journal/essays" className="underline-offset-4 hover:underline">
                Essays
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {JOURNAL_INDEX_SECTION_DESCRIPTION.essays}
            </p>
          </div>
        </div>
        {archive.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {archive.map((entry) => (
              <CultureRecordCard
                key={entry.id}
                href={getEditorialPublicPath(entry)}
                title={entry.title}
                eyebrow={EDITORIAL_TYPE_LABEL[entry.type]}
                meta={entry.publishedAt ? formatCultureDate(entry.publishedAt) : undefined}
                description={entry.dek ?? entry.excerpt}
                image={entry.heroImage}
                imageAlt={entry.heroImageAlt ?? entry.title}
                fallbackLabel="Image forthcoming"
              />
            ))}
          </ul>
        ) : (
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Further essays will appear here as they are published.
          </p>
        )}
      </Section>

      <Section
        id="conversations"
        className={`${cdcSectionMuted} border-t border-neutral-200 dark:border-neutral-800`}
      >
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          <Link href="/journal/conversations" className="underline-offset-4 hover:underline">
            Conversations
          </Link>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {JOURNAL_EMPTY_CONVERSATIONS}
        </p>
      </Section>

      <Section
        id="investigating"
        className={`${cdcSectionPaper} border-t border-neutral-200 pb-16 dark:border-neutral-800`}
      >
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          What we&apos;re investigating
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Recurring questions in the published record. Not a directory of future sections.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {JOURNAL_TOPICS.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
            >
              {topic}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
