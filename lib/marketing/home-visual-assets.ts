export type HomeVisualItem = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

/** Full-bleed mosaic after marquee — above-the-fold texture (distinct from hero collage). */
export const homeVisualPostMarquee: HomeVisualItem[] = [
  {
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Surveillance_Cutie_2024.webp',
    alt: 'Artwork depicting cute aesthetics intersecting surveillance motifs.',
    caption: 'Surveillance cute',
    credit: 'Fabiola Larios',
  },
  {
    src: 'https://angelocaruso.art/images/traverse2.jpg',
    alt: 'Photograph suggesting movement through urban or corridor space.',
    caption: 'Corridor signal',
    credit: 'Angelo Caruso',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717961679/art/moisestech-website/moisesdsanabria-babyagi_ewquhe.webp',
    alt: 'Artwork referencing autonomous agents and digital labor.',
    caption: 'Agentic drift',
    credit: 'Moisés D. Sanabria',
  },
];

/** After narrative — surveillance / network entanglement thematics. */
export const homeVisualNarrativeBridge: HomeVisualItem[] = [
  {
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Surveillance_Cutie_2024.webp',
    alt: 'Artwork depicting cute aesthetics intersecting surveillance motifs.',
    caption: 'Surveillance Cutie',
    credit: 'Fabiola Larios',
  },
  {
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Internet_Entanglement_2024.webp',
    alt: 'Artwork about entanglement with internet systems and identity.',
    caption: 'Internet Entanglement',
    credit: 'Fabiola Larios',
  },
];

/** Why Miami — civic / weathered public space. */
export const homeVisualWhyMiami: HomeVisualItem[] = [
  {
    src: 'https://angelocaruso.art/images/traverse2.jpg',
    alt: 'Photograph suggesting movement through urban or corridor space.',
    caption: 'Traverse',
    credit: 'Angelo Caruso',
  },
  {
    src: 'https://angelocaruso.art/images/frontpage/rain.jpg',
    alt: 'Rain-soaked urban scene, reflective surfaces.',
    caption: 'Rain corridor',
    credit: 'Angelo Caruso',
  },
];

/** Process section — horizontal strip (scroll on small screens). */
export const homeVisualProcessStrip: HomeVisualItem[] = [
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjvyoUNXh1r1ubs7o1_1280_bsmcic.jpg',
    alt: 'Abstract digital texture with vertical color bands.',
    caption: 'Buffer A',
    credit: 'Studio reference',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjzb2mbro1r1ubs7o1_1280_cqc4ds.jpg',
    alt: 'Layered abstract imagery suggesting stacked interfaces.',
    caption: 'Buffer B',
    credit: 'Studio reference',
  },
];

/** Proof section — single echo tile. */
export const homeVisualProofEcho: HomeVisualItem[] = [
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717961679/art/moisestech-website/moisesdsanabria-babyagi_ewquhe.webp',
    alt: 'Artwork referencing autonomous agents and digital labor.',
    caption: 'Pattern echo',
    credit: 'Moisés D. Sanabria',
  },
];

/** Problem section — physical/digital friction (featured). */
export const homeVisualProblemFeatured: HomeVisualItem = {
  src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831887/art/moisestech-website/touchgrass-doomscrolling-treadmill-stations-1_gggocb.jpg',
  alt: 'Installation with treadmills and screens commenting on doomscrolling and physical presence.',
  caption: 'Touch grass / doomscrolling stations',
  credit: 'Installation reference',
};

/** Mid-page exhibition & practice references. */
export const homeVisualMidGallery: HomeVisualItem[] = [
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717960571/art/moisestech-website/digitaldivinities-moisesdsanabria-fabiolalarios-bakehouse-openstudios-spring-2024_f3ahbx.jpg',
    alt: 'Open studios exhibition view with digital and sculptural work.',
    caption: 'Digital Divinities — Bakehouse Open Studios',
    credit: 'Moisés D. Sanabria & Fabiola Larios',
  },
  {
    src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717961679/art/moisestech-website/moisesdsanabria-babyagi_ewquhe.webp',
    alt: 'Artwork referencing autonomous agents and digital labor.',
    caption: 'BabyAGI',
    credit: 'Moisés D. Sanabria',
  },
  {
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Gems_of_Obsolescence.webp',
    alt: 'Sculptural work with gems and obsolete technology aesthetics.',
    caption: 'Gems of Obsolescence',
    credit: 'Fabiola Larios',
  },
  {
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_eyeseeyou_watch.webp',
    alt: 'Wearable or object evoking always-on watching and smart devices.',
    caption: 'Eye see you watch',
    credit: 'Fabiola Larios',
  },
  {
    src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Ewaste_2022_1.webp',
    alt: 'E-waste and material residue as sculptural subject.',
    caption: 'E-waste',
    credit: 'Fabiola Larios',
  },
  {
    src: 'https://createbuildconnect.com/images/exhibitions/cubic.jpg',
    alt: 'Exhibition documentation with cubic sculptural installation.',
    caption: 'Cubic',
    credit: 'Create Build Connect',
  },
];
