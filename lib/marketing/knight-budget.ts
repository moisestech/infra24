/**
 * Knight Cities Challenge — static budget narrative for `/knight/budget`.
 *
 * Totals: $400,000 pilot / $200,000 Knight Foundation request / $200,000 match & other support.
 * Reconcile line labels with the authoritative workbook before external submission.
 */

export const knightBudgetSummary = {
  totalProjectUsd: 400_000,
  knightFoundationAskUsd: 200_000,
  counterpartFundingUsd: 200_000,
  counterpartLabel: 'Match / in-kind / earned / sponsorship / partner support',
  pilotDurationMonths: 12,
  framingTitle: 'How $400,000 Becomes Cultural Infrastructure',
  framingLead:
    'A year-one pilot budget designed to turn funding into public programs, artist support, digital literacy, and a stronger network for Miami’s digital culture ecosystem.',
  dataNote:
    'Figures are static for web review. Reconcile line items with the authoritative workbook before any external submission.',
  sectionCopy: {
    fundingTitle: 'Knight as Anchor Funding',
    fundingBody: [
      'The Knight Foundation grant would provide the core funding needed to launch DCC as a one-year pilot. That support would make it possible to activate a broader network of matching value, including partner space, outreach support, sponsorships, earned workshop revenue, software credits, donated or upcycled equipment, and community investment.',
      'This structure allows the project to stay lean while increasing its reach. Every Knight dollar is designed to help activate additional resources, public participation, and long-term cultural value.',
    ],
    allocationTitle: 'Where the Budget Creates Value',
    allocationBody: [
      'The majority of the budget is directed toward public-facing activity: workshops, artist services, community calls, online programs, livestreams, monthly events, documentation, and network activation. Technology and analytics are included as the support layer that helps coordinate this work, measure participation, and make outcomes visible to partners, funders, and the public.',
      'This allocation reflects DCC’s core belief: the most valuable outcome is not just a platform, but a living network of artists, curators, funders, organizers, educators, and audiences.',
    ],
    impactFlowTitle: 'From Funding to Community Impact',
    impactFlowBody: [
      'DCC’s budget is designed as a flow from funding to participation to measurable cultural value. Funds support programs, artist services, infrastructure, documentation, and reporting. Those activities produce visible outcomes: artists served, workshops delivered, events attended, profiles created, opportunities circulated, and networks strengthened.',
      'This is the core strategy of the pilot: turn a one-year investment into a reusable cultural infrastructure model for Miami.',
    ],
    timelineTitle: 'How the Budget Moves Across the Year',
    timelineBody: [
      'The pilot is structured across four phases so that funding is deployed intentionally. The first months establish the systems, partnerships, and evaluation structure. The middle of the year focuses on programming, artist support, and network growth. The final phase turns the work into public documentation, reporting, and a sustainability strategy.',
    ],
    networkTitle: 'The 10x Goal: A Group of Groups',
    networkBody: [
      'DCC’s year-one goal is to directly support a focused group of artists while building a much larger network around them. The most valuable long-term asset is not only the money spent during the pilot, but the relationships, data, trust, and public visibility created through the process.',
      'A successful pilot should help Miami move from scattered digital support toward a visible network of artists, curators, funders, host organizations, educators, technologists, and audiences connected through recurring programs and shared infrastructure.',
    ],
    measurementTitle: 'How We Will Know It Worked',
    measurementBody: [
      'DCC is being built with measurement at the center. The artist CRM, funder portal, forms, website analytics, ticketing tools, and online learning systems will help track both in-person and online engagement.',
      'The goal is not just to count activity, but to understand whether artists are adopting digital literacy practices, participating repeatedly, improving their public-facing materials, connecting with opportunities, and becoming part of a larger cultural network.',
    ],
    publicValueTitle: 'What Miami Gets',
    publicValueBody: [
      'Miami gets more than a temporary program. The pilot creates a practical model for supporting artists in a cultural landscape where visibility, documentation, publishing, communication, and public participation increasingly happen through digital and hybrid channels.',
      'DCC helps artists become more prepared, connected, visible, and technically confident. It helps local organizations reach artists through shared programming and data-informed outreach. It helps funders see where participation is happening and what forms of support create measurable value.',
      'Most importantly, it helps Miami build the digital culture infrastructure it does not yet fully have: a connected layer between artists, audiences, institutions, funders, and public life.',
    ],
    detailTitle: 'Detailed Budget',
    detailIntro: [
      'The following budget summarizes how DCC plans to manage a $400,000 year-one pilot. Final allocations may be refined based on the confirmed grant agreement, partner commitments, in-kind support, and implementation needs.',
    ],
    detailTableQuote:
      'This budget is organized around public value, not only operational cost. Each category is tied to a program function and a measurable outcome.',
    closingTitle: 'A Pilot Built to Grow',
    closingBody: [
      'DCC’s first year is designed as a testable and measurable pilot. The budget supports immediate public programming while also building the infrastructure needed to keep learning, reporting, and growing. If successful, the model can expand through future funding, partner sites, earned programs, sponsorships, and deeper civic collaboration.',
      'The long-term goal is to help Miami become a stronger home for artists working in, with, and toward digital culture.',
    ],
  },
  sectionCallouts: {
    funding:
      'Knight funding serves as the anchor. The match layer expands the pilot into a broader cultural network.',
    allocation:
      'More than half of the budget directly supports public programs, artist participation, and community activation.',
    impactFlow:
      'The budget is not only funding events. It is funding the conditions for a network to grow.',
    network: 'The 10x goal is to turn direct artist support into a much larger cultural network.',
    timeline: 'The budget is tied to a realistic 12-month implementation plan.',
    measurement: 'DCC will report on growth throughout the year, not only after the pilot is over.',
    publicValue:
      'The budget turns into programs. Programs turn into relationships. Relationships turn into infrastructure.',
    closing:
      'This is how $400,000 becomes more than a grant. It becomes a network, a public program, and a foundation for Miami’s digital culture future.',
  },
} as const;

