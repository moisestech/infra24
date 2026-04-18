/**
 * Org-scoped copy for the workshops marketing landing.
 * Other orgs can add parallel files or a registry later.
 */

export type WorkshopHeroCta = {
  label: string
  href: string
}

export type LandingCtaLink = {
  label: string
  href: string
}

export type WorkshopsLandingContent = {
  heroEyebrow: string
  heroTitle: string
  heroTitleAccent: string
  heroLead: string
  /** Primary hero CTA (e.g. anchor to catalog) */
  heroPrimaryCta: WorkshopHeroCta
  /** Secondary hero CTA (e.g. mailto book) */
  heroSecondaryCta: WorkshopHeroCta
  trustLine: string
  trustItems: string[]
  /** Framing section below hero */
  framingSection: { title: string; body: string }
  /** Intro above workshop grids */
  featuredSection: { title: string; subcopy: string }
  /** Why this series */
  whySeriesSection: { title: string; body: string }
  howItWorks: { title: string; steps: { title: string; body: string }[] }
  forInstitutions: {
    title: string
    body: string
    bullets: string[]
  }
  /** Extra links under institution block (mailto or anchors) */
  institutionCtas: LandingCtaLink[]
  proofLine: string
  comingSoonSection: { title: string; subcopy: string }
  footerCtaSection: { title: string; body: string; ctas: LandingCtaLink[] }
  faq: { q: string; a: string }[]
  institutionalInquiry: {
    email: string
    subjectPrefix: string
    bodyIntro: string
  }
}

const OOLITE: WorkshopsLandingContent = {
  heroEyebrow: 'Oolite Arts Digital Lab',
  heroTitle: 'Artist-centered workshops',
  heroTitleAccent: 'for digital practice',
  heroLead:
    'Digital Lab Workshops are designed for artists, teaching artists, and cultural organizations navigating digital practice in real time. The series focuses on websites, discoverability, documentation, AI literacy, creative coding, and sustainable workflows — with an emphasis on clarity, experimentation, and long-term usefulness.',
  heroPrimaryCta: {
    label: 'Explore Workshops',
    href: '/o/oolite/workshops/digital-lab',
  },
  heroSecondaryCta: {
    label: 'Book a Workshop',
    href: 'mailto:info@oolitearts.org?subject=Workshop%20inquiry%20%E2%80%94%20Oolite%20Arts%20Digital%20Lab',
  },
  trustLine: 'Designed for artists, educators, and cultural organizations.',
  trustItems: [
    'Individual artists & studio practitioners',
    'Nonprofits & residency programs',
    'Public-facing cultural education',
  ],
  framingSection: {
    title: 'A growing workshop system for contemporary artistic practice',
    body:
      'These workshops are designed to meet artists where digital practice actually happens: across websites, writing, search visibility, documentation, browser-based publishing, AI-assisted workflows, and creative experimentation.\n\nThe series is beginner-friendly overall, while leaving room for more advanced and experimental approaches as demand grows. Each workshop can function as a standalone learning experience or as part of a larger educational pathway.',
  },
  featuredSection: {
    title: 'Featured Workshops',
    subcopy:
      'Start with the core workshops in the Digital Lab series — designed for immediate relevance, strong public value, and future growth into packets, toolkits, and learning pathways.',
  },
  whySeriesSection: {
    title: 'Why these workshops now',
    body:
      'Artists are increasingly expected to maintain a public presence, document their work clearly, navigate emerging technologies, and communicate across multiple digital platforms. At the same time, many institutions want programming that is contemporary, useful, and accessible without becoming overly technical. Digital Lab Workshops respond to that gap with artist-centered learning experiences that combine critical thinking, practical tools, and reusable frameworks.',
  },
  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'Choose a workshop',
        body: 'Filter by focus area, level, and format. Read outcomes before you commit.',
      },
      {
        title: 'Register or express interest',
        body: 'Reserve a seat or signal interest so we can plan cohorts and materials.',
      },
      {
        title: 'Show up prepared',
        body: 'Bring what’s listed; leave with templates, language, and next steps.',
      },
    ],
  },
  forInstitutions: {
    title: 'Built for artists, adaptable for institutions',
    body:
      'These workshops can be offered as public programs, artist professional development sessions, residency support, cohort-based learning, or staff-and-artist hybrid programming. The format is flexible enough for one-time events while also supporting longer-term curriculum development.',
    bullets: [
      'Cohort-friendly scheduling',
      'Clear learning outcomes & materials lists',
      'Optional follow-up resources (roadmap for LMS)',
    ],
  },
  institutionCtas: [
    {
      label: 'Book for Your Organization',
      href: 'mailto:info@oolitearts.org?subject=Institutional%20workshop%20%E2%80%94%20Oolite%20Arts',
    },
    {
      label: 'Discuss Institutional Programming',
      href: 'mailto:info@oolitearts.org?subject=Institutional%20programming%20%E2%80%94%20Digital%20Lab',
    },
    {
      label: 'Bring This Workshop to Your Space',
      href: 'mailto:info@oolitearts.org?subject=Bring%20a%20Digital%20Lab%20workshop%20to%20our%20space',
    },
  ],
  proofLine:
    'Oolite Arts has hosted digital lab programming and professional development for artists across Miami—this catalog grows from that work.',
  comingSoonSection: {
    title: 'Coming Soon',
    subcopy:
      'The Digital Lab Workshops catalog is expanding into a larger 24-workshop system, including advanced creative coding, publishing workflows, digital archiving, and artist-centered AI practice.',
  },
  footerCtaSection: {
    title: 'Looking for a workshop for your cohort, residency, or organization?',
    body:
      'We can adapt workshops for different group sizes, technical levels, and institutional contexts — from artist-centered public programs to more focused professional development sessions.',
    ctas: [
      {
        label: 'Get in Touch',
        href: 'mailto:info@oolitearts.org?subject=Workshop%20%E2%80%94%20Get%20in%20touch',
      },
      {
        label: 'Request a Workshop',
        href: 'mailto:info@oolitearts.org?subject=Request%20a%20workshop',
      },
      {
        label: 'Discuss a Program',
        href: 'mailto:info@oolitearts.org?subject=Discuss%20a%20Digital%20Lab%20program',
      },
    ],
  },
  faq: [
    {
      q: 'Are these beginner-friendly?',
      a: 'Many sessions welcome beginners; each workshop lists level and what to bring. When in doubt, read “Who it’s for” on the detail page.',
    },
    {
      q: 'Do you offer hybrid or online options?',
      a: 'Format is listed per workshop (in person, online, or hybrid). Institutional partners can inquire about custom delivery.',
    },
    {
      q: 'Is this the same as a degree program?',
      a: 'No—it’s focused professional development. The same structure is designed to connect later to modules and resources as the platform evolves.',
    },
  ],
  institutionalInquiry: {
    email: 'info@oolitearts.org',
    subjectPrefix: '[Workshop inquiry — Oolite Digital Lab]',
    bodyIntro:
      'We are interested in institutional or cohort programming. Organization / role:',
  },
}

