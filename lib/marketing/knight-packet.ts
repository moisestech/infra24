/**
 * Knight pilot & funder packet — shared rows for /knight and /grants/materials.
 * Update href + status to 'ready' when files ship.
 */

export type FunderMaterialRow = {
  id: string;
  label: string;
  status: 'ready' | 'soon';
  href?: string;
  external?: boolean;
};

/** Downloadables (PDFs and similar). Linked from both /knight and /grants/materials. */
export const funderMaterialDownloadRows: FunderMaterialRow[] = [
  {
    id: 'one-pager',
    label: 'One-page DCC / pilot overview (PDF)',
    status: 'soon',
  },
  {
    id: 'rina-letter',
    label: 'Recommendation letter (Rina)',
    status: 'soon',
  },
  {
    id: 'cv-moises',
    label: 'Moises Sanabria — CV',
    status: 'soon',
  },
  {
    id: 'cv-fabiola',
    label: 'Fabiola Larios — CV',
    status: 'soon',
  },
  {
    id: 'budget-summary',
    label: 'Budget summary (pilot)',
    status: 'soon',
  },
  {
    id: 'founder-bios',
    label: 'Founder bios',
    status: 'soon',
  },
  {
    id: 'funder-deck',
    label: 'Funder deck',
    status: 'soon',
  },
  {
    id: 'pilot-impact',
    label: 'Pilot & impact summary',
    status: 'soon',
  },
  {
    id: 'press-blurb',
    label: 'Press-ready description',
    status: 'soon',
  },
  {
    id: 'logo-kit',
    label: 'Logo / visual kit',
    status: 'soon',
  },
];

export type KnightPacketContextLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

/** Long-form Knight-aligned page (linked prominently from /knight). */
export const knightFullNarrativeLink: KnightPacketContextLink = {
  id: 'narrative',
  title: 'Full Knight-aligned narrative',
  description:
    'Long-form overview: problem framing, proposed pilot, public entry points, outcomes, Miami rationale, and Infra24 context.',
  href: '/grant/knight-foundation',
};

/** DCC identity, evidence, and adjacent grants pages (grid on /knight). */
export const knightPacketContextLinks: KnightPacketContextLink[] = [
  {
    id: 'home',
    title: 'DCC Miami — public site',
    description: 'Homepage and public identity for Digital Culture Center Miami.',
    href: '/',
  },
  {
    id: 'about',
    title: 'About DCC Miami',
    description: 'What the center is and how it shows up in Miami’s digital culture field.',
    href: '/about',
  },
  {
    id: 'mission',
    title: 'Mission',
    description: 'Public benefit, artist-centered infrastructure, and civic-facing programs.',
    href: '/mission',
  },
  {
    id: 'infra24',
    title: 'Infra24 (systems studio)',
    description: 'Implementation layer behind DCC: signage, maps, portals, and repeatable workflows.',
    href: '/infra24',
  },
  {
    id: 'projects',
    title: 'Projects & case studies',
    description: 'Work samples: public interfaces, pilots, and institutional systems.',
    href: '/projects',
  },
  {
    id: 'grants-funders',
    title: 'For funders',
    description: 'Grantmaker-facing narrative and impact framing beyond this packet.',
    href: '/grants/funders',
  },
  {
    id: 'priorities',
    title: 'Funding priorities',
    description: 'Current buckets for the Miami pilot (interfaces, workshops, documentation, and more).',
    href: '/grants/priorities',
  },
];
