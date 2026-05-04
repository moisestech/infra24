/**
 * Rotating homepage H1 lines — public-facing, digital-cultural hooks.
 */

export const marketingHeaderSloganLines = [
  'For artists working with screens.',
  'For software, networks, and culture.',
  'For born-digital art in Miami.',
  'For the chronically online.',
  'For public culture after the internet.',
  'For artists building with code.',
  'For institutions that need digital infrastructure.',
  'For cultural workers making systems visible.',
  'For the people turning digital life into public life.',
  'For Miami\u2019s digital culture field.',
] as const;

export type MarketingHeaderSloganLine = (typeof marketingHeaderSloganLines)[number];
