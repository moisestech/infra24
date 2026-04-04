'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';
import { heroCollagePanels } from '@/lib/marketing/homepage-visuals';

const [main, ...rest] = heroCollagePanels;
const [topRight, midRight, phone] = rest;

const gridClassName =
  'relative isolate z-[1] grid min-h-[240px] grid-cols-12 grid-rows-3 gap-2 sm:min-h-[300px] lg:min-h-[360px] max-lg:min-h-[260px]';

export function HeroCollage({
  className,
  variant = 'default',
  beamColorFrom,
  beamColorTo,
}: {
  className?: string;
  /** `embedded`: no outer frame or beam — nests inside `CdcHeroVisual`. */
  variant?: 'default' | 'embedded';
  beamColorFrom?: string;
  beamColorTo?: string;
}) {
  const from = beamColorFrom ?? '#d4d4d8';
  const to = beamColorTo ?? '#18181b';

  const grid = (
    <motion.div
      initial={variant === 'embedded' ? false : { opacity: 0, y: 10 }}
      animate={variant === 'embedded' ? { opacity: 1, y: 0 } : undefined}
      whileInView={variant === 'embedded' ? undefined : { opacity: 1, y: 0 }}
      viewport={variant === 'embedded' ? undefined : { once: true, margin: '-20px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        gridClassName,
        variant === 'embedded' &&
          'rounded-xl bg-white/50 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] ring-1 ring-[var(--cdc-border)] backdrop-blur-[2px]'
      )}
    >
          <div className="relative col-span-8 row-span-3 overflow-hidden rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_12px_40px_-16px_rgba(15,23,42,0.35)]">
            <Image
              src={main.src}
              alt={main.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 70vw, 45vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <span className="absolute left-3 top-3 rounded bg-black/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/95 backdrop-blur-sm">
              {main.label}
            </span>
          </div>

          <div
            className={cn(
              'relative z-10 col-span-4 row-span-1 overflow-hidden rounded-lg',
              'shadow-md ring-1 ring-black/10'
            )}
          >
            <Image
              src={topRight.src}
              alt={topRight.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 30vw, 18vw"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 text-[9px] font-medium uppercase tracking-wide text-white drop-shadow">
              {topRight.label}
            </span>
          </div>

          <div
            className={cn(
              'relative z-20 col-span-4 row-span-1 overflow-hidden rounded-lg',
              'lg:-mt-4 lg:shadow-lg lg:ring-1 lg:ring-white/35',
              'shadow-md ring-1 ring-black/10'
            )}
          >
            <Image
              src={midRight.src}
              alt={midRight.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 30vw, 18vw"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/15 to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 text-[9px] font-medium uppercase tracking-wide text-white drop-shadow">
              {midRight.label}
            </span>
          </div>

          <div
            className={cn(
              'relative z-30 col-span-4 row-span-1 overflow-hidden rounded-lg ring-1 ring-white/20',
              'lg:-mt-4 lg:shadow-lg lg:ring-white/40',
              'shadow-md'
            )}
          >
            <Image
              src={phone.src}
              alt={phone.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 30vw, 18vw"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[9px] font-medium uppercase tracking-wide text-white drop-shadow">
              {phone.label}
            </span>
          </div>
    </motion.div>
  );

  if (variant === 'embedded') {
    return <div className={cn('relative', className)}>{grid}</div>;
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100/50 p-2 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)]"
        aria-hidden
      >
        <BorderBeam
          size={100}
          duration={12}
          borderWidth={1.25}
          colorFrom={from}
          colorTo={to}
        />
        {grid}
      </div>
      <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        One communication layer across physical and digital surfaces
      </p>
    </div>
  );
}
