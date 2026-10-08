import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  THREE_D_SCHOOL_LEVEL_LABEL,
  THREE_D_SCHOOL_STATUS_LABEL,
  curriculumWorkshopPath,
  toolLogosForSoftware,
  type ThreeDCurriculumWorkshop,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import {
  curriculumCardInteractive,
  curriculumIconBadge,
} from '@/components/dcc/education/3d-curriculum/interactive'
import { ToolMarks } from '@/components/dcc/education/3d-curriculum/ToolMark'
import { WorkshopMark } from '@/components/dcc/education/3d-curriculum/WorkshopMark'

export function CurriculumWorkshopCard({
  workshop,
  className,
  markAside = false,
}: {
  workshop: ThreeDCurriculumWorkshop
  className?: string
  /** Large logo or icon on the right, with a hover glow. */
  markAside?: boolean
}) {
  const color = getFabricationColor(workshop.colorTokenId)
  const Icon = CURRICULUM_ICONS[workshop.mentalModel]
  const logos = toolLogosForSoftware(workshop.software)

  return (
    <article
      className={cn(
        'group flex h-full rounded-2xl border p-5',
        markAside ? 'flex-row items-center gap-4' : 'flex-col',
        curriculumCardInteractive(color),
        className
      )}
    >
      <div className={cn('min-w-0', markAside ? 'flex-1' : 'contents')}>
      {markAside ? null : logos.length ? (
        <ToolMarks software={workshop.software} markClassName="h-12 w-12 rounded-2xl" />
      ) : (
        <span className={curriculumIconBadge(color)}>
          <Icon aria-hidden className="h-6 w-6" />
        </span>
      )}
      <p className={cn('font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500', markAside ? '' : 'mt-3')}>
        {String(workshop.order).padStart(2, '0')} · {THREE_D_SCHOOL_STATUS_LABEL[workshop.status]} ·{' '}
        {THREE_D_SCHOOL_LEVEL_LABEL[workshop.level]}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        <Link
          href={curriculumWorkshopPath(workshop.slug)}
          className="rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          {workshop.title}
        </Link>
      </h3>
      {workshop.subtitle ? (
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {workshop.subtitle}
        </p>
      ) : null}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {workshop.mentalModelLabel}
        {workshop.software.length ? ` · ${workshop.software.join(', ')}` : ''}
      </p>
      <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {workshop.duration}
      </p>
      <Link
        href={curriculumWorkshopPath(workshop.slug)}
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
      >
        Open the workshop
        <ArrowRight
          aria-hidden
          className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
        />
      </Link>
      </div>
      {markAside ? <WorkshopMark workshop={workshop} /> : null}
    </article>
  )
}
