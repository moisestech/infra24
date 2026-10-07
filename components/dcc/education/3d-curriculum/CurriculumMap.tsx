import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  CURRICULUM_MAP_OUTPUT,
  CURRICULUM_MAP_PROCESS,
  CURRICULUM_MAP_SOURCE,
  CURRICULUM_MAP_TOOLS,
  THREE_D_SCHOOL_MAP_HEADING,
  THREE_D_SCHOOL_MAP_LEAD,
  getCurriculumWorkshopById,
  toolLogoForMapNode,
  type ThreeDCurriculumMapNode,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { curriculumCardInteractive } from '@/components/dcc/education/3d-curriculum/interactive'

function MapNode({
  node,
  emphasized = false,
}: {
  node: ThreeDCurriculumMapNode
  emphasized?: boolean
}) {
  const workshop = node.workshopId
    ? getCurriculumWorkshopById(node.workshopId)
    : undefined
  const color = getFabricationColor(workshop?.colorTokenId ?? 'slate')
  const Icon =
    workshop?.mentalModel === 'mesh'
      ? CURRICULUM_ICONS.mesh
      : workshop?.mentalModel === 'solid'
        ? CURRICULUM_ICONS.solid
        : workshop?.mentalModel === 'nurbs'
          ? CURRICULUM_ICONS.nurbs
          : workshop?.mentalModel === 'repair'
            ? CURRICULUM_ICONS.repair
            : workshop?.mentalModel === 'literacy'
              ? CURRICULUM_ICONS.literacy
              : CURRICULUM_ICONS.print

  const logo = toolLogoForMapNode(node.id)
  const inner = (
    <>
      {logo ? (
        <span
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white',
            emphasized ? 'h-20 w-20' : 'h-28 w-28'
          )}
        >
          <img src={logo.src} alt="" className="h-full w-full object-contain p-2" />
        </span>
      ) : (
        <span
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-2xl shadow-sm',
            emphasized ? 'h-20 w-20' : 'h-24 w-24',
            color.icon
          )}
        >
          <Icon aria-hidden className={emphasized ? 'h-10 w-10' : 'h-12 w-12'} />
        </span>
      )}
      <span className={cn('min-w-0', emphasized ? 'text-left' : 'text-center')}>
        <span className={cn('block text-lg font-semibold leading-snug text-neutral-900 dark:text-neutral-50 sm:text-xl', !emphasized && 'mt-3')}>
          {node.label}
        </span>
        {node.sublabel ? (
          <span className="mt-1 block text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-base">
            {node.sublabel}
          </span>
        ) : null}
        {workshop ? (
          <span className="mt-2 block text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-400">
            {workshop.status === 'pilot' ? 'Open the workshop' : 'Coming / in development'}
          </span>
        ) : null}
      </span>
    </>
  )

  const className = cn(
    'group flex rounded-2xl border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900',
    curriculumCardInteractive(color),
    emphasized
      ? 'min-h-28 flex-row items-center gap-5 px-5 py-4 text-left'
      : 'min-h-[14rem] flex-col items-center justify-center gap-1 px-4 py-6 text-center'
  )

  if (node.href) {
    return (
      <Link href={node.href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <ArrowDown className="h-5 w-5 text-neutral-400" />
    </div>
  )
}

export function CurriculumMap({
  className,
  embedded = false,
}: {
  className?: string
  embedded?: boolean
}) {
  const body = (
      <div className={cn(!embedded && 'mt-8', 'rounded-2xl border border-[var(--cdc-border)] bg-white/70 p-4 dark:bg-neutral-950/70 sm:p-6')}>
        <MapNode node={CURRICULUM_MAP_SOURCE} emphasized />
        <FlowArrow />
        <ul className="grid gap-3 md:grid-cols-3">
          {CURRICULUM_MAP_TOOLS.map((node) => (
            <li key={node.id}>
              <MapNode node={node} />
            </li>
          ))}
        </ul>
        <FlowArrow />
        <ol className="flex flex-col gap-3">
          {CURRICULUM_MAP_PROCESS.map((node) => (
            <li key={node.id}>
              <MapNode node={node} emphasized />
            </li>
          ))}
        </ol>
        <FlowArrow />
        <MapNode node={CURRICULUM_MAP_OUTPUT} emphasized />
      </div>
  )

  if (embedded) return body

  return (
    <section
      id="curriculum-map"
      className={cn('scroll-mt-24', className)}
      aria-labelledby="curriculum-map-heading"
    >
      <h2
        id="curriculum-map-heading"
        className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl"
      >
        {THREE_D_SCHOOL_MAP_HEADING}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
        {THREE_D_SCHOOL_MAP_LEAD}
      </p>
      {body}
    </section>
  )
}
