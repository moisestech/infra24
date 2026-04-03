/**
 * Single source for marketing homepage remote image URLs (hero, bento, proof).
 *
 * Replace these Unsplash placeholders with organization-owned or licensed assets
 * (e.g. Cloudinary) when ready. `next.config.js` must allow the image host.
 *
 * @see docs/marketing/HOMEPAGE_IMAGE_SYSTEM.md
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

/** Bento “photo” cells: keyed by `capabilities` index */
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

export const caseStudyCoverImages = {
  'cultural-institution-wayfinding': {
    src: 'https://images.unsplash.com/photo-1566127444979-b3d2b64e932f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Museum visitors in a spacious exhibition hall—public information in context',
  },
  'nonprofit-program-portal': {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Workshop tables and materials—program operations in a nonprofit setting',
  },
  'multi-venue-events': {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    alt: 'Event venue seating—multi-venue coordination in physical space',
  },
} as const;
