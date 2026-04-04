export type HomeVisualItem = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

/**
 * Five Cloudinary studio assets — shared pool for the marketing homepage (and related strips)
 * so the same handful of URLs repeats intentionally instead of many one-off remotes.
 */
export const homePageStudioImagePool = [
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjzb2mbro1r1ubs7o1_1280_cqc4ds.jpg',
    alt: 'Layered abstract imagery suggesting stacked digital interfaces.',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjvpsamAG1r1ubs7o1_1280_kdxzoj.jpg',
    alt: 'Vertical color bands and abstract digital texture.',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831875/art/moisestech-website/meditation-battlestation_b7ne15.jpg',
    alt: 'Meditation-oriented installation with screens and seating.',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831875/art/moisestech-website/data-dating-show-1_w0imjq.webp',
    alt: 'Performance or installation referencing data and social formats.',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831876/art/moisestech-website/smart_shoppers__bsw9ko.jpg',
    alt: 'Retail or consumer-facing imagery with digital overlays.',
  },
] as const;

const S = homePageStudioImagePool;

/** Full-bleed mosaic after marquee — above-the-fold texture (distinct from hero collage). */
export const homeVisualPostMarquee: HomeVisualItem[] = [
  { ...S[0], caption: 'Stacked signal', credit: 'Studio' },
  { ...S[1], caption: 'Vertical buffer', credit: 'Studio' },
  { ...S[2], caption: 'Held attention', credit: 'Studio' },
];

/** After narrative — studio texture. */
export const homeVisualNarrativeBridge: HomeVisualItem[] = [
  { ...S[3], caption: 'Data social', credit: 'Studio' },
  { ...S[4], caption: 'Smart surface', credit: 'Studio' },
];

/** Why Miami — same pool, different crop of indices. */
export const homeVisualWhyMiami: HomeVisualItem[] = [
  { ...S[2], caption: 'Pilot posture', credit: 'Studio' },
  { ...S[3], caption: 'Public format', credit: 'Studio' },
];

/** Process section — horizontal strip (scroll on small screens). */
export const homeVisualProcessStrip: HomeVisualItem[] = [
  { ...S[0], caption: 'Process A', credit: 'Studio' },
  { ...S[1], caption: 'Process B', credit: 'Studio' },
];

/** Proof section — single echo tile. */
export const homeVisualProofEcho: HomeVisualItem[] = [{ ...S[4], caption: 'Pattern echo', credit: 'Studio' }];

/** Problem section — physical/digital friction (featured). */
export const homeVisualProblemFeatured: HomeVisualItem = {
  ...S[2],
  caption: 'Station / screen',
  credit: 'Studio',
};

/** Mid-page exhibition & practice references. */
export const homeVisualMidGallery: HomeVisualItem[] = [
  { ...S[0], caption: 'Layer stack', credit: 'Studio' },
  { ...S[1], caption: 'Color columns', credit: 'Studio' },
  { ...S[2], caption: 'Battlestation', credit: 'Studio' },
  { ...S[3], caption: 'Data dating', credit: 'Studio' },
  { ...S[4], caption: 'Smart shoppers', credit: 'Studio' },
  { ...S[0], caption: 'Layer stack (return)', credit: 'Studio' },
];
