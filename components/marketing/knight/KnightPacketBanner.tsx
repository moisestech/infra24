'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KnightBannerTerminal } from '@/components/marketing/knight/KnightBannerTerminal';
import { knightPacketBannerAlt, knightPacketBannerImages } from '@/lib/marketing/knight-packet';
import { cn } from '@/lib/utils';

/**
 * Full-width packet banner: scroll parallax + CSS-only overlays (aurora, grid, scan,
 * Ken Burns, rim light, occasional sheen) + optional CLI-style typing overlay.
 * Scroll/resize + light typing timeouts only; respects `prefers-reduced-motion`.
 */
export function KnightPacketBanner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [parallaxY, setParallaxY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useLayoutEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setParallaxY(0);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const mid = rect.top + rect.height / 2;
      const n = (mid - vh / 2) / (vh * 0.75);
      const clamped = Math.max(-1, Math.min(1, n));
      setParallaxY(-clamped * 16);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={wrapRef}
      className="knight-packet-banner relative isolate w-full overflow-hidden border-b border-neutral-200/90 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] knight-packet-banner__aurora"
        aria-hidden
      />
      <div className="relative z-[2] aspect-[21/9] min-h-[120px] w-full max-h-[min(32vw,260px)] sm:max-h-[min(28vw,280px)]">
        <div
          className={cn(
            'absolute -left-[3%] top-0 h-[118%] w-[106%] max-md:w-[108%]',
            reduceMotion && 'scale-[1.06]',
            !reduceMotion && 'will-change-transform'
          )}
          style={reduceMotion ? undefined : { transform: `translateY(${parallaxY}px) scale(1.06)` }}
        >
          {/* Inner layer: slow Ken Burns (scale-only) — avoids fighting parallax translate on same node */}
          <div
            className={cn(
              'relative h-full w-full',
              !reduceMotion && 'knight-packet-banner__kenburns'
            )}
          >
            <Image
              src={knightPacketBannerImages.light}
              alt={knightPacketBannerAlt}
              fill
              priority
              className="object-cover object-[center_42%] dark:hidden"
              sizes="100vw"
            />
            <Image
              src={knightPacketBannerImages.dark}
              alt=""
              fill
              priority
              className="hidden object-cover object-[center_42%] dark:block"
              sizes="100vw"
              aria-hidden
            />
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[3] knight-packet-banner__sheen"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[4] knight-packet-banner__grid"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[5] knight-packet-banner__scan"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[3px] knight-packet-banner__rim" aria-hidden />
      <KnightBannerTerminal reduceMotion={reduceMotion} />
    </div>
  );
}
