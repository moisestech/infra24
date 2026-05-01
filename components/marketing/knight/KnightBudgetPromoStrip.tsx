'use client';

import Link from 'next/link';
import { Banknote } from 'lucide-react';

/** Budget teaser row under /knight hero — full-width link with icon and hover glow. */
export function KnightBudgetPromoStrip() {
  return (
    <Link
      href="/knight/budget"
      className="group/budget relative block overflow-hidden border-b border-neutral-200/90 bg-gradient-to-r from-neutral-50 via-white to-teal-50/50 outline-none transition-[border-color,box-shadow] duration-300 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-teal-950/30 hover:border-teal-300/60 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.28),0_10px_40px_-12px_rgba(45,212,191,0.35)] dark:hover:border-teal-500/40 dark:hover:shadow-[0_0_0_1px_rgba(45,212,191,0.22),0_14px_48px_-14px_rgba(20,184,166,0.28)] focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/budget:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-violet-400/8 to-cyan-400/10 dark:from-teal-400/14 dark:via-violet-500/10 dark:to-cyan-400/12" />
        <div className="knight-budget-promo-shimmer absolute inset-0 opacity-70" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-200/90 bg-gradient-to-br from-teal-50 to-white text-teal-700 shadow-sm transition-all duration-300 group-hover/budget:scale-105 group-hover/budget:border-teal-400/80 group-hover/budget:shadow-[0_0_22px_rgba(20,184,166,0.4)] dark:border-teal-800/70 dark:from-teal-950/60 dark:to-neutral-900 dark:text-teal-300 dark:group-hover/budget:shadow-[0_0_26px_rgba(45,212,191,0.32)]"
            aria-hidden
          >
            <Banknote className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
          </span>
          <p className="max-w-xl text-xs leading-snug text-neutral-600 dark:text-neutral-400 sm:text-[13px]">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Knight Cities Challenge</span>
            {' — '}
            static budget ($400k pilot / $200k Knight ask). Full model with charts and line items.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-300 group-hover/budget:scale-[1.02] group-hover/budget:border-teal-400 group-hover/budget:bg-teal-600 group-hover/budget:shadow-[0_0_28px_rgba(20,184,166,0.5)] dark:border-teal-500/45 dark:bg-teal-950/75 dark:text-teal-50 dark:group-hover/budget:bg-teal-600 dark:group-hover/budget:shadow-[0_0_32px_rgba(45,212,191,0.38)]">
          Open budget detail
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover/budget:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
