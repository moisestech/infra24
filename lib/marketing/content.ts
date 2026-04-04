/**
 * Marketing site copy (single source of truth).
 * Public narrative: Center of Digital Culture (CDC). Implementation layer: Infra24.
 */

import type { WebcoreIconName } from '@/components/marketing/webcore-lucide';

import { caseStudyCoverImages } from './image-assets';

/** Lockup line — header + hero (place + public digital culture). */
export const publicDigitalMiamiLine = 'PUBLIC DIGITAL MIAMI' as const;

export type MarketingHeroSubheadSegment =
  | { readonly kind: 'text'; readonly text: string }
  | {
      readonly kind: 'term';
      readonly text: string;
      readonly image: { readonly src: string; readonly alt: string };
      readonly caption?: string;
    };

/** Homepage hero description as plain text + interactive key terms (images on hover/tap). */
export const marketingHeroSubheadSegments = [
  { kind: 'text', text: 'A ' },
  {
    kind: 'term',
    text: 'Miami-based',
    caption: 'Place-based pilot in civic corridors',
    image: {
      src: 'https://angelocaruso.art/images/traverse2.jpg',
      alt: 'Photograph suggesting movement through urban or corridor space.',
    },
  },
  { kind: 'text', text: ' platform for ' },
  {
    kind: 'term',
    text: 'artists',
    caption: 'Workshops, clinics, and experimental learning',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717961679/art/moisestech-website/moisesdsanabria-babyagi_ewquhe.webp',
      alt: 'Artwork referencing autonomous agents and digital labor.',
    },
  },
  { kind: 'text', text: ', ' },
  {
    kind: 'term',
    text: 'public learning',
    caption: 'Programs that build literacy in the open',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717960571/art/moisestech-website/digitaldivinities-moisesdsanabria-fabiolalarios-bakehouse-openstudios-spring-2024_f3ahbx.jpg',
      alt: 'Open studios exhibition view with digital and sculptural work.',
    },
  },
  { kind: 'text', text: ', and ' },
  {
    kind: 'term',
    text: 'civic-facing',
    caption: 'Interfaces the public actually encounters',
    image: {
      src: 'https://angelocaruso.art/images/frontpage/rain.jpg',
      alt: 'Rain-soaked urban scene, reflective surfaces.',
    },
  },
  { kind: 'text', text: ' ' },
  {
    kind: 'term',
    text: 'digital culture infrastructure',
    caption: 'Systems, not one-off installs',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjvyoUNXh1r1ubs7o1_1280_bsmcic.jpg',
      alt: 'Abstract digital texture with vertical color bands.',
    },
  },
  { kind: 'text', text: '—' },
  {
    kind: 'term',
    text: 'workshops',
    caption: 'Hands-on skill building',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831887/art/moisestech-website/touchgrass-doomscrolling-treadmill-stations-1_gggocb.jpg',
      alt: 'Installation with treadmills and screens commenting on doomscrolling and physical presence.',
    },
  },
  { kind: 'text', text: ', ' },
  {
    kind: 'term',
    text: 'public programs',
    caption: 'Events and offerings made legible',
    image: {
      src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Surveillance_Cutie_2024.webp',
      alt: 'Artwork depicting cute aesthetics intersecting surveillance motifs.',
    },
  },
  { kind: 'text', text: ', ' },
  {
    kind: 'term',
    text: 'artist support',
    caption: 'Visibility tools and pathways',
    image: {
      src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Gems_of_Obsolescence.webp',
      alt: 'Sculptural work with gems and obsolete technology aesthetics.',
    },
  },
  { kind: 'text', text: ', and ' },
  {
    kind: 'term',
    text: 'updateable public interfaces',
    caption: 'Signs, maps, kiosks, portals—kept current',
    image: {
      src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_eyeseeyou_watch.webp',
      alt: 'Wearable or object evoking always-on watching and smart devices.',
    },
  },
  { kind: 'text', text: '. ' },
  {
    kind: 'term',
    text: 'Infra24',
    caption: 'Implementation methodology behind CDC pilots',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjzb2mbro1r1ubs7o1_1280_cqc4ds.jpg',
      alt: 'Layered abstract imagery suggesting stacked interfaces.',
    },
  },
  { kind: 'text', text: ' is the systems methodology that makes this work ' },
  {
    kind: 'term',
    text: 'repeatable',
    caption: 'Patterns other partners can adopt',
    image: {
      src: 'https://createbuildconnect.com/images/exhibitions/cubic.jpg',
      alt: 'Exhibition documentation with cubic sculptural installation.',
    },
  },
  { kind: 'text', text: ' and ' },
  {
    kind: 'term',
    text: 'deployable',
    caption: 'From pilot to operating practice',
    image: {
      src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Internet_Entanglement_2024.webp',
      alt: 'Artwork about entanglement with internet systems and identity.',
    },
  },
  { kind: 'text', text: '.' },
] as const satisfies readonly MarketingHeroSubheadSegment[];

