import Image from 'next/image';
import type { KnightPacketStoryPhoto } from '@/lib/marketing/knight-packet';
import { cn } from '@/lib/utils';

const scrimLight =
  'pointer-events-none absolute inset-0 bg-gradient-to-tr from-teal-900/10 via-transparent to-fuchsia-900/10 dark:from-teal-950/40 dark:to-fuchsia-950/35';

const scrimDarkHero =
  'pointer-events-none absolute inset-0 bg-gradient-to-tr from-teal-950/30 via-transparent to-violet-950/25';

export type KnightPacketFieldPhotoMosaicProps = {
  horizontalItems?: KnightPacketStoryPhoto[];
  items: KnightPacketStoryPhoto[];
  surface: 'light' | 'darkHero';
  className?: string;
};

export function KnightPacketFieldPhotoMosaic({
  horizontalItems,
  items,
  surface,
  className,
}: KnightPacketFieldPhotoMosaicProps) {
  const horiz = horizontalItems?.slice(0, 2) ?? [];
  const hasHoriz = horiz.length > 0;
  const hasGrid = items.length > 0;

  if (!hasHoriz && !hasGrid) return null;

  const figureLight =
    'overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100 shadow-md ring-1 ring-black/[0.04] dark:border-neutral-700 dark:bg-neutral-900 dark:ring-white/[0.06]';

  const captionLight =
    'border-t border-neutral-200/80 bg-white/95 px-3 py-2.5 text-xs leading-snug text-neutral-600 dark:border-neutral-700 dark:bg-neutral-950/95 dark:text-neutral-400';

  const figureDark =
    'overflow-hidden rounded-2xl border border-white/22 bg-black/35 shadow-[0_14px_44px_rgba(0,0,0,0.5)] ring-1 ring-white/12 backdrop-blur-md [text-shadow:0_1px_12px_rgba(0,0,0,0.65)]';

  const captionDark =
    'border-t border-white/18 bg-black/45 px-3 py-2.5 text-xs leading-snug text-white/90 backdrop-blur-sm';

  const figureShell = surface === 'light' ? figureLight : figureDark;
  const figCaption = surface === 'light' ? captionLight : captionDark;
  const scrim = surface === 'light' ? scrimLight : scrimDarkHero;

  const horizontalRow =
    hasHoriz ? (
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
        {horiz.map((item) => (
          <figure key={item.src} className={figureShell}>
            <div className="relative aspect-[16/9] w-full md:aspect-[2/1]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={scrim} aria-hidden />
            </div>
            <figcaption className={cn(figCaption, 'px-4 py-3')}>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    ) : null;

  const grid = hasGrid ? (
    <div
      className={cn(
        'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6',
        hasHoriz && 'mt-8 md:mt-10'
      )}
    >
      {items.map((item) => (
        <figure key={item.src} className={figureShell}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className={scrim} aria-hidden />
          </div>
          <figcaption className={figCaption}>{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  ) : null;

  return (
    <div className={cn(className)}>
      {horizontalRow}
      {grid}
    </div>
  );
}
