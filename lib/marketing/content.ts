/**
 * Marketing site copy (single source of truth).
 * Public narrative: Digital Culture Center Miami (DCC.miami). Implementation layer: Infra24.
 */

import type { WebcoreIconName } from '@/components/marketing/webcore-lucide';
import type { MarketingGradientId } from '@/lib/marketing/marketing-gradients';
import {
  dccHeroRotatingSubheads,
  dccPilotHomeHero,
  dccPilotSeoDescription,
  dccPilotWhatWeAreBlurb,
} from '@/lib/marketing/dcc-pilot-home-content';

/** Lockup line — header + hero (place + public digital culture). */
export const publicDigitalMiamiLine = 'PUBLIC DIGITAL MIAMI' as const;

export type MarketingHeroSubheadSegment =
  | { readonly kind: 'text'; readonly text: string }
  | {
      readonly kind: 'term';
      readonly text: string;
      readonly preview: { readonly gradientId: MarketingGradientId; readonly alt: string };
      readonly caption?: string;
    };

/** Homepage hero description as plain text + interactive key terms (images on hover/tap). */
export const marketingHeroSubheadSegments = [
  { kind: 'text', text: 'A ' },
  {
    kind: 'term',
    text: 'Miami-based',
    caption: 'Place-based pilot in civic corridors',
    preview: {
      gradientId: 'stackTeal',
      alt: 'Teal gradient suggesting place-based civic signal.',
    },
  },
  { kind: 'text', text: ' platform for ' },
  {
    kind: 'term',
    text: 'artists',
    caption: 'Workshops, clinics, and experimental learning',
    preview: {
      gradientId: 'columnCoral',
      alt: 'Warm gradient suggesting artist-centered energy.',
    },
  },
  { kind: 'text', text: ', ' },
  {
    kind: 'term',
    text: 'public learning',
    caption: 'Programs that build literacy in the open',
    preview: {
      gradientId: 'fieldViolet',
      alt: 'Violet field gradient suggesting open learning.',
    },
  },
  { kind: 'text', text: ', and ' },
  {
    kind: 'term',
    text: 'civic-facing',
    caption: 'Interfaces the public actually encounters',
    preview: {
      gradientId: 'meshSlate',
      alt: 'Slate mesh gradient suggesting institutional surfaces.',
    },
  },
  { kind: 'text', text: ' ' },
  {
    kind: 'term',
    text: 'digital culture infrastructure',
    caption: 'Systems, not one-off installs',
    preview: {
      gradientId: 'pulseMagenta',
      alt: 'Magenta pulse gradient suggesting networked infrastructure.',
    },
  },
  { kind: 'text', text: '—' },
  {
    kind: 'term',
    text: 'workshops',
    caption: 'Hands-on skill building',
    preview: {
      gradientId: 'warmAmber',
      alt: 'Amber gradient suggesting hands-on workshop space.',
    },
  },
  { kind: 'text', text: ', ' },
  {
    kind: 'term',
    text: 'public programs',
    caption: 'Events and offerings made legible',
    preview: {
      gradientId: 'deepInk',
      alt: 'Deep ink gradient suggesting program schedules and legibility.',
    },
  },
  { kind: 'text', text: ', ' },
  {
    kind: 'term',
    text: 'artist support',
    caption: 'Visibility tools and pathways',
    preview: {
      gradientId: 'signalCyan',
      alt: 'Cyan signal gradient suggesting visibility and support tools.',
    },
  },
  { kind: 'text', text: ', and ' },
  {
    kind: 'term',
    text: 'updateable public interfaces',
    caption: 'Signs, maps, kiosks, portals—kept current',
    preview: {
      gradientId: 'roseMist',
      alt: 'Rose mist gradient suggesting public-facing interfaces.',
    },
  },
  { kind: 'text', text: '. ' },
  {
    kind: 'term',
    text: 'Infra24',
    caption: 'Implementation methodology behind DCC Miami pilots',
    preview: {
      gradientId: 'indigoHaze',
      alt: 'Indigo haze gradient suggesting systems methodology.',
    },
  },
  { kind: 'text', text: ' is the systems methodology that makes this work ' },
  {
    kind: 'term',
    text: 'repeatable',
    caption: 'Patterns other partners can adopt',
    preview: {
      gradientId: 'stackTeal',
      alt: 'Teal stack gradient suggesting repeatable patterns.',
    },
  },
  { kind: 'text', text: ' and ' },
  {
    kind: 'term',
    text: 'deployable',
    caption: 'From pilot to operating practice',
    preview: {
      gradientId: 'columnCoral',
      alt: 'Warm gradient suggesting deployment and scale.',
    },
  },
  { kind: 'text', text: '.' },
] as const satisfies readonly MarketingHeroSubheadSegment[];

