import Link from 'next/link';
import { knightPartnersContentFragment } from '@/lib/marketing/knight-nav';

/**
 * Pill-style jump control with mesh backing + gradient label (see theme CSS).
 */
export function KnightPartnerAudienceLink() {
  return (
    <Link
      href={knightPartnersContentFragment}
      className="knight-audience-link group/aud relative mx-auto flex max-w-xl flex-col items-center overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/75 px-7 py-3.5 text-center shadow-sm outline-none backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50 hover:bg-white/95 hover:shadow-[0_14px_44px_-12px_rgba(45,212,191,0.38)] focus-visible:ring-2 focus-visible:ring-teal-500/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-600/80 dark:bg-neutral-900/65 dark:hover:border-teal-500/45 dark:hover:bg-neutral-900/92 dark:hover:shadow-[0_16px_48px_-14px_rgba(45,212,191,0.22)] dark:focus-visible:ring-offset-neutral-950 motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/aud:opacity-100"
        aria-hidden
      >
        <span className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-violet-400/8 to-cyan-400/10 dark:from-teal-500/12 dark:via-violet-500/10 dark:to-cyan-500/10" />
      </span>
      <span className="knight-audience-link__label relative z-[1]">Who this packet is for</span>
      <span className="relative z-[1] mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700 opacity-90 transition-all duration-300 group-hover/aud:gap-2 dark:text-teal-300">
        Partner cards
        <span aria-hidden className="inline-block transition-transform duration-300 group-hover/aud:translate-x-1">
          ↓
        </span>
      </span>
    </Link>
  );
}
