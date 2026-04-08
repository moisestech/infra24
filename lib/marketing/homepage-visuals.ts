/**
 * Homepage layout config (bento placement + visual kinds).
 * Photo cells use gradient ids from `image-assets.ts` (no remote placeholders).
 */

export { heroCollagePanels, bentoPhotoGradient } from './image-assets';

/** Bento cell order matches `capabilities` indices: 0–5 */
export type BentoVisualKind = 'photo' | 'ui' | 'diagram' | 'metrics' | 'handoff';

export const bentoLayouts: { capabilityIndex: number; visual: BentoVisualKind }[] = [
  { capabilityIndex: 0, visual: 'photo' },
  { capabilityIndex: 1, visual: 'ui' },
  { capabilityIndex: 2, visual: 'handoff' },
  { capabilityIndex: 3, visual: 'photo' },
  { capabilityIndex: 4, visual: 'ui' },
  { capabilityIndex: 5, visual: 'metrics' },
];