/** Site-wide organization name + tagline (metadata, JSON-LD, header/footer). */
export const cdcSiteMeta = {
  organizationName: 'Center of Digital Culture',
  shortName: 'CDC',
  poweredByLine: 'Powered by Infra24',
  infra24Descriptor:
    'Infra24 is the operational methodology and systems layer that designs, deploys, and documents CDC programs and public interfaces.',
} as const;

/** Homepage meta title/description (also used for JSON-LD). */
export const marketingHomeMeta = {
  title: 'Center of Digital Culture — Miami platform for artists, public learning & digital culture',
  description:
    'Center of Digital Culture is a Miami-based initiative for artist-centered digital culture, public programs, and civic-facing infrastructure. Infra24 powers the systems behind workshops, smart signs, maps, kiosks, and repeatable public interfaces.',
} as const;

export const marketingHero = {
  eyebrow: 'Miami · Public digital culture',
  headline: 'Center of Digital Culture',
  subhead: marketingHeroSubheadSegments.map((s) => s.text).join(''),
  microTrust:
    'Built for funders, partners, and communities who want cultural infrastructure that is visible, legible, and accountable—not a one-off vendor relationship.',
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
export const cdcHeroDigital = {
  systemLabels: ['Public', 'Digital', 'Miami'] as const,
  caption: 'One communication layer across physical and digital surfaces',
} as const;

/** Homepage narrative sequence (grants, decks, and site). */
export const cdcNarrativeStack = [
  {
    id: 'problem',
    title: 'Problem',
    body:
      'Artists and cultural organizations are expected to operate in digital public space, but most lack usable systems, interfaces, workflows, and support. Information fragments across signs, PDFs, inboxes, and screens.',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1737831887/art/moisestech-website/touchgrass-doomscrolling-treadmill-stations-1_gggocb.jpg',
      alt: 'Installation with treadmills and screens commenting on doomscrolling and physical presence.',
    },
  },
  {
    id: 'opportunity',
    title: 'Opportunity',
    body:
      'Miami can model artist-centered digital culture infrastructure that is visible, useful, and repeatable—across workshops, public interfaces, and documentation others can adopt.',
    image: {
      src: 'https://angelocaruso.art/images/traverse2.jpg',
      alt: 'Photograph suggesting movement through urban or corridor space.',
    },
  },
  {
    id: 'response',
    title: 'Response',
    body:
      'CDC builds public programs, tools, workshops, and prototypes grounded in neighborhood and field reality—not abstract “innovation” for its own sake.',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717960571/art/moisestech-website/digitaldivinities-moisesdsanabria-fabiolalarios-bakehouse-openstudios-spring-2024_f3ahbx.jpg',
      alt: 'Open studios exhibition view with digital and sculptural work.',
    },
  },
  {
    id: 'method',
    title: 'Method',
    body:
      'Partners implement the technical layer: what to deploy, how updates flow, and how pilots become legible to staff, boards, and funders. Infra24 documents that systems grammar on the implementation site.',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1738040056/art/moisestech-website/tumblr_npjvyoUNXh1r1ubs7o1_1280_bsmcic.jpg',
      alt: 'Abstract digital texture with vertical color bands.',
    },
  },
  {
    id: 'outcome',
    title: 'Outcome',
    body:
      'More access, clearer visibility, stronger public engagement, and infrastructure that can travel across partners—without losing accountability to the public.',
    image: {
      src: 'https://fabiola.io/portfolio/works/Fabiola_Larios_Surveillance_Cutie_2024.webp',
      alt: 'Artwork depicting cute aesthetics intersecting surveillance motifs.',
    },
  },
] as const;

export const cdcAudiencePathways = [
  {
    href: '/grants/funders',
    title: 'For funders & grantmakers',
    description:
      'Miami pilot narrative, funding priorities, and materials—written for boards and program officers evaluating place-based digital culture.',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717960571/art/moisestech-website/digitaldivinities-moisesdsanabria-fabiolalarios-bakehouse-openstudios-spring-2024_f3ahbx.jpg',
      alt: 'Open studios exhibition view with digital and sculptural work.',
    },
  },
  {
    href: '/programs/institutional-programs',
    title: 'For small cultural organizations',
    description:
      'Public interfaces, smart signs, artist-centered workflows, and staff training—scoped for organizations that need maintainable systems, not a one-off vendor.',
    image: {
      src: 'https://angelocaruso.art/images/frontpage/rain.jpg',
      alt: 'Rain-soaked urban scene, reflective surfaces.',
    },
  },
  {
    href: '/programs',
    title: 'For artists',
    description: 'Workshops, clinics, visibility tools, and experimental learning.',
    image: {
      src: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1717961679/art/moisestech-website/moisesdsanabria-babyagi_ewquhe.webp',
      alt: 'Artwork referencing autonomous agents and digital labor.',
    },
  },
] as const;