export const knightBudgetHeroIntro: readonly [string, string] = [
  'DCC’s year-one budget is designed to maximize public programming, artist participation, and network growth. The Knight Foundation request of $200,000 would serve as anchor funding for a larger $400,000 pilot, helping unlock an additional $200,000 through partner support, in-kind contributions, sponsorships, earned revenue, and community investment.',
  'The goal is not to build technology for its own sake. The goal is to use digital infrastructure to coordinate people, circulate opportunities, support artists, measure engagement, and make Miami’s digital culture ecosystem more visible, connected, and sustainable.',
];

export const knightBudgetEmphasis = {
  primaryStat: '56%+',
  primaryLabel:
    'directly supports public programs, artist participation, and network activation.',
  secondaryLine: '65%+ when documentation, livestream, and public storytelling are included.',
  supporting:
    'This budget is designed to maximize public value. Technology is the support layer; the primary investment is in people, programming, participation, and network growth.',
} as const;

export const knightBudgetFundingExamples = {
  knight: [
    'Public programs',
    'Artist support',
    'Documentation',
    'Measurement',
    'Program delivery',
  ],
  match: [
    'Partner spaces',
    'Workshop hosting',
    'Outreach',
    'Sponsorships',
    'Software credits',
    'Donated / upcycled equipment',
    'Earned workshops',
    'Community support',
  ],
} as const;

/** In-page jump rail for `/knight/budget` — order matches DOM section ids (scroll-spy). */
export type KnightBudgetNavItem = { readonly href: string; readonly label: string };

