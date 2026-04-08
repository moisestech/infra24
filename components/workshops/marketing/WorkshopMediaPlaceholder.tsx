'use client'

import { cn } from '@/lib/utils'
import {
  marketingGradientSurfaceClass,
  type MarketingGradientId,
} from '@/lib/marketing/marketing-gradients'

const GRADIENT_IDS: MarketingGradientId[] = [
  'meshSlate',
  'indigoHaze',
  'stackTeal',
  'fieldViolet',
  'roseMist',
  'signalCyan',
  'warmAmber',
  'deepInk',
]

function hashTitle(title: string): number {
  let h = 0
  for (let i = 0; i < title.length; i++) {
    h = (h << 5) - h + title.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function WorkshopMediaPlaceholder({
  title,
  subtitle,
  aspectClassName = 'aspect-[4/3]',
  className,
  imagePrompt,
}: {
  title: string
  subtitle?: string | null
  aspectClassName?: string
  className?: string
  /** From metadata.placeholderImagePrompt — exposed to screen readers only */
  imagePrompt?: string | null
}) {
  const gradientId = GRADIENT_IDS[hashTitle(title) % GRADIENT_IDS.length]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl',
        aspectClassName,
        marketingGradientSurfaceClass(gradientId, { mesh: true }),
        className
      )}
      role="img"
      aria-label={imagePrompt ? `${title}. ${imagePrompt}` : title}
    >
      {imagePrompt ? (
        <span className="sr-only">{imagePrompt}</span>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
        {subtitle ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 md:text-xs">
            {subtitle}
          </p>
        ) : null}
        <p className="mt-1 line-clamp-3 text-base font-semibold leading-snug tracking-tight text-white shadow-sm md:text-lg">
          {title}
        </p>
      </div>
    </div>
  )
}
