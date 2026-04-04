'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Balancer } from 'react-wrap-balancer';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { TextAnimate } from '@/components/magicui/text-animate';
import { GlitchText } from '@/components/marketing/GlitchText';
import { cdcDigitalBeam } from '@/lib/marketing/cdc-digital-theme';
import { cn } from '@/lib/utils';

type HomeHeroDigitalProps = {
  eyebrow: string;
  headline: string;
  subhead: string;
  poweredByLine: string;
  children: React.ReactNode;
};

export function HomeHeroDigital({
  eyebrow,
  headline,
  subhead,
  poweredByLine,
  children,
}: HomeHeroDigitalProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--cdc-border)] bg-white/35 p-6 shadow-sm shadow-teal-950/[0.04] backdrop-blur-[2px] sm:p-8">
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
        {reduceMotion ? (
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
        )}

        {reduceMotion ? (
          <h1 className="cdc-hero-headline mt-5 max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            <Balancer>
              <GlitchText as="span" disabled={reduceMotion} className="inline">
                {headline}
              </GlitchText>
            </Balancer>
          </h1>
        ) : (
          <motion.h1
            className="cdc-hero-headline mt-5 max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-[1.08]"
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

        <p className="mt-2 text-sm font-medium text-neutral-500">{poweredByLine}</p>

        {reduceMotion ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{subhead}</p>
        ) : (
          <TextAnimate
            as="p"
            by="word"
            animation="blurIn"
            startOnView
            once
            delay={0.2}
            duration={0.65}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600"
          >
            {subhead}
          </TextAnimate>
        )}

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
