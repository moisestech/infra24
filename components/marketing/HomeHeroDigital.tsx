'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Balancer } from 'react-wrap-balancer';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { TextAnimate } from '@/components/magicui/text-animate';
import { GlitchText } from '@/components/marketing/GlitchText';
import { GlitchWords } from '@/components/marketing/GlitchWords';
import { HeroSubheadKeyTerms } from '@/components/marketing/HeroSubheadKeyTerms';
import { DccHeroAsciiStatus } from '@/components/marketing/DccHeroAsciiStatus';
import { HomeHeroRotatingHeadline } from '@/components/marketing/HomeHeroRotatingHeadline';
import { cdcDigitalBeam } from '@/lib/marketing/cdc-digital-theme';
import type { MarketingHeroSubheadSegment } from '@/lib/marketing/content';
import { marketingHeaderSloganLines } from '@/lib/marketing/marketing-header-slogans';
import { cn } from '@/lib/utils';

const INSTITUTIONAL_HEADLINE_ROTATE_MS = 5200;

const Hero3DField = dynamic(
  () => import('@/components/marketing/hero/Hero3DField').then((m) => m.Hero3DField),
  { ssr: false, loading: () => null }
);

export type HomeHeroDigitalLayout = 'standard' | 'digital-first' | 'institutional';

type HomeHeroDigitalProps = {
  /** Optional small line above PDM / headline (omit when using `publicDigitalMiamiLine` only). */
  eyebrow?: string;
  /** Prominent place + public digital culture lockup (larger than header). */
  publicDigitalMiamiLine?: string;
  headline: string;
  /** Organization line under mission H1 when `layout` is `institutional`. */
  orgLine?: string;
  /** Override H1 sizing (e.g. longer organization name with glitch). */
  headlineClassName?: string;
  /** When `layout` is `digital-first`, applied to the legal org line (smaller than rotating hero). */
  staticHeadlineClassName?: string;
  poweredByLine: string;
  /** Plain subhead (used with `TextAnimate` when `subheadSegments` is omitted). */
  subhead?: string;
  /** Structured subhead with interactive key terms; takes precedence over `subhead` for visible body. */
  subheadSegments?: readonly MarketingHeroSubheadSegment[];
  /** Optional one-line value prop between H1 and powered-by (e.g. pilot tagline). */
  pilotTagline?: string;
  /** When set, replaces static `pilotTagline` with a rotating Knight-first headline cycle. */
  rotatingHeadlines?: readonly string[];
  /** When set, rotating tier-2 body copy after `poweredByLine`; static `subhead` is omitted. */
  rotatingSubheads?: readonly string[];
  /** `digital-first`: rotating digital lines as dominant H1, org name + pilot lines follow. */
  layout?: HomeHeroDigitalLayout;
  /** Larger type scale for the tier-1 rotating line (homepage digital-first). */
  rotatingHeadlineScale?: 'default' | 'dominant';
  /** Tier-1 rotating line motion (see `HomeHeroRotatingHeadline`). */
  rotatingHeadlineMotion?: 'glitch' | 'typewriter';
  /** Tier-2 rotating subheads when used. */
  rotatingSubheadMotion?: 'glitch' | 'typewriter';
  /** WebGL particle field behind the hero card (skipped when `prefers-reduced-motion` is set). */
  showHero3DBackground?: boolean;
  /**
   * Institutional layout: rotating H1 lines (per-word glitch). Defaults to site marketing slogans;
   * `headline` is only used if this list resolves empty.
   */
  institutionalHeadlineLines?: readonly string[];
  children: React.ReactNode;
};

const defaultHeadlineClass =
  'cdc-hero-headline max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl lg:leading-[1.08]';

const digitalFirstStaticHeadlineFallback =
  'cdc-hero-headline max-w-4xl text-[clamp(1.35rem,2.2vw+0.75rem,2.25rem)] font-semibold leading-[1.15] tracking-tight text-neutral-800 dark:text-neutral-200 sm:text-3xl';

/** ~2× prior institutional mission scale — most of above-the-fold is this line. */
const institutionalSloganHeadlineClass =
  'cdc-font-display m-0 max-w-[min(100%,58rem)] text-[clamp(2.15rem,5.2vw+1.35rem,4.25rem)] font-extrabold leading-[1.03] tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-6xl sm:leading-[1.02] lg:text-7xl xl:text-8xl xl:leading-[0.98]';

