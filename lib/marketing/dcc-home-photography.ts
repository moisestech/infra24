/**
 * DCC.miami homepage photography (Cloudinary). Single registry for hero collage + visual bands.
 */

export type DccHomePhoto = { readonly src: string; readonly alt: string };

const BASE = 'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto' as const;

/** Full artwork set (nine distinct installations). */
export const dccHomePhotos = {
  galleryInteractiveStations: {
    src: `${BASE}/v1738040056/art/moisestech-website/tumblr_npjvqvIkQK1r1ubs7o1_1280_uvwuly.jpg`,
    alt: 'Interactive digital art installation with three seated stations, projectors, and large-scale 3D environment projections on a gallery wall.',
  },
  galleryCrowdOpening: {
    src: `${BASE}/v1738040056/art/moisestech-website/tumblr_npjzb2mbro1r1ubs7o1_1280_cqc4ds.jpg`,
    alt: 'Visitors at a digital art exhibition viewing multiple large projections along a white gallery wall.',
  },
  touchgrassTreadmillFigure: {
    src: `${BASE}/v1737831895/art/moisestech-website/touchgrass-doomscrolling-treadmill-stations-6_cwf4ns.jpg`,
    alt: 'Touch Grass / Doomscrolling treadmill installation: standing desk, vertical social-media screens, and green-lit turf.',
  },
  meditationBattlestation: {
    src: `${BASE}/v1737831875/art/moisestech-website/meditation-battlestation_b7ne15.jpg`,
    alt: 'Outdoor battlestation: computer desk with monitors and gaming setup set in tall grass and trees.',
  },
  vrHug: {
    src: `${BASE}/v1717962487/art/moisestech-website/vr_hug_moisesdsanabria_tomgalle_2017_csfeef.jpg`,
    alt: 'VR Hug — two people embracing while wearing VR headsets, lit in saturated red. Moises Sanabria and Tom Galle, 2017.',
  },
  digitalDivinities: {
    src: `${BASE}/v1717960571/art/moisestech-website/digitaldivinities-moisesdsanabria-fabiolalarios-bakehouse-openstudios-spring-2024_f3ahbx.jpg`,
    alt: 'Digital Divinities installation: classical torso with projection, code terminal, and flanking screens. Moises D. Sanabria and Fabiola Larios.',
  },
  touchgrassTreadmillWide: {
    src: `${BASE}/v1737831887/art/moisestech-website/touchgrass-doomscrolling-treadmill-stations-1_gggocb.jpg`,
    alt: 'Touch Grass / Doomscrolling treadmill station with vertical monitors, LED sign, and neon-lit artificial grass.',
  },
  smartShoppers: {
    src: `${BASE}/v1737831876/art/moisestech-website/smart_shoppers__bsw9ko.jpg`,
    alt: 'Smart Shoppers — shopping cart filled with glowing brain-like spheres in a dim gallery.',
  },
  babyAgi: {
    src: `${BASE}/v1717961679/art/moisestech-website/moisesdsanabria-babyagi_ewquhe.webp`,
    alt: 'BabyAGI — multi-screen sculpture with AI-related text, digital figure, and glitch display. Moises Sanabria.',
  },
} as const satisfies Record<string, DccHomePhoto>;

/** Hero collage: large cell + three stacked tiles (left-to-right column). */
export const dccHomeHeroCollagePhotos = [
  dccHomePhotos.galleryInteractiveStations,
  dccHomePhotos.touchgrassTreadmillFigure,
  dccHomePhotos.digitalDivinities,
  dccHomePhotos.vrHug,
] as const;

/** Why Miami section row. */
export const dccHomeWhyMiamiPhotos = [
  dccHomePhotos.galleryCrowdOpening,
  dccHomePhotos.touchgrassTreadmillWide,
] as const;

/** Proof / patterns intro row (three tiles). */
export const dccHomeProofPhotos = [
  dccHomePhotos.meditationBattlestation,
  dccHomePhotos.smartShoppers,
  dccHomePhotos.babyAgi,
] as const;
