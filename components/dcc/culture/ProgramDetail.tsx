import Link from 'next/link'
import { PageHero, Section } from '@/components/marketing/cdc'
import { CultureMediaFrame } from '@/components/dcc/culture/CultureMediaFrame'
import { CultureRecordCard } from '@/components/dcc/culture/CultureRecordCard'
import { CultureRelatedList } from '@/components/dcc/culture/CultureRelatedList'
import { getCdcBreadcrumbs } from '@/lib/cdc/routes'
import {
  artistHref,
  CLANDESTINE_PLACEHOLDER,
  EDITORIAL_TYPE_LABEL,
  formatCultureDateRange,
  getArtistsForProgram,
  getEditorialForProgram,
  getEditorialPublicPath,
  getProgramPublicPath,
  getProjectsForProgram,
  PROGRAM_TYPE_LABEL,
  RELATION_ROLE_LABEL,
  type DccProgram,
} from '@/lib/dcc/culture'

type ProgramDetailProps = {
  program: DccProgram
}

export function ProgramDetail({ program }: ProgramDetailProps) {
  const path = getProgramPublicPath(program)
  const artists = getArtistsForProgram(program)
  const editorial = getEditorialForProgram(program)
  const projects = getProjectsForProgram(program)
  const dates = formatCultureDateRange(program.startDate, program.endDate)
  const location = [program.locationName, program.locationAddress].filter(Boolean).join(' · ')

  return (
    <>
      <PageHero
        eyebrow={PROGRAM_TYPE_LABEL[program.type]}
        title={program.title}
        description={program.subtitle ?? program.shortDescription}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            {program.description ? (
              <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-base">
                {program.description.split('\n\n').map((para) => (
                  <p key={para.slice(0, 48)}>{para}</p>
                ))}
              </div>
            ) : null}
            <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">When</dt>
                <dd className="mt-1 text-neutral-800 dark:text-neutral-200">
                  {dates ?? 'Dates to be announced'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">Where</dt>
                <dd className="mt-1 text-neutral-800 dark:text-neutral-200">
                  {location || 'Location to be announced'}
                </dd>
              </div>
              {program.node ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">Presented by</dt>
                  <dd className="mt-1 text-neutral-800 dark:text-neutral-200">{program.node}</dd>
                </div>
              ) : null}
              {program.relations && program.relations.length > 0 ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">Context</dt>
                  <dd className="mt-1 text-neutral-800 dark:text-neutral-200">
                    {program.relations
                      .map((relation) => `${RELATION_ROLE_LABEL[relation.role]}: ${relation.name}`)
                      .join(' · ')}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {program.externalUrl ? (
                <a
                  href={program.externalUrl}
                  className="font-medium underline-offset-4 hover:underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  Event information
                </a>
              ) : null}
              {program.registrationUrl ? (
                <a
                  href={program.registrationUrl}
                  className="font-medium underline-offset-4 hover:underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  Registration
                </a>
              ) : null}
            </div>
          </div>
          <CultureMediaFrame
            src={program.heroImage}
            alt={program.heroImageAlt ?? program.title}
            aspectClassName="aspect-[4/3]"
            fallbackLabel="Installation photography forthcoming"
            priority
          />
        </div>

        <section className="mt-16">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            Artists
          </h2>
          {artists.length > 0 ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => (
                <CultureRecordCard
                  key={artist.id}
                  href={artistHref(artist.slug)}
                  title={artist.name}
                  meta={artist.location}
                  description={artist.shortBio}
                  image={artist.portrait ?? artist.heroImage}
                  imageAlt={artist.portraitAlt ?? artist.name}
                  fallbackLabel="Portrait forthcoming"
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {program.id === 'clandestine-2026'
                ? CLANDESTINE_PLACEHOLDER
                : 'Participating artists will be listed when confirmed.'}
            </p>
          )}
        </section>

        {projects.length > 0 ? (
          <div className="mt-14">
            <CultureRelatedList
              heading="Selected works"
              items={projects.map((project) => ({
                title: project.title,
                meta: project.shortDescription,
              }))}
            />
          </div>
        ) : null}

        {editorial.length > 0 ? (
          <div className="mt-14">
            <CultureRelatedList
              heading="Journal"
              items={editorial.map((entry) => ({
                href: getEditorialPublicPath(entry),
                title: entry.title,
                meta: EDITORIAL_TYPE_LABEL[entry.type],
              }))}
            />
          </div>
        ) : null}

        {program.images && program.images.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              Documentation
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {program.images.map((src, index) => (
                <li key={src}>
                  <CultureMediaFrame
                    src={src}
                    alt={`${program.title} documentation ${index + 1}`}
                    aspectClassName="aspect-[4/3]"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-12 text-sm">
          <Link
            href="/programs"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            All programs
          </Link>
        </p>
      </Section>
    </>
  )
}
