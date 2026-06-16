/**
 * Copy and CTA structure for `/o/oolite/get-involved`.
 * Pulls live URLs from promotion registries — single hub for Apply / Book / Give / See.
 */

import { OOLITE_CAPITAL_CAMPAIGN_URL } from '@/lib/oolite/capital-campaign-showcase'
import { DIGITAL_LAB_QGIV_HUB_URL } from '@/lib/orgs/oolite/digital-lab-qgiv-offerings'
import {
  getPublicOpenCallOfferings,
  OOLITE_ELLIES_OPEN_CALLS_URL,
  OOLITE_OPEN_CALLS_WINDOW,
  OOLITE_SUBMITTABLE_PORTAL_URL,
} from '@/lib/oolite/open-calls-showcase'

export type GetInvolvedPillar = {
  id: string
  eyebrow: string
  title: string
  body: string
  primaryCta: { label: string; href: string; external?: boolean }
  secondaryCta?: { label: string; href: string; external?: boolean }
  imageUrl?: string
  highlights?: string[]
}

export const getInvolvedHubCopy = {
  heroEyebrow: 'Oolite Arts',
  heroTitle: 'Get involved',
  heroLead:
    'Apply for 2027 opportunities, book Digital Lab workshops and consulting, support our new campus, and see what\'s on view — all in one place.',
  agentCta: {
    label: 'Ask the Memory Agent',
    href: '/o/oolite/memory-agent',
  },
} as const

const FROM_WITHIN_IMAGE =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1780505821/teens-resident-TJ-PHOTO-scaled_diiopj.jpg'

const OPEN_CALLS_IMAGE =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1768968673/january-ellies-2026_xtllmg.gif'

const CAMPUS_IMAGE =
  'https://res.cloudinary.com/dkod1at3i/image/upload/v1781623326/oolite-arts-new-campus-20220315_AMICON_OA_V4_5400px_02-1500x957_urvqlc.jpg'

export function getInvolvedPillars(): GetInvolvedPillar[] {
  const openCallLabels = getPublicOpenCallOfferings()
    .map((o) => o.shortLabel)
    .slice(0, 6)

  return [
    {
      id: 'see',
      eyebrow: 'On view',
      title: 'From Within',
      body:
        'Youth Artist Residents reflect on the experiences and environments that shape their creative lives. On view at the Oolite Arts Vitrine, July 8 – Oct. 4, 2026.',
      primaryCta: {
        label: 'Learn about the exhibition',
        href: '/o/oolite/memory-agent',
      },
      secondaryCta: {
        label: 'Ask what\'s on view',
        href: '/o/oolite/memory-agent',
      },
      imageUrl: FROM_WITHIN_IMAGE,
      highlights: [
        'Ana Blanco, Noa Garcia, Emely Yanji, Melina Walsh, TJ Wright',
        '924 Lincoln Rd., Miami Beach',
      ],
    },
    {
      id: 'apply',
      eyebrow: 'Apply now',
      title: '2027 Open Calls',
      body: `Applications open ${OOLITE_OPEN_CALLS_WINDOW.display}. The Ellies, Studio Residency, Home + Away, and Cinematic Residency — apply through Submittable.`,
      primaryCta: {
        label: 'Apply now',
        href: OOLITE_SUBMITTABLE_PORTAL_URL,
        external: true,
      },
      secondaryCta: {
        label: 'View all opportunities',
        href: OOLITE_ELLIES_OPEN_CALLS_URL,
        external: true,
      },
      imageUrl: OPEN_CALLS_IMAGE,
      highlights: openCallLabels,
    },
    {
      id: 'book',
      eyebrow: 'Digital Lab @ 924',
      title: 'Book workshops & consulting',
      body:
        'Reserve a workshop seat, 1:1 consultation, or studio visit — from Vibe Coding and website audits to 3D printing, VR, and open lab time.',
      primaryCta: {
        label: 'Book a session',
        href: DIGITAL_LAB_QGIV_HUB_URL,
        external: true,
      },
      secondaryCta: {
        label: 'Browse Digital Lab',
        href: '/o/oolite/digital-lab',
      },
      highlights: [
        'Tuesdays & Wednesdays, 11 a.m. – 7 p.m.',
        'Studio 105 · 924 Lincoln Rd.',
      ],
    },
    {
      id: 'give',
      eyebrow: 'Our New Home',
      title: 'Support the Little River campus',
      body:
        'Help build Oolite\'s 26,850-square-foot artist village in Little River — designed by Barozzi Veiga with studios, fabrication, classrooms, and public spaces for generations of Miamians.',
      primaryCta: {
        label: 'Learn & give',
        href: OOLITE_CAPITAL_CAMPAIGN_URL,
        external: true,
      },
      secondaryCta: {
        label: 'Ask about the capital project',
        href: '/o/oolite/memory-agent',
      },
      imageUrl: CAMPUS_IMAGE,
      highlights: [
        'LEED-targeted design',
        '24 artist studios · fabrication · classrooms',
      ],
    },
  ]
}
