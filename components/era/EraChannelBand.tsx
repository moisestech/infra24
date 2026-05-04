'use client';

import dynamic from 'next/dynamic';
import { type ReactNode, useMemo } from 'react';
import { EraInflectionCard } from '@/components/era/cards/EraInflectionCard';
import {
  bornDigitalEra,
  bornDigitalEraChannels,
  type BornDigitalEraChannel,
} from '@/lib/marketing/content';
import { eraMetricLadders } from '@/lib/era/metrics';
import { cn } from '@/lib/utils';

const MeshField = dynamic(
  () => import('@/components/era/effects/MeshField').then((m) => m.MeshField),
  { ssr: false }
);
const VenueNode3D = dynamic(
  () => import('@/components/era/effects/VenueNode3D').then((m) => m.VenueNode3D),
  { ssr: false }
);
const KnowledgeLattice = dynamic(
  () =>
    import('@/components/era/effects/KnowledgeLattice').then((m) => m.KnowledgeLattice),
  { ssr: false }
);
const SignalPulse = dynamic(
  () => import('@/components/era/effects/SignalPulse').then((m) => m.SignalPulse),
  { ssr: false }
);
const LiveLoop = dynamic(
  () => import('@/components/era/effects/LiveLoop').then((m) => m.LiveLoop),
  { ssr: false }
);
const CityScan = dynamic(
  () => import('@/components/era/effects/CityScan').then((m) => m.CityScan),
  { ssr: false }
);
const ParticleDispatch = dynamic(
  () =>
    import('@/components/era/effects/ParticleDispatch').then((m) => m.ParticleDispatch),
  { ssr: false }
);

function effectFor(channel: BornDigitalEraChannel): ReactNode {
  switch (channel.cardEffect) {
    case 'mesh-field':
      return <MeshField channelId={channel.id} />;
    case 'venue-node':
      return <VenueNode3D />;
    case 'knowledge-lattice':
      return <KnowledgeLattice />;
    case 'signal-pulse':
      return <SignalPulse />;
    case 'live-loop':
      return <LiveLoop />;
    case 'city-scan':
      return <CityScan />;
    case 'particle-dispatch':
      return <ParticleDispatch />;
    default:
      return null;
  }
}

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
          {bornDigitalEraChannels.map((channel, idx) => {
            const ladder = ladderById.get(channel.id);
            // Network gets a wide tile on lg+ to anchor the spine visually.
            const wide = channel.id === 'network';
            return (
              <div
                key={channel.id}
                className={cn(
                  'min-h-[22rem]',
                  wide ? 'lg:col-span-2' : '',
                  idx === 0 ? 'lg:row-span-1' : ''
                )}
              >
                <EraInflectionCard
                  channel={channel}
                  ladder={ladder}
                  effect={effectFor(channel)}
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