/** Miami-area orgs on the Infra24 multi-tenant platform (`/o/{slug}`). CDC marketing is separate; tenant apps are unchanged. */
export const cdcInfra24TenantOrgs = [
  { href: '/o/oolite', name: 'Oolite Arts' },
  { href: '/o/bakehouse', name: 'Bakehouse Art Complex' },
  { href: '/o/madarts', name: 'Mad Arts' },
  { href: '/o/locust', name: 'Locust Projects' },
] as const;

export const cdcWhyMiami = {
  title: 'Why Miami',
  body:
    'This region combines dense cultural production, multilingual publics, and visible civic corridors where digital culture can be tested in the open. CDC starts as a pilot platform and distributed programs; a dedicated hub can follow traction—not the other way around.',
} as const;

export const cdcSystemsIntro =
  'Across CDC programs, Infra24 implements the touchpoints where culture meets the public: updateable signs and screens, maps and wayfinding, kiosks, portals, and the workflows that keep them current.';

/** Visible homepage FAQ + FAQPage JSON-LD (single source of truth). */
export const marketingFaq = [
  {
    question: 'What is Center of Digital Culture?',
    answer:
      'Center of Digital Culture (CDC) is a public-facing Miami initiative for artist-centered digital culture: workshops, public programs, artist support, and civic-facing interfaces. It is structured so funders and partners can see public benefit, pilots, and measurable outcomes—not only commercial services.',
    readout:
      'CDC is modeled as cultural infrastructure with legible public surfaces: programs produce literacy, interfaces produce accountability, and pilots produce evidence—not a closed SaaS product narrative.',
    hints: ['entity: cdc.public_mission', 'surface: workshops + civic_ui', 'output: pilot_evidence_bundle'],
  },
  {
    question: 'What is Infra24, and how does it relate to CDC?',
    answer:
      'Infra24 is the implementation layer: the methodology and systems studio that designs, deploys, and documents the infrastructure behind CDC programs—smart signage, maps, kiosks, portals, update workflows, and documentation so the model can repeat across institutions.',
    readout:
      'Infra24 owns deployable patterns: schema for what ships, runbooks for who updates what, and documentation so the next org does not restart from zero—CDC stays the public story; Infra24 stays the systems grammar.',
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
      'Buying screens answers hardware. CDC and Infra24 focus on communication systems: what must be visible, where it lives, who updates it, and how you know it works—so public culture stays legible over time.',
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
  { href: '/projects', label: 'Projects' },
  { href: '/partners', label: 'Partners' },
  { href: '/grants', label: 'Grants' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
  { href: '/infra24', label: 'Infra24' },
] as const;

/** Grouped links for the marketing header Sheet (`<details>` sections). Hrefs must exist in `navItems`. */
export const marketingNavSheetGroups = [
  { title: 'Explore', hrefs: ['/programs', '/projects', '/partners'] as const },
  { title: 'Organization', hrefs: ['/about', '/grants', '/journal'] as const },
] as const;

export const marketingNavSheetFooterHrefs = ['/contact', '/infra24'] as const;

/** Dedicated public product page at /infra24 (institutions, RFPs, technical buyers). */
export const infra24MarketingMeta = {
  title: 'Infra24 — smart signage, maps, kiosks & public communication systems',
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
  cdcLinkLine:
    'For Miami public programs, workshops, and the CDC mission layer, start at the home page.',
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
    question: 'How does Infra24 relate to Center of Digital Culture?',
    answer:
      'CDC is the public Miami initiative for digital culture programs; Infra24 is the implementation methodology and product layer that builds and runs the systems. This page is the institutional entry point for the Infra24 studio itself.',
  },
] as const;

export const caseStudyPreviews = [
  {
    slug: 'cultural-institution-wayfinding',
    title: 'Museum-scale public information',
    challenge: 'Event and hours data lived in three systems; on-site screens lagged the website by days.',
    whatWeDid: 'Pilot: single update path into smart signs and a public map.',
    outcome: 'Staff stopped re-keying the same copy; visitors saw consistent hours and programs.',
    coverImage: caseStudyCoverImages['cultural-institution-wayfinding'].src,
    coverAlt: caseStudyCoverImages['cultural-institution-wayfinding'].alt,
  },
  {
    slug: 'nonprofit-program-portal',
    title: 'Program-heavy nonprofit',
    challenge: 'Artist-facing requirements were buried in PDFs and email threads.',
    whatWeDid: 'Resident portal prototype tied to your existing program structure.',
    outcome: 'Clear expectations for artists; fewer “where do I find…?” questions to staff.',
    coverImage: caseStudyCoverImages['nonprofit-program-portal'].src,
    coverAlt: caseStudyCoverImages['nonprofit-program-portal'].alt,
  },
  {
    slug: 'multi-venue-events',
    title: 'Multi-venue events calendar',
    challenge: 'Communications and programming each maintained separate calendars.',
    whatWeDid: 'Scoped workflow: one authoritative schedule, multiple public views.',
    outcome: 'One place to update; fewer last-minute corrections before openings.',
    coverImage: caseStudyCoverImages['multi-venue-events'].src,
    coverAlt: caseStudyCoverImages['multi-venue-events'].alt,
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