const institutionalOrgClass =
  'cdc-font-display m-0 mt-5 max-w-4xl text-2xl font-semibold leading-snug tracking-tight text-neutral-800 dark:text-neutral-200 sm:mt-6 sm:text-3xl lg:text-4xl';

const institutionalPdmClass =
  'cdc-font-mono-accent font-mono text-xs font-bold uppercase tracking-[0.22em] text-[var(--cdc-teal)] sm:text-sm sm:tracking-[0.26em]';

export function HomeHeroDigital({
  eyebrow,
  publicDigitalMiamiLine,
  headline,
  orgLine,
  headlineClassName,
  staticHeadlineClassName,
  poweredByLine,
  subhead,
  subheadSegments,
  pilotTagline,
  rotatingHeadlines,
  rotatingSubheads,
  layout = 'standard',
  rotatingHeadlineScale = 'default',
  rotatingHeadlineMotion = 'glitch',
  rotatingSubheadMotion = 'glitch',
  showHero3DBackground = true,
  institutionalHeadlineLines,
  children,
}: HomeHeroDigitalProps) {
  const reduceMotion = useReducedMotion();
  const digitalFirst = layout === 'digital-first';
  const institutional = layout === 'institutional';

  const institutionalLines = useMemo(() => {
    if (institutionalHeadlineLines?.length) return [...institutionalHeadlineLines];
    const fromMarketing = [...marketingHeaderSloganLines];
    return fromMarketing.length > 0 ? fromMarketing : [headline];
  }, [institutionalHeadlineLines, headline]);

  const [institutionalIdx, setInstitutionalIdx] = useState(0);

  useEffect(() => {
    if (!institutional || reduceMotion || institutionalLines.length <= 1) return undefined;
    const t = window.setInterval(() => {
      setInstitutionalIdx((i) => (i + 1) % institutionalLines.length);
    }, INSTITUTIONAL_HEADLINE_ROTATE_MS);
    return () => window.clearInterval(t);
  }, [institutional, reduceMotion, institutionalLines.length]);

  const institutionalCurrentLine =
    institutional && institutionalLines.length > 0
      ? institutionalLines[institutionalIdx % institutionalLines.length]!
      : headline;

  const showEyebrow = Boolean(eyebrow?.trim());
  const pilotLineForSr = institutional
    ? [institutionalCurrentLine, orgLine, publicDigitalMiamiLine, eyebrow].filter(Boolean).join(' — ')
    : rotatingHeadlines?.length && rotatingHeadlines[0]
      ? rotatingHeadlines[0]
      : pilotTagline?.trim() ?? '';
  const subheadBodyForSr = rotatingSubheads?.length
    ? rotatingSubheads[0]
    : (subhead ?? subheadSegments?.map((s) => s.text).join('') ?? '');
  const plainSubheadForSr = [pilotLineForSr, subheadBodyForSr].filter(Boolean).join(' ') || '';
  const showPilotBand =
    !institutional && (Boolean(rotatingHeadlines?.length) || Boolean(pilotTagline?.trim()));
  const showRotatingSubheads = Boolean(rotatingSubheads?.length);

  const metaBlock = (
    <>
      {showEyebrow ? (
        reduceMotion ? (
          <p className="cdc-font-mono-accent font-mono text-xs font-medium uppercase tracking-[0.12em] text-[var(--cdc-teal)]">
            {eyebrow}
          </p>
        ) : (
          <TextAnimate
            as="p"
            by="word"
            animation="blurInUp"
            startOnView
            once
            delay={0.05}
            duration={0.45}
            className="cdc-font-mono-accent font-mono text-xs font-medium uppercase tracking-[0.12em] text-[var(--cdc-teal)]"
          >
            {String(eyebrow)}
          </TextAnimate>
        )
      ) : null}

      {publicDigitalMiamiLine ? (
        reduceMotion ? (
          <p
            className={cn(
              'cdc-font-mono-accent font-mono text-sm font-bold uppercase tracking-[0.24em] text-[var(--cdc-teal)] sm:text-base sm:tracking-[0.28em]',
              showEyebrow ? 'mt-3' : 'mt-0'
            )}
          >
            {publicDigitalMiamiLine}
          </p>
        ) : (
          <motion.p
            className={cn(
              'cdc-font-mono-accent font-mono text-sm font-bold uppercase tracking-[0.24em] text-[var(--cdc-teal)] sm:text-base sm:tracking-[0.28em]',
              showEyebrow ? 'mt-3' : 'mt-0'
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
          >
            {publicDigitalMiamiLine}
          </motion.p>
        )
      ) : null}
    </>
  );

  const staticHeadlineMargin = digitalFirst
    ? 'mt-8'
    : publicDigitalMiamiLine || showEyebrow
      ? 'mt-4'
      : 'mt-5';

  const staticHeadlineClass = digitalFirst
    ? staticHeadlineClassName ?? digitalFirstStaticHeadlineFallback
    : headlineClassName ?? defaultHeadlineClass;

  const staticHeadlineBlock = digitalFirst ? (
    reduceMotion ? (
      <h2 className={cn(staticHeadlineClass, staticHeadlineMargin)}>
        <Balancer>
          <GlitchText as="span" disabled className="inline">
            {headline}
          </GlitchText>
        </Balancer>
      </h2>
    ) : (
      <motion.h2
        className={cn(staticHeadlineClass, staticHeadlineMargin)}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <Balancer>
          <GlitchText as="span" className="inline" interactive={false}>
            {headline}
          </GlitchText>
        </Balancer>
      </motion.h2>
    )
  ) : reduceMotion ? (
    <h1 className={cn(staticHeadlineClass, staticHeadlineMargin)}>
      <Balancer>
        <GlitchText as="span" disabled className="inline">
          {headline}
        </GlitchText>
      </Balancer>
    </h1>
  ) : (
    <motion.h1
      className={cn(staticHeadlineClass, staticHeadlineMargin)}
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
    >
      <Balancer>
        <GlitchText as="span" className="inline">
          {headline}
        </GlitchText>
      </Balancer>
    </motion.h1>
  );

  const rotatingTier1 = rotatingHeadlines?.length ? (
    <HomeHeroRotatingHeadline
      lines={rotatingHeadlines}
      variant="hero"
      textScale={rotatingHeadlineScale}
      headlineAs={digitalFirst ? 'h1' : 'p'}
      textMotion={rotatingHeadlineMotion}
    />
  ) : pilotTagline?.trim() ? (
    <p className="mt-4 max-w-2xl text-lg font-semibold leading-snug tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-xl">
      {pilotTagline.trim()}
    </p>
  ) : null;

  const poweredBlock = (
    <p
      className={cn(
        'text-sm font-medium text-neutral-500 dark:text-neutral-400',
        institutional ? 'mt-0' : digitalFirst ? 'mt-5' : showPilotBand ? 'mt-3' : 'mt-2'
      )}
    >
      {poweredByLine}
    </p>
  );

  const institutionalPdmBlock =
    publicDigitalMiamiLine?.trim() ? (
      reduceMotion ? (
        <p className={cn(institutionalPdmClass, 'mt-4 sm:mt-5')}>{publicDigitalMiamiLine.trim()}</p>
      ) : (
        <motion.p
          className={cn(institutionalPdmClass, 'mt-4 sm:mt-5')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          {publicDigitalMiamiLine.trim()}
        </motion.p>
      )
    ) : null;

  const institutionalBottomMeta = (
    <>
      {showEyebrow ? (
        reduceMotion ? (
          <p className="cdc-font-mono-accent font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {eyebrow}
          </p>
        ) : (
          <TextAnimate
            as="p"
            by="word"
            animation="blurInUp"
            startOnView
            once
            delay={0.04}
            duration={0.4}
            className="cdc-font-mono-accent font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400"
          >
            {String(eyebrow)}
          </TextAnimate>
        )
      ) : null}
      {subhead?.trim() ? (
        reduceMotion ? (
          <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
            {subhead.trim()}
          </p>
        ) : (
          <TextAnimate
            as="p"
            by="word"
            animation="blurIn"
            startOnView
            once
            delay={0.06}
            duration={0.5}
            className="max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base"
          >
            {subhead.trim()}
          </TextAnimate>
        )
      ) : null}
      <div className="mt-1">
        <DccHeroAsciiStatus />
      </div>
      {poweredBlock}
    </>
  );

  const institutionalBlock = institutional ? (
    <div className="flex min-h-[min(90dvh,940px)] flex-col">
      <span className="sr-only">
        {[pilotLineForSr, subheadBodyForSr].filter(Boolean).join(' ')}
      </span>
      {/* ~65% viewport band for mission + org + PDM — rest is CTAs + pilot meta */}
      <div className="flex min-h-[min(65dvh,720px)] flex-1 flex-col justify-center">
        <h1 className={institutionalSloganHeadlineClass} aria-live="polite">
          <Balancer>
            {reduceMotion ? (
              <GlitchWords text={institutionalLines[0] ?? headline} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={institutionalCurrentLine}
                  className="block"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlitchWords text={institutionalCurrentLine} />
                </motion.span>
              </AnimatePresence>
            )}
          </Balancer>
        </h1>
        {orgLine?.trim() ? (
          reduceMotion ? (
            <h2 className={institutionalOrgClass}>
              <Balancer>{orgLine.trim()}</Balancer>
            </h2>
          ) : (
            <motion.h2
              className={institutionalOrgClass}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <Balancer>{orgLine.trim()}</Balancer>
            </motion.h2>
          )
        ) : null}
        {institutionalPdmBlock}
      </div>
      <div
        className={cn(
          'mt-auto flex flex-col gap-5 pt-2 sm:gap-6 sm:pt-4',
          !reduceMotion && 'transition-transform duration-300 hover:-translate-y-px'
        )}
      >
        {children}
        {institutionalBottomMeta}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-white/35 p-6 shadow-sm shadow-teal-950/[0.04] backdrop-blur-[2px] dark:bg-neutral-900/45 dark:shadow-black/20 sm:p-8 lg:p-10">
      {!reduceMotion && showHero3DBackground ? <Hero3DField /> : null}
      {!reduceMotion && (
        <>
          <AnimatedGridPattern
            numSquares={42}
            maxOpacity={0.35}
            duration={3.2}
            repeatDelay={0.35}
            width={48}
            height={48}
            className="mask-[radial-gradient(ellipse_85%_80%_at_50%_45%,black_15%,transparent_68%)] text-teal-600"
          />
          <BorderBeam
            size={120}
            duration={16}
            borderWidth={1.25}
            colorFrom={cdcDigitalBeam.from}
            colorTo={cdcDigitalBeam.to}
          />
        </>
      )}

      <div className="relative z-[1]">
        {institutional ? (
          institutionalBlock
        ) : digitalFirst ? (
          <>
            {rotatingTier1}
            {staticHeadlineBlock}
            {showEyebrow || publicDigitalMiamiLine ? (
              <div className="mt-5 flex flex-col gap-3 border-t border-[var(--cdc-border)]/60 pt-5 dark:border-neutral-700/60">
                {digitalFirst ? <DccHeroAsciiStatus /> : null}
                <div className="flex flex-col gap-1">{metaBlock}</div>
              </div>
            ) : null}
            {poweredBlock}
          </>
        ) : (
          <>
            {metaBlock}
            {staticHeadlineBlock}
            {rotatingTier1}
            {poweredBlock}
          </>
        )}

        {digitalFirst ? null : showRotatingSubheads && rotatingSubheads?.length ? (
          <div className="mt-6">
            <span className="sr-only">{plainSubheadForSr}</span>
            <HomeHeroRotatingHeadline
              lines={rotatingSubheads}
              variant="subhead"
              textMotion={rotatingSubheadMotion}
            />
          </div>
        ) : null}

        {!digitalFirst && subheadSegments?.length ? (
          <>
            <span className="sr-only">{plainSubheadForSr}</span>
            <HeroSubheadKeyTerms segments={subheadSegments} reduceMotion={Boolean(reduceMotion)} />
          </>
        ) : subhead && !digitalFirst && !showRotatingSubheads ? (
          reduceMotion ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              {subhead}
            </p>
          ) : (
            <TextAnimate
              as="p"
              by="word"
              animation="blurIn"
              startOnView
              once
              delay={0.2}
              duration={0.65}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300"
            >
              {subhead}
            </TextAnimate>
          )
        ) : null}

        <div
          className={cn(
            institutional ? 'hidden' : digitalFirst ? 'mt-10' : 'mt-1',
            !reduceMotion && !institutional && 'transition-transform duration-300 hover:-translate-y-px'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
