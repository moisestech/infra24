'use client';

import { eraAccent, type EraAccentKey } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';

type EffectFallbackProps = {
  accentKey?: EraAccentKey;
  /** Plain shape descriptor; effect-specific implementations override this. */
  shape?: 'mesh' | 'rings' | 'lattice' | 'pulse' | 'loop' | 'scan' | 'particles';
  className?: string;
};

/**
 * SSR-safe placeholder used by every Born-Digital Era effect before its full
 * client-only renderer (three.js, p5, Houdini Paint API, etc.) hydrates. Also
 * doubles as the `prefers-reduced-motion` rendering — quiet, structured,
 * still-on-brand.
 */
export function EffectFallback({
  accentKey = 'network',
  shape = 'mesh',
  className,
}: EffectFallbackProps) {
  const accent = eraAccent[accentKey];
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 80% 20%, ${accent}1f 0%, transparent 60%), radial-gradient(120% 80% at 0% 100%, ${accent}14 0%, transparent 65%)`,
        }}
      />
      <svg
        viewBox="0 0 200 140"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-50 mix-blend-luminosity"
      >
        <defs>
          <linearGradient id={`era-fallback-${shape}-${accentKey}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.7" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {shape === 'mesh' ? (
          <g stroke={`url(#era-fallback-${shape}-${accentKey})`} strokeWidth="0.5" fill="none">
            {Array.from({ length: 20 }).map((_, i) => {
              const y = (i / 20) * 140;
              return <line key={`h${i}`} x1={0} x2={200} y1={y} y2={y + 6} />;
            })}
            {Array.from({ length: 28 }).map((_, i) => {
              const x = (i / 28) * 200;
              return <line key={`v${i}`} x1={x} x2={x + 4} y1={0} y2={140} />;
            })}
          </g>
        ) : null}
        {shape === 'rings' ? (
          <g fill="none" stroke={accent} strokeWidth="0.4" opacity="0.7">
            {[10, 22, 36, 52, 70].map((r) => (
              <circle key={r} cx={150} cy={70} r={r} />
            ))}
          </g>
        ) : null}
        {shape === 'lattice' ? (
          <g fill={accent} opacity="0.5">
            {Array.from({ length: 14 }).map((_, row) =>
              Array.from({ length: 20 }).map((__, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={col * 10}
                  y={row * 10}
                  width={1.5}
                  height={1.5}
                  opacity={(row * col) % 7 === 0 ? 0.9 : 0.25}
                />
              ))
            )}
          </g>
        ) : null}
        {shape === 'pulse' ? (
          <g fill="none" stroke={accent} strokeWidth="0.6" opacity="0.7">
            <path d="M0 70 Q 30 30, 60 70 T 120 70 T 200 70" />
            <path d="M0 75 Q 30 35, 60 75 T 120 75 T 200 75" opacity="0.4" />
          </g>
        ) : null}
        {shape === 'loop' ? (
          <g fill="none" stroke={accent} strokeWidth="0.5" opacity="0.6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} cx="100" cy="70" rx={20 + i * 8} ry={10 + i * 4} />
            ))}
          </g>
        ) : null}
        {shape === 'scan' ? (
          <g>
            <line
              x1="0"
              x2="200"
              y1="40"
              y2="100"
              stroke={accent}
              strokeWidth="0.6"
              opacity="0.7"
            />
            <line
              x1="0"
              x2="200"
              y1="60"
              y2="120"
              stroke={accent}
              strokeWidth="0.4"
              opacity="0.4"
            />
          </g>
        ) : null}
        {shape === 'particles' ? (
          <g fill={accent}>
            {Array.from({ length: 60 }).map((_, i) => {
              const x = (i * 53) % 200;
              const y = (i * 31) % 140;
              return <circle key={i} cx={x} cy={y} r={0.6} opacity={0.6} />;
            })}
          </g>
        ) : null}
      </svg>
    </div>
  );
}
