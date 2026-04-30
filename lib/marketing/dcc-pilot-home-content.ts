/**
 * Homepage copy for the Year 1 Artist Support Pilot narrative (DCC Miami).
 * Institutional homepage uses `dccHomeMissionHeadline` + `dccHomeOrgLine`; other surfaces may still use `marketingHero.headline`.
 */

import { dccHomePhotos } from '@/lib/marketing/dcc-home-photography';

export const dccPilotSeoDescription =
  'Digital Culture Center Miami: infrastructure for born-digital art—software, screens, networks, and public-facing systems for Miami artists and cultural organizations. Year 1 pilot: clinics, workshops, and shared tools. Powered by Infra24.' as const;

/** Homepage institutional hero — static mission H1 (funder-facing). */
export const dccHomeMissionHeadline =
  'Building Cultural Infrastructure for Miami\u2019s Artists' as const;

export const dccHomeOrgLine = 'Digital Culture Center Miami' as const;

export const dccHomeFunderSubline =
  'DCC is a distributed artist-support pilot helping artists and cultural organizations strengthen digital presence, technical presentation, public visibility, and opportunity readiness.' as const;

/** Mono accent strip: short phrases, animated in `DccHeroAsciiStatus`. */
export const dccHomeMonoAccentPhrases = [
  'website support_',
  'technical presentation_',
  'public visibility_',
  'shared tools_',
] as const;

/** Hero tier-1 line rotation (marketing homepage). */
export const heroHeadlineRotateIntervalMs = 6000 as const;
export const heroHeadlineRotateTransitionSec = 0.45 as const;

/** Typewriter tier-1: per-character delay and pause after a full line before advancing. */
export const heroHeadlineTypewriterMsPerChar = 26 as const;
export const heroHeadlineTypewriterHoldMs = 2200 as const;

/** Hero tier-2 subhead rotation — offset from tier 1 so lines do not tick in lockstep. */
export const heroSubheadRotateIntervalMs = 8500 as const;

/**
 * Tier 1 — rotating taglines (e.g. alternate marketing heroes). Homepage institutional layout uses a static mission H1 instead.
 */
export const dccHeroRotatingHeadlines = [
  'Infrastructure for Born-Digital Art',
  'A Support System for Networked Art',
  'Built for Internet-Native Artists',
  'For Artists Working in Software, Screens, and Systems',
  'A New Infrastructure for Digital Culture',
  'Building Miami’s Digital Art Underground',
  'Art for the Browser-Brained Era',
  'Where Hardware, Software, and Culture Collide',
] as const;

/**
 * Tier 2 — concrete subcopy: software/screens/hardware/online culture + pilot outputs.
 * First line mirrors `supportingSubhead` for non-hero consumers and SEO-adjacent blurbs.
 */
export const dccHeroRotatingSubheads = [
  'DCC helps artists working with software, screens, networks, hardware, and online culture strengthen visibility, technical presentation, and public connection in Miami.',
  'From websites and documentation to screens, QR systems, installations, and public-facing tools, DCC supports artists working across digital culture, new media, and online aesthetics.',
  'DCC is a Miami-based support layer for artists and cultural workers building with hardware, software, browser culture, memes, e-waste, and other born-digital forms.',
  'DCC supports artists shaping culture through code, screens, networks, digital debris, and chronically online aesthetics.',
  'DCC strengthens born-digital art and culture through practical infrastructure: workshops, clinics, public programs, and tools that stay accountable to artists and the public.',
  'For creative technologists and organizations: clearer digital presence, better technical presentation of screen-based and networked work, and visibility in civic corridors.',
] as const;

export const dccPilotHomeHero = {
  eyebrow: 'Artist Support Pilot · Year 1',
  /** Default plain subhead (first rotating tier-2 line); hero may cycle full `dccHeroRotatingSubheads`. */
  supportingSubhead: dccHeroRotatingSubheads[0],
  trustLine:
    'We treat digital and technical support as cultural infrastructure: practical outputs, public learning, and systems that can travel—not a one-off vendor story.',
  primaryCta: { label: 'Explore Services', href: '/#what-dcc-does' },
  secondaryCta: { label: 'Partner With DCC', href: '/partners' },
} as const;

export const dccPilotIntro = {
  title: 'Why this pilot',
  backgroundImage: dccHomePhotos.galleryCrowdOpening,
  paragraphs: [
    'Miami has a strong arts community, but many artists and smaller cultural organizations still lack practical support for the digital and technical systems that shape how work is presented, discovered, and sustained.',
    'DCC addresses that gap through one-on-one clinics, workshops, shared tools, and public programs—so participants can improve websites, documentation, technical presentation, communications, and public-facing cultural visibility with support that stays accountable to the public.',
  ],
} as const;