export const knightBudgetNavItems: readonly KnightBudgetNavItem[] = [
  { href: '#budget-top', label: 'Overview' },
  { href: '#overview', label: 'Snapshot' },
  { href: '#funding', label: 'Funding' },
  { href: '#allocation', label: 'Allocation' },
  { href: '#impact-flow', label: 'Impact' },
  { href: '#network', label: 'Network' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#measurement', label: 'Measure' },
  { href: '#public-value', label: 'Miami' },
  { href: '#detail', label: 'Detail' },
  { href: '#closing', label: 'Grow' },
  { href: '#transparency', label: 'CTA' },
];

export type KnightBudgetLine = {
  id: string;
  label: string;
  amountUsd: number;
  knightPortionUsd: number;
  note?: string;
};

export type KnightBudgetUseOfFundsCategory = {
  id: string;
  name: string;
  amountUsd: number;
  percentOfTotal: number;
  color: string;
  description: string;
  subitems: string[];
  outcomes: string[];
  lines: KnightBudgetLine[];
};

/** Six use-of-funds categories — totals $400,000; Knight portions sum to $200,000 */
export const knightBudgetUseOfFunds: KnightBudgetUseOfFundsCategory[] = [
  {
    id: 'public-programs',
    name: 'Public Programs, Workshops & Community Activation',
    amountUsd: 140_000,
    percentOfTotal: 35,
    color: '#22c55e',
    description:
      'This is the largest budget category because DCC is fundamentally a public culture project. These funds support recurring programs that bring artists, cultural workers, curators, funders, technologists, and audiences together around digital culture in Miami.',
    subitems: [
      'Monthly in-person programs at partner locations',
      'Online workshops and digital literacy sessions',
      'Weekly community calls',
      'Livestream public programs',
      'Guest speakers and facilitators',
      'Program production and coordination',
      'Community event materials',
      'Public-facing learning experiences',
    ],
    outcomes: [
      'Artists and audiences have recurring spaces to learn, connect, share work, and participate in Miami’s digital culture ecosystem.',
    ],
    lines: [
      {
        id: 'pp-workshops-school',
        label: 'Workshops, online school & community learning',
        amountUsd: 60_000,
        knightPortionUsd: 35_000,
      },
      {
        id: 'pp-events',
        label: 'In-person events & production',
        amountUsd: 45_000,
        knightPortionUsd: 22_000,
      },
      {
        id: 'pp-calls',
        label: 'Community calls & facilitation',
        amountUsd: 25_000,
        knightPortionUsd: 12_000,
      },
      {
        id: 'pp-speakers',
        label: 'Guest speakers & program support',
        amountUsd: 10_000,
        knightPortionUsd: 6_000,
      },
    ],
  },
  {
    id: 'artist-support',
    name: 'Artist Support, Stipends & Network Participation',
    amountUsd: 85_000,
    percentOfTotal: 21.25,
    color: '#8b5cf6',
    description:
      'DCC will provide direct support to artists working in, with, or toward digital culture. This includes one-on-one support, artist visibility improvements, digital documentation guidance, technical presentation planning, and participation support.',
    subitems: [
      'Artist digital support sessions',
      'Website and visibility audits',
      'Documentation and portfolio guidance',
      'Technical presentation support',
      'Artist stipends or participation support',
      'Accessibility and community support',
      'Curator-facing readiness',
      'Artist onboarding into the DCC network',
    ],
    outcomes: [
      'Artists leave with concrete improvements: stronger websites, clearer public materials, better documentation, improved digital confidence, and deeper connection to curators, funders, peers, and audiences.',
    ],
    lines: [
      {
        id: 'as-stipends',
        label: 'Stipends & participation support',
        amountUsd: 40_000,
        knightPortionUsd: 22_000,
      },
      {
        id: 'as-sessions',
        label: 'Support sessions & clinics',
        amountUsd: 25_000,
        knightPortionUsd: 13_000,
      },
      {
        id: 'as-network',
        label: 'Network participation & materials',
        amountUsd: 20_000,
        knightPortionUsd: 10_000,
      },
    ],
  },
  {
    id: 'leadership-ops',
    name: 'Program Leadership & Operations',
    amountUsd: 70_000,
    percentOfTotal: 17.5,
    /** Slate tone — readable on dark UI and on chart axes (avoids near-black on dark backgrounds). */
    color: '#64748b',
    description:
      'This category supports the people and coordination needed to deliver the pilot responsibly. DCC requires consistent leadership across partnerships, scheduling, program delivery, communications, budgeting, artist support, reporting, and technical implementation.',
    subitems: [
      'Project leadership',
      'Program coordination',
      'Partner communication',
      'Scheduling and logistics',
      'Workshop planning',
      'Community management',
      'Internal operations',
      'Strategic development',
    ],
    outcomes: [
      'The project has enough operational capacity to deliver consistent programming, maintain partner trust, support artists well, and stay accountable to the grant timeline.',
    ],
    lines: [
      {
        id: 'lo-leadership',
        label: 'Program leadership & delivery',
        amountUsd: 45_000,
        knightPortionUsd: 28_000,
      },
      {
        id: 'lo-coord',
        label: 'Operations & coordination',
        amountUsd: 15_000,
        knightPortionUsd: 7_000,
      },
      {
        id: 'lo-partners',
        label: 'Partner liaison & administration',
        amountUsd: 10_000,
        knightPortionUsd: 5_000,
      },
    ],
  },
  {
    id: 'crm-infra',
    name: 'CRM, Portal, Analytics & Digital Infrastructure',
    amountUsd: 45_000,
    percentOfTotal: 11.25,
    color: '#06b6d4',
    description:
      'DCC’s digital infrastructure helps make the network measurable and useful. The CRM, artist portal, funder portal, forms, notifications, and analytics systems allow DCC to track participation, circulate opportunities, measure engagement, and report outcomes over time.',
    subitems: [
      'Artist CRM',
      'Funder portal',
      'Artist portal',
      'Forms and intake systems',
      'Analytics dashboard',
      'Opportunity circulation',
      'Notifications and community updates',
      'Website infrastructure',
      'Data engineering and reporting workflows',
    ],
    outcomes: [
      'DCC can understand who is participating, what services are being used, which programs are working, and how the network is growing. This makes the project more accountable, fundable, and scalable.',
    ],
    lines: [
      {
        id: 'cr-crm-portal',
        label: 'CRM, portal & forms',
        amountUsd: 25_000,
        knightPortionUsd: 6_000,
      },
      {
        id: 'cr-analytics',
        label: 'Analytics & reporting infrastructure',
        amountUsd: 12_000,
        knightPortionUsd: 2_000,
      },
      {
        id: 'cr-integrations',
        label: 'Integrations, hosting slice & maintenance',
        amountUsd: 8_000,
        knightPortionUsd: 2_000,
      },
    ],
  },
  {
    id: 'documentation',
    name: 'Documentation, Media & Livestream Production',
    amountUsd: 35_000,
    percentOfTotal: 8.75,
    color: '#f97316',
    description:
      'Documentation turns the pilot into public memory. This category supports the recording, editing, publishing, and distribution of programs, artist stories, workshops, interviews, livestreams, and project outcomes.',
    subitems: [
      'Livestream production',
      'Video documentation',
      'Photography',
      'Editing and publishing',
      'Artist story capture',
      'Public program archives',
      'Case studies',
      'Social and web content',
      'Final reporting media',
    ],
    outcomes: [
      'The work does not disappear after each event. DCC creates a visible archive of Miami’s digital culture ecosystem that can support future funding, public engagement, and artist visibility.',
    ],
    lines: [
      {
        id: 'doc-live',
        label: 'Livestream & media production',
        amountUsd: 18_000,
        knightPortionUsd: 11_000,
      },
      {
        id: 'doc-story',
        label: 'Documentation & public storytelling',
        amountUsd: 12_000,
        knightPortionUsd: 6_000,
      },
      {
        id: 'doc-photo',
        label: 'Photography & asset production',
        amountUsd: 5_000,
        knightPortionUsd: 3_000,
      },
    ],
  },
  {
    id: 'admin',
    name: 'Admin, Bookkeeping, Compliance & Reporting',
    amountUsd: 25_000,
    percentOfTotal: 6.25,
    color: '#9ca3af',
    description:
      'Strong administration protects the project. This category supports the financial, legal, compliance, and reporting work required to manage grant funding responsibly.',
    subitems: [
      'Bookkeeping',
      'Accounting support',
      'Grant reporting',
      'Budget reconciliation',
      'Fiscal documentation',
      'Legal or contract review',
      'Insurance or compliance needs',
      'Final evaluation support',
    ],
    outcomes: [
      'The project remains transparent, compliant, and accountable to funders, partners, artists, and the public.',
    ],
    lines: [
      {
        id: 'ad-book',
        label: 'Bookkeeping & fiscal administration',
        amountUsd: 12_000,
        knightPortionUsd: 5_000,
      },
      {
        id: 'ad-compliance',
        label: 'Compliance & insurance',
        amountUsd: 8_000,
        knightPortionUsd: 3_000,
      },
      {
        id: 'ad-reporting',
        label: 'Grant reporting',
        amountUsd: 5_000,
        knightPortionUsd: 2_000,
      },
    ],
  },
];

export type KnightBudgetFundingRow = {
  id: string;
  label: string;
  amountUsd: number;
};

export const knightBudgetKnightAllocation: KnightBudgetFundingRow[] = [
  {
    id: 'kf-programs',
    label: 'Public programs, workshops, online school, community calls',
    amountUsd: 75_000,
  },
  {
    id: 'kf-artists',
    label: 'Artist support sessions, stipends, accessibility, participation',
    amountUsd: 45_000,
  },
  {
    id: 'kf-leadership',
    label: 'Program leadership and delivery',
    amountUsd: 40_000,
  },
  {
    id: 'kf-docs',
    label: 'Documentation, livestreams, public storytelling',
    amountUsd: 20_000,
  },
  {
    id: 'kf-crm',
    label: 'CRM / portal / analytics for measurement',
    amountUsd: 10_000,
  },
  {
    id: 'kf-admin',
    label: 'Admin, reporting, compliance',
    amountUsd: 10_000,
  },
];

export const knightBudgetMatchSources: KnightBudgetFundingRow[] = [
  {
    id: 'm-venues',
    label: 'Partner venue space, hosting, outreach, staff support',
    amountUsd: 50_000,
  },
  {
    id: 'm-earned',
    label: 'Earned workshops / online school revenue',
    amountUsd: 35_000,
  },
  {
    id: 'm-sponsor',
    label: 'Local sponsorships / institutional contributions',
    amountUsd: 35_000,
  },
  {
    id: 'm-equipment',
    label: 'Donated or discounted equipment, software, devices',
    amountUsd: 25_000,
  },
  {
    id: 'm-philanthropic',
    label: 'Additional philanthropic support / individual donors',
    amountUsd: 30_000,
  },
  {
    id: 'm-founder',
    label: 'In-kind founder labor / technical development beyond grant',
    amountUsd: 25_000,
  },
];

export type KnightBudgetImpactMetric = {
  id: string;
  name: string;
  target: string;
  description?: string;
};

/** Eight network targets — Option A metrics table */
export const knightBudgetImpactMetrics: KnightBudgetImpactMetric[] = [
  { id: 'partners', name: 'Partner organizations', target: '7–12' },
  { id: 'artists', name: 'Artists directly served', target: '100–150' },
  {
    id: 'workshops',
    name: 'Workshop / online school participants',
    target: '300–500',
  },
  { id: 'crm', name: 'CRM network contacts', target: '1,000+' },
  {
    id: 'attendance',
    name: 'Public event attendance',
    target: '1,000–2,500',
    description: 'In-person and online public program attendance.',
  },
  {
    id: 'livestream',
    name: 'Livestream / recorded program reach',
    target: '5,000–10,000',
  },
  {
    id: 'opportunities',
    name: 'Opportunities circulated',
    target: '50–100',
    description: 'Open calls, funding opportunities, partner opportunities, and digital culture resources shared.',
  },
  {
    id: 'profiles',
    name: 'Artist profiles / records created',
    target: '250–500',
  },
];

export type KnightBudgetPhase = {
  id: string;
  label: string;
  months: string;
  description: string;
  bullets: string[];
};

export const knightBudgetPhases: KnightBudgetPhase[] = [
  {
    id: 'p1',
    label: 'Setup + co-design',
    months: 'Months 1–2',
    description:
      'Partner confirmation, outreach, intake, CRM setup, evaluation design, and workshop planning foundations.',
    bullets: [
      'Partner confirmation',
      'Participant outreach',
      'Intake forms',
      'CRM setup',
      'Evaluation design',
      'Workshop planning',
    ],
  },
  {
    id: 'p2',
    label: 'Launch programming',
    months: 'Months 3–6',
    description:
      'Workshops, artist clinics, public programs, online school sessions, community calls, and livestreams.',
    bullets: [
      'Online workshops',
      'Artist support clinics',
      'Weekly community calls',
      'Monthly public programs',
      'Online school launch',
      'Livestream programming',
    ],
  },
  {
    id: 'p3',
    label: 'Refinement + deeper implementation',
    months: 'Months 7–10',
    description:
      'Expanded programming, reusable templates, analytics review, partner feedback, and opportunity circulation.',
    bullets: [
      'Program refinement',
      'Reusable templates',
      'Partner feedback',
      'CRM analytics review',
      'Network growth',
      'Opportunity circulation',
    ],
  },
  {
    id: 'p4',
    label: 'Evaluation + sustainability',
    months: 'Months 11–12',
    description:
      'Reporting, documentation, public sharing, sustainability plan, funding strategy, and next-year roadmap.',
    bullets: [
      'Final report',
      'Public documentation',
      'Case studies',
      'Sustainability plan',
      'Funding strategy',
      'Next-year roadmap',
    ],
  },
];

export type KnightBudgetMeasurementArea = {
  id: string;
  area: string;
  measures: string;
};

export const knightBudgetMeasurementAreas: KnightBudgetMeasurementArea[] = [
  {
    id: 'artist-support',
    area: 'Artist support',
    measures:
      'Artists served, sessions completed, websites audited, documentation plans created.',
  },
  {
    id: 'public-programs',
    area: 'Public programs',
    measures: 'Attendance, RSVPs, ticketing, repeat participation, partner-hosted events.',
  },
  {
    id: 'online-school',
    area: 'Online school',
    measures: 'Registrations, lesson views, completion, workshop participation.',
  },
  {
    id: 'livestreams',
    area: 'Livestreams',
    measures: 'Views, watch time, shares, archived program reach.',
  },
  {
    id: 'crm-network',
    area: 'CRM / network',
    measures:
      'Artist profiles, curator contacts, funder contacts, referrals, opportunity clicks.',
  },
  {
    id: 'community',
    area: 'Community engagement',
    measures:
      'Form submissions, newsletter engagement, group chat participation, feedback.',
  },
  {
    id: 'funding-readiness',
    area: 'Funding readiness',
    measures: 'Campaign engagement, funder portal visits, sponsorship leads.',
  },
  {
    id: 'reporting',
    area: 'Reporting',
    measures: 'Quarterly summaries, final report, case studies, public documentation.',
  },
];

export type KnightBudgetImpactFlowColumn = {
  title: string;
  items: { label: string; hint?: string }[];
};

export type KnightBudgetImpactNarrativeBlock = {
  title: string;
  body: string;
};

export const knightBudgetImpactFlow = {
  columns: [
    {
      title: 'Funding',
      items: [
        { label: 'Knight Foundation', hint: '$200,000' },
        { label: 'Match / other support', hint: '$200,000' },
      ],
    },
    {
      title: 'Budget categories',
      items: [
        { label: 'Public programs' },
        { label: 'Artist support' },
        { label: 'Leadership & operations' },
        { label: 'CRM / portal / analytics' },
        { label: 'Documentation & livestream' },
        { label: 'Admin & compliance' },
      ],
    },
    {
      title: 'Activities',
      items: [
        { label: 'Workshops' },
        { label: 'Artist clinics' },
        { label: 'Weekly calls' },
        { label: 'Monthly events' },
        { label: 'Livestreams' },
        { label: 'CRM & portals' },
        { label: 'Online school' },
        { label: 'Opportunity circulation' },
        { label: 'Documentation' },
        { label: 'Reporting' },
      ],
    },
    {
      title: 'Outcomes',
      items: [
        { label: 'Artists served' },
        { label: 'Digital literacy adoption' },
        { label: 'Public attendance' },
        { label: 'Network growth' },
        { label: 'Curator / funder engagement' },
        { label: 'Funding readiness' },
        { label: 'Miami digital culture visibility' },
      ],
    },
  ] satisfies KnightBudgetImpactFlowColumn[],
  narrativeBlocks: [
    {
      title: 'Funding becomes programs',
      body: 'Knight funding and matching support make it possible to run workshops, community calls, online school sessions, livestreams, and monthly public programs.',
    },
    {
      title: 'Programs become participation',
      body: 'Artists, cultural workers, curators, funders, students, technologists, and audiences participate through events, forms, portals, workshops, and public programs.',
    },
    {
      title: 'Participation becomes network growth',
      body: 'The CRM and artist portal help organize the people, relationships, opportunities, and feedback generated by the pilot.',
    },
    {
      title: 'Network growth becomes cultural infrastructure',
      body: 'Over time, DCC becomes more than a program calendar. It becomes a shared system for visibility, digital literacy, public connection, and cultural coordination.',
    },
  ] satisfies KnightBudgetImpactNarrativeBlock[],
  footnotes: [
    'Infrastructure dollars are sized to measure and sustain the public work—not to replace it.',
  ],
} as const;

export type KnightBudgetCategory = {
  id: string;
  title: string;
  intro?: string;
  lines: KnightBudgetLine[];
};

export const knightBudgetCategories: KnightBudgetCategory[] = knightBudgetUseOfFunds.map((c) => ({
  id: c.id,
  title: c.name,
  intro: c.description,
  lines: c.lines,
}));

function sumLines(getter: (line: KnightBudgetLine) => number): number {
  return knightBudgetCategories.reduce(
    (acc, cat) => acc + cat.lines.reduce((a, line) => a + getter(line), 0),
    0
  );
}

export const knightBudgetComputedTotals = {
  totalUsd: sumLines((l) => l.amountUsd),
  knightUsd: sumLines((l) => l.knightPortionUsd),
} as const;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function sumRows(rows: KnightBudgetFundingRow[]): number {
  return rows.reduce((a, r) => a + r.amountUsd, 0);
}

function assertKnightBudgetIntegrity(): void {
  const totalUse = knightBudgetUseOfFunds.reduce((a, c) => a + c.amountUsd, 0);
  const totalKnightLines = sumLines((l) => l.knightPortionUsd);
  const totalPilotLines = sumLines((l) => l.amountUsd);
  const knightAlloc = sumRows(knightBudgetKnightAllocation);
  const match = sumRows(knightBudgetMatchSources);

  const issues: string[] = [];
  if (totalUse !== knightBudgetSummary.totalProjectUsd) {
    issues.push(`useOfFunds sum ${totalUse} !== totalProjectUsd ${knightBudgetSummary.totalProjectUsd}`);
  }
  if (totalPilotLines !== knightBudgetSummary.totalProjectUsd) {
    issues.push(`line items pilot sum ${totalPilotLines} !== ${knightBudgetSummary.totalProjectUsd}`);
  }
  if (totalKnightLines !== knightBudgetSummary.knightFoundationAskUsd) {
    issues.push(`line items Knight sum ${totalKnightLines} !== ${knightBudgetSummary.knightFoundationAskUsd}`);
  }
  if (knightAlloc !== knightBudgetSummary.knightFoundationAskUsd) {
    issues.push(`knightBudgetKnightAllocation sum ${knightAlloc} !== ${knightBudgetSummary.knightFoundationAskUsd}`);
  }
  if (match !== knightBudgetSummary.counterpartFundingUsd) {
    issues.push(`knightBudgetMatchSources sum ${match} !== ${knightBudgetSummary.counterpartFundingUsd}`);
  }

  knightBudgetUseOfFunds.forEach((cat) => {
    const catTotal = cat.lines.reduce((a, l) => a + l.amountUsd, 0);
    const catKnight = cat.lines.reduce((a, l) => a + l.knightPortionUsd, 0);
    if (catTotal !== cat.amountUsd) {
      issues.push(`category ${cat.id}: lines total ${catTotal} !== category ${cat.amountUsd}`);
    }
    if (catKnight > cat.amountUsd) {
      issues.push(`category ${cat.id}: Knight portion ${catKnight} exceeds category total`);
    }
  });

  if (issues.length) {
    throw new Error(`[knight-budget] Integrity check failed:\n${issues.join('\n')}`);
  }
}

if (process.env.NODE_ENV !== 'production') {
  assertKnightBudgetIntegrity();
}
