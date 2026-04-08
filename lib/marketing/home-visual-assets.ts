import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';

export type HomeVisualItem =
  | {
      kind: 'image';
      src: string;
      alt: string;
      caption?: string;
      credit?: string;
    }
  | {
      kind: 'gradient';
      gradientId: MarketingGradientId;
      alt: string;
      caption?: string;
      credit?: string;
    };

const g = (
  gradientId: MarketingGradientId,
  alt: string,
  caption?: string,
  credit?: string
): HomeVisualItem => ({
  kind: 'gradient',
  gradientId,
  alt,
  caption,
  credit,
});

/** Full-bleed mosaic after marquee */
export const homeVisualPostMarquee: HomeVisualItem[] = [
  g('stackTeal', 'Teal and slate gradient suggesting stacked digital layers.', 'Stacked signal'),
  g('columnCoral', 'Warm vertical gradient suggesting interface columns.', 'Vertical buffer'),
  g('fieldViolet', 'Violet gradient suggesting held attention in a field.', 'Held attention'),
];

/** After narrative — reference layer */
export const homeVisualNarrativeBridge: HomeVisualItem[] = [
  g('pulseMagenta', 'Magenta pulse gradient suggesting networked public formats.', 'Data social'),
  g('warmAmber', 'Amber gradient suggesting surfaces and retail-adjacent display.', 'Smart surface'),
];

/** Why Miami — distinct pair */
export const homeVisualWhyMiami: HomeVisualItem[] = [
  g('signalCyan', 'Cyan signal gradient suggesting pilot posture.', 'Pilot posture'),
  g('meshSlate', 'Slate mesh gradient suggesting public institutional formats.', 'Public format'),
];

/** Process section — Infra24 page strip */
export const homeVisualProcessStrip: HomeVisualItem[] = [
  g('deepInk', 'Deep ink gradient — process phase texture.', 'Process A'),
  g('indigoHaze', 'Indigo haze gradient — process phase texture.', 'Process B'),
];

/** Proof section — single echo tile */
export const homeVisualProofEcho: HomeVisualItem[] = [
  g('roseMist', 'Rose-neutral gradient echo tile.', 'Pattern echo'),
];

/** Problem section — featured (Infra24) */
export const homeVisualProblemFeatured: HomeVisualItem = g(
  'fieldViolet',
  'Violet field gradient — friction between physical and digital surfaces.',
  'Station / screen',
  'Texture'
);

/** Mid-page gallery — six unique gradients (no repeated artwork) */
export const homeVisualMidGallery: HomeVisualItem[] = [
  g('stackTeal', 'Teal stack gradient.', 'Layer stack'),
  g('columnCoral', 'Coral column gradient.', 'Color columns'),
  g('fieldViolet', 'Violet field gradient.', 'Field'),
  g('pulseMagenta', 'Magenta pulse gradient.', 'Network pulse'),
  g('warmAmber', 'Amber warmth gradient.', 'Warm signal'),
  g('signalCyan', 'Cyan signal gradient.', 'Civic signal'),
];
