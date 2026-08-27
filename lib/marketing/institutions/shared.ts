/**
 * Shared constants for /institutions and /artist-infrastructure.
 * DCC channels only — not personal moises.tech Calendly/email.
 */

export const INSTITUTIONAL_CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/dccmiami';

export const INSTITUTIONAL_EMAIL = 'contact@dcc.miami';

export const ART_PRACTICE_ORIGIN = 'https://moises.tech';

export const INSTITUTIONAL_COLLABORATION_AVAILABILITY =
  'Available for paid guest teaching, curriculum development, and institutional creative-technology collaborations beginning fall 2026.';

export const INSTITUTIONAL_SERVICES_AVAILABILITY =
  'Currently available for project-based and fractional engagements.';

export const OOLITE_CONTRACT_CONTEXT =
  'Year-long engagement as Technical Director of Digital at Oolite Arts concludes September 17, 2026.';

/** Public workshop catalog — missing workshop landings point here. */
export const DCC_WORKSHOPS_CATALOG = '/workshops';

/** Live DCC workshop landings. */
export const DCC_WORKSHOP_VIBE_CODING = '/workshop/vibe-coding-net-art';
export const DCC_WORKSHOP_RESIN = '/workshop/resin-printing';

export const INSTITUTIONAL_FAMILY_NAV = [
  {
    href: '/artist-infrastructure',
    label: 'Offer',
    match: 'artist-infrastructure',
    short: 'Workshops',
  },
  {
    href: '/institutions',
    label: 'Institutions',
    match: 'institutions',
    short: 'Services',
  },
  {
    href: '/workshops',
    label: 'Workshops',
    match: 'workshops',
    short: 'Catalog',
  },
  {
    href: '/infra24',
    label: 'Infra24',
    match: 'infra24',
    short: 'Systems',
  },
  {
    href: '/partners',
    label: 'Partners',
    match: 'partners',
    short: 'Host',
  },
] as const;

export type InstitutionalFamilyMatch = (typeof INSTITUTIONAL_FAMILY_NAV)[number]['match'];

export const DCC_MIAMI = {
  name: 'DCC Miami',
  fullName: 'Digital Culture Center Miami',
  href: 'https://dcc.miami',
  label: 'Artist-owned cultural-technology practice',
} as const;

export type LogoBandItem = {
  src?: string;
  alt: string;
  height?: number;
};

export function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');
}

export function calendlyMailto(subject: string): string {
  return `mailto:${INSTITUTIONAL_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
