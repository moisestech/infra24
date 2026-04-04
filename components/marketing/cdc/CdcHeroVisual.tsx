'use client';

import { useReducedMotion } from 'framer-motion';
import { BorderBeam } from '@/components/ui/border-beam';
import { HeroCollage } from '@/components/marketing/HeroCollage';
import { CdcMiamiLogo } from '@/components/marketing/cdc/CdcMiamiLogo';
import { cdcHeroDigital } from '@/lib/marketing/content';
import { cdcDigitalBeam } from '@/lib/marketing/cdc-digital-theme';
import { cn } from '@/lib/utils';

export function CdcHeroVisual({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[var(--cdc-border)] shadow-[0_28px_90px_-32px_rgba(13,148,136,0.22)]',
        className
      )}
    >
      <div className="cdc-mesh-hero-bg absolute inset-0" aria-hidden />
      <div
        className="cdc-grid-overlay pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
      />

      {!reduceMotion && (
        <BorderBeam
          size={110}
          duration={14}
          borderWidth={1.25}
          colorFrom={cdcDigitalBeam.from}
          colorTo={cdcDigitalBeam.to}
        />
      )}

      <div className="relative z-[1]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cdc-border)] bg-white/40 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-3.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-600 sm:text-[10px]">
            <span className="text-[var(--cdc-teal)]">{cdcHeroDigital.systemLabels[0]}</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <span className="text-[var(--cdc-coral)]">{cdcHeroDigital.systemLabels[1]}</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <span className="text-[var(--cdc-magenta)]">{cdcHeroDigital.systemLabels[2]}</span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <CdcMiamiLogo size="hero" priority />
          </div>
        </div>

        <div className="p-2 sm:p-3">
          <HeroCollage variant="embedded" />
        </div>

        <p className="px-3 pb-3 pt-0 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
          {cdcHeroDigital.caption}
        </p>
      </div>

      <svg
        className="pointer-events-none absolute bottom-8 right-0 w-[min(52%,240px)] opacity-[0.22] max-lg:bottom-16 max-lg:w-[min(70%,200px)]"
        viewBox="0 0 320 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 72 C 48 24, 96 88, 160 52 S 288 28, 320 44"
          stroke="var(--cdc-teal)"
          strokeWidth="1.25"
          strokeDasharray="5 7"
          vectorEffect="non-scaling-stroke"
          className={reduceMotion ? undefined : 'cdc-data-path-animate'}
        />
        <path
          d="M20 88 L 20 68 L 36 76 Z"
          fill="var(--cdc-coral)"
          fillOpacity="0.35"
        />
      </svg>
    </div>
  );
}
