'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import { EraKpiLadder } from '@/components/era/EraKpiLadder';
import { bornDigitalEra } from '@/lib/marketing/content';
import type { EraMetricLadder } from '@/lib/era/metrics';

export type EraInflectionChannel = {
  id: string;
  title: string;
  shortLabel: string;
  group: string;
  description: string;
  siteHref: string;
  eraHref?: string;
  converge: string;
};

export type EraInflectionCardProps = {
  channel: EraInflectionChannel;
  accent: string;
  /** Overrides the Born-Digital Era eyebrow (homepage snapshot kickers). */
  kicker?: string;
  /** Primary CTA label when no KPI ladder join action is present. */
  joinLabel?: string;
  ladder?: EraMetricLadder;
  /**
   * The bespoke effect rendered behind the card content (three.js, p5,
   * Paint API, etc.). Owners are responsible for `pointer-events-none` and
   * `aria-hidden`. Keep heavy effects behind `dynamic(... { ssr: false })`
   * at the call site so SSR stays cheap.
   */
  effect?: ReactNode;
  /** Optional secondary CTA shown beside the channel join action. */
  secondaryCta?: { label: string; href: string };
  /** When true, skips the BorderBeam + AnimatedGridPattern (useful inside dense bands). */
  minimal?: boolean;
  className?: string;
};

/**
 * Shared shell for pathway / Era channel cards. Composes the bespoke
 * effect, an ASCII-style status row, the KPI ladder, and the join CTA.
 */
export function EraInflectionCard({
  channel,
  accent,
  kicker,
  joinLabel,
  ladder,
  effect,
  secondaryCta,
  minimal = false,
  className,
}: EraInflectionCardProps) {
  const reduceMotion = useReducedMotion();
  const eyebrow = kicker ?? bornDigitalEra.eyebrow;

  return (
    <article
      className={cn(
        'relative isolate overflow-hidden rounded-2xl border bg-white/70 text-neutral-900 shadow-sm backdrop-blur-[2px] transition-transform duration-300 dark:bg-neutral-900/60 dark:text-neutral-100',
        'border-[var(--cdc-border,rgba(15,23,42,0.12))]',
        !reduceMotion && 'hover:-translate-y-px',
        className
      )}
      style={{ ['--era-card-accent' as const]: accent } as React.CSSProperties}
      aria-labelledby={`era-card-${channel.id}-title`}
    >
      {effect ? (
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          aria-hidden
        >
          {effect}
        </div>
      ) : null}

      {!minimal && !reduceMotion ? (
        <>
          <AnimatedGridPattern
            numSquares={20}
            maxOpacity={0.18}
            duration={3.6}
            repeatDelay={0.6}
            width={36}
            height={36}
            className="mask-[radial-gradient(ellipse_85%_70%_at_50%_40%,black_15%,transparent_70%)] text-[var(--era-card-accent)]"
          />
          <BorderBeam
            size={92}
            duration={14}
            borderWidth={1}
            colorFrom={accent}
            colorTo="rgba(255,255,255,0.0)"
          />
        </>
      ) : null}

      <div className="relative z-[1] flex h-full flex-col gap-5 p-5 sm:p-6">
        <header className="flex items-baseline justify-between gap-3">
          <span
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            {eyebrow} · {channel.shortLabel}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60"
            aria-hidden
          >
            {`ch_${channel.id.replace(/-/g, '_')}`}
          </span>
        </header>

        <div>
          <h3
            id={`era-card-${channel.id}-title`}
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            <Link
              href={channel.siteHref}
              {...(/^https?:\/\//.test(channel.siteHref)
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="bg-[image:linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 hover:bg-[length:100%_1px]"
            >
              {channel.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {channel.description}
          </p>
          <p className="mt-2 max-w-md font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Who it&rsquo;s for: <span className="opacity-80">{channel.group}</span>
          </p>
        </div>

        {ladder ? (
          <EraKpiLadder ladder={ladder} accentColor={accent} density="compact" />
        ) : null}

        <footer className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="max-w-[24rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            ↳ {channel.converge}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {(() => {
              const joinHref = joinLabel
                ? channel.siteHref
                : (ladder?.joinAction.href ?? channel.siteHref);
              const joinText =
                joinLabel ?? ladder?.joinAction.label ?? `Open ${channel.shortLabel}`;
              const isExternalJoin = /^https?:\/\//.test(joinHref);
              return (
                <Link
                  href={joinHref}
                  {...(isExternalJoin
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold tracking-tight text-neutral-50 transition-opacity duration-200 hover:opacity-90 dark:text-neutral-900"
                  style={{ backgroundColor: accent }}
                >
                  {joinText}
                  <span aria-hidden>→</span>
                </Link>
              );
            })()}
            {channel.eraHref ? (
              <Link
                href={channel.eraHref}
                className="inline-flex items-center gap-1 rounded-full border border-current px-3 py-1.5 text-[11px] font-medium opacity-70 transition hover:opacity-100"
              >
                Learn more
                <span aria-hidden>→</span>
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-1 rounded-full border border-current px-3 py-1.5 text-xs font-medium opacity-80 transition hover:opacity-100"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </footer>
      </div>

      {!reduceMotion ? (
        <motion.span
          className="pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left"
          style={{ backgroundColor: accent }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />
      ) : null}
    </article>
  );
}
