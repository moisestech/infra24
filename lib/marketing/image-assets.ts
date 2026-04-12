/**
 * Marketing visual config: hero collage labels + bento gradient keys.
 * Hero collage photos: [`dcc-home-photography`](./dcc-home-photography.ts).
 */

import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import { dccHomeHeroCollagePhotos } from '@/lib/marketing/dcc-home-photography';

const [heroMain, heroTop, heroMid, heroPhone] = dccHomeHeroCollagePhotos;

export const heroCollagePanels = [
  {
    id: 'field',
    gradientId: 'stackTeal' as const satisfies MarketingGradientId,
    label: 'Layer stack',
    photo: heroMain,
  },
  {
    id: 'entanglement',
    gradientId: 'columnCoral' as const satisfies MarketingGradientId,
    label: 'Vertical buffer',
    photo: heroTop,
  },
  {
    id: 'touchgrass',
    gradientId: 'fieldViolet' as const satisfies MarketingGradientId,
    label: 'Held attention',
    photo: heroMid,
  },
  {
    id: 'watch',
    gradientId: 'pulseMagenta' as const satisfies MarketingGradientId,
    label: 'Public format',
    photo: heroPhone,
  },
] as const;

/** Bento “photo” cells: keyed by `capabilities` index */
export const bentoPhotoGradient: Partial<Record<number, MarketingGradientId>> = {
  0: 'meshSlate',
  3: 'indigoHaze',
};
