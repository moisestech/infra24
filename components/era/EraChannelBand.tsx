'use client';

import { EraChannelEffect } from '@/components/era/EraChannelEffect';
import { EraInflectionCard } from '@/components/era/cards/EraInflectionCard';
import {
  bornDigitalEra,
  bornDigitalEraChannels,
  type BornDigitalEraChannel,
} from '@/lib/marketing/content';
import { eraMetricLadders } from '@/lib/era/metrics';
import { eraAccentForChannel } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type EraChannelBandProps = {
  /** Drop the section heading + lede when used inside `/era` (page already has its own hero). */
  hideHeading?: boolean;
  /** Optional id to scroll-target. */
  id?: string;
  className?: string;
};

/**
 * Renders all seven Born-Digital Era inflection cards in a responsive grid.
 * Each card lazy-loads its bespoke effect (three.js, p5, Paint API) so the
 * homepage stays cheap and interactive while the band loads progressively.
 */
export function EraChannelBand({ hideHeading = false, id, className }: EraChannelBandProps) {
  const ladderById = useMemo(
    () => new Map(eraMetricLadders.map((l) => [l.channel, l])),
    []
  );

  return (
    <section
      id={id}
      className={cn('scroll-mt-14 border-y border-[var(--cdc-border)] bg-[#fafafa] py-14 dark:border-neutral-800 dark:bg-neutral-950 sm:py-16', className)}
      aria-labelledby={hideHeading ? undefined : 'era-band-heading'}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeading ? (
          <header className="mb-8 max-w-3xl">
            <p className="cdc-font-mono-accent font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              {bornDigitalEra.eyebrow}
            </p>
            <h2
              id="era-band-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl"
            >
              Seven pathways, one shared cultural network
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {bornDigitalEra.tagline}
            </p>
          </header>
        ) : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bornDigitalEraChannels.map((channel) => {
            const ladder = ladderById.get(channel.id);
            const wide = channel.id === 'network';
            return (
              <div
                key={channel.id}
                className={cn('min-h-[22rem]', wide ? 'lg:col-span-2' : '')}
              >
                <EraInflectionCard
                  channel={channel}
                  accent={eraAccentForChannel(channel.id)}
                  ladder={ladder}
                  effect={<EraChannelEffect name={channel.cardEffect} channelId={channel.id} />}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Kept so `/era/[channel]` and tests can still name the channel type locally if needed. */
export type { BornDigitalEraChannel };
