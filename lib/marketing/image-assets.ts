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
    id: 'field',
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717960571/art/moisestech-website/digitaldivinities-moisesdsanabria-fabiolalarios-bakehouse-openstudios-spring-2024_f3ahbx.jpg',
    alt: 'Bakehouse Open Studios—digital and sculptural work in a Miami cultural space',
    label: 'Miami field',
  },
  {
    id: 'entanglement',
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Internet_Entanglement_2024.webp',
    alt: 'Artwork about entanglement with internet systems and identity',
    label: 'Network layer',
  },
  {
    id: 'touchgrass',
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831887/art/moisestech-website/touchgrass-doomscrolling-treadmill-stations-1_gggocb.jpg',
    alt: 'Installation with treadmills and screens—physical presence and doomscrolling',
    label: 'Body / feed',
  },
  {
    id: 'watch',
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_eyeseeyou_watch.webp',
    alt: 'Wearable evoking always-on devices and watching',
    label: 'Wearable UI',
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