/** Site-wide organization name + tagline (metadata, JSON-LD, header/footer). */
export const dccSiteMeta = {
  organizationName: 'Digital Culture Center Miami',
  shortName: 'DCC.miami',
  poweredByLine: 'Powered by Infra24',
  infra24Descriptor:
    'Infra24 is the operational methodology and systems layer that designs, deploys, and documents DCC Miami programs and public interfaces.',
} as const;

/** Homepage meta title/description (also used for JSON-LD). */
export const marketingHomeMeta = {
  title: 'DCC.miami | Digital Culture Center Miami',
  description: `Building cultural infrastructure for Miami\u2019s artists. ${dccPilotSeoDescription}`,
} as const;

/** Plain hero subhead default (first tier-2 rotating line); homepage cycles full `dccHeroRotatingSubheads`. */
export const marketingHeroPlainSubhead = dccHeroRotatingSubheads[0];

export const marketingHero = {
  eyebrow: 'Miami · Public digital culture',
  /** Visible H1 in hero card (glitch styling); brand short name stays in metadata and chrome. */
  headline: 'Digital Culture Center Miami',
  subhead: marketingHeroSubheadSegments.map((s) => s.text).join(''),
  microTrust: dccPilotHomeHero.trustLine,
} as const;

/** Above-fold engagement on the homepage (newsletter + artist index). */
export const marketingHeroEngagement = {
  artistIndex: {
    label: 'Add your practice to the artist index',
    href: '/contact/artist-index',
  },
  newsletter: {
    placeholder: 'Email for updates',
    submitLabel: 'Subscribe',
    /** Optional: full URL for POST (e.g. Mailchimp / Buttondown form action). If unset, submits to `/newsletter` with email query. */
    formAction: process.env.NEXT_PUBLIC_MARKETING_NEWSLETTER_FORM_ACTION ?? '',
  },
} as const;

/** Homepage ticker — Magic UI marquee strip (icons + pause on hover). */
export const homeDigitalMarquee = [
  { label: 'Workshops', icon: 'GraduationCap' },
  { label: 'Public interfaces', icon: 'LayoutPanelLeft' },
  { label: 'Grant-ready documentation', icon: 'FileSpreadsheet' },
  { label: 'Miami pilot', icon: 'MapPin' },
  { label: 'Artist-centered systems', icon: 'Users' },
  { label: 'Wayfinding & signage', icon: 'Signpost' },
  { label: 'Open documentation', icon: 'BookOpen' },
  { label: 'Civic-facing UX', icon: 'Building2' },
] as const satisfies ReadonlyArray<{ readonly label: string; readonly icon: WebcoreIconName }>;

/** Hero status row — webcore / net-art chrome (mono + icons). */
export const homeWebcoreStatus = [
  { icon: 'Radio', label: 'Public signal' },
  { icon: 'MapPin', label: 'Miami node' },
  { icon: 'Cpu', label: 'Systems layer' },
] as const satisfies ReadonlyArray<{ readonly icon: WebcoreIconName; readonly label: string }>;

/** Decorative SYS.LOG lines (stylized; not operational telemetry). */
export const homeSysLogLines = [
  '[public.layer] handshake · miami_corridor · OK',
  '[grants] schema_validate · priorities_bundle loaded',
  '[workshops] queue · next_session · scheduled',
  '[interfaces] signage_feed · delta_sync · idle',
  '[docs] open_spec · version pinned for partners',
] as const;

/** Hero digital frame microcopy (homepage webcore strip). */
export const dccHeroDigital = {
  systemLabels: ['Public', 'Digital', 'Miami'] as const,
  caption: 'One communication layer across physical and digital surfaces',
} as const;

