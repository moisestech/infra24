import Image from 'next/image'
import {
  EDGE_ZONES_BANNERS,
  type EdgeZonesBannerKey,
} from '@/lib/marketing/edgezones-media'
import { cn } from '@/lib/utils'

type Props = {
  banner: EdgeZonesBannerKey
  /** Optional caption overlaid on the scrim */
  caption?: string
  priority?: boolean
  className?: string
}

/** Full-width section banner with bottom gradient scrim. */
export function EdgeZonesSectionBanner({ banner, caption, priority = false, className }: Props) {
  const photo = EDGE_ZONES_BANNERS[banner]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900',
        className
      )}
    >
      <div className="relative aspect-[3/1] w-full min-h-[7rem] sm:min-h-[9rem]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1152px"
        />
        <div className="ez-banner-scrim pointer-events-none absolute inset-0" aria-hidden />
        {caption ? (
          <p className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white/90 sm:text-sm">
            {caption}
          </p>
        ) : null}
      </div>
    </div>
  )
}
