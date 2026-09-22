import type { ReactNode } from 'react'
import { PageHero, Section, cdcSectionMuted } from '@/components/marketing/cdc'
import { CultureMediaFrame } from '@/components/dcc/culture/CultureMediaFrame'
import { CultureRelatedList } from '@/components/dcc/culture/CultureRelatedList'
import {
  EditorialEssayPager,
  EditorialSequenceChrome,
} from '@/components/dcc/culture/EditorialEssayNav'
import { EditorialHeroBand } from '@/components/dcc/culture/EditorialHeroBand'
import { EditorialImageSlot } from '@/components/dcc/culture/EditorialImageSlot'
import { EditorialPullQuote } from '@/components/dcc/culture/editorial/EditorialPullQuote'
import { EditorialSources } from '@/components/dcc/culture/editorial/EditorialSources'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import {
  artistHref,
  EDITORIAL_TYPE_LABEL,
  formatCultureDate,
  getArtistsForEditorial,
  getEditorialPublicPath,
  getProgramPublicPath,
  getProgramsForEditorial,
  getProjectsForEditorial,
  getRelatedEditorial,
  journalHeroAccentForEntry,
  journalHeroEffectForEntry,
  listJournalAdjacent,
  type DccEditorial,
} from '@/lib/dcc/culture'
import { cn } from '@/lib/utils'

type EditorialDetailProps = {
  entry: DccEditorial
  mdx?: ReactNode | null
}

export function EditorialDetail({ entry, mdx }: EditorialDetailProps) {
  const path = getEditorialPublicPath(entry)
  const artists = getArtistsForEditorial(entry)
  const programs = getProgramsForEditorial(entry)
  const projects = getProjectsForEditorial(entry)
  const related = getRelatedEditorial(entry)
  const adjacent = listJournalAdjacent(entry)
  const heroEffect = journalHeroEffectForEntry(entry)
  const blocks = (entry.body ?? '').split('\n\n').filter(Boolean)
  const hasMdx = Boolean(mdx)
  const hasInlineBody = !hasMdx && blocks.length > 0
  const hasCover = Boolean(entry.heroImage)

  return (
    <>
      <PageHero
        eyebrow={EDITORIAL_TYPE_LABEL[entry.type]}
        title={entry.title}
        description={entry.dek}
        breadcrumbs={getCdcBreadcrumbs(path)}
        className={
          hasCover
            ? 'relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.08),transparent_55%)] dark:before:bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.14),transparent_55%)]'
            : undefined
        }
      />
      <Section className={`${cdcSectionMuted} border-t border-neutral-200 pb-16 dark:border-neutral-800`}>
        <EditorialSequenceChrome sequenceItem={adjacent.sequenceItem} />
        <div
          className={cn(
            'flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400',
            adjacent.sequenceItem && 'mt-3'
          )}
        >
          {entry.author ? <p>{entry.author}</p> : null}
          {entry.publishedAt ? <p>Published {formatCultureDate(entry.publishedAt)}</p> : null}
          {entry.updatedAt ? <p>Updated {formatCultureDate(entry.updatedAt)}</p> : null}
          {entry.version ? <p>Version {entry.version}</p> : null}
        </div>
        {entry.living ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Living essay — this article will be updated as DCC collects operating data.
          </p>
        ) : null}
        {entry.topics && entry.topics.length > 0 ? (
          <p className="mt-2 max-w-2xl text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {entry.topics.join(' · ')}
          </p>
        ) : null}

        {entry.heroImage ? (
          <div className="mt-10 max-w-3xl">
            <CultureMediaFrame
              src={entry.heroImage}
              alt={entry.heroImageAlt ?? entry.title}
              aspectClassName="aspect-[16/9]"
              priority
            />
          </div>
        ) : heroEffect && entry.heroSlot ? (
          <div className="mt-10">
            <EditorialHeroBand
              effect={heroEffect}
              accentKey={journalHeroAccentForEntry(entry)}
              title={entry.heroSlot.title}
              brief={entry.heroSlot.brief}
            />
          </div>
        ) : entry.heroSlot ? (
          <div className="mt-10 max-w-3xl">
            <EditorialImageSlot {...entry.heroSlot} />
          </div>
        ) : null}

        {entry.pullQuote ? (
          <EditorialPullQuote className="mt-10">{entry.pullQuote}</EditorialPullQuote>
        ) : null}

        {entry.videoUrl ? (
          <div className="mt-10 aspect-video max-w-3xl overflow-hidden rounded-lg bg-neutral-900">
            <iframe
              src={entry.videoUrl}
              title={entry.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}

        {entry.audioUrl ? (
          <div className="mt-8 max-w-3xl">
            <audio controls src={entry.audioUrl} className="w-full">
              <a href={entry.audioUrl}>Listen to {entry.title}</a>
            </audio>
          </div>
        ) : null}

        {hasMdx ? (
          <div className="editorial-prose mt-12">{mdx}</div>
        ) : hasInlineBody ? (
          <div className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {blocks.map((block, index) => {
              if (block.startsWith('## ')) {
                return (
                  <h2
                    key={`h-${index}`}
                    className="pt-4 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
                  >
                    {block.slice(3)}
                  </h2>
                )
              }
              return <p key={`p-${index}`}>{block}</p>
            })}
          </div>
        ) : (
          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {entry.type === 'conversation' || entry.type === 'interview'
              ? 'The full conversation will be published here once it has been recorded and edited. A podcast feed is not launching in this phase.'
              : 'The full essay will be published here once it has been edited.'}
          </p>
        )}

        {entry.images && entry.images.length > 0 ? (
          <ul className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {entry.images.map((src, index) => (
              <li key={src}>
                <CultureMediaFrame
                  src={src}
                  alt={`${entry.title} ${index + 1}`}
                  aspectClassName="aspect-[4/3]"
                />
              </li>
            ))}
          </ul>
        ) : null}

        {entry.sources && entry.sources.length > 0 ? (
          <div className="mt-16 max-w-2xl">
            <EditorialSources sources={entry.sources} />
          </div>
        ) : null}

        <CultureRelatedList
          heading="Related essays"
          items={related.map((relatedEntry) => ({
            href: getEditorialPublicPath(relatedEntry),
            title: relatedEntry.title,
            meta: relatedEntry.dek,
          }))}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <CultureRelatedList
            heading="Artists"
            items={artists.map((artist) => ({
              href: artistHref(artist.slug),
              title: artist.name,
              meta: artist.location,
            }))}
          />
          <CultureRelatedList
            heading="Programs"
            items={programs.map((program) => ({
              href: getProgramPublicPath(program),
              title: program.title,
            }))}
          />
          <CultureRelatedList
            heading="Projects"
            items={projects.map((project) => ({
              title: project.title,
              meta: project.shortDescription,
            }))}
          />
        </div>

        <EditorialEssayPager prev={adjacent.prev} next={adjacent.next} />
      </Section>
    </>
  )
}