/** Homepage narrative sequence (grants, decks, and site). */
export const dccNarrativeStack = [
  {
    id: 'problem',
    title: 'Problem',
    body:
      'Artists and cultural organizations are expected to operate in digital public space, but most lack usable systems, interfaces, workflows, and support. Information fragments across signs, PDFs, inboxes, and screens.',
    visual: {
      gradientId: 'stackTeal' as const satisfies MarketingGradientId,
      alt: 'Teal gradient — fragmented signals across channels.',
    },
  },
  {
    id: 'opportunity',
    title: 'Opportunity',
    body:
      'Miami can model artist-centered digital culture infrastructure that is visible, useful, and repeatable—across workshops, public interfaces, and documentation others can adopt.',
    visual: {
      gradientId: 'columnCoral' as const satisfies MarketingGradientId,
      alt: 'Warm gradient — regional opportunity and visibility.',
    },
  },
  {
    id: 'response',
    title: 'Response',
    body:
      'DCC Miami builds public programs, tools, workshops, and prototypes grounded in neighborhood and field reality—not abstract “innovation” for its own sake.',
    visual: {
      gradientId: 'fieldViolet' as const satisfies MarketingGradientId,
      alt: 'Violet field gradient — grounded response in public space.',
    },
  },
  {
    id: 'method',
    title: 'Method',
    body:
      'Partners implement the technical layer: what to deploy, how updates flow, and how pilots become legible to staff, boards, and funders. Infra24 documents that systems grammar on the implementation site.',
    visual: {
      gradientId: 'meshSlate' as const satisfies MarketingGradientId,
      alt: 'Slate mesh — method and technical legibility.',
    },
  },
  {
    id: 'outcome',
    title: 'Outcome',
    body:
      'More access, clearer visibility, stronger public engagement, and infrastructure that can travel across partners—without losing accountability to the public.',
    visual: {
      gradientId: 'pulseMagenta' as const satisfies MarketingGradientId,
      alt: 'Magenta pulse — outcomes and public engagement.',
    },
  },
] as const;

export const dccAudiencePathways = [
  {
    href: '/for-funders',
    title: 'For funders & grantmakers',
    description:
      'Miami pilot narrative, funding priorities, and materials—written for boards and program officers evaluating place-based digital culture.',
    cover: {
      gradientId: 'warmAmber' as const satisfies MarketingGradientId,
      alt: 'Amber gradient — funder and grantmaking context.',
    },
  },
  {
    href: '/for-organizations',
    title: 'For small cultural organizations',
    description:
      'Public interfaces, smart signs, artist-centered workflows, and staff training—scoped for organizations that need maintainable systems, not a one-off vendor.',
    cover: {
      gradientId: 'deepInk' as const satisfies MarketingGradientId,
      alt: 'Deep ink gradient — institutional operations.',
    },
  },
  {
    href: '/for-artists',
    title: 'For artists',
    description: 'Workshops, clinics, visibility tools, and experimental learning.',
    cover: {
      gradientId: 'signalCyan' as const satisfies MarketingGradientId,
      alt: 'Cyan signal gradient — artist programs and visibility.',
    },
  },
] as const;

/** Miami-area orgs on the Infra24 multi-tenant platform (`/o/{slug}`). DCC marketing is separate; tenant apps are unchanged. */
export const dccInfra24TenantOrgs = [
  { href: '/o/oolite', name: 'Oolite Arts' },
  { href: '/o/bakehouse', name: 'Bakehouse Art Complex' },
  { href: '/o/madarts', name: 'Mad Arts' },
  { href: '/o/locust', name: 'Locust Projects' },
] as const;

export const dccWhyMiami = {
  title: 'Why Miami',
  body:
    'This region combines dense cultural production, multilingual publics, and visible civic corridors where digital culture can be tested in the open. DCC Miami starts as a pilot platform and distributed programs; a dedicated hub can follow traction—not the other way around.',
} as const;

export const dccSystemsIntro =
  'Across DCC Miami programs, Infra24 implements the touchpoints where culture meets the public: updateable signs and screens, maps and wayfinding, kiosks, portals, and the workflows that keep them current.';

/** Short “what we are” blurb for the homepage (links to /about for depth). */
export const dccWhatWeAreIntro = dccPilotWhatWeAreBlurb;

