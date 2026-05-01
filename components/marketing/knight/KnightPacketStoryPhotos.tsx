import { Section } from '@/components/marketing/cdc';
import type { KnightPacketStoryPhoto } from '@/lib/marketing/knight-packet';
import { KnightPacketFieldPhotoMosaic } from '@/components/marketing/knight/KnightPacketFieldPhotoMosaic';
import { cn } from '@/lib/utils';

type KnightPacketStoryPhotosProps = {
  items: KnightPacketStoryPhoto[];
  horizontalItems?: KnightPacketStoryPhoto[];
  showIntro?: boolean;
  sectionId?: string;
  embedded?: boolean;
  className?: string;
};

export function KnightPacketStoryPhotos({
  items,
  horizontalItems,
  showIntro = false,
  sectionId = 'knight-story-photos',
  embedded = false,
  className,
}: KnightPacketStoryPhotosProps) {
  const horiz = horizontalItems?.slice(0, 2) ?? [];
  const hasHoriz = horiz.length > 0;
  const hasGrid = items.length > 0;

  if (!hasHoriz && !hasGrid) return null;

  const inner = (
    <>
      {showIntro ? (
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
            Field & programs
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
            Documentation from the work
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Context photographs alongside the narrative — Miami programming and national convenings tied to the pilot.
          </p>
        </div>
      ) : null}
      <KnightPacketFieldPhotoMosaic
        surface="light"
        horizontalItems={horizontalItems}
        items={items}
      />
    </>
  );

  const paddedShell = 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';

  if (embedded) {
    return <div className={cn('mx-auto w-full max-w-6xl', className)}>{inner}</div>;
  }

  return (
    <Section
      id={sectionId}
      className={cn(
        'scroll-mt-28 border-b border-neutral-200/70 bg-gradient-to-b from-white via-neutral-50/40 to-white py-10 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-900/40 dark:to-neutral-950 sm:py-12 lg:py-14',
        className
      )}
    >
      <div className={paddedShell}>{inner}</div>
    </Section>
  );
}
