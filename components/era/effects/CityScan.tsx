'use client';

import { useId } from 'react';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';

/**
 * Public Corridor channel — diagonal scanline running over a stylized
 * corridor / city-block silhouette. SVG-only so it ships zero JS for the
 * effect itself; CSS animation handles the scan.
 *
 * On `prefers-reduced-motion` the scan freezes mid-pass instead of looping.
 */
export function CityScan({ className }: { className?: string }) {
  const gradientId = useId();
  const maskId = useId();
  const accent = eraAccent.publicCorridor;

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 240 140"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`${gradientId}-bg`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.05" />
            <stop offset="1" stopColor={accent} stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id={`${gradientId}-scan`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={accent} stopOpacity="0" />
            <stop offset="0.5" stopColor={accent} stopOpacity="0.85" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <mask id={maskId}>
            <rect width="240" height="140" fill="black" />
            {/* Stylized corridor: blocks of varying height. */}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = i * 14;
              const seed = (i * 97) % 11;
              const h = 24 + seed * 4 + (i % 3) * 8;
              return (
                <rect
                  key={i}
                  x={x}
                  y={140 - h}
                  width={11}
                  height={h}
                  fill="white"
                  rx={1}
                />
              );
            })}
            {/* Pavement strip. */}
            <rect x={0} y={134} width={240} height={6} fill="white" opacity="0.7" />
          </mask>
        </defs>
        {/* Background tint inside the corridor mask. */}
        <rect width="240" height="140" fill={`url(#${gradientId}-bg)`} />
        <g mask={`url(#${maskId})`}>
          <rect width="240" height="140" fill={`${accent}25`} />
          {/* Window grid in the buildings. */}
          {Array.from({ length: 18 }).map((_, i) =>
            Array.from({ length: 6 }).map((__, j) => (
              <rect
                key={`${i}-${j}`}
                x={i * 14 + 2}
                y={140 - (24 + ((i * 97) % 11) * 4 + (i % 3) * 8) + j * 6 + 2}
                width={2}
                height={2}
                fill={accent}
                opacity={(i * j) % 5 === 0 ? 0.85 : 0.3}
              />
            ))
          )}
          {/* Diagonal scanline. */}
          <g className="era-cityscan-scan">
            <rect
              x="-120"
              y="-30"
              width="120"
              height="220"
              fill={`url(#${gradientId}-scan)`}
              transform="rotate(20 60 70)"
            />
          </g>
        </g>
        {/* Static signage rectangle in the corridor floor. */}
        <rect
          x="170"
          y="118"
          width="50"
          height="10"
          fill={accent}
          opacity="0.55"
          rx="1"
        />
        <rect x="172" y="121" width="46" height="2" fill="#fff" opacity="0.7" />
      </svg>
      <style jsx>{`
        :global(.era-cityscan-scan) {
          animation: era-cityscan-scan 5.4s linear infinite;
          transform: translateX(-100%);
        }
        @keyframes era-cityscan-scan {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(220%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.era-cityscan-scan) {
            animation: none;
            transform: translateX(40%);
          }
        }
      `}</style>
    </div>
  );
}
