import type { ReactNode } from 'react';
import { knightPacketNarrativeSplitImages } from '@/lib/marketing/knight-packet';

type KnightNarrativeMapSectionProps = {
  children: ReactNode;
};

/**
 * #narrative — full-bleed DCC map as CSS background (light / dark) with light scrim for copy.
 */
export function KnightNarrativeMapSection({ children }: KnightNarrativeMapSectionProps) {
  const light = knightPacketNarrativeSplitImages.light;
  const dark = knightPacketNarrativeSplitImages.dark;

  return (
    <section
      id="narrative"
      className="relative scroll-mt-28 overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800"
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden"
          style={{ backgroundImage: `url('${light}')` }}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat dark:block"
          style={{ backgroundImage: `url('${dark}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/72 via-white/55 to-white/78 dark:from-neutral-950/75 dark:via-neutral-950/60 dark:to-neutral-950/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">{children}</div>
    </section>
  );
}
