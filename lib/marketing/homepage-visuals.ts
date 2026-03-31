/**
 * Homepage image strategy: systems in context—architecture, wayfinding, surfaces.
 * Sources: Unsplash (configured in next.config.js). Replace with org-owned photography when available.
 */

export const heroCollagePanels = [
  {
    id: 'space',
    src: 'https://images.unsplash.com/photo-1577083553086-f6c65c021c89?auto=format&fit=crop&w=1600&q=80',
    alt: 'Gallery hallway with white walls—public cultural space',
    label: 'Public space',
  },
  {
    id: 'layers',
    src: 'https://images.unsplash.com/photo-1524661135-423995f32d0b?auto=format&fit=crop&w=900&q=80',
    alt: 'Abstract map layers suggesting navigation and geography',
    label: 'Wayfinding layer',
  },
  {
    id: 'surface',
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
    alt: 'Ambient light and digital surface in a public interior',
    label: 'Signage & screens',
  },
  {
    id: 'handoff',
    src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    alt: 'Mobile device—QR and public handoff',
    label: 'Mobile & QR',
  },
] as const;

/** Bento cell order matches `capabilities` indices: 0–5 */
export type BentoVisualKind = 'photo' | 'ui' | 'diagram' | 'metrics';

export const bentoLayouts: { capabilityIndex: number; visual: BentoVisualKind }[] = [
  { capabilityIndex: 0, visual: 'photo' },
  { capabilityIndex: 1, visual: 'ui' },
  { capabilityIndex: 2, visual: 'diagram' },
  { capabilityIndex: 3, visual: 'photo' },
  { capabilityIndex: 4, visual: 'ui' },
  { capabilityIndex: 5, visual: 'metrics' },
];

/** Optional photography for bento “photo” cells—institutional tone */
export const bentoPhotoSrc: Record<number, { src: string; alt: string }> = {
  0: {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    alt: 'Wayfinding and signage in a public interior',
  },
  3: {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
    alt: 'Event and program communication in a venue setting',
  },
};
