/**
 * Digital Culture Center Miami (DCC.miami) — marketing route registry.
 * Single source for breadcrumbs, static params, and sitemap URLs.
 */

export type CdcLayoutKind = 'default' | 'program' | 'project' | 'support';

export type CdcPageDef = {
  path: string;
  title: string;
  description: string;
  /** Parent path for breadcrumbs; omit for top-level */
  parent?: string;
  layout: CdcLayoutKind;
  /** Shown on project-style pages */
  infra24Note?: string;
  /** Program category (programs/[category]/[slug]) */
  programCategory?: string;
  /** Project collection vs detailed case */
  projectKind?: 'collection' | 'case';
};

function p(def: CdcPageDef): CdcPageDef {
  return def;
}

/** Flat registry keyed by path for O(1) lookup */
const pages: CdcPageDef[] = [
  p({
    path: '/about',
    title: 'About',
    description:
      'Digital Culture Center Miami: a public-facing platform for artist-centered digital culture, public learning, and civic-facing infrastructure—powered by Infra24.',
    layout: 'default',
  }),
  p({
    path: '/why-miami',
    title: 'Why Miami',
    description:
      'Why Miami is the right region for a pilot in artist-centered digital culture: dense production, multilingual publics, and visible civic corridors.',
    parent: '/about',
    layout: 'default',
  }),
  p({
    path: '/mission',
    title: 'Mission',
    description:
      'Public benefit, artist-centered infrastructure, digital culture, civic interfaces, and repeatable systems.',
    parent: '/about',
    layout: 'default',
  }),
  p({
    path: '/programs',
    title: 'Programs',
    description:
      'Workshops, public programs, artist support, and institutional programs for digital culture in Miami.',
    layout: 'default',
  }),
  p({
    path: '/projects',
    title: 'Projects',
    description:
      'Smart signs, maps, portals, kiosks, and pilot deployments—proof of the Infra24 implementation layer.',
    layout: 'default',
  }),
  p({
    path: '/partners',
    title: 'Partners',
    description:
      'Cultural organizations, artists, schools, civic partners, and space sponsors collaborating on pilots.',
    layout: 'default',
  }),
  p({
    path: '/grants',
    title: 'Grants',
    description:
      'Funding priorities, funder narrative, and materials for the Miami pilot. DCC Miami is building a public digital culture model; fiscal sponsorship and institutional partners can help make grants and donations administratively clean.',
    layout: 'support',
  }),
  p({
    path: '/journal',
    title: 'Journal',
    description:
      'Essays, field notes, project updates, and workshop reflections on digital culture infrastructure.',
    layout: 'default',
  }),
  p({
    path: '/contact',
    title: 'Contact',
    description:
      'Reach Digital Culture Center Miami for general inquiries, partnerships, funders, press, and programs.',
    layout: 'default',
  }),
  p({
    path: '/infra24',
    title: 'Infra24',
    description:
      'Updateable public communication systems for nonprofits and cultural organizations: smart signage, wayfinding, kiosks, portals, and workflows you can maintain and measure. The systems studio behind Digital Culture Center Miami.',
    parent: '/about',
    layout: 'default',
  }),
  p({
    path: '/infra24/method',
    title: 'Method',
    description: 'How Infra24 scopes, pilots, and documents digital culture infrastructure.',
    parent: '/infra24',
    layout: 'default',
  }),
  p({
    path: '/infra24/systems',
    title: 'Systems',
    description: 'Control plane, display plane, portals, and update workflows.',
    parent: '/infra24',
    layout: 'default',
  }),
  p({
    path: '/infra24/case-studies',
    title: 'Case studies',
    description: 'Implementation patterns across institutions and public interfaces.',
    parent: '/infra24',
    layout: 'default',
  }),
  p({
    path: '/infra24/toolkit',
    title: 'Toolkit',
    description: 'Reusable methods and technical building blocks.',
    parent: '/infra24',
    layout: 'default',
  }),
  p({
    path: '/privacy',
    title: 'Privacy',
    description: 'Privacy policy for centerofdigitalculture.org / Infra24 marketing properties.',
    layout: 'default',
  }),
  p({
    path: '/terms',
    title: 'Terms',
    description: 'Terms of use.',
    layout: 'default',
  }),
  p({
    path: '/accessibility',
    title: 'Accessibility',
    description: 'Accessibility statement.',
    layout: 'default',
  }),
  p({
    path: '/press',
    title: 'Press',
    description: 'Press kit and media contact.',
    layout: 'default',
  }),
  p({
    path: '/newsletter',
    title: 'Newsletter',
    description: 'Subscribe for updates on programs and pilots.',
    layout: 'default',
  }),
  p({
    path: '/events',
    title: 'Events',
    description: 'Public programs and upcoming events.',
    layout: 'default',
  }),
  /* Support subpages */
  p({
    path: '/grants/funders',
    title: 'For funders',
    description:
      'Grantmaker-facing narrative: why Miami, what we fund, impact areas, and pilot model.',
    parent: '/grants',
    layout: 'support',
  }),
  p({
    path: '/grants/sponsors',
    title: 'For sponsors',
    description: 'Commercial, technology, and neighborhood sponsors for public interfaces and programs.',
    parent: '/grants',
    layout: 'support',
  }),
  p({
    path: '/grants/advisors',
    title: 'For advisors',
    description: 'Strategic allies, board-in-formation, and civic connectors.',
    parent: '/grants',
    layout: 'support',
  }),
  p({
    path: '/grants/priorities',
    title: 'Funding priorities',
    description: 'Current funding priorities for the Miami pilot.',
    parent: '/grants',
    layout: 'support',
  }),
  p({
    path: '/grants/materials',
    title: 'Materials',
    description: 'One-pager, bios, deck, and press-ready descriptions.',
    parent: '/grants',
    layout: 'support',
  }),
  p({
    path: '/knight',
    title: 'Knight pilot packet',
    description:
      'Single hub for the Knight-aligned Miami pilot: narrative, DCC identity, downloads (as published), evidence, and contact.',
    parent: '/grants',
    layout: 'support',
  }),
  p({
    path: '/knight/founders',
    title: 'Founder bios',
    description:
      'Founding team bios for Digital Culture Center Miami — context for funders and partners.',
    parent: '/knight',
    layout: 'support',
  }),
  p({
    path: '/knight/budget',
    title: 'Knight Cities budget',
    description:
      'How $400,000 becomes cultural infrastructure: Knight anchor funding, match and partner support, allocation toward public programs and artists, 10x network goals, measurement, and transparency.',
    parent: '/knight',
    layout: 'support',
  }),
];

