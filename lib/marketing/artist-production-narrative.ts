/**
 * Artist-production sales layer for DCC Miami.
 *
 * Mission stays on the cultural-center homepage. This file is the sales message:
 * DCC is defined by the uncertainty it removes for an artist — not by machines or programs.
 *
 * Promise ceiling: do not claim DCC handles everything from idea to finished work,
 * nor a specialist-partner general-contractor model, until ops can fulfill it.
 */

import type { ServiceLaneId } from '@/lib/dcc/fabrication/lanes'

export const ARTIST_PRODUCTION_CUSTOMER =
  'Artists who know what they want to make but not how to make it.'

export const ARTIST_PRODUCTION_ADVANTAGE =
  'Trust through transparent technical guidance.'

/** Remember / repeat. Not the homepage H1. */
export const ARTIST_PRODUCTION_PROMISE = 'We help artists figure out how to make it.'

/** Spoken / homepage production band headline. */
export const ARTIST_PRODUCTION_SPOKEN = 'You bring the idea. We help you make it.'

export const ARTIST_PRODUCTION_SUPPORT =
  'DCC MIA helps artists turn rough ideas into real work through technical planning, CAD, prototyping and digital fabrication.'

/** Mission — keep, do not use as the sales headline. */
export const ARTIST_PRODUCTION_MISSION =
  'Elevate born-digital artistic production and technical literacy in Miami.'

export const ARTIST_PRODUCTION_DIFFERENTIATORS = [
  'No membership.',
  'No residency.',
  'No print-ready file required.',
] as const

export const ARTIST_PRODUCTION_CHIP = 'No print-ready file required.'

export const ARTIST_PRODUCTION_WHY_HEADLINE = 'Built around artists, not machines.'

export const ARTIST_PRODUCTION_WHY_BODY =
  "You don't need to know which printer, software or fabrication process you need before contacting us. You tell us what you're trying to make. We help figure out the rest."

/** Full worksheet sentence — about/FAQ, not the H1. */
export const ARTIST_PRODUCTION_VALUE_PROP =
  'We help artists who know what they want to make but not how to make it turn rough ideas into finished work through one guided production process, without needing a print-ready file or coordinating multiple vendors.'

export const ARTIST_PRODUCTION_CTA = {
  startProject: {
    label: 'Start a project',
    href: '/fabricate/quote?lane=make-it-with-me',
  },
  printMyFile: {
    label: 'Print my file',
    href: '/fabricate/quote?lane=print-my-file',
  },
} as const

/** Lane card CTA labels. Lane titles stay; CTAs map the two-lane sales model onto three products. */
export const ARTIST_PRODUCTION_LANE_CTA: Record<ServiceLaneId, string> = {
  'print-my-file': 'Print my file',
  'prepare-fabricate': 'Start this lane',
  'make-it-with-me': 'Start a project',
}

/**
 * MAKE / LEARN / SHOW — company engines, not a third nav.
 * LEARN feeds MAKE. SHOW compounds both. MAKE is the economic engine.
 */
export const ARTIST_PRODUCTION_ENGINES = [
  {
    id: 'make',
    label: 'MAKE',
    title: 'Fabricate',
    body: 'Technical production for artists — planning, CAD, prototyping and fabrication.',
    href: '/fabricate',
    linkLabel: 'Start a project',
    icon: 'Wrench' as const,
    accent: 'coral' as const,
  },
  {
    id: 'learn',
    label: 'LEARN',
    title: 'Workshops',
    body: 'Build the skills to understand and use the tools — without becoming a technician to stay an artist.',
    href: '/workshops',
    linkLabel: 'Browse workshops',
    icon: 'GraduationCap' as const,
    accent: 'teal' as const,
  },
  {
    id: 'show',
    label: 'SHOW',
    title: 'Journal',
    body: 'Present, document and circulate born-digital work. Proof beats prestige.',
    href: '/journal',
    linkLabel: 'Open journal',
    icon: 'Sparkles' as const,
    accent: 'magenta' as const,
  },
] as const

/**
 * MADE — working process name for a paid production job.
 * Distinct from Learn → Test → Make (how an artist moves through DCC).
 * Not a trademark; validate whether customers remember it first.
 */
export const ARTIST_PRODUCTION_MADE_TAGLINE = 'From idea to MADE.'

export const ARTIST_PRODUCTION_MADE_STEPS = [
  {
    id: 'map',
    letter: 'M',
    label: 'Map the idea',
    detail: "What are you trying to make? Intent, scale, deadline and budget.",
  },
  {
    id: 'advise',
    letter: 'A',
    label: 'Advise the path',
    detail: 'Which process, material, CAD work and production approach actually make sense.',
  },
  {
    id: 'develop',
    letter: 'D',
    label: 'Develop & prototype',
    detail: 'Model, test and refine before committing to production.',
  },
  {
    id: 'execute',
    letter: 'E',
    label: 'Execute & finish',
    detail: 'Fabricate, finish, document and hand off the result.',
  },
] as const

export const ARTIST_PRODUCTION_DISCOVERY = {
  making: {
    label: 'What are you trying to make?',
    hint: 'Sketch, object, installation, edition — however rough.',
  },
  blocking: {
    label: "What's stopping you from making it now?",
    hint: 'File, material, cost, deadline, or not knowing the path.',
  },
  deadline: {
    label: 'Deadline',
    hint: 'Show, install, or when you need it in hand.',
  },
  success: {
    label: 'What would success look like?',
    hint: 'One object, a prototype, or a path you can continue.',
  },
} as const

export const ARTIST_PRODUCTION_PROOF_CAPTION =
  'DCC process still — conceptual, not a client commission.'

export const ARTIST_PRODUCTION_SLOGAN =
  'For artists who know what they want to make.' as const
