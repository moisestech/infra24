/**
 * Born-Digital Era — channel KPI ladders.
 *
 * One ladder per priority channel. Tier targets are placeholders sized to be
 * defensible (not vanity), and they live next to the source of truth so a
 * single edit to `data/era-metrics.json` updates the homepage band, the
 * `/era` index, and each `/era/[channel]` deep page in lockstep.
 */

import rawMetrics from '@/data/era-metrics.json';
import type { BornDigitalEraChannelId } from '@/lib/marketing/content';

export type EraMetricUnit =
  | 'attendees'
  | 'enrollments'
  | 'sessions'
  | 'visitors'
  | 'sites'
  | 'subscribers'
  | 'profiles';

export type EraMetricTier = {
  /** 1 = first defensible milestone, 2 = scale, 3 = stretch. */
  readonly tier: 1 | 2 | 3;
  readonly label: string;
  readonly target: number;
};

export type EraMetricLadder = {
  readonly channel: BornDigitalEraChannelId;
  /** Plain-language metric name shown in the KPI strip. */
  readonly metric: string;
  readonly unit: EraMetricUnit;
  readonly current: number;
  readonly tiers: readonly [EraMetricTier, EraMetricTier, EraMetricTier];
  /** ISO date — when `current` was last edited; renderers can show "as of …". */
  readonly lastUpdated: string;
  /** Optional secondary KPIs we track but do not ladder. */
  readonly support?: ReadonlyArray<{ readonly label: string; readonly value: string }>;
  /** What "joining" actually looks like for this channel — surfaced on cards. */
  readonly joinAction: { readonly label: string; readonly href: string };
};

const ladders = rawMetrics as unknown as {
  readonly channels: readonly EraMetricLadder[];
};

export const eraMetricLadders: readonly EraMetricLadder[] = ladders.channels;

export function getEraMetricLadder(
  channel: BornDigitalEraChannelId
): EraMetricLadder | undefined {
  return eraMetricLadders.find((l) => l.channel === channel);
}

/**
 * Progress toward the next tier (0..1). Returns `tierIndex` of the *next*
 * unmet tier so callers can show "you're 60% to Tier 2" without re-deriving.
 */
export function getEraLadderProgress(ladder: EraMetricLadder) {
  const sorted = [...ladder.tiers].sort((a, b) => a.target - b.target);
  for (let i = 0; i < sorted.length; i += 1) {
    const tier = sorted[i];
    if (ladder.current < tier.target) {
      const prev = i === 0 ? 0 : sorted[i - 1].target;
      const span = Math.max(1, tier.target - prev);
      const filled = Math.max(0, ladder.current - prev);
      return {
        nextTier: tier,
        tierIndex: i,
        progress: Math.min(1, filled / span),
      };
    }
  }
  return {
    nextTier: sorted[sorted.length - 1],
    tierIndex: sorted.length - 1,
    progress: 1,
  };
}

export function formatEraMetricCount(value: number, unit: EraMetricUnit): string {
  const formatted =
    value >= 1000 ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : `${value}`;
  return `${formatted} ${unit}`;
}