const SUPPORT_PRIORITY_SLUGS = [
  'miami-pilot',
  'public-interfaces',
  'artist-workshops',
  'documentation-and-publishing',
  'space-exploration',
  'equipment-and-prototyping',
] as const;

const SUPPORT_PRIORITY_TITLES: Record<(typeof SUPPORT_PRIORITY_SLUGS)[number], string> = {
  'miami-pilot': 'Miami pilot programs',
  'public-interfaces': 'Public interfaces & wayfinding',
  'artist-workshops': 'Workshops & artist access',
  'documentation-and-publishing': 'Documentation & publishing',
  'space-exploration': 'Space exploration',
  'equipment-and-prototyping': 'Equipment & prototyping',
};

for (const slug of SUPPORT_PRIORITY_SLUGS) {
  pages.push(
    p({
      path: `/grants/priorities/${slug}`,
      title: SUPPORT_PRIORITY_TITLES[slug],
      description: `Funding priority: ${SUPPORT_PRIORITY_TITLES[slug]}.`,
      parent: '/grants/priorities',
      layout: 'support',
    })
  );
}

const PROGRAM_CATEGORIES = [
  {
    slug: 'workshops',
    title: 'Workshops',
    description: 'Hands-on learning for artists and cultural workers.',
  },
  {
    slug: 'public-programs',
    title: 'Public programs',
    description: 'Talks, demos, clinics, and community sessions.',
  },
  {
    slug: 'artist-support',
    title: 'Artist support',
    description: 'Digital audits, visibility, documentation, and archives.',
  },
  {
    slug: 'institutional-programs',
    title: 'Institutional programs',
    description: 'Staff training, public interface pilots, and smart signage programs.',
  },
] as const;