/** First questions for the homepage FAQ band; full list remains in `marketingFaq` for About and JSON consumers. */
export const marketingHomeFaqPreview = [
  'What is Digital Culture Center Miami?',
  'What is Infra24, and how does it relate to DCC Miami?',
  'Who is this for?',
  'What is a typical first step?',
] as const;

/** Visible site FAQ (single source of truth for copy). */
export const marketingFaq = [
  {
    question: 'What is Digital Culture Center Miami?',
    answer:
      'Digital Culture Center Miami (DCC.miami) is a public-facing platform for artist-centered digital culture: workshops, public programs, artist support, and civic-facing interfaces. It is structured so funders and partners can see public benefit, pilots, and measurable outcomes—not only commercial services.',
    readout:
      'DCC is modeled as cultural infrastructure with legible public surfaces: programs produce literacy, interfaces produce accountability, and pilots produce evidence—not a closed SaaS product narrative.',
    hints: ['entity: dcc.public_mission', 'surface: workshops + civic_ui', 'output: pilot_evidence_bundle'],
  },
  {
    question: 'What is Infra24, and how does it relate to DCC Miami?',
    answer:
      'Infra24 is the implementation layer: the methodology and systems studio that designs, deploys, and documents the infrastructure behind DCC Miami programs—smart signage, maps, kiosks, portals, update workflows, and documentation so the model can repeat across institutions.',
    readout:
      'Infra24 owns deployable patterns: schema for what ships, runbooks for who updates what, and documentation so the next org does not restart from zero—DCC stays the public story; Infra24 stays the systems grammar.',
    hints: ['layer: implementation_studio', 'artifact: runbook + delta_feed', 'route: /infra24 · /platform'],
  },
  {
    question: 'Who is this for?',
    answer:
      'Artists, small cultural organizations, educators, civic partners, and funders investing in place-based digital culture in Miami. Institutional programs also include museums, nonprofits, libraries, and residency-style organizations that need public information to stay current across web and physical space.',
    readout:
      'Audience graph is intentionally multi-node: artists need clinics; orgs need maintainable stacks; funders need outcome language—same site, different entry paths without forking the brand.',
    hints: ['segment: artist | org | funder', 'constraint: small_team_ops', 'geo: miami_pilot'],
  },
  {
    question: 'How is this different from buying displays or digital signage?',
    answer:
      'Buying screens answers hardware. DCC Miami and Infra24 focus on communication systems: what must be visible, where it lives, who updates it, and how you know it works—so public culture stays legible over time.',
    readout:
      'Hardware procurement closes a PO; communication systems close a loop—content lifecycle, ownership, and measurement are the actual product, screens are just one render target.',
    hints: ['anti-pattern: screen_without_owner', 'target: update_graph + sla', 'signal: stale_public_info ↓'],
  },
  {
    question: 'What is a typical first step?',
    answer:
      'For organizations, a structured infrastructure review (audit) or a scoped pilot is common. For artists, workshops and clinics are entry points. For funders, start with Grants and the funder contact path.',
    readout:
      'First moves are sequenced: audit → scoped pilot → expand—so boards see a defensible slice before capital-heavy rollouts.',
    hints: ['flow: audit → pilot → scale', 'entry: /programs · /grants', 'artifact: scope_memo'],
  },
  {
    question: 'Can outcomes be measured for grants or boards?',
    answer:
      'Yes—systems are designed so improvements can be legible when appropriate: usage signals, update patterns, kiosk and map engagement, workshop attendance, and reduced outdated public information, depending on what you deploy.',
    readout:
      'Metrics attach to deployed surfaces—not vanity dashboards. What you can report depends on what you turn on: kiosks yield touch events; workshops yield attendance; update workflows yield freshness.',
    hints: ['metric: engagement | freshness | training', 'policy: proportionate_measurement', 'export: board_summary'],
  },
  {
    question: 'Where can I learn more or get in touch?',
    answer:
      'Browse Programs and Projects for offerings and case patterns, read Grants for funding priorities, or use Contact to route general, partnership, funder, or press inquiries.',
    readout:
      'Routing is explicit to reduce inbox entropy—partnership vs funder vs press should not compete in one generic form if you can help it.',
    hints: ['nav: /programs · /projects · /grants', 'action: /contact/*', 'queue: routed_intake'],
  },
] as const;

