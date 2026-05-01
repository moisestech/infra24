import Link from 'next/link';
import { FaLandmark, FaMedal } from 'react-icons/fa6';
import { KnightPartnerAudienceLink } from '@/components/marketing/knight/KnightPartnerAudienceLink';
import { knightPacketPartnerTitleHref } from '@/lib/marketing/knight-nav';
import { cn } from '@/lib/utils';

const cardBase =
  'group/card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 flex min-w-0 flex-1 basis-[260px] items-center gap-4 rounded-2xl border px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1';

export function KnightPartnerStrip() {
  return (
    <section
      id="partners"
      className="scroll-mt-28 border-b border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="cdc-mesh-hero-bg mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <KnightPartnerAudienceLink />
        <div
          id="partners-content"
          className="mt-6 flex scroll-mt-36 flex-col items-stretch justify-center gap-5 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-6"
        >
          <Link
            href={knightPacketPartnerTitleHref.dccIdentity}
            aria-label="Digital Culture Center Miami — jump to DCC links and public identity"
            className={cn(
              cardBase,
              'border-white/70 bg-white/90 hover:border-teal-400/55 hover:shadow-[0_16px_48px_-14px_rgba(45,212,191,0.38)] hover:ring-2 hover:ring-teal-400/30 dark:border-neutral-600/80 dark:bg-neutral-900/85 dark:shadow-none dark:hover:border-teal-500/50 dark:hover:shadow-[0_18px_52px_-16px_rgba(45,212,191,0.22)] dark:hover:ring-teal-500/25',
              'focus-visible:ring-teal-500/70'
            )}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-1 ring-teal-200/80 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:shadow-[0_0_24px_rgba(45,212,191,0.35)] dark:bg-teal-950/80 dark:text-teal-200 dark:ring-teal-500/30 dark:group-hover/card:shadow-[0_0_28px_rgba(45,212,191,0.25)]">
              <FaLandmark className="h-7 w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-neutral-900 transition-colors duration-300 group-hover/card:text-teal-900 dark:text-neutral-100 dark:group-hover/card:text-teal-100">
                Digital Culture Center Miami
              </p>
              <p className="mt-0.5 text-sm text-neutral-600 transition-colors duration-300 group-hover/card:text-neutral-800 dark:text-neutral-400 dark:group-hover/card:text-neutral-300">
                Artist-centered digital culture, public programs, and civic-facing infrastructure.
              </p>
              <p className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100 dark:text-teal-300">
                DCC links
                <span aria-hidden className="transition-transform duration-300 group-hover/card:translate-x-0.5">
                  →
                </span>
              </p>
            </div>
          </Link>

          <Link
            href={knightPacketPartnerTitleHref.knightNarrative}
            aria-label="Knight Arts–aligned pilot — jump to narrative and framing"
            className={cn(
              cardBase,
              'border-white/70 bg-white/90 hover:border-amber-400/55 hover:shadow-[0_16px_48px_-14px_rgba(251,191,36,0.32)] hover:ring-2 hover:ring-amber-400/35 dark:border-neutral-600/80 dark:bg-neutral-900/85 dark:shadow-none dark:hover:border-amber-500/45 dark:hover:shadow-[0_18px_52px_-16px_rgba(251,191,36,0.18)] dark:hover:ring-amber-500/25',
              'focus-visible:ring-amber-500/70'
            )}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 ring-1 ring-amber-200/90 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:shadow-[0_0_24px_rgba(251,191,36,0.4)] dark:bg-amber-950/70 dark:text-amber-200 dark:ring-amber-500/25 dark:group-hover/card:shadow-[0_0_28px_rgba(251,191,36,0.22)]">
              <FaMedal className="h-7 w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-neutral-900 transition-colors duration-300 group-hover/card:text-amber-900 dark:text-neutral-100 dark:group-hover/card:text-amber-100">
                Knight Arts–aligned pilot
              </p>
              <p className="mt-0.5 text-sm text-neutral-600 transition-colors duration-300 group-hover/card:text-neutral-800 dark:text-neutral-400 dark:group-hover/card:text-neutral-300">
                Materials structured for foundation-style review (not an official Knight logo lockup).
              </p>
              <p className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100 dark:text-amber-200">
                Narrative
                <span aria-hidden className="transition-transform duration-300 group-hover/card:translate-x-0.5">
                  →
                </span>
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
