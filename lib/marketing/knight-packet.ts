/**
 * Knight pilot & funder packet — shared rows for /knight and /grants/materials.
 * Update href + status to 'ready' when files ship.
 */

import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography';
import {
  knightDriveFabiolaCvUrl,
  knightDriveFoundersCvsUrl,
  knightDriveRecommendationLetterUrl,
} from '@/lib/marketing/knight-people';

export type FunderFileKind = 'pdf' | 'doc' | 'slides' | 'sheet' | 'archive' | 'brand' | 'letter';

/** Groups drive color accents and section headers on /knight. */
export type FunderMaterialGroup = 'core' | 'people' | 'program' | 'brand';

export type FunderMaterialRow = {
  id: string;
  label: string;
  /** Shown on file cards, e.g. "PDF" */
  fileHint: string;
  kind: FunderFileKind;
  group: FunderMaterialGroup;
  status: 'ready' | 'soon';
  href?: string;
  external?: boolean;
  /** Optional thumbnail shown on the right of card layouts (e.g. /knight packet grid). */
  previewSrc?: string;
  previewAlt?: string;
};

export const FUNDER_MATERIAL_GROUP_LABEL: Record<FunderMaterialGroup, string> = {
  core: 'Core packet',
  people: 'People and credentials',
  program: 'Program and finances',
  brand: 'Press and brand',
};

/** Full packet order (materials index). On /knight, the file grid omits `people` (see avatar section). */
export const FUNDER_MATERIAL_GROUP_ORDER: FunderMaterialGroup[] = ['core', 'people', 'program', 'brand'];

/** Downloadables (PDFs and similar). Linked from both /knight and /grants/materials. */
export const funderMaterialDownloadRows: FunderMaterialRow[] = [
  {
    id: 'one-pager',
    label: 'One-page DCC / pilot overview',
    fileHint: 'PDF',
    kind: 'pdf',
    group: 'core',
    status: 'soon',
    previewSrc: dccHomePhotos.galleryCrowdOpening.src,
    previewAlt: dccHomePhotos.galleryCrowdOpening.alt,
  },
  {
    id: 'funder-deck',
    label: 'Funder deck',
    fileHint: 'Slides / PDF',
    kind: 'slides',
    group: 'core',
    status: 'soon',
    previewSrc: dccHomePhotos.digitalDivinities.src,
    previewAlt: dccHomePhotos.digitalDivinities.alt,
  },
  {
    id: 'pilot-impact',
    label: 'Pilot and impact summary',
    fileHint: 'PDF',
    kind: 'pdf',
    group: 'core',
    status: 'soon',
    previewSrc: dccHomePhotos.babyAgi.src,
    previewAlt: dccHomePhotos.babyAgi.alt,
  },
  {
    id: 'rina-letter',
    label: 'Recommendation letter (Rina Carvajal)',
    fileHint: 'PDF / Drive',
    kind: 'letter',
    group: 'people',
    status: 'ready',
    href: knightDriveRecommendationLetterUrl,
    external: true,
    previewSrc: dccHomePhotos.knightArtTec2025Talk.src,
    previewAlt: dccHomePhotos.knightArtTec2025Talk.alt,
  },
  {
    id: 'cv-moises',
    label: 'Founders’ CVs (Moises & Fabiola)',
    fileHint: 'PDF / Drive',
    kind: 'pdf',
    group: 'people',
    status: 'ready',
    href: knightDriveFoundersCvsUrl,
    external: true,
    previewSrc: dccHomePhotos.moisesArtec2024Talk.src,
    previewAlt: dccHomePhotos.moisesArtec2024Talk.alt,
  },
  {
    id: 'cv-fabiola',
    label: 'Fabiola Larios — CV (individual file)',
    fileHint: 'PDF',
    kind: 'pdf',
    group: 'people',
    status: 'ready',
    href: knightDriveFabiolaCvUrl,
    external: true,
    previewSrc: dccHomePhotos.knightFabiolaArtTec2025.src,
    previewAlt: dccHomePhotos.knightFabiolaArtTec2025.alt,
  },
  {
    id: 'founder-bios',
    label: 'Founder bios (full page)',
    fileHint: 'Web',
    kind: 'doc',
    group: 'people',
    status: 'ready',
    href: '/knight/founders',
    previewSrc: dccHomePhotos.digitalDivinities.src,
    previewAlt: dccHomePhotos.digitalDivinities.alt,
  },
  {
    id: 'budget-summary',
    label: 'Budget summary (pilot)',
    fileHint: 'Sheet / PDF',
    kind: 'sheet',
    group: 'program',
    status: 'soon',
    previewSrc: dccHomePhotos.smartShoppers.src,
    previewAlt: dccHomePhotos.smartShoppers.alt,
  },
  {
    id: 'press-blurb',
    label: 'Press-ready description',
    fileHint: 'DOC / PDF',
    kind: 'doc',
    group: 'brand',
    status: 'soon',
    previewSrc: dccHomePhotos.fabiolaGemsOfObsolescence.src,
    previewAlt: dccHomePhotos.fabiolaGemsOfObsolescence.alt,
  },
  {
    id: 'logo-kit',
    label: 'Logo / visual kit',
    fileHint: 'ZIP / folder',
    kind: 'archive',
    group: 'brand',
    status: 'soon',
    previewSrc: dccHomePhotos.fabiolaEwaste2022.src,
    previewAlt: dccHomePhotos.fabiolaEwaste2022.alt,
  },
];