const PROGRAM_LEAVES: Record<
  (typeof PROGRAM_CATEGORIES)[number]['slug'],
  { slug: string; title: string; description: string }[]
> = {
  workshops: [
    {
      slug: 'own-your-digital-presence',
      title: 'Own your digital presence',
      description: 'Websites, portfolios, and sustainable online identity for artists.',
    },
    {
      slug: 'ai-literacy-for-artists',
      title: 'AI literacy for artists',
      description: 'Creative risk, authorship, and practical workflows with AI tools.',
    },
    {
      slug: 'vibe-coding-and-net-art',
      title: 'Vibe Coding & Net Art',
      description: 'Experimental coding and network-native creative practice.',
    },
    {
      slug: 'creative-automation-for-artists',
      title: 'Creative automation for artists',
      description: 'Workflows that reduce drudgery without flattening creative judgment.',
    },
    {
      slug: 'digital-visibility-for-cultural-organizations',
      title: 'Digital visibility for cultural organizations',
      description: 'Clear public communication across web and physical touchpoints.',
    },
    {
      slug: 'documentation-and-archive-practices',
      title: 'Documentation & archive practices',
      description: 'Sustainable documentation for studios and programs.',
    },
  ],
  'public-programs': [
    { slug: 'talks', title: 'Talks', description: 'Salons and public conversations on digital culture.' },
    { slug: 'demos', title: 'Demos', description: 'Live demonstrations of tools and interfaces.' },
    { slug: 'clinics', title: 'Clinics', description: 'Drop-in support for digital presence questions.' },
    { slug: 'open-lab', title: 'Open lab', description: 'Experimental sessions and peer learning.' },
    {
      slug: 'community-sessions',
      title: 'Community sessions',
      description: 'Neighborhood-facing digital culture programming.',
    },
  ],
  'artist-support': [
    {
      slug: 'digital-audits',
      title: 'Digital audits',
      description: 'Structured review of how you show up online and on-site.',
    },
    {
      slug: 'website-strategy',
      title: 'Website strategy',
      description: 'Architecture and content strategy aligned to your practice.',
    },
    {
      slug: 'portfolio-and-visibility',
      title: 'Portfolio & visibility',
      description: 'Presentation layers that match how gatekeepers and publics actually browse.',
    },
    {
      slug: 'documentation-support',
      title: 'Documentation support',
      description: 'Workflows for capturing and publishing work over time.',
    },
    {
      slug: 'archive-and-presence-systems',
      title: 'Archive & presence systems',
      description: 'Long-lived structures for work, metadata, and access.',
    },
  ],
  'institutional-programs': [
    {
      slug: 'staff-training',
      title: 'Staff training',
      description: 'Digital culture literacy for teams managing public information.',
    },
    {
      slug: 'public-interface-pilots',
      title: 'Public interface pilots',
      description: 'Kiosks, signs, and maps tied to real update workflows.',
    },
    {
      slug: 'digital-presence-systems',
      title: 'Digital presence systems',
      description: 'Institutional web and screen layers that stay in sync.',
    },
    {
      slug: 'artist-centered-workflows',
      title: 'Artist-centered workflows',
      description: 'Portals and processes designed around how artists actually participate.',
    },
    {
      slug: 'smart-signage-programs',
      title: 'Smart signage programs',
      description: 'Updateable on-site communication aligned with programming.',
    },
  ],
};

