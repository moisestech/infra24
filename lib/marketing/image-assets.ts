/**
 * Marketing visual config: hero collage labels + bento gradient keys.
 * Surfaces use CSS gradients (`marketing-gradients`) instead of remote placeholders.
 */

import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';

/** Main hero collage cell: real photo from Cloudinary (Next/Image uses `unoptimized` in `HeroCollage`). */
export const marketingHeroCollageMainPhoto = {
  src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758247127/smart-sign/orgs/oolite/oolite-digital-arts-program_ai-sketch_mqtbm9.png',
  alt: 'Digital arts and public program collage — workshops and civic-facing interfaces.',
} as const;

export const heroCollagePanels = [
  {
    id: 'field',
    gradientId: 'stackTeal' as const satisfies MarketingGradientId,
    label: 'Layer stack',
    /** When set, shown behind gradient scrim so Cloudinary assets visibly load on the homepage. */
    photo: marketingHeroCollageMainPhoto,
  },
  {
    id: 'entanglement',
    gradientId: 'columnCoral' as const satisfies MarketingGradientId,
    label: 'Vertical buffer',
  },
  {
    id: 'touchgrass',
    gradientId: 'fieldViolet' as const satisfies MarketingGradientId,
    label: 'Held attention',
  },
  {
    id: 'watch',
    gradientId: 'pulseMagenta' as const satisfies MarketingGradientId,
    label: 'Public format',
  },
] as const;

/** Bento “photo” cells: keyed by `capabilities` index */
export const bentoPhotoGradient: Partial<Record<number, MarketingGradientId>> = {
  0: 'meshSlate',
  3: 'indigoHaze',
};
