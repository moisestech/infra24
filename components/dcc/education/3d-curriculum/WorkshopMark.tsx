import { cn } from '@/lib/utils'
import {
  CURRICULUM_ICONS,
  toolLogosForSoftware,
  type ThreeDCurriculumWorkshop,
} from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import type { FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'

const MARK_GLOW: Record<FabricationColorTokenId, string> = {
  teal: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(15,118,110,0.5)]',
  cyan: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(14,116,144,0.5)]',
  indigo: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(67,56,202,0.5)]',
  amber: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(217,119,6,0.5)]',
  emerald: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(4,120,87,0.5)]',
  rose: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(190,18,60,0.5)]',
  slate: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(51,65,85,0.45)]',
  violet: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(109,40,217,0.5)]',
  orange: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(234,88,12,0.5)]',
  sky: 'motion-safe:group-hover:shadow-[0_0_28px_4px_rgba(3,105,161,0.5)]',
}

/** Large workshop mark for the right side of a card. Logo when there is one tool, otherwise the mental-model icon. */
export function WorkshopMark({ workshop }: { workshop: ThreeDCurriculumWorkshop }) {
  const color = getFabricationColor(workshop.colorTokenId)
  const logos = toolLogosForSoftware(workshop.software)
  const Icon = CURRICULUM_ICONS[workshop.mentalModel]
  const frame = cn(
    'relative z-10 h-20 w-20 shrink-0 transition duration-300 sm:h-24 sm:w-24',
    'motion-safe:group-hover:[transform:scale(1.1)_rotate(-3deg)]',
    MARK_GLOW[workshop.colorTokenId]
  )

  if (logos.length === 1) {
    return (
      <span
        className={cn(
          frame,
          'flex items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-white'
        )}
      >
        <img src={logos[0].src} alt="" className="h-full w-full object-contain p-2.5" />
      </span>
    )
  }

  return (
    <span className={cn(frame, 'inline-flex items-center justify-center rounded-3xl shadow-sm', color.icon)}>
      <Icon aria-hidden className="h-10 w-10 sm:h-12 sm:w-12" />
    </span>
  )
}
