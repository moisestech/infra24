import { FaLandmark, FaMedal } from 'react-icons/fa6';
import { KnightPartnerAudienceLink } from '@/components/marketing/knight/KnightPartnerAudienceLink';
import { KnightPartnerTitleLink } from '@/components/marketing/knight/KnightPartnerTitleLink';

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
          <div className="flex min-w-0 flex-1 basis-[260px] items-center gap-4 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-neutral-600/80 dark:bg-neutral-900/85 dark:shadow-none">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-1 ring-teal-200/80 dark:bg-teal-950/80 dark:text-teal-200 dark:ring-teal-500/30">
              <FaLandmark className="h-7 w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                <KnightPartnerTitleLink variant="dcc">Digital Culture Center Miami</KnightPartnerTitleLink>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Artist-centered digital culture, public programs, and civic-facing infrastructure.
              </p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 basis-[260px] items-center gap-4 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-neutral-600/80 dark:bg-neutral-900/85 dark:shadow-none">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 ring-1 ring-amber-200/90 dark:bg-amber-950/70 dark:text-amber-200 dark:ring-amber-500/25">
              <FaMedal className="h-7 w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                <KnightPartnerTitleLink variant="knight">Knight Arts–aligned pilot</KnightPartnerTitleLink>
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Materials structured for foundation-style review (not an official Knight logo lockup).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

