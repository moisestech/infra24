import Link from 'next/link'
import { PageHero, Section } from '@/components/marketing/cdc'
import { CultureMediaFrame } from '@/components/dcc/culture/CultureMediaFrame'
import { CultureRelatedList } from '@/components/dcc/culture/CultureRelatedList'
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
  type DccEditorial,
} from '@/lib/dcc/culture'

type EditorialDetailProps = {
  entry: DccEditorial
}

export function EditorialDetail({ entry }: EditorialDetailProps) {
  const path = getEditorialPublicPath(entry)
  const artists = getArtistsForEditorial(entry)
  const programs = getProgramsForEditorial(entry)
  const projects = getProjectsForEditorial(entry)
  const paragraphs = (entry.body ?? '').split('\n\n').filter(Boolean)

  return (
    <>
      <PageHero
        eyebrow={EDITORIAL_TYPE_LABEL[entry.type]}
        title={entry.title}
        description={entry.dek}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          {entry.author ? <p>{entry.author}</p> : null}
          {entry.publishedAt ? <p>{formatCultureDate(entry.publishedAt)}</p> : null}
        </div>

        {entry.heroImage ? (
          <div className="mt-8 max-w-3xl">
            <CultureMediaFrame
              src={entry.heroImage}
              alt={entry.heroImageAlt ?? entry.title}
              aspectClassName="aspect-[16/9]"
              priority
            />
          </div>
        ) : null}

        {entry.pullQuote ? (
          <blockquote className="mt-10 max-w-2xl border-l-2 border-neutral-300 pl-5 text-lg leading-relaxed text-neutral-800 dark:border-neutral-600 dark:text-neutral-100">
            {entry.pullQuote}
          </blockquote>
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

        {paragraphs.length > 0 ? (
          <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        ) : (
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            The full conversation will be published here once it has been recorded and edited.
            Audio may later become a podcast episode; the website interview is the primary format.
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

        <p className="mt-12 text-sm">
          <Link
            href="/journal"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Journal home
          </Link>
        </p>
      </Section>
    </>
  )
}
