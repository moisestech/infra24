'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';
import { heroCollagePanels } from '@/lib/marketing/homepage-visuals';

const [main, ...rest] = heroCollagePanels;
const [topRight, midRight, phone] = rest;

export function HeroCollage({ className }: { className?: string }) {
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
          colorFrom="#d4d4d8"
          colorTo="#18181b"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate z-[1] grid min-h-[280px] grid-cols-12 grid-rows-3 gap-2 sm:min-h-[340px] lg:min-h-[400px]"
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
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[9px] font-medium uppercase tracking-wide text-white drop-shadow">
              {phone.label}
            </span>
          </div>
        </motion.div>
      </div>
      <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        One communication layer across physical and digital surfaces
      </p>
    </div>
  );
}