const marketingHomeFaqPreviewQuestionSet = new Set<string>(marketingHomeFaqPreview);

/** Subset of FAQ items shown on the homepage; remaining answers live on About and in `marketingFaq`. */
export function getMarketingFaqHomeItems() {
  return marketingFaq.filter((item) => marketingHomeFaqPreviewQuestionSet.has(item.question));
}

export const problemSection = {
  headline: 'Most organizations do not have a signage problem. They have a communication systems problem.',
  lead:
    'Public information often gets scattered across outdated signs, event pages, PDFs, inboxes, screens, staff memory, and disconnected tools. What looks like a signage issue is usually a broader coordination issue.',
  closing:
    'Infra24 helps organizations turn those fragments into updateable public-facing systems that can be maintained, measured, and expanded over time.',
} as const;

export const problemBullets = [
  'Visitors miss important information.',
  'Staff repeat the same updates manually.',
  'Artists and participants struggle to find what is current.',
  'Departments work in parallel instead of through one accountable structure.',
  'Leadership lacks clear reporting on what is actually being used.',
] as const;

export const fragmentedList = [
  'Signs and printed pieces',
  'PDFs and one-off files',
  'Event pages and calendars',
  'Inboxes and chat',
  'Staff memory',
  'Underused screens or kiosks',
] as const;

export const connectedList = [
  'Updateable sign and screen layer',
  'Shared source of truth for public info',
  'Maps and wayfinding tied to programs',
  'Event and program communication',
  'Portals and self-serve access',
  'Usage you can report on',
] as const;

export const differentiationSection = {
  headline: 'Not a display catalog. A communication infrastructure partner.',
  intro:
    'Some paths help organizations buy products. Infra24 helps organizations design communication systems that fit how they operate—what needs to be visible, where it lives, who updates it, and how you know it is working.',
  supportingLine: 'Hardware can be part of the solution. It is not the solution by itself.',
} as const;

export const differentiationCards = [
  {
    leftLabel: 'Product purchasing',
    left: 'Useful when you already know exactly what object to buy.',
    rightLabel: 'System design',
    right:
      'Useful when the bigger problem is visibility, ownership, updates, and public clarity.',
  },
  {
    leftLabel: 'Static setup',
    left: 'A sign, screen, or fixture placed once.',
    rightLabel: 'Living infrastructure',
    right:
      'A system designed to stay current, be maintained by staff, and support engagement over time.',
  },
  {
    leftLabel: 'Broad category shopping',
    left: 'Optimized for browsing and fulfillment.',
    rightLabel: 'Institutional fit',
    right:
      'Optimized for real workflows, public access, reporting, and long-term usefulness.',
  },
] as const;

export const systemsIntro =
  'Infra24 works across digital and physical touchpoints to make public communication clearer, easier to maintain, and more measurable.';

/** Locked audit deliverables—adjust only when your actual scope changes. */
export const auditDeliverables = [
  {
    title: 'Findings memo',
    description:
      'A concise written summary of how information moves today: what works, what breaks, and where teams duplicate effort.',
  },
  {
    title: 'Prioritized gaps',
    description:
      'Ranked visibility and workflow gaps so leadership can agree on what to fix first.',
  },
  {
    title: 'Recommended pilot sequence',
    description:
      'A practical order of pilots (signs, maps, portals, workflows) sized to your capacity and risk tolerance.',
  },
  {
    title: 'Effort and risk framing',
    description:
      'Rough sense of what each next step asks of staff and IT—without committing to a full build.',
  },
] as const;

export const navItems = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/projects', label: 'Projects' },
  { href: '/partners', label: 'Partners' },
  { href: '/grants', label: 'Grants' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
  { href: '/infra24', label: 'Infra24' },
] as const;

/** Grouped links for the marketing header Sheet (`<details>` sections). Hrefs must exist in `navItems`. */
export const marketingNavSheetGroups = [
  { title: 'Explore', hrefs: ['/programs', '/workshops', '/projects', '/partners'] as const },
  { title: 'Organization', hrefs: ['/about', '/grants', '/journal'] as const },
] as const;

export const marketingNavSheetFooterHrefs = ['/contact', '/infra24'] as const;

