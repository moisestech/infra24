/**
 * DCC Miami /institutions — institutional technology services.
 * Subject is DCC Miami / we. Moises Sanabria is founder/lead, not the page identity.
 * Do not list DCC Miami as its own client.
 */

import {
  DCC_WORKSHOPS_CATALOG,
  INSTITUTIONAL_CALENDLY_URL,
  INSTITUTIONAL_EMAIL,
  INSTITUTIONAL_SERVICES_AVAILABILITY,
  type LogoBandItem,
} from './shared';
import { media } from './media';

export type OrgRelationship =
  | 'lab'
  | 'residency'
  | 'employment'
  | 'exhibition'
  | 'workshop'
  | 'platform'
  | 'funder'
  | 'education'
  | 'festival';

export type InstitutionOrg = {
  id: string;
  name: string;
  location: string;
  relationship: OrgRelationship;
  relationshipLabel: string;
  summary: string;
  href?: string;
  external?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  archiveFeatured?: boolean;
};

export type InstitutionCaseStudy = {
  id: string;
  title: string;
  org: string;
  kind: 'systems' | 'program' | 'exhibition' | 'platform' | 'workshop';
  kindLabel: string;
  body: string;
  href: string;
  external?: boolean;
  imageSrc: string;
  imageAlt: string;
  featured?: boolean;
};

export type PracticeLaneAccent = 'web' | 'automation' | 'live' | 'lab';

export type PracticeLane = {
  id: string;
  index: string;
  title: string;
  description: string;
  solves: string;
  href: string;
  linkLabel: string;
  accent: PracticeLaneAccent;
  icon: 'database' | 'workflow' | 'radio' | 'flask';
  proofTags: string[];
  stack: LogoBandItem[];
};

export const ORG_RELATIONSHIP_LABELS: Record<OrgRelationship, string> = {
  lab: 'Employment · Lab operations',
  residency: 'Residency',
  employment: 'Employment',
  exhibition: 'Exhibition',
  workshop: 'Teaching / workshop',
  platform: 'Platform',
  funder: 'Funder context',
  education: 'Education',
  festival: 'Exhibition / festival',
};

const STACK = {
  salesforce: { alt: 'Salesforce' },
  wordpress: { alt: 'WordPress' },
  bloomerang: { alt: 'Bloomerang' },
  airtable: { src: media.airtableLogo.src, alt: media.airtableLogo.alt, height: 28 },
  n8n: { alt: 'n8n' },
  obs: { alt: 'OBS Studio' },
  aws: { alt: 'AWS' },
  github: { alt: 'GitHub' },
} as const satisfies Record<string, LogoBandItem>;

export const institutionsLogoBand: LogoBandItem[] = [
  STACK.salesforce,
  STACK.wordpress,
  STACK.bloomerang,
  STACK.airtable,
  STACK.n8n,
  STACK.obs,
  STACK.aws,
  STACK.github,
  { alt: 'Zoom' },
  { alt: 'YouTube' },
];

