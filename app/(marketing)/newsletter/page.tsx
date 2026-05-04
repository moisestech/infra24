import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { PageHero } from '@/components/marketing/cdc';
import { NewsletterPageForm } from '@/components/marketing/NewsletterPageForm';
import { PartnersCardPaintRegister } from '@/components/marketing/PartnersCardPaintRegister';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/newsletter';

export const metadata: Metadata = cdcPageMetadata(path);

const SIGNAL_BAR_HEIGHTS = [38, 72, 48, 88, 56, 96, 44] as const;

type Props = {
  searchParams: { email?: string };
};

function NewsletterHeroSignal() {
  return (
    <div className="newsletter-hero-signal relative mt-8 overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white/90 via-white/70 to-teal-50/40 p-6 shadow-lg backdrop-blur-md dark:border-teal-500/20 dark:from-neutral-900/85 dark:via-neutral-950/80 dark:to-[rgb(10_18_32)] lg:mt-0 lg:max-w-sm lg:justify-self-end">
      <div
        className="cdc-grid-overlay pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.28]"
        aria-hidden
      />
      <span
        className="partners-card-pixel-overlay pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.18]"
        style={
          {
            '--partners-hue': 168,
            '--partners-hue-accent': 280,
            '--partners-density': 10,
          } as CSSProperties
        }
        aria-hidden
      />
      <div className="relative z-[1]">
        <p className="cdc-font-mono-accent text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500 dark:text-teal-200/85">
          Signal · digest
        </p>
        <p className="mt-3 text-sm font-medium leading-snug text-neutral-800 dark:text-neutral-100">
          Field notes, workshop drops, and public program pulses from Miami&apos;s digital culture layer.
        </p>
        <div
          className="newsletter-hero-signal__bars mt-5 flex h-[4.5rem] items-end justify-between gap-1.5 sm:h-20"
          aria-hidden
        >
          {SIGNAL_BAR_HEIGHTS.map((pct, i) => (
            <span key={i} className="min-h-[4px] flex-1" style={{ height: `${pct}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewsletterPage({ searchParams }: Props) {
  const initialEmail = typeof searchParams.email === 'string' ? searchParams.email : '';

  return (
    <>
      <PartnersCardPaintRegister />
      <section className="cdc-mesh-hero-bg cdc-webcore-hero-shell scroll-mt-14 border-b border-[var(--cdc-border)]">
        <PageHero
          surface="mesh"
          eyebrow="Newsletter"
          title="Stay in the loop"
          description="A recurring digest of workshops, artists, opportunities, tools, public programs, and updates from the DCC network—no spam."
          breadcrumbs={getCdcBreadcrumbs(path)}
          trailing={<NewsletterHeroSignal />}
        />
      </section>

      <section
        id="subscribe"
        className="newsletter-landing-band relative overflow-hidden border-b border-[var(--cdc-border)] bg-[#eef1f9] py-16 sm:py-20 dark:border-neutral-800 dark:bg-[rgb(8_12_22)]"
      >
        <span
          className="partners-card-pixel-overlay pointer-events-none absolute inset-0 z-[1] opacity-[0.38] dark:opacity-[0.32]"
          style={
            {
              '--partners-hue': 175,
              '--partners-hue-accent': 265,
              '--partners-density': 12,
            } as CSSProperties
          }
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.4)_48%,transparent_56%)] opacity-30 dark:bg-[linear-gradient(105deg,transparent_35%,rgba(0,212,170,0.06)_50%,transparent_65%)] dark:opacity-100"
          aria-hidden
        />

        <div className="relative z-[3] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 lg:items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">Subscribe</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
                Join the list
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                One field, clear consent, no clutter. We&apos;ll only send the digest when there is something worth your
                attention.
              </p>

              <div className="newsletter-form-shell partners-grid-card mt-8 max-w-xl">
                <div className="newsletter-form-shell__inner">
                  <NewsletterPageForm initialEmail={initialEmail} className="mt-0 max-w-none" />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="newsletter-benefit-card relative overflow-hidden p-6 sm:p-8">
                <span
                  className="partners-card-pixel-overlay pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.12]"
                  style={
                    {
                      '--partners-hue': 200,
                      '--partners-hue-accent': 330,
                      '--partners-density': 14,
                    } as CSSProperties
                  }
                  aria-hidden
                />
                <div className="relative z-[1]">
                  <p className="cdc-font-mono-accent text-[10px] font-semibold uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-400">
                    What shows up
                  </p>
                  <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                    <li>Workshop announcements and registration windows</li>
                    <li>Artist opportunities, labs, and public interfaces</li>
                    <li>Tooling notes, documentation patterns, and field experiments</li>
                    <li>Miami digital culture calendar highlights — concise, not noisy</li>
                  </ul>
                  <p className="mt-6 border-t border-neutral-200/90 pt-5 text-xs leading-relaxed text-neutral-500 dark:border-neutral-700/80 dark:text-neutral-500">
                    Unsubscribe anytime. This list is separate from org workspaces and member tools.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
