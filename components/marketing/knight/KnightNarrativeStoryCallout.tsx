'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { BookOpen, MapPin } from 'lucide-react';
import { knightFullNarrativeLink } from '@/lib/marketing/knight-packet';
import { cn } from '@/lib/utils';

type GlyphTileProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  ariaLabel: string;
  tiltHover: string;
  auraClass: string;
  tileHoverRing: string;
  tileHoverShadow: string;
};

function NarrativeGlyphTile({
  href,
  icon: Icon,
  label,
  ariaLabel,
  tiltHover,
  auraClass,
  tileHoverRing,
  tileHoverShadow,
}: GlyphTileProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        'group/glyph relative flex flex-col items-center gap-2 rounded-2xl p-1 outline-none',
        'transition-[transform] duration-300 ease-out',
        'hover:z-[2] focus-visible:z-[2]',
        'motion-reduce:transition-none',
        'focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa] dark:focus-visible:ring-offset-neutral-950'
      )}
    >
      {/* Ambient glow — scales up on tile hover */}
      <span
        className={cn(
          'pointer-events-none absolute -inset-4 rounded-[1.6rem] opacity-45 blur-2xl transition-all duration-500 ease-out',
          'group-hover/glyph:scale-[1.35] group-hover/glyph:opacity-100',
          'motion-reduce:group-hover/glyph:scale-100',
          auraClass
        )}
        aria-hidden
      />
      <span
        className={cn(
          'relative flex aspect-square w-[4.75rem] items-center justify-center rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-white to-teal-50/90 text-teal-800',
          'shadow-[0_12px_36px_-14px_rgba(15,23,42,0.35),inset_0_1px_0_rgba(255,255,255,0.85)] ring-1 ring-black/[0.04]',
          '[transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out',
          'dark:border-teal-800/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-teal-950/50 dark:text-teal-200 dark:shadow-[0_16px_44px_-16px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] dark:ring-white/[0.06]',
          'motion-reduce:transition-none motion-reduce:group-hover/glyph:scale-100 motion-reduce:group-hover/glyph:transform-none',
          'group-hover/glyph:scale-110 group-hover/glyph:border-transparent',
          tileHoverRing,
          tileHoverShadow,
          tiltHover
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.07] transition-opacity duration-300 group-hover/glyph:opacity-[0.14] dark:opacity-[0.09] dark:group-hover/glyph:opacity-[0.18]"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(45,212,191,0.55) 0%, transparent 42%, transparent 58%, rgba(167,139,250,0.4) 100%),
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 10px 10px, 10px 10px',
          }}
          aria-hidden
        />
        <Icon
          className={cn(
            'relative z-[1] h-[2.15rem] w-[2.15rem] transition-[filter,transform] duration-300 ease-out',
            'drop-shadow-[0_3px_12px_rgba(45,212,191,0.45)]',
            'group-hover/glyph:scale-105 group-hover/glyph:drop-shadow-[0_0_22px_rgba(45,212,191,0.65)]',
            'motion-reduce:group-hover/glyph:scale-100',
            'dark:drop-shadow-[0_3px_14px_rgba(20,184,166,0.35)] dark:group-hover/glyph:drop-shadow-[0_0_26px_rgba(45,212,191,0.5)]'
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </span>
      <span
        className={cn(
          'max-w-[6.5rem] text-center font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition-[color,opacity] duration-300',
          'group-hover/glyph:text-teal-700 group-hover/glyph:opacity-100 dark:text-neutral-400 dark:group-hover/glyph:text-teal-300'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

/**
 * Knight-aligned narrative promo — card hover + linked glyphs and CTA to the full narrative page.
 */
export function KnightNarrativeStoryCallout() {
  const href = knightFullNarrativeLink.href;

  return (
    <div
      className={cn(
        'group/narrative rounded-3xl border border-neutral-200/70 bg-white/45 p-6 shadow-sm backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 sm:p-8',
        'hover:border-teal-400/45 hover:bg-white/58 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.12),0_20px_60px_-24px_rgba(45,212,191,0.38),0_12px_40px_-28px_rgba(124,58,237,0.15)]',
        'dark:border-neutral-700/70 dark:bg-neutral-950/45 dark:hover:border-teal-500/35 dark:hover:bg-neutral-950/55 dark:hover:shadow-[0_0_0_1px_rgba(45,212,191,0.15),0_24px_70px_-28px_rgba(45,212,191,0.25),0_16px_48px_-32px_rgba(167,139,250,0.12)]'
      )}
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-600 transition-colors group-hover/narrative:text-teal-800 dark:text-neutral-400 dark:group-hover/narrative:text-teal-300">
            Narrative · read on web
          </p>
          <h2 className="mt-2 max-w-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-teal-900 bg-clip-text text-2xl font-semibold tracking-tight text-transparent transition-[filter] duration-300 group-hover/narrative:drop-shadow-[0_0_28px_rgba(45,212,191,0.28)] dark:from-neutral-50 dark:via-neutral-200 dark:to-teal-200 dark:group-hover/narrative:drop-shadow-[0_0_32px_rgba(45,212,191,0.22)] sm:text-3xl">
            Knight-aligned story
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-700 transition-colors group-hover/narrative:text-neutral-900 dark:text-neutral-300 dark:group-hover/narrative:text-neutral-200">
            Full framing lives on one page—map context here, detail there.
          </p>
          <Link
            href={href}
            className={cn(
              'group/btn relative mt-8 inline-flex min-h-[2.75rem] items-center justify-center overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold',
              'border border-teal-500/25 bg-neutral-900 text-white shadow-[0_4px_28px_-6px_rgba(15,23,42,0.55)]',
              'transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out',
              'hover:-translate-y-1 hover:scale-[1.04] hover:border-teal-400/55 hover:bg-neutral-800',
              'hover:shadow-[0_12px_40px_-8px_rgba(45,212,191,0.42),0_0_50px_rgba(124,58,237,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]',
              'active:translate-y-0 active:scale-[0.98]',
              'motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100',
              'dark:border-teal-400/30 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100',
              'dark:hover:border-teal-300/60 dark:hover:shadow-[0_14px_44px_-10px_rgba(45,212,191,0.35),0_0_48px_rgba(45,212,191,0.15)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950'
            )}
          >
            <span
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,rgba(45,212,191,0.35),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100 dark:bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,rgba(45,212,191,0.2),transparent_55%)]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 translate-x-[-120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover/btn:translate-x-[120%] group-hover/btn:opacity-100 dark:via-teal-200/25 motion-reduce:group-hover/btn:translate-x-[-120%] motion-reduce:group-hover/btn:opacity-0"
              aria-hidden
            />
            <span className="relative z-[1] tracking-tight">Open full narrative</span>
          </Link>
        </div>

        <div className="flex shrink-0 flex-row flex-wrap items-center justify-center gap-8 sm:gap-10 lg:justify-end">
          <NarrativeGlyphTile
            href={href}
            icon={BookOpen}
            label="Full narrative"
            ariaLabel="Open full Knight-aligned narrative (same as primary button)"
            tiltHover="group-hover/glyph:[transform:perspective(560px)_rotateY(-16deg)_rotateX(10deg)_translateZ(0)]"
            auraClass="bg-gradient-to-br from-teal-400/50 to-violet-500/40 dark:from-teal-500/35 dark:to-violet-600/25"
            tileHoverRing="group-hover/glyph:ring-2 group-hover/glyph:ring-teal-400/50 dark:group-hover/glyph:ring-teal-400/35"
            tileHoverShadow="group-hover/glyph:shadow-[0_0_52px_-4px_rgba(45,212,191,0.55),0_0_72px_-12px_rgba(167,139,250,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] dark:group-hover/glyph:shadow-[0_0_56px_-4px_rgba(45,212,191,0.35),0_0_80px_-16px_rgba(167,139,250,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]"
          />
          <NarrativeGlyphTile
            href={href}
            icon={MapPin}
            label="Place & map"
            ariaLabel="Open full narrative — geographic framing on the same page"
            tiltHover="group-hover/glyph:[transform:perspective(560px)_rotateY(16deg)_rotateX(-10deg)_translateZ(0)]"
            auraClass="bg-gradient-to-br from-violet-400/45 to-cyan-400/45 dark:from-violet-500/30 dark:to-cyan-500/28"
            tileHoverRing="group-hover/glyph:ring-2 group-hover/glyph:ring-violet-400/45 dark:group-hover/glyph:ring-violet-400/35"
            tileHoverShadow="group-hover/glyph:shadow-[0_0_52px_-4px_rgba(167,139,250,0.5),0_0_72px_-12px_rgba(34,211,238,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] dark:group-hover/glyph:shadow-[0_0_56px_-4px_rgba(167,139,250,0.32),0_0_80px_-16px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
          />
        </div>
      </div>
    </div>
  );
}
