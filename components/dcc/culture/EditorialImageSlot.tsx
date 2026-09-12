import Image from 'next/image'
import { cn } from '@/lib/utils'
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

  return (
    <figure
      data-editorial-image-slot={id}
      data-editorial-image-role={role}
      className="overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className={cn('relative w-full', RATIO_CLASS[ratio])}>
        {src ? (
          <Image
            src={src}
            alt={alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-end gap-2 p-5 sm:p-6">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {isHero ? (
                'Hero'
              ) : (
                <span className="editorial-image-slot__index" />
              )}
            </p>
            <p className="text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
              {title}
            </p>
            {brief ? (
              <p className="max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {brief}
              </p>
            ) : null}
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500">
              {ratio} · Imagery forthcoming
            </p>
          </div>
        )}
      </div>
    </figure>
  )
}
