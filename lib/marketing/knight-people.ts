/**
 * People & credentials for /knight — portraits, documents, optional social URLs.
 * Set `social.*` when ready; omitted keys hide that button.
 */

/** Rina Carvajal — recommendation letter (Google Drive). */
export const knightDriveRecommendationLetterUrl =
  'https://drive.google.com/file/d/1YLbZKWdcoV93xdb0FSGxwH-IUyLIwJOC/view?usp=sharing' as const;

/** Founders’ CVs — shared PDF on Drive (Moises live; Fabiola’s standalone CV still to come). */
export const knightDriveFoundersCvsUrl =
  'https://drive.google.com/file/d/1XfqTrXGnUM3visTffEtVmX_5b1_A0OCK/view?usp=drive_link' as const;

/** `/knight/founders` hero — Fabiola Larios and Moises Sanabria. */
export const knightFoundersHeroPhoto = {
  src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777520267/dccmiami/portraits/Fabiola-and-Moises_khyrpu.jpg',
  alt: 'Fabiola Larios and Moises Sanabria — founding team, Digital Culture Center Miami.',
} as const;

const PORTRAITS = {
  rina:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511657/dccmiami/portraits/rina-carvajal-profile_uam3z6.webp',
  moises:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511801/dccmiami/portraits/moises-pfp_dnn3d3.jpg',
  fabiola:
    'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777518148/dccmiami/portraits/fabiola-lariosm-profile_vuypf4.jpg',
} as const;

export type KnightPersonSocial = {
  instagram?: string;
  linkedin?: string;
  /** mailto: address */
  email?: string;
};

export type KnightPersonCredential = {
  id: string;
  name: string;
  subtitle: string;
  documentLabel: string;
  documentStatus: 'ready' | 'soon';
  documentHref?: string;
  /** Public headshot; omit for initials-only avatar */
  portraitSrc?: string;
  portraitAlt: string;
  initials: string;
  initialsClass: string;
  social: KnightPersonSocial;
};

export const knightFoundersPageHref = '/knight/founders' as const;

export const knightPersonCredentials: KnightPersonCredential[] = [
  {
    id: 'rina',
    name: 'Rina Carvajal',
    subtitle: 'Recommendation letter',
    documentLabel: 'View recommendation letter (PDF)',
    documentStatus: 'ready',
    documentHref: knightDriveRecommendationLetterUrl,
    portraitSrc: PORTRAITS.rina,
    portraitAlt: 'Rina Carvajal',
    initials: 'RC',
    initialsClass:
      'bg-gradient-to-br from-rose-100 to-orange-100 text-rose-900 ring-rose-200/80 dark:from-rose-950/60 dark:to-orange-950/40 dark:text-rose-100 dark:ring-rose-500/25',
    social: {},
  },
  {
    id: 'moises',
    name: 'Moises Sanabria',
    subtitle: 'CV',
    documentLabel: 'View founders’ CVs (PDF)',
    documentStatus: 'ready',
    documentHref: knightDriveFoundersCvsUrl,
    portraitSrc: PORTRAITS.moises,
    portraitAlt: 'Moises Sanabria',
    initials: 'MS',
    initialsClass:
      'bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-900 ring-teal-200/80 dark:from-teal-950/60 dark:to-cyan-950/40 dark:text-teal-100 dark:ring-teal-500/25',
    social: {},
  },
  {
    id: 'fabiola',
    name: 'Fabiola Larios',
    subtitle: 'CV (individual file pending)',
    documentLabel: 'Individual CV (PDF)',
    documentStatus: 'soon',
    portraitSrc: PORTRAITS.fabiola,
    portraitAlt: 'Fabiola Larios',
    initials: 'FL',
    initialsClass:
      'bg-gradient-to-br from-fuchsia-100 to-violet-100 text-violet-900 ring-fuchsia-200/70 dark:from-fuchsia-950/50 dark:to-violet-950/40 dark:text-fuchsia-100 dark:ring-fuchsia-500/25',
    social: {},
  },
];
