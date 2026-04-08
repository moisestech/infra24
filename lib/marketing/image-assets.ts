/**
 * Marketing visual config: hero collage labels + bento gradient keys.
 * Surfaces use CSS gradients (`marketing-gradients`) instead of remote placeholders.
 */

import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';

export const heroCollagePanels = [
  {
    id: 'field',
    gradientId: 'stackTeal' as const satisfies MarketingGradientId,
    label: 'Layer stack',
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
