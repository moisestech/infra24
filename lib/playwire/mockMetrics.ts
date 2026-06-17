import type { MetricSnapshot, PublisherPersonaId } from './types';

export const metricsByPersona: Record<PublisherPersonaId, MetricSnapshot> = {
  studyHub: {
    rpm: 4.82,
    cpm: 2.14,
    fillRate: 91.2,
    viewability: 74.5,
    adRequests: 3_200_000,
    revenueLiftPct: 22,
    priceFloorRules: 890_000,
    byDevice: { mobile: 58, desktop: 42 },
    bidders: [
      { name: 'Google Ad Manager', share: 28, cpm: 1.98 },
      { name: 'Index Exchange', share: 18, cpm: 2.31 },
      { name: 'OpenX', share: 14, cpm: 2.05 },
      { name: 'Magnite', share: 12, cpm: 2.44 },
      { name: 'Playwire Direct', share: 16, cpm: 3.12 },
      { name: 'Other', share: 12, cpm: 1.76 },
    ],
  },
  arenaNews: {
    rpm: 8.94,
    cpm: 4.67,
    fillRate: 94.8,
    viewability: 81.2,
    adRequests: 5_100_000,
    revenueLiftPct: 31,
    priceFloorRules: 1_240_000,
    byDevice: { mobile: 62, desktop: 38 },
    bidders: [
      { name: 'Google Ad Manager', share: 22, cpm: 4.12 },
      { name: 'Index Exchange', share: 16, cpm: 4.55 },
      { name: 'Magnite', share: 20, cpm: 5.02 },
      { name: 'Playwire Direct', share: 24, cpm: 6.88 },
      { name: 'OpenX', share: 10, cpm: 3.94 },
      { name: 'Other', share: 8, cpm: 3.21 },
    ],
  },
  gameGrid: {
    rpm: 6.35,
    cpm: 3.28,
    fillRate: 88.4,
    viewability: 69.8,
    adRequests: 6_800_000,
    revenueLiftPct: 26,
    priceFloorRules: 1_050_000,
    byDevice: { mobile: 71, desktop: 29 },
    bidders: [
      { name: 'Google Ad Manager', share: 24, cpm: 2.89 },
      { name: 'Index Exchange', share: 15, cpm: 3.41 },
      { name: 'OpenX', share: 13, cpm: 3.12 },
      { name: 'Magnite', share: 14, cpm: 3.78 },
      { name: 'Playwire Direct', share: 18, cpm: 4.95 },
      { name: 'Other', share: 16, cpm: 2.54 },
    ],
  },
};

/** Apply format mixer toggles — illustrative RPM lift from adding formats */
export function adjustMetricsForFormats(
  base: MetricSnapshot,
  formats: { display: boolean; video: boolean; flex: boolean; native: boolean },
): MetricSnapshot {
  let rpmBoost = 0;
  if (formats.video) rpmBoost += 0.08;
  if (formats.flex) rpmBoost += 0.14;
  if (formats.native) rpmBoost += 0.05;
  if (!formats.display) rpmBoost -= 0.12;

  const multiplier = 1 + rpmBoost;
  return {
    ...base,
    rpm: Math.round(base.rpm * multiplier * 100) / 100,
    cpm: Math.round(base.cpm * (1 + rpmBoost * 0.6) * 100) / 100,
    viewability: Math.min(95, Math.round((base.viewability + (formats.flex ? 4 : 0)) * 10) / 10),
    adRequests: Math.round(base.adRequests * (formats.flex ? 0.85 : 1)),
  };
}
