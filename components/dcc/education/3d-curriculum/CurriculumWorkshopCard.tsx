import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  THREE_D_SCHOOL_LEVEL_LABEL,
  THREE_D_SCHOOL_STATUS_LABEL,
  curriculumWorkshopPath,
  type ThreeDCurriculumWorkshop,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { CurriculumMedia } from '@/components/dcc/education/3d-curriculum/CurriculumMedia'

export function CurriculumWorkshopCard({
  workshop,
  className,
}: {
  workshop: ThreeDCurriculumWorkshop
  className?: string
}) {
  const color = getFabricationColor(workshop.colorTokenId)
  const Icon = CURRICULUM_ICONS[workshop.mentalModel]

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border',
        color.border,
        color.surface,
        className
      )}
    >
      <CurriculumMedia
        assetId={workshop.heroAssetId}
        colorTokenId={workshop.colorTokenId}
        variant="card"
        className="rounded-none border-0"
      />

      <div className="flex flex-1 flex-col p-5">
        <p
          className={cn(
            'inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]',
            color.border,
            'text-neutral-700 dark:text-neutral-300'
          )}
        >
          <Icon aria-hidden className="h-3.5 w-3.5" />
          {workshop.mentalModelLabel}
        </p>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
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
          {workshop.software.length ? workshop.software.join(', ') : 'Tool TBD'}
        </p>
        <p className="mt-4 text-sm text-neutral-500">{workshop.duration}</p>
        <Link
          href={curriculumWorkshopPath(workshop.slug)}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
        >
          Open the workshop
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