export const institutionsHub = {
  meta: {
    title: 'Digital Systems for Arts Institutions — DCC Miami',
    description:
      'Digital Culture Center Miami builds web, Salesforce, automation, livestreaming, and digital-lab systems for museums, arts organizations, and artist-facing programs.',
    url: 'https://dcc.miami/institutions',
  },
  logoBand: institutionsLogoBand,
  logoBandLabel: 'Institutional software and production tools',
  profile: {
    src: media.portraitMoises.src,
    alt: media.portraitMoises.alt,
    label: 'Profile',
  },
  hero: {
    eyebrow: 'Institutional technology · Miami',
    headline: 'Digital systems for museums, arts organizations, and artist-facing programs.',
    lead:
      'DCC Miami helps cultural organizations improve the systems behind their public programs—from websites, Salesforce, and operational automation to livestreaming, digital production, and creative-technology labs.',
    support:
      'Led by Moises Sanabria, with previous experience inside ICA Miami and recent technical direction at Oolite Arts, DCC can step into existing institutional environments quickly, reduce vendor handoffs, and move focused projects from diagnosis to implementation.',
    availability: INSTITUTIONAL_SERVICES_AVAILABILITY,
    availabilityLabel: 'Currently available · project-based + fractional engagements',
    primaryCta: {
      label: 'Discuss a project',
      href: INSTITUTIONAL_CALENDLY_URL,
      external: true,
    },
    secondaryCta: {
      label: 'View selected institutional work',
      href: '#work',
      external: false,
    },
    collage: {
      main: {
        src: media.digilab360.src,
        alt: media.digilab360.alt,
        caption: 'Oolite Digital Lab — operated environment for artist programs.',
      },
      teaching: {
        src: media.artTechCoding.src,
        alt: media.artTechCoding.alt,
        caption: 'Creative-coding workshop in use.',
      },
      workflow: {
        src: media.n8nDiagram.src,
        alt: media.n8nDiagram.alt,
        caption: 'Automation workflow — human review built in.',
      },
      captionCard: 'ICA Miami · Digital Producer · 2019–2020',
    },
  },
  nav: [
    { id: 'top', label: 'Overview' },
    { id: 'services', label: 'Services' },
    { id: 'system', label: 'System' },
    { id: 'work', label: 'Selected work' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'engage', label: 'Engage' },
    { id: 'archive', label: 'Experience' },
  ],
  proof: {
    eyebrow: 'Institutional context',
    items: [
      {
        id: 'ica',
        name: 'ICA Miami',
        role: 'Digital Producer',
        dates: '2019–2020',
        href: 'https://moises.tech/ica-miami',
        external: true,
      },
      {
        id: 'oolite',
        name: 'Oolite Arts',
        role: 'Technical Director of Digital',
        dates: '2025–2026',
        href: 'https://moises.tech/oolite-arts',
        external: true,
      },
      {
        id: 'bakehouse',
        name: 'Bakehouse Art Complex',
        role: 'Studio 43 · institutional systems',
        dates: 'Active',
        href: 'https://moises.tech/bakehouse',
        external: true,
      },
      {
        id: 'locust',
        name: 'Locust Projects',
        role: 'Public workshop · The Art of AI Agents',
        dates: '2026',
        href: DCC_WORKSHOPS_CATALOG,
        external: false,
      },
    ],
  },
  lanes: [
    {
      id: 'web-salesforce',
      index: '01',
      title: 'Web and Salesforce systems',
      description:
        'Website management, CMS support, Salesforce integrations, registration and membership workflows, forms, analytics, search, and SEO.',
      solves: 'Keeps public sites, CRM data, and registration in one maintainable system.',
      href: '#work-ica',
      linkLabel: 'ICA systems case study',
      accent: 'web' as const,
      icon: 'database' as const,
      proofTags: ['ICA Miami', 'WordPress', 'Salesforce', 'GraphQL', 'AWS CloudFront', 'Registration'],
      stack: [STACK.salesforce, STACK.wordpress, STACK.bloomerang, STACK.aws],
    },
    {
      id: 'automation-operations',
      index: '02',
      title: 'Automation and digital operations',
      description:
        'Reporting, intake, booking, communications, documentation, and repetitive administrative workflows designed with human review and handoff.',
      solves: 'Removes repetitive handoffs so staff time goes back to programs.',
      href: '#work-bakehouse',
      linkLabel: 'Bakehouse systems',
      accent: 'automation' as const,
      icon: 'workflow' as const,
      proofTags: ['Airtable', 'n8n / Make', 'APIs', 'Structured outputs', 'Documentation'],
      stack: [STACK.airtable, STACK.n8n],
    },
    {
      id: 'livestream-production',
      index: '03',
      title: 'Livestreaming and digital production',
      description:
        'Public programs, member events, webinars, OBS production, captioning, hybrid events, and reusable media workflows.',
      solves: 'Makes public programs reach remote audiences without a new vendor every time.',
      href: '#work-ica',
      linkLabel: 'ICA digital production',
      accent: 'live' as const,
      icon: 'radio' as const,
      proofTags: ['ICA Miami Channel', 'OBS', 'Zoom webinars', 'Captions', 'YouTube', 'After Effects'],
      stack: [STACK.obs],
    },
    {
      id: 'digital-labs-programs',
      index: '04',
      title: 'Digital labs and artist programs',
      description:
        'Technical infrastructure, equipment planning, fabrication workflows, workshops, documentation, and artist support.',
      solves: 'Turns a room of tools into an artist-facing program that staff can keep running.',
      href: '#work-oolite',
      linkLabel: 'Oolite Digital Lab',
      accent: 'lab' as const,
      icon: 'flask' as const,
      proofTags: ['Oolite Arts', '3D printing', '3D scanning', 'VR', 'Laser cutting', 'Creative coding'],
      stack: [],
    },
  ] satisfies PracticeLane[],
  system: {
    eyebrow: 'Operating method',
    title: 'Need → system → use → evidence → continued capacity',
    caption: 'The deliverable is not only the tool. It is the organization’s ability to keep using it.',
    callout:
      'At Oolite, equipment, workshops, open-lab support, documentation, and artist access operated as one connected program. That same logic can be adapted to web systems, Salesforce workflows, public media, or institutional AI.',
    steps: [
      { id: 'listen', title: 'Listen', body: 'Map institutional, staff, artist, and audience needs.' },
      { id: 'connect', title: 'Connect', body: 'Align existing space, software, hardware, and people.' },
      { id: 'build', title: 'Build', body: 'Ship a workflow, platform, program, or production system.' },
      { id: 'adopt', title: 'Adopt', body: 'Support staff and artists through use, teaching, and iteration.' },
      { id: 'document', title: 'Document', body: 'Leave reusable systems and institutional memory.' },
    ],
  },
  flagship: [
    {
      id: 'oolite',
      slug: 'oolite-arts',
      institution: 'Oolite Arts',
      headline: 'From a room of tools to an artist-facing digital program.',
      role: 'Technical Director of Digital',
      dates: '2025–2026',
      statusLabel: 'Operated / delivered',
      summary:
        'Technical direction connecting lab infrastructure, operations, booking, workshops, fabrication, vendors, and documentation into one artist-facing program.',
      proofSequence: [
        { stage: 'Need', text: 'A new lab, tools, and an artist-support mandate.' },
        {
          stage: 'Intervention',
          text: 'Layout, equipment and software readiness, workshops, open lab, vendor coordination, fabrication workflows, documentation.',
        },
        {
          stage: 'Adoption',
          text: 'Published open-lab days, English and Spanish support, workshops, consultations, and return visits.',
        },
        { stage: 'Capacity', text: 'Documented workflows and a reusable institutional model.' },
      ],
      facts: [
        { value: 'Tue / Thu', label: 'Published open-lab days' },
        { value: '10–5', label: 'Published hours' },
        { value: 'EN / ES', label: 'Language support' },
        { value: '10', label: 'Artist Website workshop capacity' },
        { value: '8', label: 'Resin workshop capacity' },
      ],
      media: [
        { src: media.digilab360.src, alt: media.digilab360.alt },
        { src: media.artTechCoding.src, alt: media.artTechCoding.alt },
        { src: media.resin2026.src, alt: media.resin2026.alt },
      ],
      href: 'https://moises.tech/oolite-arts',
      cta: 'Open Oolite case study',
    },
    {
      id: 'ica',
      slug: 'ica-miami',
      institution: 'ICA Miami',
      headline: 'Connecting museum data, public programming, and digital audiences.',
      role: 'Digital Producer',
      dates: 'October 2019–December 2020',
      statusLabel: 'Employment / operated',
      summary:
        'Salesforce-to-WordPress workflows, ticketing, website management, livestreaming, interactive video, cloud infrastructure, SEO, and vendor coordination.',
      proofSequence: [
        {
          stage: 'Need',
          text: 'Digital autonomy, faster updates, connected collection and program data, remote programs.',
        },
        {
          stage: 'Intervention',
          text: 'Web and data integration, vendor coordination, streaming workflows, captioning, forms, reporting, and production.',
        },
        {
          stage: 'Adoption',
          text: 'Cross-department use across development, external affairs, education, curatorial, and programs.',
        },
        { stage: 'Capacity', text: 'Lower vendor friction and reusable public-program workflows.' },
      ],
      facts: [
        { value: 'Salesforce', label: 'Collection data → WordPress / ticketing' },
        { value: 'WordPress', label: 'Site management, GitHub, GraphQL, CloudFront' },
        { value: 'OBS', label: 'Livestreaming, YouTube, captions, After Effects' },
      ],
      media: [{ src: media.icaNotions.src, alt: media.icaNotions.alt }],
      href: 'https://moises.tech/ica-miami',
      cta: 'Open ICA systems case study',
    },
    {
      id: 'bakehouse',
      slug: 'bakehouse',
      institution: 'Bakehouse Art Complex',
      headline: 'Building artist-owned infrastructure inside an existing creative community.',
      role: 'Studio 43 resident · institutional systems',
      dates: 'Ongoing',
      statusLabel: 'Mixed — labeled by module',
      summary:
        'SmartSigns, kiosk infrastructure, artist-facing systems, and portal planning—with shipped work separated from proposed work.',
      proofSequence: [
        {
          stage: 'Need',
          text: 'Make artist and program activity visible without recurring ad-hoc file drops.',
        },
        {
          stage: 'Intervention',
          text: 'Reusable vertical display formats, device and content workflow, portal and governance planning.',
        },
        { stage: 'Adoption', text: 'Active operational coordination and handoff in progress.' },
        {
          stage: 'Capacity',
          text: 'A future shared content model across screens, portal, programs, and staff workflows.',
        },
      ],
      facts: [
        { value: 'Shipped', label: 'SmartSigns + Raspberry Pi / Anthias displays' },
        { value: 'Proposed', label: 'Artist Portal on Assembly' },
        { value: 'Future', label: 'Connected digital lab and communications partnership' },
      ],
      modules: [
        {
          status: 'shipped' as const,
          label: 'Shipped / active implementation',
          text: 'SmartSigns and Raspberry Pi / Anthias display infrastructure.',
        },
        { status: 'proposed' as const, label: 'Proposed', text: 'Artist Portal on Assembly.' },
        {
          status: 'proposed' as const,
          label: 'Future opportunity',
          text: 'Connected digital lab, communications, and programming partnership.',
        },
      ],
      media: [
        {
          src: media.bakehouseOpenStudios.src,
          alt: media.bakehouseOpenStudios.alt,
        },
      ],
      href: 'https://moises.tech/bakehouse',
      cta: 'Open Bakehouse systems case study',
    },
  ],
  additionalEvidence: [
    {
      id: 'locust-ai-agents',
      title: 'The Art of AI Agents',
      org: 'Locust Projects',
      kind: 'workshop',
      kindLabel: 'Workshop',
      body: 'Public workshop and talk on artist task automation, agents, and human review—delivered in a Miami contemporary art context.',
      href: DCC_WORKSHOPS_CATALOG,
      imageSrc: media.locustAiAgents.src,
      imageAlt: media.locustAiAgents.alt,
    },
    {
      id: 'infra24',
      title: 'Infra24 — public interfaces',
      org: 'Product',
      kind: 'platform',
      kindLabel: 'Systems product',
      body: 'Updateable public communication systems for cultural organizations—smart signage, wayfinding, kiosks, portals, and workflows staff can maintain.',
      href: '/infra24',
      imageSrc: media.dccScreenshot.src,
      imageAlt: media.dccScreenshot.alt,
    },
    {
      id: 'ai24-studio',
      title: 'AI24 — cultural R&D and literacy',
      org: 'AI24',
      kind: 'program',
      kindLabel: 'Program · Platform',
      body: 'AI literacy, tools, and cultural R&D systems for artists and institutions—education, prototypes, and public-facing programs.',
      href: 'https://moises.tech/ai24',
      external: true,
      imageSrc: media.ai24Hero.src,
      imageAlt: media.ai24Hero.alt,
    },
    {
      id: 'munag-continuum',
      title: 'CONTINUUM — Smart Shoppers',
      org: 'MUNAG · Fundación Paiz',
      kind: 'exhibition',
      kindLabel: 'Exhibition',
      body: 'International museum exhibition of Smart Shoppers / Price of Existence—cognition staged as consumer product within CONTINUUM.',
      href: 'https://moises.tech/art/smart-shoppers',
      external: true,
      imageSrc: media.smartShoppers.src,
      imageAlt: 'Smart Shoppers — CONTINUUM exhibition work',
    },
    {
      id: 'chroma-touch-grass',
      title: 'Touch Grass / Doomscrolling',
      org: 'Chroma Art Film Festival · Superblue',
      kind: 'exhibition',
      kindLabel: 'Festival install',
      body: 'Public festival installation staging attention, bodies, and platform governance.',
      href: 'https://moises.tech/art/doomscrolling_treadmill',
      external: true,
      imageSrc: media.touchGrass.src,
      imageAlt: media.touchGrass.alt,
    },
    {
      id: 'momus-technofetishism',
      title: 'Technofetishism',
      org: 'MOMus — Thessaloniki',
      kind: 'exhibition',
      kindLabel: 'Exhibition',
      body: 'International exhibition at MOMus Experimental Center for the Arts.',
      href: 'https://moises.tech/calendar/exhibitions',
      external: true,
      imageSrc: media.momus.src,
      imageAlt: media.momus.alt,
    },
  ] satisfies InstitutionCaseStudy[],
  process: {
    eyebrow: 'How work begins',
    title: 'Review, then build, then leave it usable',
    reassurance: [
      'Works with existing tools',
      'Human review for AI/automation',
      'Clear shipped / proposed labeling',
      'Documentation included',
      'Scope and ownership defined',
    ],
    steps: [
      {
        id: 'review',
        title: 'Technical review',
        body: 'Map tools, owners, handoffs, bottlenecks, permissions, and current costs. Define what should be repaired, automated, connected, or left alone.',
      },
      {
        id: 'build',
        title: 'Build',
        body: 'Deliver a focused implementation with clear scope, review gates, evidence, and practical staff involvement.',
      },
      {
        id: 'support',
        title: 'Support and handoff',
        body: 'Document the system, train the people using it, measure adoption, and establish the next maintenance rhythm.',
      },
    ],
  },
  engagement: {
    eyebrow: 'Start with the right scope',
    title: 'Three ways to begin',
    lead: 'Tell us what is slowing your team down.',
    modes: [
      {
        id: 'review',
        title: 'Technical review',
        duration: '2–4 weeks',
        outcome:
          'System map, bottleneck analysis, risk list, prioritized roadmap, and implementation options.',
        bestFor:
          'Institutions unsure whether the problem is the website, CRM, workflow, vendor structure, or ownership.',
      },
      {
        id: 'project',
        title: 'Focused project',
        duration: '4–12 weeks',
        outcome:
          'One clearly defined system, integration, workflow, public program, or technical production setup—shipped and documented.',
        bestFor: 'A known bottleneck with a bounded owner and a shippable artifact.',
      },
      {
        id: 'fractional',
        title: 'Fractional support',
        duration: 'Monthly / term-based',
        outcome:
          'Ongoing webmaster, automation, digital production, or technical leadership embedded alongside staff and vendors.',
        bestFor: 'Teams that need continuity without a full-time hire or another vendor handoff.',
      },
    ],
    primaryCta: {
      label: 'Schedule a 20-minute conversation',
      href: INSTITUTIONAL_CALENDLY_URL,
    },
    secondaryCta: {
      label: 'Email DCC Miami',
      href: `mailto:${INSTITUTIONAL_EMAIL}`,
    },
  },
  contact: {
    headline:
      'A website problem is often a workflow problem. A workflow problem is often an ownership problem. Let’s map the system.',
    body: 'DCC Miami is currently available for focused projects, technical reviews, institutional workshops, and fractional digital support in Miami and remotely.',
    image: {
      src: media.portraitMoises.src,
      alt: media.portraitMoises.alt,
    },
    cvHref: 'https://moises.tech/cv/tech',
    email: INSTITUTIONAL_EMAIL,
  },
  artBand: {
    title: 'Cultural judgment is part of the technical work.',
    body: 'The founder’s artistic practice on moises.tech keeps the systems work accountable to the cultural questions institutions actually hold: authorship, attention, labor, access, value, and the public meaning of technology.',
    items: [
      {
        src: media.smartShoppers.src,
        alt: 'Smart Shoppers sculpture',
        href: 'https://moises.tech/art/smart-shoppers',
        label: 'Smart Shoppers / CONTINUUM · MUNAG',
      },
      {
        src: media.touchGrass.src,
        alt: 'Touch Grass / Doomscrolling installation',
        href: 'https://moises.tech/art/doomscrolling_treadmill',
        label: 'Touch Grass · Chroma / Superblue',
      },
      {
        src: media.momus.src,
        alt: 'Technofetishism at MOMus',
        href: 'https://moises.tech/calendar/exhibitions',
        label: 'Technofetishism · MOMus',
      },
      {
        src: media.afirme.src,
        alt: 'Algoritmica Intima exhibition',
        href: 'https://moises.tech/calendar/exhibitions',
        label: 'Algoritmica Intima · Mexico City',
      },
    ],
  },
  organizations: [
    {
      id: 'oolite',
      name: 'Oolite Arts',
      location: 'Miami Beach, FL',
      relationship: 'lab',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.lab,
      summary:
        'Technical Director of Digital — Knight-supported Digital Lab: workshops, fabrication, documentation, and artist support. With Director of Digital Lab Fabiola Larios first, then Moises Sanabria as Technical Director of Digital.',
      href: 'https://moises.tech/oolite-arts',
      imageSrc: media.digilab360.src,
      imageAlt: media.digilab360.alt,
      archiveFeatured: true,
    },
    {
      id: 'ica',
      name: 'Institute of Contemporary Art, Miami',
      location: 'Miami, FL',
      relationship: 'employment',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.employment,
      summary:
        'Digital Producer (2019–2020): Salesforce–WordPress workflows, website management, livestreaming, SEO, and vendor coordination.',
      href: 'https://moises.tech/ica-miami',
      archiveFeatured: true,
    },
    {
      id: 'bakehouse',
      name: 'Bakehouse Art Complex',
      location: 'Miami, FL',
      relationship: 'residency',
      relationshipLabel: 'Residency · institutional systems',
      summary:
        'Studio 43 residency; SmartSigns / Anthias display systems; open studios; proposed Artist Portal on Assembly.',
      href: 'https://moises.tech/bakehouse',
      imageSrc: media.bakehouseStudio.src,
      imageAlt: media.bakehouseStudio.alt,
      archiveFeatured: true,
    },
    {
      id: 'locust',
      name: 'Locust Projects',
      location: 'Miami, FL',
      relationship: 'workshop',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.workshop,
      summary: 'Public workshops and talks including The Art of AI Agents / Artist in the Automation.',
      href: DCC_WORKSHOPS_CATALOG,
      imageSrc: media.locustAiAgents.src,
      imageAlt: media.locustAiAgents.alt,
      archiveFeatured: true,
    },
    {
      id: 'mdc-idea',
      name: 'MDC Idea Center',
      location: 'Miami, FL',
      relationship: 'education',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.education,
      summary: 'AI Sprint for Artists — workshop and education partnership.',
      href: DCC_WORKSHOPS_CATALOG,
      archiveFeatured: true,
    },
    {
      id: 'knight',
      name: 'John S. and James L. Knight Foundation',
      location: 'Miami / national',
      relationship: 'funder',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.funder,
      summary:
        'Funder of Oolite Arts Digital Lab; related civic-technology and proposal work archived on site. Not a direct employer.',
      href: '/grants',
      imageSrc: media.digilab360.src,
      imageAlt: media.digilab360.alt,
    },
    {
      id: 'museum-of-sex',
      name: 'Museum of Sex Miami',
      location: 'Miami, FL',
      relationship: 'exhibition',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.exhibition,
      summary: 'F*ck Art: Nature & Artifice — Taste the Algorithm.',
      href: 'https://moises.tech/calendar/exhibitions',
    },
    {
      id: 'munag',
      name: 'MUNAG — National Museum of Art of Guatemala',
      location: 'Guatemala',
      relationship: 'exhibition',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.exhibition,
      summary: 'CONTINUUM — Smart Shoppers and The Price of Existence (with collaborators).',
      href: 'https://moises.tech/art/smart-shoppers',
      imageSrc: media.smartShoppers.src,
      imageAlt: media.smartShoppers.alt,
    },
    {
      id: 'paiz',
      name: 'Fundación Paiz',
      location: 'Guatemala',
      relationship: 'exhibition',
      relationshipLabel: 'Exhibition partner',
      summary: 'Support / partner context for CONTINUUM exhibition work.',
      href: 'https://moises.tech/art/smart-shoppers',
      imageSrc: media.smartShoppers.src,
      imageAlt: 'CONTINUUM exhibition context',
    },
    {
      id: 'momus',
      name: 'MOMus',
      location: 'Thessaloniki, Greece',
      relationship: 'exhibition',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.exhibition,
      summary: 'Technofetishism — MOMus Experimental Center for the Arts.',
      href: 'https://moises.tech/calendar/exhibitions',
      imageSrc: media.momus.src,
      imageAlt: media.momus.alt,
    },
    {
      id: 'chroma',
      name: 'Chroma Art Film Festival',
      location: 'Miami, FL',
      relationship: 'festival',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.festival,
      summary: 'Touch Grass / Doomscrolling public festival install.',
      href: 'https://moises.tech/art/doomscrolling_treadmill',
      imageSrc: media.touchGrass.src,
      imageAlt: media.touchGrass.alt,
    },
    {
      id: 'superblue',
      name: 'Superblue',
      location: 'Miami, FL',
      relationship: 'festival',
      relationshipLabel: 'Festival venue',
      summary: 'Host context for Chroma / Touch Grass festival presentation.',
      href: 'https://moises.tech/art/doomscrolling_treadmill',
      imageSrc: media.touchGrass.src,
      imageAlt: 'Festival install context',
    },
    {
      id: 'transmediale',
      name: 'transmediale',
      location: 'Berlin, Germany',
      relationship: 'exhibition',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.exhibition,
      summary: 'Dark Drives / Incompatible (2012, ART404) — archival exhibition credit.',
      href: 'https://moises.tech/calendar/exhibitions',
    },
    {
      id: 'hkw',
      name: 'Haus der Kulturen der Welt (HKW)',
      location: 'Berlin, Germany',
      relationship: 'exhibition',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.exhibition,
      summary: 'International presentation context with transmediale.',
      href: 'https://moises.tech/calendar/exhibitions',
    },
    {
      id: 'afirme',
      name: 'Centro Cultural Afirme',
      location: 'Mexico City, Mexico',
      relationship: 'exhibition',
      relationshipLabel: ORG_RELATIONSHIP_LABELS.exhibition,
      summary: 'Algoritmica Intima: Runtime (2025).',
      href: 'https://moises.tech/calendar/exhibitions',
      imageSrc: media.afirme.src,
      imageAlt: media.afirme.alt,
    },
    {
      id: 'postmasters',
      name: 'Postmasters Gallery',
      location: 'New York, NY',
      relationship: 'exhibition',
      relationshipLabel: 'Screening',
      summary: 'Low Resolution screening (2024).',
      href: 'https://moises.tech/calendar/exhibitions',
      imageSrc: media.transmediale.src,
      imageAlt: media.transmediale.alt,
    },
    {
      id: 'cooper',
      name: 'The Cooper Union',
      location: 'New York, NY',
      relationship: 'education',
      relationshipLabel: 'Education',
      summary: 'BFA; early exhibition context (F* Real Life, 2015).',
      href: 'https://moises.tech/bio',
    },
    {
      id: 'sfpc',
      name: 'School for Poetic Computation',
      location: 'New York, NY',
      relationship: 'education',
      relationshipLabel: 'Education',
      summary: '2013 cohort — computational art and poetic systems.',
      href: 'https://moises.tech/bio',
    },
    {
      id: 'nwsa',
      name: 'New World School of the Arts',
      location: 'Miami, FL',
      relationship: 'education',
      relationshipLabel: 'Education · Alumni',
      summary:
        'Alum (2009–2011). Natural fit for guest workshops, visiting artist sessions, and creative-technology curriculum with Visual Arts.',
      href: DCC_WORKSHOPS_CATALOG,
    },
  ] satisfies InstitutionOrg[],
  honestyNote:
    'Listed through employment, residency, lab operations, workshops, exhibitions, platform builds, education, or funder credits documented on this site. Application-only relationships are not listed.',
  icaNotions: {
    src: media.icaNotions.src,
    alt: media.icaNotions.alt,
    caption: 'Later exhibition context — not visual evidence of the 2019–2020 Digital Producer role.',
  },
} as const;