for (const cat of PROGRAM_CATEGORIES) {
  pages.push(
    p({
      path: `/programs/${cat.slug}`,
      title: cat.title,
      description: cat.description,
      parent: '/programs',
      layout: 'program',
      programCategory: cat.slug,
    })
  );
  for (const leaf of PROGRAM_LEAVES[cat.slug]) {
    pages.push(
      p({
        path: `/programs/${cat.slug}/${leaf.slug}`,
        title: leaf.title,
        description: leaf.description,
        parent: `/programs/${cat.slug}`,
        layout: 'program',
        programCategory: cat.slug,
      })
    );
  }
}

const PROJECT_ENTRIES: {
  slug: string;
  title: string;
  description: string;
  kind: 'collection' | 'case';
  infra24Note?: string;
}[] = [
  {
    slug: 'public-interfaces',
    title: 'Public interfaces',
    description: 'Kiosks, signs, and civic-facing surfaces.',
    kind: 'collection',
  },
  {
    slug: 'artist-tools',
    title: 'Artist tools',
    description: 'Portals and workflows for artist-facing programs.',
    kind: 'collection',
  },
  {
    slug: 'institutional-systems',
    title: 'Institutional systems',
    description: 'Backbone systems for cultural organizations.',
    kind: 'collection',
  },
  {
    slug: 'pilots',
    title: 'Pilots',
    description: 'Limited-scope deployments that prove value before scale.',
    kind: 'collection',
  },
  {
    slug: 'research',
    title: 'Research',
    description: 'Experiments and prototypes in digital culture infrastructure.',
    kind: 'collection',
  },
  {
    slug: 'case-studies',
    title: 'Case studies',
    description: 'Narrative summaries of challenge, intervention, and outcomes.',
    kind: 'collection',
  },
  {
    slug: 'smart-signs',
    title: 'Smart signs',
    description: 'Updateable on-site screens tied to authoritative program data.',
    kind: 'case',
    infra24Note: 'Playlist and control-plane patterns from Infra24.',
  },
  {
    slug: 'smart-maps',
    title: 'Smart maps',
    description: 'Wayfinding and cultural mapping tied to live information.',
    kind: 'case',
    infra24Note: 'Resolver and display-plane components from Infra24.',
  },
  {
    slug: 'artist-portal',
    title: 'Artist portal',
    description: 'Self-serve access to requirements, schedules, and resources.',
    kind: 'case',
    infra24Note: 'Portal workflows scoped to institutional program structure.',
  },
  {
    slug: 'cultural-kiosk',
    title: 'Cultural kiosk',
    description: 'Public-facing kiosk layer for venues and corridors.',
    kind: 'case',
    infra24Note: 'Kiosk UX and update paths designed for staff maintainability.',
  },
  {
    slug: 'digital-lab-systems',
    title: 'Digital lab systems',
    description: 'Infrastructure for labs, residencies, and education programs.',
    kind: 'case',
    infra24Note: 'Operational tooling aligned to how labs actually run.',
  },
  {
    slug: 'miami-beach-pilot',
    title: 'Miami Beach pilot',
    description: 'Place-based prototype for public digital culture in Miami Beach.',
    kind: 'case',
    infra24Note: 'Miami-focused deployment and documentation.',
  },
  {
    slug: 'lincoln-road-pilot',
    title: 'Lincoln Road pilot',
    description: 'Corridor-scale cultural visibility and public interface concepts.',
    kind: 'case',
    infra24Note: 'Public-space activation patterns.',
  },
  /* Project pattern case studies (marketing-friendly slugs; legacy URLs redirect in next.config) */
  {
    slug: 'museum-scale-public-information',
    title: 'Museum-scale public information',
    description: 'Event and hours data unified for screens and maps.',
    kind: 'case',
    infra24Note: 'Single update path into signs and public map.',
  },
  {
    slug: 'program-heavy-nonprofit-portal',
    title: 'Program-heavy nonprofit',
    description: 'Artist-facing requirements surfaced outside PDFs and email.',
    kind: 'case',
    infra24Note: 'Resident portal tied to program structure.',
  },
  {
    slug: 'multi-venue-events-calendar',
    title: 'Multi-venue events calendar',
    description: 'One authoritative schedule, multiple public views.',
    kind: 'case',
    infra24Note: 'Workflow design across communications and programming.',
  },
];

