/**
 * Infra24 marketing site copy (single source of truth).
 * Positioning: updateable public communication systems for nonprofits and cultural orgs—
 * institutional fit and measurable outcomes over commodity display purchasing.
 */

export const marketingHero = {
  eyebrow: 'Digital culture infrastructure for mission-driven organizations',
  headline:
    'Updateable public communication systems for nonprofits and cultural organizations',
  subhead:
    'Infra24 builds smart signage, maps, kiosks, portals, and communication workflows that help mission-driven organizations stay visible, useful, and measurable across physical and online space.',
  microTrust:
    'Built for nonprofits, museums, artist-serving organizations, residency programs, libraries, and public-facing cultural spaces.',
} as const;

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
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/audit', label: 'Audit' },
  { href: '/pilots', label: 'Pilots' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const caseStudyPreviews = [
  {
    slug: 'cultural-institution-wayfinding',
    title: 'Museum-scale public information',
    challenge: 'Event and hours data lived in three systems; on-site screens lagged the website by days.',
    whatWeDid: 'Pilot: single update path into smart signs and a public map.',
    outcome: 'Staff stopped re-keying the same copy; visitors saw consistent hours and programs.',
  },
  {
    slug: 'nonprofit-program-portal',
    title: 'Program-heavy nonprofit',
    challenge: 'Artist-facing requirements were buried in PDFs and email threads.',
    whatWeDid: 'Resident portal prototype tied to your existing program structure.',
    outcome: 'Clear expectations for artists; fewer “where do I find…?” questions to staff.',
  },
  {
    slug: 'multi-venue-events',
    title: 'Multi-venue events calendar',
    challenge: 'Communications and programming each maintained separate calendars.',
    whatWeDid: 'Scoped workflow: one authoritative schedule, multiple public views.',
    outcome: 'One place to update; fewer last-minute corrections before openings.',
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
    href: '/what-we-do',
  },
  {
    title: 'Smart maps',
    description:
      'Wayfinding and navigation layers for campuses, exhibitions, multi-space organizations, and public programs.',
    href: '/what-we-do',
  },
  {
    title: 'Kiosks',
    description:
      'Public access points for event info, check-in, navigation, artist resources, and community engagement.',
    href: '/what-we-do',
  },
  {
    title: 'Event information systems',
    description:
      'Connected program communication across physical signage, screens, web, QR layers, and on-site touchpoints.',
    href: '/what-we-do',
  },
  {
    title: 'Artist & resident portals',
    description:
      'Centralized systems for forms, agreements, announcements, resources, and organization-wide communication.',
    href: '/what-we-do',
  },
  {
    title: 'Communication workflows',
    description:
      'Ownership, updates, content flow, and reporting—the internal structure that keeps the public layer current.',
    href: '/what-we-do',
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
