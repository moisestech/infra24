import type { ModuleBanner as ModuleBannerMeta } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'

/**
 * Ultra-wide illustrative module banner with room for HTML title overlays.
 * Does not bake text into the image. Not documentary evidence.
 */
export function ModuleBanner({
  banner,
  children,
  className,
  priority = false,
  decorative = true,
  washClassName,
}: {
  banner: ModuleBannerMeta
  children?: React.ReactNode
  className?: string
  /** Disable lazy-load for the first visible / LCP banner. */
  priority?: boolean
  /** When true, alt is empty because the heading communicates the module. */
  decorative?: boolean
  /** Module-token left wash for live HTML titles (does not bake into the asset). */
  washClassName?: string
}) {
  return (
    <header
      className={cn(
        'relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-slate-100',
        className
      )}
    >
      <div
        className="relative min-h-[11rem] w-full sm:min-h-[13rem] md:min-h-[15rem] lg:min-h-0"
        style={{ aspectRatio: `${banner.width} / ${banner.height}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner.src}
          alt={decorative ? '' : banner.alt}
          width={banner.width}
          height={banner.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: banner.objectPosition ?? 'center right',
          }}
        />
        {children ? (
          <div
            aria-hidden
            className={cn(
              'absolute inset-0 bg-gradient-to-r',
              washClassName ??
                'from-[#f5f7f5]/95 via-[#f5f7f5]/75 to-transparent sm:from-[#f5f7f5]/92 sm:via-[#f5f7f5]/55'
            )}
          />
        ) : null}
        {children ? (
          <div className="relative z-10 flex h-full min-h-[11rem] flex-col justify-end p-4 sm:min-h-[13rem] sm:p-5 md:min-h-[15rem] md:p-6 lg:min-h-0 lg:justify-center lg:p-7 xl:p-8 2xl:p-10">
            <div className="max-w-[min(100%,28rem)] md:max-w-[min(100%,34rem)] lg:max-w-[38%]">
              {children}
            </div>
          </div>
        ) : null}
      </div>
      <p className="sr-only">
        Illustrative webpage banner — not a documentary safety, slicer, or
        equipment photograph.
      </p>
    </header>
  )
}
