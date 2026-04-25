import type {
  Artist,
  Book,
  ChapterDossierLayout,
  ChapterLessonSkin,
  CuratorLens,
  Institution,
  ResourceLink,
  ResourcePhase,
  ResourceType,
  Tool,
  Work,
} from '@/lib/course/types'
import { SectionLabel } from '@/components/course/SectionLabel'
import { LessonExternalAnchor } from '@/components/course/LessonExternalAnchor'
import Link from 'next/link'
import { resolveResourceIcon } from '@/lib/course/resource-icons'
import { cn } from '@/lib/utils'

type IndexProps = {
  artists: Artist[]
  institutions: Institution[]
  books: Book[]
  tools: Tool[]
  anchorWorks?: Work[]
  curatorLenses?: CuratorLens[]
}

export type ResourceStripProps = IndexProps & {
  resources?: ResourceLink[]
  /** When false, skip the legacy quick index (e.g. dossier-only benchmark pages). */
  showQuickIndex?: boolean
  /** When set, dossier group headings pick up chapter accent colors. */
  presentation?: ChapterLessonSkin
  /** `phase` = canon → readings → tools using array order within each phase (see `Chapter.dossierLayout`). */
  dossierLayout?: ChapterDossierLayout
}

function LinkList({
  items,
  empty,
}: {
  items: { key: string; label: string; href?: string }[]
  empty: string
}) {
  if (!items.length) {
    return <p className="mt-1 text-neutral-600 dark:text-neutral-400">{empty}</p>
  }
  return (
    <ul className="mt-2 list-none space-y-1.5 p-0">
      {items.map((i) => (
        <li key={i.key}>
          {i.href ? (
            <LessonExternalAnchor
              href={i.href}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {i.label}
            </LessonExternalAnchor>
          ) : (
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{i.label}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

function groupResources(resources: ResourceLink[]) {
  return resources.reduce<Record<string, ResourceLink[]>>((acc, resource) => {
    acc[resource.type] = acc[resource.type] ?? []
    acc[resource.type].push(resource)
    return acc
  }, {})
}

/**
 * Within one resource type: consecutive rows with the same `dossierGroup` form one band.
 * Ungrouped rows (`dossierGroup` empty) merge with adjacent ungrouped runs.
 */
function organizeByDossierGroup(items: ResourceLink[]): { heading: string | null; items: ResourceLink[] }[] {
  const hasAny = items.some((i) => i.dossierGroup?.trim())
  if (!hasAny) return [{ heading: null, items }]

  const out: { heading: string | null; items: ResourceLink[] }[] = []

  for (const item of items) {
    const g = item.dossierGroup?.trim() || null
    const last = out[out.length - 1]
    if (last && last.heading === g) {
      last.items.push(item)
    } else {
      out.push({ heading: g, items: [item] })
    }
  }
  return out
}

function dossierGroupHeadingClass(presentation?: ChapterLessonSkin) {
  switch (presentation) {
    case 'getting-started':
      return 'text-blue-900/85 dark:text-blue-200/90'
    case 'hypertext':
    case 'remix-collage':
      return 'text-neutral-700 dark:text-neutral-300'
    case 'canon-entry':
      return 'text-slate-700 dark:text-slate-300'
    case 'browser-as-medium':
    case 'interaction-motion':
    case 'interface-glitch':
      return 'text-violet-800 dark:text-violet-200/90'
    case 'identity-networked':
    case 'systems-circulation':
      return 'text-rose-800 dark:text-rose-200/90'
    case 'advanced-pathways':
    case 'final-capstone':
      return 'text-[#0F6E54] dark:text-[#7CE3C6]'
    case 'publishing':
      return 'text-[#0F6E54] dark:text-[#7CE3C6]'
    default:
      return 'text-neutral-600 dark:text-neutral-400'
  }
}

function formatLabel(label: string) {
  return label.replace(/-/g, ' ')
}

const RESOURCE_DOSSIER_ORDER: ResourceType[] = [
  'work',
  'artist',
  'article',
  'publication',
  'interview',
  'exhibition',
  'institution',
  'organization',
  'curator',
  'book',
  'tool',
  'website',
]

const RESOURCE_PHASE_ORDER: ResourcePhase[] = ['canon', 'docs', 'tools']

function inferResourcePhase(type: ResourceType): ResourcePhase {
  switch (type) {
    case 'work':
    case 'exhibition':
    case 'institution':
    case 'artist':
      return 'canon'
    case 'article':
    case 'book':
    case 'publication':
    case 'interview':
    case 'curator':
    case 'website':
      return 'docs'
    case 'tool':
    case 'organization':
      return 'tools'
  }
}

function effectiveResourcePhase(link: ResourceLink): ResourcePhase {
  return link.resourcePhase ?? inferResourcePhase(link.type)
}

function phaseSectionTitle(phase: ResourcePhase) {
  switch (phase) {
    case 'canon':
      return 'Canon & context'
    case 'docs':
      return 'Reference & readings'
    case 'tools':
      return 'Studio & workflow tools'
  }
}

type ResourceDossierProps = {
  resources: ResourceLink[]
  presentation?: ChapterLessonSkin
  dossierLayout?: ChapterDossierLayout
}

function DossierSegmentGrid({
  segment,
  presentation,
}: {
  segment: { heading: string | null; items: ResourceLink[] }
  presentation?: ChapterLessonSkin
}) {
  return (
    <div
      className={cn(
        segment.heading &&
          'rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 dark:border-neutral-700/80 dark:bg-neutral-950/50 md:p-5',
      )}
    >
      {segment.heading ? (
        <h4
          className={cn(
            'text-xs font-semibold uppercase tracking-[0.16em]',
            dossierGroupHeadingClass(presentation),
          )}
        >
          {segment.heading}
        </h4>
      ) : null}
      <div className={cn('grid gap-4 xl:grid-cols-2', segment.heading ? 'mt-4' : '')}>
        {segment.items.map((item) => {
          const Icon = resolveResourceIcon(item)
          return (
            <article
              key={`${item.type}-${item.href}`}
              className="rounded-3xl border border-neutral-200 bg-white/90 p-5 dark:border-neutral-700 dark:bg-neutral-950/50"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-neutral-200 bg-white/80 p-3 dark:border-neutral-600 dark:bg-neutral-900/80">
                  <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
                </div>
                <div className="min-w-0">
                  <Link
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-base font-semibold text-neutral-900 underline underline-offset-4 dark:text-neutral-50"
                  >
                    {item.title}
                  </Link>
                  {(item.publisher || item.year || item.region) && (
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {[item.publisher, item.year, item.region].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {item.description ? (
                    <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{item.description}</p>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function ResourceDossier({ resources, presentation, dossierLayout = 'type' }: ResourceDossierProps) {
  const grouped = groupResources(resources)
  const orderedTypes = [
    ...RESOURCE_DOSSIER_ORDER.filter((t) => (grouped[t]?.length ?? 0) > 0),
    ...Object.keys(grouped).filter((k) => !RESOURCE_DOSSIER_ORDER.includes(k as ResourceType)),
  ]
  const hasBands = resources.some((r) => r.dossierGroup?.trim())
  const usePhase = dossierLayout === 'phase'

  return (
    <section
      id="chapter-dossier"
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Chapter dossier
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Articles, shows, publications, and tools
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-neutral-700 dark:text-neutral-300">
          Curated research and studio appendix for this chapter — institutional context, interpretation, and build
          paths.
          {usePhase ? (
            <>
              {' '}
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                This chapter orders the dossier canon → readings → studio tools so it reads like a short research
                trail.
              </span>
            </>
          ) : null}
          {!usePhase && hasBands ? (
            <>
              {' '}
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Bands group links by role when the chapter marks them (e.g. platform docs vs quick lookup).
              </span>
            </>
          ) : null}
        </p>
      </div>
      <div className="mt-8 space-y-8">
        {usePhase
          ? RESOURCE_PHASE_ORDER.map((phase) => {
              const phaseItems = resources.filter((r) => effectiveResourcePhase(r) === phase)
              if (!phaseItems.length) return null
              const segments = organizeByDossierGroup(phaseItems)
              return (
                <section key={phase} className="space-y-6">
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-2xl">
                    {phaseSectionTitle(phase)}
                  </h3>
                  <div className="space-y-8">
                    {segments.map((segment, segIdx) => (
                      <DossierSegmentGrid
                        key={segment.heading ?? `flat-${phase}-${segIdx}`}
                        segment={segment}
                        presentation={presentation}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          : orderedTypes.map((type) => {
              const items = grouped[type]
              if (!items?.length) return null
              const segments = organizeByDossierGroup(items)
              return (
                <section key={type} className="space-y-6">
                  <h3 className="text-lg font-semibold capitalize text-neutral-950 dark:text-neutral-50">
                    {formatLabel(type)}
                  </h3>
                  <div className="space-y-8">
                    {segments.map((segment, segIdx) => (
                      <DossierSegmentGrid
                        key={segment.heading ?? `flat-${type}-${segIdx}`}
                        segment={segment}
                        presentation={presentation}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
      </div>
    </section>
  )
}

export function ResourceStrip({
  resources,
  artists,
  institutions,
  books,
  tools,
  anchorWorks = [],
  curatorLenses = [],
  showQuickIndex = true,
  presentation,
  dossierLayout = 'type',
}: ResourceStripProps) {
  const workLines: { key: string; label: string; href?: string }[] = []
  for (const w of anchorWorks ?? []) {
    if (w.links?.length) {
      w.links.forEach((l, idx) => {
        workLines.push({
          key: `${w.title}-${l.href}-${idx}`,
          label: `${w.title} — ${l.label}`,
          href: l.href,
        })
      })
    } else {
      workLines.push({ key: w.title, label: w.title })
    }
  }

  const showIndex =
    showQuickIndex &&
    (artists.length > 0 ||
      institutions.length > 0 ||
      books.length > 0 ||
      tools.length > 0 ||
      curatorLenses.length > 0 ||
      workLines.length > 0)

  return (
    <div className="space-y-8" id="resources">
      {resources?.length ? (
        <ResourceDossier resources={resources} presentation={presentation} dossierLayout={dossierLayout} />
      ) : null}

      {showIndex ? (
        <section className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-950/60">
          <SectionLabel>Resources</SectionLabel>
          <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">Quick index</h2>
          <dl className="mt-4 grid gap-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-neutral-800 dark:text-neutral-200">Anchor works</dt>
              <dd>
                <LinkList items={workLines} empty="—" />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-800 dark:text-neutral-200">Artists</dt>
              <dd>
                <LinkList
                  items={artists.map((a) => ({ key: a.name, label: a.name, href: a.website }))}
                  empty="—"
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-800 dark:text-neutral-200">Curator / writer lenses</dt>
              <dd>
                <LinkList
                  items={curatorLenses.map((c) => ({ key: c.name, label: c.name, href: c.website }))}
                  empty="—"
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-800 dark:text-neutral-200">Institutions</dt>
              <dd>
                <LinkList
                  items={institutions.map((i) => ({ key: i.name, label: i.name, href: i.website }))}
                  empty="—"
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-800 dark:text-neutral-200">Books</dt>
              <dd>
                <LinkList
                  items={books.map((b) => ({
                    key: b.title + b.author,
                    label: `${b.title} — ${b.author}`,
                    href: b.link,
                  }))}
                  empty={books.length ? 'Add a purchase or publisher link on the book row in the overlay.' : '—'}
                />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-neutral-800 dark:text-neutral-200">Tools</dt>
              <dd>
                <LinkList
                  items={tools.map((t) => ({ key: t.name, label: t.name, href: t.website }))}
                  empty="—"
                />
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  )
}