/** Desktop header (`lg+`): left column — `href` must exist in `navItems`; `label` may differ for bar copy (e.g. Services → /programs). */
export const marketingHeaderNavLeft = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Services' },
  { href: '/grants', label: 'Pilot' },
] as const;

/** Desktop header (`lg+`): right column text links before Apply + theme. */
export const marketingHeaderNavRight = [
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Primary CTA in desktop header; same destination as artist index engagement. */
export const marketingHeaderApplyCta = {
  href: '/contact/artist-index',
  label: 'Apply',
} as const;

/** Dedicated public product page at /infra24 (institutions, RFPs, technical buyers). */
export const infra24MarketingMeta = {
  title: 'Infra24 | Public Interfaces, Signage, and Digital Culture Infrastructure',
  description:
    'Infra24 designs updateable public communication systems for nonprofits, museums, and cultural organizations: smart signage, wayfinding, kiosks, portals, and workflows so the public sees accurate information and your team can maintain it.',
} as const;

export const infra24MarketingHero = {
  eyebrow: 'Digital infrastructure for public-facing organizations',
  headline: 'Updateable public communication systems',
  subhead:
    'Infra24 is a digital infrastructure partner for nonprofits, museums, libraries, residency programs, and cultural organizations. We build smart signage, maps, kiosks, portals, and communication workflows so the public sees accurate, current information—and your team can update and measure it without endless manual rework.',
  microTrust:
    'If your mission depends on clear public access, navigation, and program visibility, we align infrastructure with how you actually operate.',
  dccLinkLine:
    'For Miami public programs, workshops, and the DCC Miami mission layer, start at the home page.',
} as const;

/** Service areas (legacy “what we do” template). */
export const infra24WhatWeDoCategories = [
  {
    title: 'Visibility systems',
    body: 'A coherent picture of what your organization offers the public: what to see, when, and where—without competing versions in email, PDFs, and side channels.',
  },
  {
    title: 'Public interfaces',
    body: 'Websites and on-site surfaces that are easy to update and easy to navigate. Structure matches how visitors actually look for information.',
  },
  {
    title: 'Smart signs',
    body: 'Lobby and gallery screens that reflect authoritative data—not a separate copy-paste job every Monday.',
  },
  {
    title: 'Smart maps',
    body: 'Wayfinding and program-aware maps that stay tied to places and schedules as they change.',
  },
  {
    title: 'Artist and resident portals',
    body: 'Clear entry points for people your organization serves: expectations, resources, and deadlines in one accountable place.',
  },
  {
    title: 'Update workflows',
    body: 'Who publishes what, which system is source of truth, and how handoffs work between programming, communications, and operations.',
  },
  {
    title: 'Institutional memory',
    body: 'Lightweight patterns so decisions and content do not live only in inboxes or departing staff laptops.',
  },
  {
    title: 'Web and physical coherence',
    body: 'The lobby, the website, and the program calendar tell one story—because they draw from aligned systems.',
  },
  {
    title: 'Pilot design and implementation',
    body: 'Bounded experiments with clear success signals before you commit to organization-wide change.',
  },
] as const;

export const infra24Faq = [
  {
    question: 'What is Infra24?',
    answer:
      'A practice that designs and implements updateable public communication systems for mission-driven organizations—smart signage, maps, wayfinding, kiosks, portals, and the workflows that keep public-facing information accurate over time.',
  },
  {
    question: 'Who is Infra24 for?',
    answer:
      'Nonprofits, museums, art centers, libraries, artist-serving organizations, and cultural or civic organizations that need public information to stay current across physical spaces, screens, and the web—not a one-time hardware purchase.',
  },
  {
    question: 'How is this different from buying displays?',
    answer:
      'Buying screens solves hardware. Infra24 focuses on communication systems: what needs to be visible, where it lives, who owns updates, and how you know the system is working.',
  },
  {
    question: 'What is the usual first step?',
    answer:
      'Most engagements start with a Communication Infrastructure Audit: how information moves today, prioritized gaps, and a recommended pilot sequence sized to your capacity.',
  },
  {
    question: 'How does Infra24 relate to Digital Culture Center Miami?',
    answer:
      'DCC Miami is the public platform for digital culture programs; Infra24 is the implementation methodology and product layer that builds and runs the systems. This page is the institutional entry point for the Infra24 studio itself.',
  },
] as const;

export const caseStudyPreviews = [
  {
    slug: 'museum-scale-public-information',
    title: 'Museum-scale public information',
    challenge: 'Event and hours data lived in three systems; on-site screens lagged the website by days.',
    whatWeDid: 'Pilot: single update path into smart signs and a public map.',
    outcome: 'Staff stopped re-keying the same copy; visitors saw consistent hours and programs.',
    coverGradient: 'roseMist' as const satisfies MarketingGradientId,
    coverAlt: 'Rose mist gradient — museum-scale public information and wayfinding.',
  },
  {
    slug: 'program-heavy-nonprofit-portal',
    title: 'Program-heavy nonprofit',
    challenge: 'Artist-facing requirements were buried in PDFs and email threads.',
    whatWeDid: 'Resident portal prototype tied to your existing program structure.',
    outcome: 'Clear expectations for artists; fewer “where do I find…?” questions to staff.',
    coverGradient: 'indigoHaze' as const satisfies MarketingGradientId,
    coverAlt: 'Indigo haze gradient — nonprofit program portals and clarity.',
  },
  {
    slug: 'multi-venue-events-calendar',
    title: 'Multi-venue events calendar',
    challenge: 'Communications and programming each maintained separate calendars.',
    whatWeDid: 'Scoped workflow: one authoritative schedule, multiple public views.',
    outcome: 'One place to update; fewer last-minute corrections before openings.',
    coverGradient: 'stackTeal' as const satisfies MarketingGradientId,
    coverAlt: 'Teal stack gradient — multi-venue scheduling and coordination.',
  },
] as const;

export const symptoms = [
  'Communications, programming, and operations each maintain their own version of “what’s true.”',
  'The website, screens, and on-site signage do not stay in sync.',
  'Staff repeat the same updates across channels—or updates stop happening.',
  'Visitors and artists cannot find basic information without asking someone.',
  'Important details live in PDFs, inboxes, or individual staff memory.',
  'Leadership knows something is wrong but cannot name it as a single systems problem.',
] as const;

export const capabilities = [
  {
    title: 'Smart signs',
    description:
      'Updateable signage systems that reduce outdated information and make public messaging easier to manage.',
    href: '/projects/smart-signs',
  },
  {
    title: 'Smart maps',
    description:
      'Wayfinding and navigation layers for campuses, exhibitions, multi-space organizations, and public programs.',
    href: '/projects/smart-maps',
  },
  {
    title: 'Kiosks',
    description:
      'Public access points for event info, check-in, navigation, artist resources, and community engagement.',
    href: '/projects/cultural-kiosk',
  },
  {
    title: 'Event information systems',
    description:
      'Connected program communication across physical signage, screens, web, QR layers, and on-site touchpoints.',
    href: '/programs/institutional-programs/public-interface-pilots',
  },
  {
    title: 'Artist & resident portals',
    description:
      'Centralized systems for forms, agreements, announcements, resources, and organization-wide communication.',
    href: '/projects/artist-portal',
  },
  {
    title: 'Communication workflows',
    description:
      'Ownership, updates, content flow, and reporting—the internal structure that keeps the public layer current.',
    href: '/infra24/method',
  },
] as const;

export const idealFitSection = {
  headline: 'Built for mission-driven organizations, not generic display purchasing',
  body:
    'Infra24 is especially aligned with organizations that need communication infrastructure to be public-facing, maintainable, measurable, and adaptable over time.',
  supporting:
    'For organizations where visibility, access, navigation, and communication are part of the mission—not only back-office operations.',
} as const;

export const idealFitBullets = [
  'Museums and art centers',
  'Residency programs',
  'Cultural nonprofits',
  'Libraries',
  'Nonprofit campuses',
  'Artist-serving organizations',
  'Public programs teams',
  'Community cultural spaces',
  'Education and civic arts initiatives',
] as const;

export const measurementSection = {
  headline: 'Better communication should be measurable',
  lead:
    'Infra24 systems are designed not only to improve visibility, but to make that improvement legible—internally and for funders.',
  supporting:
    'Depending on the system, organizations can track scans, visits, update frequency, kiosk interactions, event engagement, facility activation, staff adoption, and reduction in outdated public information. That makes infrastructure easier to justify and more useful in grant, board, and reporting contexts.',
} as const;