export type KnightContextIconKey =
  | 'home'
  | 'about'
  | 'mission'
  | 'infra24'
  | 'projects'
  | 'funders'
  | 'priorities';

export type KnightPacketContextLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  icon: KnightContextIconKey;
  /** Accent stripe on cards — matches DCC marketing variables where possible */
  accent: 'teal' | 'coral' | 'magenta' | 'indigo';
  /** Full-bleed preview on `/knight` DCC links board (hover / focus). */
  previewSrc: string;
  previewAlt: string;
};

/** Long-form Knight-aligned page (linked prominently from /knight). */
export const knightFullNarrativeLink: KnightPacketContextLink = {
  id: 'narrative',
  title: 'Full Knight-aligned narrative',
  description:
    'Long-form overview: problem framing, proposed pilot, public entry points, outcomes, Miami rationale, and Infra24 context.',
  href: '/grant/knight-foundation',
  icon: 'mission',
  accent: 'indigo',
  previewSrc: dccHomePhotos.digitalDivinities.src,
  previewAlt: dccHomePhotos.digitalDivinities.alt,
};

/** DCC identity, evidence, and adjacent grants pages (grid on /knight). */
export const knightPacketContextLinks: KnightPacketContextLink[] = [
  {
    id: 'home',
    title: 'DCC Miami — public site',
    description: 'Homepage and public identity for Digital Culture Center Miami.',
    href: '/',
    icon: 'home',
    accent: 'teal',
    previewSrc: dccHomePhotos.galleryCrowdOpening.src,
    previewAlt: dccHomePhotos.galleryCrowdOpening.alt,
  },
  {
    id: 'about',
    title: 'About DCC Miami',
    description: 'What the center is and how it shows up in Miami’s digital culture field.',
    href: '/about',
    icon: 'about',
    accent: 'teal',
    previewSrc: dccHomePhotos.fabiolaGemsOfObsolescence.src,
    previewAlt: dccHomePhotos.fabiolaGemsOfObsolescence.alt,
  },
  {
    id: 'mission',
    title: 'Mission',
    description: 'Public benefit, artist-centered infrastructure, and civic-facing programs.',
    href: '/mission',
    icon: 'mission',
    accent: 'coral',
    previewSrc: dccHomePhotos.vrHug.src,
    previewAlt: dccHomePhotos.vrHug.alt,
  },
  {
    id: 'infra24',
    title: 'Infra24 (systems studio)',
    description: 'Implementation layer behind DCC: signage, maps, portals, and repeatable workflows.',
    href: '/infra24',
    icon: 'infra24',
    accent: 'magenta',
    previewSrc: dccHomePhotos.touchgrassTreadmillWide.src,
    previewAlt: dccHomePhotos.touchgrassTreadmillWide.alt,
  },
  {
    id: 'projects',
    title: 'Projects and case studies',
    description: 'Work samples: public interfaces, pilots, and institutional systems.',
    href: '/projects',
    icon: 'projects',
    accent: 'indigo',
    previewSrc: dccHomePhotos.galleryInteractiveStations.src,
    previewAlt: dccHomePhotos.galleryInteractiveStations.alt,
  },
  {
    id: 'grants-funders',
    title: 'For funders',
    description: 'Grantmaker-facing narrative and impact framing beyond this packet.',
    href: '/grants/funders',
    icon: 'funders',
    accent: 'coral',
    previewSrc: dccHomePhotos.fabiolaSurveillanceCutie2024.src,
    previewAlt: dccHomePhotos.fabiolaSurveillanceCutie2024.alt,
  },
  {
    id: 'priorities',
    title: 'Funding priorities',
    description: 'Current buckets for the Miami pilot (interfaces, workshops, documentation, and more).',
    href: '/grants/priorities',
    icon: 'priorities',
    accent: 'magenta',
    previewSrc: dccHomePhotos.babyAgi.src,
    previewAlt: dccHomePhotos.babyAgi.alt,
  },
];

