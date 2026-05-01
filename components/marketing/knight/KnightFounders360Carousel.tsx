import type { KnightFounderMomentoEmbed } from '@/lib/marketing/knight-people';
import { cn } from '@/lib/utils';

type KnightFounders360CarouselProps = {
  items: KnightFounderMomentoEmbed[];
  className?: string;
};

/**
 * Edge-to-edge horizontal “carousel” of Momento360 iframes (`scroll-snap` when multiple slides).
 */
export function KnightFounders360Carousel({ items, className }: KnightFounders360CarouselProps) {
  if (items.length === 0) return null;

  const multi = items.length > 1;

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
            360° captures of studio space — drag or pinch to look around.
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
            className="relative min-w-full shrink-0 snap-center snap-always"
            role="group"
            aria-roledescription="slide"
            aria-label={item.label}
          >
            <div className="relative h-[clamp(260px,42vw,560px)] w-full">
              <iframe
                src={item.embedSrc}
                title={`360° space — ${item.label}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-16 sm:px-6 sm:pb-5">
              <p className="text-sm font-semibold tracking-tight text-white drop-shadow-sm sm:text-base">
                {item.label}
              </p>
              <p className="mt-0.5 text-[11px] text-violet-200/80 sm:text-xs">
                Archive Artists Studios · 360°
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
