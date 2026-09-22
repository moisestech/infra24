import Image from 'next/image'
import { cn } from '@/lib/utils'
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients'
import type { DccEditorialImageRatio, DccEditorialImageRole } from '@/lib/dcc/culture/types'

export type EditorialImageSlotProps = {
  id: string
  ratio?: DccEditorialImageRatio
  role?: DccEditorialImageRole
  title: string
  brief?: string
  src?: string
  alt?: string
}

const RATIO_CLASS: Record<DccEditorialImageRatio, string> = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
}

export function EditorialImageSlot({
  id,
  ratio = '16:9',
  role = 'editorial-photo',
  title,
  brief,
  src,
  alt,
}: EditorialImageSlotProps) {
  const isHero = role === 'hero'
  const isDiagram = role === 'diagram' || role === 'map'
  const isSvg = Boolean(src?.toLowerCase().endsWith('.svg'))
  const emptySurface = isDiagram ? 'meshSlate' : 'signalCyan'

  return (
    <figure
      data-editorial-image-slot={id}
      data-editorial-image-role={role}
      className="overflow-hidden border border-neutral-200 dark:border-neutral-700"
    >
      <div className={cn('relative w-full', RATIO_CLASS[ratio])}>
        {src ? (
          isSvg ? (
            // Vector diagrams: preserve labels; Next/Image is for raster slots.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? title}
              className={cn(
                'absolute inset-0 h-full w-full',
                isDiagram
                  ? 'object-contain bg-[#f7f7f5]'
                  : 'object-cover'
              )}
            />
          ) : (
            <Image
              src={src}
              alt={alt ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              className={isDiagram ? 'object-contain' : 'object-cover'}
            />
          )
        ) : (
          <div
            className={cn(
              'flex h-full w-full flex-col justify-end gap-2 p-5 sm:p-6',
              marketingGradientSurfaceClass(emptySurface)
            )}
          >
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-400">
              {isHero ? (
                'Hero'
              ) : (
                <span className="editorial-image-slot__index" />
              )}
            </p>
            <p className="text-sm font-semibold leading-snug text-neutral-50">
              {title}
            </p>
            {brief ? (
              <p className="max-w-xl text-sm leading-relaxed text-neutral-300">
                {brief}
              </p>
            ) : null}
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-neutral-500">
              {ratio} · Imagery forthcoming
            </p>
          </div>
        )}
      </div>
      {src ? (
        <figcaption className="border-t border-neutral-200 px-5 py-3 dark:border-neutral-700">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            {isHero ? 'Hero' : <span className="editorial-image-slot__index" />}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
            {title}
          </p>
        </figcaption>
      ) : null}
    </figure>
  )
}
