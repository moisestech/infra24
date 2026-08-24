import Link from 'next/link'
import { PageHero, Section } from '@/components/marketing/cdc'
import { CultureMediaFrame } from '@/components/dcc/culture/CultureMediaFrame'
import { CultureRelatedList } from '@/components/dcc/culture/CultureRelatedList'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import {
  artistHref,
  EDITORIAL_TYPE_LABEL,
  getEditorialForArtist,
  getEditorialPublicPath,
  getProgramPublicPath,
  getProgramsForArtist,
  getProjectsForArtist,
  PROGRAM_TYPE_LABEL,
  type DccArtist,
} from '@/lib/dcc/culture'

type ArtistDetailProps = {
  artist: DccArtist
}

export function ArtistDetail({ artist }: ArtistDetailProps) {
  const path = artistHref(artist.slug)
  const programs = getProgramsForArtist(artist)
  const projects = getProjectsForArtist(artist)
  const editorial = getEditorialForArtist(artist)
  const hero = artist.heroImage ?? artist.portrait

  return (
    <>
      <PageHero
        eyebrow="Artists"
        title={artist.name}
        description={artist.shortBio}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <CultureMediaFrame
            src={hero}
            alt={artist.heroImageAlt ?? artist.portraitAlt ?? artist.name}
            aspectClassName="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]"
            fallbackLabel="Portrait forthcoming"
            priority
          />
          <div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              {artist.location ? <p>{artist.location}</p> : null}
              {artist.websiteUrl ? (
                <a
                  href={artist.websiteUrl}
                  className="underline-offset-4 hover:underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  Website
                </a>
              ) : null}
              {artist.instagramUrl ? (
                <a
                  href={artist.instagramUrl}
                  className="underline-offset-4 hover:underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              ) : null}
            </div>
            {artist.practiceTags && artist.practiceTags.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {artist.practiceTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs uppercase tracking-[0.12em] text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            {artist.bio ? (
              <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {artist.bio.split('\n\n').map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <CultureRelatedList
            heading="Programs"
            items={programs.map((program) => ({
              href: getProgramPublicPath(program),
              title: program.title,
              meta: PROGRAM_TYPE_LABEL[program.type],
            }))}
          />
          <CultureRelatedList
            heading="Projects"
            items={projects.map((project) => ({
              title: project.title,
              meta: project.year ? String(project.year) : project.shortDescription,
            }))}
          />
          <CultureRelatedList
            heading="Journal"
            items={editorial.map((entry) => ({
              href: getEditorialPublicPath(entry),
              title: entry.title,
              meta: EDITORIAL_TYPE_LABEL[entry.type],
            }))}
          />
        </div>

        <p className="mt-12 text-sm">
          <Link
            href="/artists"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            All artists
          </Link>
        </p>
      </Section>
    </>
  )
}