export type DccYear1ServicePillar = {
  id: string;
  title: string;
  summary: string;
  whoItServes: string;
  deliverable: string;
  image: { src: string; alt: string };
};

export const dccYear1ServicePillars: readonly DccYear1ServicePillar[] = [
  {
    id: 'website-clinics',
    title: 'Artist Website & Digital Presence Clinics',
    summary:
      'One-on-one support on websites, portfolios, bios, navigation, visibility, and audience-facing clarity.',
    whoItServes: 'Miami artists and small cultural organizations.',
    deliverable: 'Written audit + prioritized action plan.',
    image: dccHomePhotos.fabiolaGemsOfObsolescence,
  },
  {
    id: 'technical-excellence',
    title: 'Technical Excellence for Artwork Presentation',
    summary:
      'Support for digital installations, screens, QR systems, livestream setups, projections, documentation workflows, and exhibition-facing tech.',
    whoItServes: 'Artists, curators, nonprofits, and host spaces.',
    deliverable: 'Technical recommendation memo or setup plan.',
    image: dccHomePhotos.galleryInteractiveStations,
  },
  {
    id: 'workshops',
    title: 'Workshops & Public Learning',
    summary:
      'Public workshops on artist websites, digital storytelling, AI and art tools, documentation, audience engagement, and practical digital skills.',
    whoItServes: 'Artists, small organizations, and creative publics.',
    deliverable: 'Workshop sessions + reusable learning materials.',
    image: dccHomePhotos.vrHug,
  },
  {
    id: 'career-readiness',
    title: 'Career & Opportunity Readiness',
    summary:
      'Support for applications, artist statements, documentation packages, portfolio readiness, and presentation to curators and opportunities.',
    whoItServes: 'Emerging and mid-career artists.',
    deliverable: 'Revised packet, feedback memo, or opportunity prep checklist.',
    image: dccHomePhotos.meditationBattlestation,
  },
  {
    id: 'visibility-infrastructure',
    title: 'Curator / Visibility Infrastructure',
    summary:
      'Artist indexing, spotlighting, and lightweight systems that increase discoverability and connection.',
    whoItServes: 'Artists, curators, and organizations.',
    deliverable: 'Artist profiles, showcases, curated introductions.',
    image: dccHomePhotos.fabiolaEyeseeyouWatch,
  },
  {
    id: 'partner-infrastructure',
    title: 'Partner Infrastructure Support',
    summary:
      'Small systems for cultural organizations: event pages, digital signage, communications templates, lightweight tools.',
    whoItServes: 'Miami arts partners.',
    deliverable: 'Pilot workflow, template, or public-facing tool.',
    image: dccHomePhotos.digitalDivinities,
  },
] as const;

export const dccParticipantValue = {
  title: 'What participants leave with',
  backgroundImage: dccHomePhotos.touchgrassTreadmillWide,
  intro:
    'DCC does not only “support artists.” We help artists and small cultural organizations leave with concrete, public-facing progress:',
  bullets: [
    'Stronger websites and portfolio structure',
    'Clearer artist bios and public-facing language',
    'Better documentation workflows',
    'More professional presentation of digital or technology-based work',
    'Practical technical plans for exhibitions and events',
    'Stronger applications, packets, and opportunity readiness',
    'Reusable templates and shared tools where appropriate',
    'Access to workshops and public learning',
    'Stronger visibility within Miami’s cultural ecosystem',
  ],
} as const;

export const dccProofSectionIntro = {
  title: 'Selected project patterns',
  subcopy:
    'Case-style examples drawn from the same workstreams that inform the pilot—artist support, workshops, technical production, digital systems, public programs, signage and devices, collaborations, and documentation—challenge, intervention, and what scales next.',
} as const;

export const dccHomePathwaysSection = {
  title: 'Who we work with',
} as const;

/** Homepage “What DCC is” band — short; About page carries depth. */
export const dccPilotWhatWeAreBlurb =
  'We run a Year 1 distributed pilot: clinics, workshops, and public programs so artists and cultural organizations can strengthen how work is seen and shared—with concrete deliverables and systems that last. Infra24 implements the layer that keeps public interfaces, documentation, and partner pilots maintainable.' as const;

export const dccPilotCtaBand = {
  headline: 'Interested in participating, hosting, or partnering?',
  body: 'We are building a distributed support model for Miami artists and cultural organizations—services, workshops, and shared tools—with Infra24 keeping public interfaces and programs maintainable.',
  primaryLabel: 'Join the Pilot',
  primaryHref: '/for-artists',
  secondaryLabel: 'Become a Host Partner',
  secondaryHref: '/partners',
  tertiaryLabel: 'For funders',
  tertiaryHref: '/for-funders',
} as const;
