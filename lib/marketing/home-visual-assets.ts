import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import { dccHomeProofPhotos, dccHomeWhyMiamiPhotos } from '@/lib/marketing/dcc-home-photography';

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

const photo = (
  src: string,
  alt: string,
  caption?: string,
  credit?: string
): HomeVisualItem => ({
  kind: 'image',
  src,
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

/** Why Miami — DCC photography row */
export const homeVisualWhyMiami: HomeVisualItem[] = [
  photo(
    dccHomeWhyMiamiPhotos[0].src,
    dccHomeWhyMiamiPhotos[0].alt,
    'Public programs',
    'DCC Miami'
  ),
  photo(
    dccHomeWhyMiamiPhotos[1].src,
    dccHomeWhyMiamiPhotos[1].alt,
    'Pilot installations',
    'DCC Miami'
  ),
];

/** Process section — Infra24 page strip */
export const homeVisualProcessStrip: HomeVisualItem[] = [
  g('deepInk', 'Deep ink gradient — process phase texture.', 'Process A'),
  g('indigoHaze', 'Indigo haze gradient — process phase texture.', 'Process B'),
];

/** Proof section — three artwork tiles */
export const homeVisualProofEcho: HomeVisualItem[] = [
  photo(dccHomeProofPhotos[0].src, dccHomeProofPhotos[0].alt, 'Field work', 'DCC Miami'),
  photo(dccHomeProofPhotos[1].src, dccHomeProofPhotos[1].alt, 'Concept', 'DCC Miami'),
  photo(dccHomeProofPhotos[2].src, dccHomeProofPhotos[2].alt, 'Systems art', 'DCC Miami'),
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
