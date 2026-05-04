'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  dccHeroCollageSlides,
  dccHeroPlainLanguageAnchor,
} from '@/lib/marketing/dcc-hero-collage-slides';
import { cn } from '@/lib/utils';

const AUTO_MS = 5200;

export function CdcHeroCollageCarousel({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = dccHeroCollageSlides.length;
  const active = dccHeroCollageSlides[index % len]!;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len);
    },
    [len]
  );

  useEffect(() => {
    if (reduceMotion || paused || len <= 1) return undefined;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [reduceMotion, paused, len]);

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div
        className={cn(
          'relative isolate min-h-[260px] overflow-hidden rounded-xl ring-1 ring-[var(--cdc-border)]',
          'bg-neutral-950 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:min-h-[300px] lg:min-h-[360px]',
          'dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
        )}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={active.photo.src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, min(1152px, 100vw)"
              priority={index === 0}
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-teal-950/25 dark:from-black/90 dark:via-black/45"
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>

        <Link
          href={active.href}
          className="absolute inset-0 z-[1] outline-none ring-inset ring-teal-400/0 transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-teal-400/70"
          aria-label={`${active.term}. ${active.blurb} ${active.photo.alt}`}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex flex-col justify-end p-4 sm:p-5 lg:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 max-w-[min(100%,28rem)]">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-300/95 sm:text-[11px]">
                {active.term}
              </p>
              <p className="mt-1.5 text-sm font-medium leading-snug text-white/95 sm:text-base">
                {active.blurb}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-wide text-teal-200/90">Open this pathway →</p>
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2 py-1.5 backdrop-blur-md">
              <span className="hidden px-1 font-mono text-[10px] text-white/70 sm:inline">
                {String(index + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}
              </span>
              {dccHeroCollageSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIndex(i);
                  }}
                  className={cn(
                    'h-2 w-2 rounded-full transition-[transform,background-color]',
                    i === index ? 'scale-110 bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.55)]' : 'bg-white/35 hover:bg-white/55'
                  )}
                  aria-label={`Show slide ${i + 1}: ${s.term}`}
                  aria-current={i === index ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto absolute left-2 top-1/2 z-[3] -translate-y-1/2 sm:left-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-400/80"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="pointer-events-auto absolute right-2 top-1/2 z-[3] -translate-y-1/2 sm:right-3">
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline focus-visible:ring-2 focus-visible:ring-teal-400/80"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-3 px-1 sm:px-0">
        <Link
          href={dccHeroPlainLanguageAnchor}
          className="inline-flex max-w-full flex-wrap items-center gap-x-2 rounded-full border border-[var(--cdc-border)] bg-white/85 px-3 py-2 text-left text-[10px] font-semibold uppercase leading-snug tracking-[0.16em] text-neutral-700 shadow-sm transition hover:border-teal-500/45 hover:text-teal-900 dark:border-neutral-600 dark:bg-neutral-900/85 dark:text-neutral-200 dark:hover:border-teal-400/45 dark:hover:text-teal-100 sm:text-[11px] sm:tracking-[0.18em]"
        >
          <span>Explore DCC&apos;s language</span>
          <span className="font-normal normal-case tracking-normal text-neutral-500 dark:text-neutral-400">
            — a shared vocabulary for digital culture, artist support, and public infrastructure.
          </span>
        </Link>
      </div>
    </div>
  );
}
