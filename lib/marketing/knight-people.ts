/**
 * People & credentials for /knight — portraits, documents, optional social URLs.
 * Set `social.*` when ready; omitted keys hide that button.
 */

/** Rina Carvajal — recommendation letter (Google Drive). */
export const knightDriveRecommendationLetterUrl =
  'https://drive.google.com/file/d/1YLbZKWdcoV93xdb0FSGxwH-IUyLIwJOC/view?usp=sharing' as const;

/** Founders’ CVs — shared PDF on Drive (both founders; Fabiola also has an individual CV link below). */
export const knightDriveFoundersCvsUrl =
  'https://drive.google.com/file/d/1XfqTrXGnUM3visTffEtVmX_5b1_A0OCK/view?usp=drive_link' as const;

/** Fabiola Larios — individual CV (Google Drive). */
export const knightDriveFabiolaCvUrl =
  'https://drive.google.com/file/d/1q02JK4i0kw4UUH6O7aDGbBuQUBVPThl8/view?usp=sharing' as const;

/** `/knight/founders` hero — Fabiola Larios and Moises Sanabria. */
export const knightFoundersHeroPhoto = {
  src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777520267/dccmiami/portraits/Fabiola-and-Moises_khyrpu.jpg',
  alt: 'Fabiola Larios and Moises Sanabria — founding team, Digital Culture Center Miami.',
} as const;

export type KnightFounderMomentoEmbed = {
  id: string;
  label: string;
  /** Momento360 iframe `src` (include embed query params as needed). */
  embedSrc: string;
};

/**
 * Full-bleed 360° embeds on `/knight` between People and Packet files.
 * Add a second entry for Moises when the tour is ready.
 */
export const knightFounderMomentoEmbeds: KnightFounderMomentoEmbed[] = [
  {
    id: 'fabiola',
    label: 'Fabiola Larios',
    embedSrc:
      'https://momento360.com/e/u/fd0861891d284eff90e0995a727186fd?utm_campaign=embed&utm_source=other&heading=165.08&pitch=-15.38&field-of-view=75&size=medium&display-plan=true',
  },
];

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
  /**
   * Primary tap target for the portrait + name block (LinkedIn-style card).
   * Defaults to the document link when ready, otherwise `/knight/founders`.
   */
  cardHref?: string;
};

export const knightFoundersPageHref = '/knight/founders' as const;

/** Resolved destination for the profile-style card header link. */
export function knightPersonCardHref(person: KnightPersonCredential): string {
  if (person.cardHref) return person.cardHref;
  if (person.documentStatus === 'ready' && person.documentHref) return person.documentHref;
  return knightFoundersPageHref;
}

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
    cardHref: knightDriveRecommendationLetterUrl,
    social: {
      linkedin: 'https://www.linkedin.com/in/rina-carvajal-70ba1930a/',
    },
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
    cardHref: knightDriveFoundersCvsUrl,
    social: {
      instagram: 'https://www.instagram.com/moisesdsanabria/',
      linkedin: 'https://www.linkedin.com/in/moisesdsanabria',
    },
  },
  {
    id: 'fabiola',
    name: 'Fabiola Larios',
    subtitle: 'CV (individual file)',
    documentLabel: 'View individual CV (PDF)',
    documentStatus: 'ready',
    documentHref: knightDriveFabiolaCvUrl,
    portraitSrc: PORTRAITS.fabiola,
    portraitAlt: 'Fabiola Larios',
    initials: 'FL',
    initialsClass:
      'bg-gradient-to-br from-fuchsia-100 to-violet-100 text-violet-900 ring-fuchsia-200/70 dark:from-fuchsia-950/50 dark:to-violet-950/40 dark:text-fuchsia-100 dark:ring-fuchsia-500/25',
    cardHref: knightDriveFabiolaCvUrl,
    social: {
      instagram: 'https://www.instagram.com/fabiolalariosm/',
      linkedin: 'https://www.linkedin.com/in/fabiolaio',
    },
  },
];
