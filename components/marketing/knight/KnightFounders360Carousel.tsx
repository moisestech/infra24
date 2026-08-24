import { StudioTourEmbed } from '@/components/dcc/studios/StudioTourEmbed'
import type { KnightFounderMomentoEmbed } from '@/lib/marketing/knight-people'
import { cn } from '@/lib/utils'

type KnightFounders360CarouselProps = {
  items: KnightFounderMomentoEmbed[]
  className?: string
}

/**
 * Edge-to-edge studio tours. Posters load first; the Momento360 iframe
 * mounts only after someone clicks enter so two or three tours stay light.
 */
export function KnightFounders360Carousel({ items, className }: KnightFounders360CarouselProps) {
  if (items.length === 0) return null

  const multi = items.length > 1

  return (
    <section
      id="knight-founders-360"
      className={cn(
        'scroll-mt-28 w-full overflow-hidden border-y border-[var(--cdc-border)] bg-neutral-950 dark:bg-black',
        className
      )}
      aria-labelledby="knight-founders-360-heading"
    >
      <h2 id="knight-founders-360-heading" className="sr-only">
        Archive Artists Studios · 360° spaces
      </h2>

      <div className="border-b border-white/[0.08] bg-gradient-to-r from-black/55 via-black/40 to-black/55 px-4 py-4 sm:px-6 sm:py-5">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300/95">
            Archive Artists Studios
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-snug text-neutral-300">
            360° captures of studio space — enter a tour, then drag or pinch to look around.
          </p>
        </div>
      </div>

      <div
        className={cn(
          'flex w-full scroll-smooth snap-x snap-mandatory overflow-x-auto overflow-y-hidden',
          multi
            ? '[scrollbar-width:thin] [scrollbar-color:rgba(45,212,171,0.35)_transparent]'
            : '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
        )}
        tabIndex={multi ? 0 : undefined}
        aria-label={multi ? 'Swipe or scroll for each Archive Artists Studios 360° view' : undefined}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="relative min-w-full shrink-0 snap-center snap-always pb-5"
            role="group"
            aria-roledescription="slide"
            aria-label={item.caption}
          >
            <StudioTourEmbed tour={item} showCaption className="mx-auto max-w-6xl pt-4" />
          </div>
        ))}
      </div>
    </section>
  )
}