for (const proj of PROJECT_ENTRIES) {
  pages.push(
    p({
      path: `/projects/${proj.slug}`,
      title: proj.title,
      description: proj.description,
      parent: '/projects',
      layout: 'project',
      projectKind: proj.kind,
      infra24Note: proj.infra24Note,
    })
  );
}

const PARTNER_SEGMENTS = [
  {
    slug: 'cultural-organizations',
    title: 'Cultural organizations',
    description: 'Museums, nonprofits, and presenter organizations.',
  },
  {
    slug: 'artists',
    title: 'Artists',
    description: 'Individual artists and collectives.',
  },
  {
    slug: 'schools-and-education',
    title: 'Schools & education',
    description: 'K–12, higher ed, and informal learning partners.',
  },
  {
    slug: 'civic-and-neighborhood',
    title: 'Civic & neighborhood',
    description: 'Civic tech, BIDs, and neighborhood anchors.',
  },
  {
    slug: 'space-partners',
    title: 'Space partners',
    description: 'Venues, storefronts, and sponsors hosting pilots.',
  },
] as const;

const PARTNER_INQUIRY = [
  {
    slug: 'host-a-workshop',
    title: 'Host a workshop',
    description: 'Partner with DCC Miami to host a workshop at your venue.',
  },
  {
    slug: 'host-a-pilot',
    title: 'Host a pilot',
    description: 'Pilot public interfaces, signage, or wayfinding with us.',
  },
  {
    slug: 'become-a-space-partner',
    title: 'Become a space partner',
    description: 'Offer underused space for programs or activations.',
  },
  {
    slug: 'sponsor-a-program',
    title: 'Sponsor a program',
    description: 'Sponsor workshops, public programs, or interfaces.',
  },
] as const;

for (const seg of PARTNER_SEGMENTS) {
  pages.push(
    p({
      path: `/partners/${seg.slug}`,
      title: seg.title,
      description: seg.description,
      parent: '/partners',
      layout: 'default',
    })
  );
}

for (const seg of PARTNER_INQUIRY) {
  pages.push(
    p({
      path: `/partners/${seg.slug}`,
      title: seg.title,
      description: seg.description,
      parent: '/partners',
      layout: 'default',
    })
  );
}

const JOURNAL_CATEGORIES = [
  { slug: 'essays', title: 'Essays' },
  { slug: 'field-notes', title: 'Field notes' },
  { slug: 'project-updates', title: 'Project updates' },
  { slug: 'workshop-notes', title: 'Workshop notes' },
  { slug: 'public-letters', title: 'Public letters' },
  { slug: 'interviews', title: 'Interviews' },
  { slug: 'miami', title: 'Miami' },
] as const;

const JOURNAL_POSTS: { category: (typeof JOURNAL_CATEGORIES)[number]['slug']; slug: string; title: string }[] =
  [
    {
      category: 'essays',
      slug: 'why-miami-needs-digital-culture-infrastructure',
      title: 'Why Miami needs digital culture infrastructure',
    },
    {
      category: 'essays',
      slug: 'what-is-artist-centered-digital-infrastructure',
      title: 'What is artist-centered digital infrastructure?',
    },
    {
      category: 'field-notes',
      slug: 'notes-from-a-public-interface-pilot',
      title: 'Notes from a public interface pilot',
    },
    {
      category: 'project-updates',
      slug: 'building-smart-signs-for-cultural-organizations',
      title: 'Building smart signs for cultural organizations',
    },
    {
      category: 'workshop-notes',
      slug: 'lessons-from-workshop-design-in-2026',
      title: 'Lessons from workshop design in 2026',
    },
    {
      category: 'miami',
      slug: 'why-digital-presence-is-cultural-infrastructure',
      title: 'Why digital presence is cultural infrastructure',
    },
  ];

for (const cat of JOURNAL_CATEGORIES) {
  pages.push(
    p({
      path: `/journal/${cat.slug}`,
      title: cat.title,
      description: `${cat.title} from Digital Culture Center Miami.`,
      parent: '/journal',
      layout: 'default',
    })
  );
}

