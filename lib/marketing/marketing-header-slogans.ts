/**
 * Rotating header taglines — digital-forward, institutional, and internet-native sets.
 * Order: expressive digital → funder-safe → deep-web tone.
 */

export const marketingHeaderSloganLines = [
  // Digital-forward
  'For the Chronically Online.',
  'Painting With Software.',
  'Screens Are a Canvas.',
  'Born Online. Made Public.',
  'A Network for Digital Minds.',
  'Art After the Browser.',
  // Institutional / funder-safe
  'A Network for Digital Culture.',
  'Built for Screen-Based Culture.',
  'Where Digital Artists Connect.',
  'For Born-Digital Practice.',
  'Public Space for Internet Culture.',
  'Where Digital Culture Meets Community.',
  // Internet-native
  'Touch Grass, Bring Your Laptop.',
  'Post, Render, Repeat.',
  'Built by Browser People.',
  'For People Who Live Online.',
  'From Tabs to Public Life.',
  'For the Screen-Dependent.',
] as const;

export type MarketingHeaderSloganLine = (typeof marketingHeaderSloganLines)[number];
