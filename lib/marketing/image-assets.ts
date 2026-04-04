/**
 * Single source for marketing homepage remote image URLs (hero, bento, proof).
 *
 * Replace these Unsplash placeholders with organization-owned or licensed assets
 * (e.g. Cloudinary) when ready. `next.config.js` must allow the image host.
 *
 * @see docs/marketing/HOMEPAGE_IMAGE_SYSTEM.md
 */

import { homePageStudioImagePool } from './home-visual-assets';

const H = homePageStudioImagePool;

export const heroCollagePanels = [
  {
    id: 'field',
    src: H[0].src,
    alt: H[0].alt,
    label: 'Layer stack',
  },
  {
    id: 'entanglement',
    src: H[1].src,
    alt: H[1].alt,
    label: 'Vertical buffer',
  },
  {
    id: 'touchgrass',
    src: H[2].src,
    alt: H[2].alt,
    label: 'Held attention',
  },
  {
    id: 'watch',
    src: H[3].src,
    alt: H[3].alt,
    label: 'Public format',
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
    src: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?auto=format&fit=crop&w=1200&q=80',
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
