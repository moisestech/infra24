/**
 * Public known-facts ledger for `/now`.
 * Keep this aligned with docs/dcc/STATUS.md. Do not invent dates, names, or prices.
 */

import { CLANDESTINE_PLACEHOLDER, DCC_CULTURAL_POSITION } from '@/lib/dcc/culture/copy'

export const DCC_NOW_PATH = '/now'

export const DCC_NOW_TITLE = 'Where DCC MIA is now'

export const DCC_NOW_LEAD =
  'A public snapshot of what is live, what is empty on purpose, and how to take part. Names, dates, and prices appear only when they are confirmed.'

export const DCC_NOW_POSITION = DCC_CULTURAL_POSITION

export type DccNowLink = {
  href: string
  label: string
}

export type DccNowItem = {
  kicker: string
  title: string
  body: string
  links?: DccNowLink[]
}

export const DCC_NOW_LIVE_INTRO =
  'These surfaces already have public pages. What you see there is the record — not a storefront preview.'

export const DCC_NOW_FORTHCOMING: DccNowItem[] = [
  {
    kicker: 'Program 001',
    title: 'Clandestine roster, dates, and venue',
    body: CLANDESTINE_PLACEHOLDER,
  },
  {
    kicker: 'Journal',
    title: 'DCC Conversations',
    body: 'Conversations will be published as recorded interviews and studio visits are edited. A podcast feed is not launching in this phase.',
    links: [{ href: '/journal/conversations', label: 'Conversations' }],
  },
  {
    kicker: 'Photography',
    title: 'Documentary shop, class, and fair stills',
    body: 'Bakehouse room, resin class and kit photos, a documentary fabricate hero, and Clandestine hang photography are not on the site. Conceptual educational stills are labeled as such.',
  },
  {
    kicker: 'Studios',
    title: 'Angelo 360',
    body: 'Moises and Fabiola have studio tours. Angelo has a portrait only — there is no 360 to invent.',
    links: [{ href: '/artists/angelo-caruso', label: 'Angelo Caruso' }],
  },
]

export const DCC_NOW_PHOTOGRAPHY: DccNowItem = {
  kicker: 'How photographs work',
  title: 'Conceptual educational vs documentary',
  body: 'Workshop pages use conceptual educational stills: one action per frame, labels in HTML, caption “Conceptual educational image.” They are not evidence that a class already ran. Fabricate stills that are conceptual say so. Founder portraits on /artists are documentary and approved.',
}

export const DCC_NOW_PARTICIPATE: DccNowItem = {
  kicker: 'How to participate',
  title: 'Inquiry, lab, and quote',
  body: 'Register interest in a syllabus, walk into Saturday Lab, or request a fabrication quote. There is no DCC-owned checkout on these pages. Paid Oolite Digital Lab classes convert on QGiv when that is the system of record.',
  links: [
    { href: '/workshops', label: 'Workshops' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/fabricate/quote', label: 'Request a quote' },
  ],
}
