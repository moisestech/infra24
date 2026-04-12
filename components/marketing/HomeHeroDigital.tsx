'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Balancer } from 'react-wrap-balancer';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { TextAnimate } from '@/components/magicui/text-animate';
import { GlitchText } from '@/components/marketing/GlitchText';
import { HeroSubheadKeyTerms } from '@/components/marketing/HeroSubheadKeyTerms';
import { cdcDigitalBeam } from '@/lib/marketing/cdc-digital-theme';
import type { MarketingHeroSubheadSegment } from '@/lib/marketing/content';
import { cn } from '@/lib/utils';

type HomeHeroDigitalProps = {
  /** Optional small line above PDM / headline (omit when using `publicDigitalMiamiLine` only). */
  eyebrow?: string;
  /** Prominent place + public digital culture lockup (larger than header). */
  publicDigitalMiamiLine?: string;
  headline: string;
  /** Override H1 sizing (e.g. longer organization name with glitch). */
  headlineClassName?: string;
  poweredByLine: string;
  /** Plain subhead (used with `TextAnimate` when `subheadSegments` is omitted). */
  subhead?: string;
  /** Structured subhead with interactive key terms; takes precedence over `subhead` for visible body. */
  subheadSegments?: readonly MarketingHeroSubheadSegment[];
  children: React.ReactNode;
};

export function HomeHeroDigital({
  eyebrow,
  publicDigitalMiamiLine,
  headline,
  headlineClassName,
  poweredByLine,
  subhead,
  subheadSegments,
  children,
}: HomeHeroDigitalProps) {
  const reduceMotion = useReducedMotion();
  const showEyebrow = Boolean(eyebrow?.trim());
  const plainSubheadForSr = subhead ?? subheadSegments?.map((s) => s.text).join('') ?? '';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-white/35 p-6 shadow-sm shadow-teal-950/[0.04] backdrop-blur-[2px] dark:bg-neutral-900/45 dark:shadow-black/20 sm:p-8">
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
        {showEyebrow ? (
          reduceMotion ? (
            <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-[var(--cdc-teal)]">
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
              className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-[var(--cdc-teal)]"
            >
              {eyebrow}
            </TextAnimate>
          )
        ) : null}

        {publicDigitalMiamiLine ? (
          reduceMotion ? (
            <p
              className={cn(
                'font-mono text-sm font-bold uppercase tracking-[0.24em] text-[var(--cdc-teal)] sm:text-base sm:tracking-[0.28em]',
                showEyebrow ? 'mt-3' : 'mt-0'
              )}
            >
              {publicDigitalMiamiLine}
            </p>
          ) : (
            <motion.p
              className={cn(
                'font-mono text-sm font-bold uppercase tracking-[0.24em] text-[var(--cdc-teal)] sm:text-base sm:tracking-[0.28em]',
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

        {reduceMotion ? (
          <h1
            className={cn(
              headlineClassName ??
                'cdc-hero-headline max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl lg:leading-[1.08]',
              publicDigitalMiamiLine || showEyebrow ? 'mt-4' : 'mt-5'
            )}
          >
            <Balancer>
              <GlitchText as="span" disabled className="inline">
                {headline}
              </GlitchText>
            </Balancer>
          </h1>
        ) : (
          <motion.h1
            className={cn(
              headlineClassName ??
                'cdc-hero-headline max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl lg:leading-[1.08]',
              publicDigitalMiamiLine || showEyebrow ? 'mt-4' : 'mt-5'
            )}
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
        )}

        <p className="mt-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">{poweredByLine}</p>

        {subheadSegments?.length ? (
          <>
            <span className="sr-only">{plainSubheadForSr}</span>
            <HeroSubheadKeyTerms segments={subheadSegments} reduceMotion={Boolean(reduceMotion)} />
          </>
        ) : subhead ? (
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
            'mt-1',
            !reduceMotion && 'transition-transform duration-300 hover:-translate-y-px'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