for (const post of JOURNAL_POSTS) {
  pages.push(
    p({
      path: `/journal/${post.category}/${post.slug}`,
      title: post.title,
      description: post.title,
      parent: `/journal/${post.category}`,
      layout: 'default',
    })
  );
}

const CONTACT_AUDIENCES = [
  { slug: 'general', title: 'General inquiry' },
  { slug: 'partnerships', title: 'Partnerships' },
  { slug: 'funders', title: 'Funders & sponsors' },
  { slug: 'press', title: 'Press' },
  { slug: 'programs', title: 'Programs' },
  { slug: 'artist-support', title: 'Artist support' },
  {
    slug: 'artist-index',
    title: 'Artist index listing',
  },
] as const;

for (const a of CONTACT_AUDIENCES) {
  pages.push(
    p({
      path: `/contact/${a.slug}`,
      title: a.title,
      description: `Contact Digital Culture Center Miami — ${a.title}.`,
      parent: '/contact',
      layout: 'default',
    })
  );
}

const byPath = new Map<string, CdcPageDef>();
for (const page of pages) {
  byPath.set(page.path, page);
}

export function getCdcPageByPath(path: string): CdcPageDef | undefined {
  return byPath.get(path);
}

export type BreadcrumbItem = { href: string; label: string };

/** Human labels for path segments when no registry entry exists */
function segmentLabel(segment: string): string {
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Breadcrumbs from root to the given path (exclusive of home).
 */
export function getCdcBreadcrumbs(path: string): BreadcrumbItem[] {
  const def = byPath.get(path);
  if (!def) {
    const parts = path.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];
    let acc = '';
    for (const part of parts) {
      acc += `/${part}`;
      const d = byPath.get(acc);
      crumbs.push({ href: acc, label: d?.title ?? segmentLabel(part) });
    }
    return crumbs;
  }

  const chain: CdcPageDef[] = [];
  let current: CdcPageDef | undefined = def;
  while (current) {
    chain.unshift(current);
    current = current.parent ? byPath.get(current.parent) : undefined;
  }

  return chain.map((c) => ({ href: c.path, label: c.title }));
}

/** All registered marketing paths for sitemap (no trailing slash) */
export function getAllCdcPaths(): string[] {
  return [...byPath.keys()].sort();
}

export function getProgramCategories(): typeof PROGRAM_CATEGORIES {
  return PROGRAM_CATEGORIES;
}

export function getProgramCategorySlugs(): string[] {
  return PROGRAM_CATEGORIES.map((c) => c.slug);
}

export function getProgramLeaves(category: string) {
  return PROGRAM_LEAVES[category as keyof typeof PROGRAM_LEAVES] ?? [];
}

export function getProjectSlugs(): string[] {
  return PROJECT_ENTRIES.map((p) => p.slug);
}

export function getProjectEntry(slug: string) {
  return PROJECT_ENTRIES.find((p) => p.slug === slug);
}

export function getPartnerSegmentSlugs(): string[] {
  return [
    ...PARTNER_SEGMENTS.map((s) => s.slug),
    ...PARTNER_INQUIRY.map((s) => s.slug),
  ];
}

export function getJournalCategorySlugs(): string[] {
  return JOURNAL_CATEGORIES.map((c) => c.slug);
}

export function getJournalPostsForCategory(category: string) {
  return JOURNAL_POSTS.filter((p) => p.category === category);
}

export function getAllJournalPosts() {
  return JOURNAL_POSTS;
}

export function getContactAudienceSlugs(): string[] {
  return CONTACT_AUDIENCES.map((a) => a.slug);
}

/** Slugs for /infra24/[slug] (excludes index) */
export function getInfra24LeafSlugs(): string[] {
  return ['method', 'systems', 'case-studies', 'toolkit'];
}

export function getSupportPrioritySlugs(): string[] {
  return [...SUPPORT_PRIORITY_SLUGS];
}
