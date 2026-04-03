/**
 * Marketing site copy (single source of truth).
 * Public narrative: Center of Digital Culture (CDC). Implementation layer: Infra24.
 */

import { caseStudyCoverImages } from './image-assets';

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
  subhead:
    'A Miami-based platform for artists, public learning, and civic-facing digital culture infrastructure—workshops, public programs, artist support, and updateable public interfaces. Infra24 is the systems methodology that makes this work repeatable and deployable.',
  microTrust:
    'Built for funders, partners, and communities who want cultural infrastructure that is visible, legible, and accountable—not a one-off vendor relationship.',
} as const;

/** Homepage narrative sequence (grants, decks, and site). */
export const cdcNarrativeStack = [
  {
    id: 'problem',
    title: 'Problem',
    body:
      'Artists and cultural organizations are expected to operate in digital public space, but most lack usable systems, interfaces, workflows, and support. Information fragments across signs, PDFs, inboxes, and screens.',
  },
  {
    id: 'opportunity',
    title: 'Opportunity',
    body:
      'Miami can model artist-centered digital culture infrastructure that is visible, useful, and repeatable—across workshops, public interfaces, and documentation others can adopt.',
  },
  {
    id: 'response',
    title: 'Response',
    body:
      'CDC builds public programs, tools, workshops, and prototypes grounded in neighborhood and field reality—not abstract “innovation” for its own sake.',
  },
  {
    id: 'method',
    title: 'Method',
    body:
      'Infra24 provides the systems logic and implementation layer: what to deploy, how updates flow, and how pilots become legible to staff, boards, and funders.',
  },
  {
    id: 'outcome',
    title: 'Outcome',
    body:
      'More access, clearer visibility, stronger public engagement, and infrastructure that can travel across partners—without losing accountability to the public.',
  },
] as const;

export const cdcAudiencePathways = [
  {
    href: '/grants/funders',
    title: 'For funders & grantmakers',
    description:
      'Miami pilot narrative, funding priorities, materials, and how Infra24 implements the technical layer.',
  },
  {
    href: '/programs/institutional-programs',
    title: 'For small cultural organizations',
    description:
      'Public interfaces, smart signs, artist-centered workflows, and staff training—scoped for organizations that need maintainable systems, not a one-off vendor.',
  },
  {
    href: '/programs',
    title: 'For artists',
    description: 'Workshops, clinics, visibility tools, and experimental learning.',
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
  },
  {
    question: 'What is Infra24, and how does it relate to CDC?',
    answer:
      'Infra24 is the implementation layer: the methodology and systems studio that designs, deploys, and documents the infrastructure behind CDC programs—smart signage, maps, kiosks, portals, update workflows, and documentation so the model can repeat across institutions.',
  },
  {
    question: 'Who is this for?',
    answer:
      'Artists, small cultural organizations, educators, civic partners, and funders investing in place-based digital culture in Miami. Institutional programs also include museums, nonprofits, libraries, and residency-style organizations that need public information to stay current across web and physical space.',
  },
  {
    question: 'How is this different from buying displays or digital signage?',
    answer:
      'Buying screens answers hardware. CDC and Infra24 focus on communication systems: what must be visible, where it lives, who updates it, and how you know it works—so public culture stays legible over time.',
  },
  {
    question: 'What is a typical first step?',
    answer:
      'For organizations, a structured infrastructure review (audit) or a scoped pilot is common. For artists, workshops and clinics are entry points. For funders, start with Grants and the funder contact path.',
  },
  {
    question: 'Can outcomes be measured for grants or boards?',
    answer:
      'Yes—systems are designed so improvements can be legible when appropriate: usage signals, update patterns, kiosk and map engagement, workshop attendance, and reduced outdated public information, depending on what you deploy.',
  },
  {
    question: 'Where can I learn more or get in touch?',
    answer:
      'Browse Programs and Projects for offerings and case patterns, read Grants for funding priorities, or use Contact to route general, partnership, funder, or press inquiries.',
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