/** Full-width hero banners for /knight (theme-aware brand strips). */
export const knightPacketBannerImages = {
  light:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777512878/dccmiami/banners/dcc-miami-banner-light-1_krpjny.png',
  dark:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777512878/dccmiami/banners/dcc-miami-banner-dark-1_uc5bbs.png',
} as const;

export const knightPacketBannerAlt =
  'Digital Culture Center Miami — banner graphic for the Knight pilot packet.';

/** Knight Foundation mark — subtle lockup beside hero eyebrow on /knight. */
export const knightFoundationLogoSrc =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511397/dccmiami/logo/KF_Logotype_Icon-and-Stacked-Name_ctders.webp';

/** Narrative split (#narrative) — DCC map reference, theme-aware (light / dark PNG). */
export const knightPacketNarrativeSplitImages = {
  light:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777516809/dccmiami/dcc-stock/dcc-map-reference-light_hcohbo.png',
  dark:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777516810/dccmiami/dcc-stock/dcc-map-reference-dark_feo7y4.png',
} as const;

export const knightPacketNarrativeSplitImageAlt =
  'DCC map reference — Miami-area cultural geography overview for pilot framing.';

/** Photography for /knight split sections (identity + evidence). */
export const knightPacketPlaceholderImages = {
  identity: dccHomePhotos.knightFabiolaArtTec2025.src,
  evidence: dccHomePhotos.moisesArtec2024Talk.src,
} as const;

/** Alts for `knightPacketPlaceholderImages` — keep in sync with keys above. */
export const knightPacketPlaceholderImageAlts = {
  identity: dccHomePhotos.knightFabiolaArtTec2025.alt,
  evidence: dccHomePhotos.moisesArtec2024Talk.alt,
} as const;

/** Field / program photography on `/knight` (documentation context). */
export type KnightPacketStoryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

/** Miami aerial — grants / funders visual context (Knight packet). */
export const knightPacketMiamiDronePhoto = {
  src:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777604067/dccmiami/knight/fabiolaio_miami_drone_view_connected_through_an_invisible_netwo_4cce78ea-f937-4104-92bf-0c75ffc8345c_hahk6z.webp',
  alt:
    'Aerial view over Miami — conceptual visualization of neighborhoods and cultural activity linked through shared digital infrastructure.',
  caption: 'Miami — place-based digital culture and connected public programs.',
} as const satisfies KnightPacketStoryPhoto;

/** PAMM TV Bay — public event photography (wide / horizontal treatment on packet pages). */
export const knightPacketPammPublicEventPhotos: KnightPacketStoryPhoto[] = [
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777604603/dccmiami/knight/pamm-tv-bay-fabiola_ly8dnk.jpg',
    alt: 'PAMM TV Bay — public program with Fabiola Larios speaking at the event.',
    caption: 'PAMM TV Bay — public program · Fabiola Larios',
  },
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777604606/dccmiami/knight/pamm-tv-bay-moises_fk9gim.jpg',
    alt: 'PAMM TV Bay — public program with Moises Sanabria speaking at the event.',
    caption: 'PAMM TV Bay — public program · Moises Sanabria',
  },
];

export const knightPacketStoryPhotos: KnightPacketStoryPhoto[] = [
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777603093/dccmiami/knight/022525-CDebora-1520.jpg_jwhmcp.jpg',
    alt:
      'Event photograph — Miami cultural programming documentation for the Knight pilot packet (photo credit: C. Debora).',
    caption: 'Field documentation — February 2025.',
  },
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777603092/dccmiami/knight/Inkling_SeedAi_SXSW24-158.jpg_jegosx.jpg',
    alt:
      'Inkling / Seed AI at SXSW 2024 — public research and programs adjacent to the pilot narrative.',
    caption: 'SXSW 2024 — Inkling · Seed AI.',
  },
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777603269/dccmiami/knight/yami-ichi-2023-4.JPG_cxjrvo.webp',
    alt: 'Yami-Ichi 2023 — program documentation (series image 4).',
    caption: 'Yami-Ichi 2023.',
  },
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777603270/dccmiami/knight/yami-ichi-2023-2_hhiaou.webp',
    alt: 'Yami-Ichi 2023 — program documentation (series image 2).',
    caption: 'Yami-Ichi 2023.',
  },
  {
    src:
      'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777603271/dccmiami/knight/yami-ichi-2023-3_xcc41o.webp',
    alt: 'Yami-Ichi 2023 — program documentation (series image 3).',
    caption: 'Yami-Ichi 2023.',
  },
];