/** Defaults for orgs that do not have bespoke copy; satisfies full type. */
const GENERIC_DEFAULTS: Pick<
  WorkshopsLandingContent,
  | 'heroPrimaryCta'
  | 'heroSecondaryCta'
  | 'framingSection'
  | 'featuredSection'
  | 'whySeriesSection'
  | 'institutionCtas'
  | 'comingSoonSection'
  | 'footerCtaSection'
> = {
  heroPrimaryCta: { label: 'Explore workshops', href: '#workshops-catalog' },
  heroSecondaryCta: {
    label: 'Contact us',
    href: 'mailto:info@oolitearts.org',
  },
  framingSection: {
    title: 'Workshops for your practice',
    body:
      'Hands-on sessions designed to build skills and community within your organization.',
  },
  featuredSection: {
    title: 'Featured workshops',
    subcopy: 'Highlighted sessions open for registration or interest.',
  },
  whySeriesSection: {
    title: 'Why now',
    body:
      'Practical professional development for artists and cultural workers navigating digital tools and visibility.',
  },
  institutionCtas: [],
  comingSoonSection: {
    title: 'Coming soon',
    subcopy: 'More workshops are added to the catalog over time.',
  },
  footerCtaSection: {
    title: 'Questions?',
    body: 'Reach out to discuss cohorts or custom programming.',
    ctas: [{ label: 'Contact', href: 'mailto:info@oolitearts.org' }],
  },
}

export function getWorkshopsLandingContent(orgSlug: string): WorkshopsLandingContent {
  if (orgSlug === 'oolite') return OOLITE
  return {
    ...GENERIC_DEFAULTS,
    heroEyebrow: 'Workshops',
    heroTitle: 'Learn & create',
    heroTitleAccent: 'with your organization',
    heroLead:
      'Discover hands-on workshops designed to build skills and community within your organization.',
    trustLine: 'Designed for artists, educators, and cultural organizations.',
    trustItems: [
      'Individual artists & studio practitioners',
      'Nonprofits & residency programs',
      'Public-facing cultural education',
    ],
    howItWorks: OOLITE.howItWorks,
    forInstitutions: {
      ...OOLITE.forInstitutions,
      title: 'For institutions & partners',
      body:
        'Bring a cohort, sponsor a public program, or train staff. We’ll align materials and pacing with your context.',
    },
    proofLine: OOLITE.proofLine,
    faq: OOLITE.faq,
    institutionalInquiry: {
      ...OOLITE.institutionalInquiry,
      subjectPrefix: `[Workshop inquiry — ${orgSlug}]`,
    },
  }
}
