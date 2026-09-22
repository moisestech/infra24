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
  type ThreeDCurriculumMapNode,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'

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

  const inner = (
    <>
      <span
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full',
          color.icon
        )}
      >
        <Icon aria-hidden className="h-4 w-4" />
      </span>
      <span className="mt-2 block text-sm font-semibold text-neutral-900 dark:text-neutral-50">
        {node.label}
      </span>
      {node.sublabel ? (
        <span className="mt-0.5 block text-xs text-neutral-600 dark:text-neutral-400">
          {node.sublabel}
        </span>
      ) : null}
      {workshop ? (
        <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
          {workshop.status === 'pilot' ? 'Open the workshop' : 'Coming / in development'}
        </span>
      ) : null}
    </>
  )

  const className = cn(
    'flex min-h-[7.5rem] flex-col items-center justify-center rounded-2xl border px-3 py-4 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900',
    color.border,
    color.surface,
    emphasized && 'min-h-[5.5rem]'
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
      <ArrowDown className="h-4 w-4 text-neutral-400" />
    </div>
  )
}

export function CurriculumMap({ className }: { className?: string }) {
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

      <div className="mt-8 rounded-2xl border border-[var(--cdc-border)] bg-white p-4 dark:bg-neutral-950 sm:p-6">
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
    </section>
  )
}
