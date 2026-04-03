/**
 * Org-scoped copy for the workshops marketing landing.
 * Other orgs can add parallel files or a registry later.
 */

export type WorkshopsLandingContent = {
  heroEyebrow: string
  heroTitle: string
  heroTitleAccent: string
  heroLead: string
  trustLine: string
  trustItems: string[]
  howItWorks: { title: string; steps: { title: string; body: string }[] }
  forInstitutions: {
    title: string
    body: string
    bullets: string[]
  }
  proofLine: string
  faq: { q: string; a: string }[]
  institutionalInquiry: {
    email: string
    subjectPrefix: string
    bodyIntro: string
  }
}

const OOLITE: WorkshopsLandingContent = {
  heroEyebrow: 'Creative technology & arts education',
  heroTitle: 'Workshops',
  heroTitleAccent: 'Artist infrastructure, made practical',
  heroLead:
    'Hands-on sessions in creative coding, digital presence, and professional practice—built as part of a growing program at Oolite Arts, not one-off tips.',
  trustLine: 'Designed for artists, educators, and cultural organizations.',
  trustItems: [
    'Individual artists & studio practitioners',
    'Nonprofits & residency programs',
    'Public-facing cultural education',
  ],
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
    title: 'For institutions & partners',
    body:
      'Bring a cohort, sponsor a public program, or train staff. We’ll align materials and pacing with your context.',
    bullets: [
      'Cohort-friendly scheduling',
      'Clear learning outcomes & materials lists',
      'Optional follow-up resources (roadmap for LMS)',
    ],
  },
  proofLine:
    'Oolite Arts has hosted digital lab programming and professional development for artists across Miami—this catalog grows from that work.',
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
    subjectPrefix: '[Workshop inquiry — Oolite / Infra24]',
    bodyIntro:
      'We are interested in institutional or cohort programming. Organization / role:',
  },
}

export function getWorkshopsLandingContent(orgSlug: string): WorkshopsLandingContent {
  if (orgSlug === 'oolite') return OOLITE
  return {
    ...OOLITE,
    heroTitleAccent: 'Learn & create',
    heroLead:
      'Discover hands-on workshops designed to build skills and community within your organization.',
    institutionalInquiry: {
      ...OOLITE.institutionalInquiry,
      subjectPrefix: `[Workshop inquiry — ${orgSlug}]`,
    },
  }
}
