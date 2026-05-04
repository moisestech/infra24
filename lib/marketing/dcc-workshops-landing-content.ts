import type { WorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content';

/** Open Graph / Twitter card image for `/workshops` and public workshop detail SEO. */
export const DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1776544585/seo-workshop-banner_np2vhf.png' as const

/**
 * Copy for DCC.miami `/workshops` and public workshop detail — no partner-org branding in hero/footer.
 * Institutional mailto uses a DCC-facing address; replace with a live inbox when set.
 */
export const DCC_MARKETING_WORKSHOPS_LANDING: WorkshopsLandingContent = {
  heroEyebrow: 'Digital Culture Center Miami',
  heroTitle: 'Workshop catalog',
  heroTitleAccent: 'for digital practice',
  heroLead: '',
  heroPrimaryCta: {
    label: 'Browse Catalog',
    href: '#catalog',
  },
  heroSecondaryCta: {
    label: 'Contact DCC',
    href: '/contact',
  },
  trustLine: 'Designed for artists, educators, and cultural organizations.',
  trustItems: [
    'Individual artists & studio practitioners',
    'Nonprofits & residency programs',
    'Public-facing cultural education',
  ],
  framingSection: {
    title: 'A public workshop layer for contemporary digital culture',
    body:
      'Workshops meet artists where digital practice happens: writing, search visibility, documentation, browser-based publishing, AI-assisted workflows, and creative experimentation.\n\nSessions are beginner-friendly overall, with room for more advanced approaches as the catalog grows. Each workshop can stand alone or connect to broader DCC pilot programming.',
  },
  featuredSection: {
    title: 'Catalog',
    subcopy:
      'Published sessions listed below are open for discovery on DCC.miami. Registration and member tools may use a separate workspace after sign-in.',
  },
  whySeriesSection: {
    title: 'Why now',
    body:
      'Artists and smaller cultural organizations need practical support for the systems that shape how work is presented, discovered, and sustained. DCC workshops are part of that support layer — public, legible, and accountable to Miami’s cultural field.',
  },
  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'Choose a workshop',
        body: 'Read outcomes, level, and format on each listing before you commit.',
      },
      {
        title: 'Register or reach out',
        body: 'Use the paths on each workshop page; cohorts and materials are planned from real sign-ups and interest.',
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
      'Workshops can support public programs, professional development, residency weeks, or hybrid staff-and-artist training. DCC can align pacing and materials with your context — start from the contact path.',
    bullets: [
      'Cohort-friendly scheduling',
      'Clear learning outcomes & materials lists',
      'Pilot-friendly documentation for funders and hosts',
    ],
  },
  institutionCtas: [
    { label: 'Partner with DCC', href: '/partners' },
    { label: 'Grants & pilot', href: '/grants' },
    { label: 'Contact', href: '/contact' },
  ],
  proofLine:
    'Digital Culture Center Miami builds public-facing digital culture infrastructure with artists and organizations — workshops are one entry point into that work.',
  comingSoonSection: {
    title: 'Growing catalog',
    subcopy:
      'Additional sessions and pathways are added as the Year 1 pilot expands — including advanced creative practice, publishing workflows, and artist-centered AI literacy.',
  },
  footerCtaSection: {
    title: 'Workshop for your cohort, residency, or organization?',
    body:
      'Tell us about group size, technical level, and timeline. We will route institutional and cohort inquiries through DCC’s contact path.',
    ctas: [
      { label: 'Contact DCC', href: '/contact' },
      { label: 'For funders', href: '/for-funders' },
      { label: 'Programs overview', href: '/programs' },
    ],
  },
  faq: [
    {
      q: 'Are these beginner-friendly?',
      a: 'Many sessions welcome beginners; each workshop lists level and what to bring. Read “Who it’s for” on the detail page when in doubt.',
    },
    {
      q: 'Do you offer hybrid or online options?',
      a: 'Format is listed per workshop. Partners can inquire about custom delivery via Contact.',
    },
    {
      q: 'Is this a degree program?',
      a: 'No — it is focused professional development and public learning, designed to connect to broader DCC pilot services over time.',
    },
  ],
  institutionalInquiry: {
    email: 'contact@dcc.miami',
    subjectPrefix: '[Workshop inquiry — DCC Miami]',
    bodyIntro: 'We are interested in institutional or cohort programming. Organization / role:',
  },
};

export function getDccMarketingWorkshopsLandingContent(): WorkshopsLandingContent {
  return DCC_MARKETING_WORKSHOPS_LANDING;
}
