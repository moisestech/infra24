/**
 * Placeholder PDF contract templates for the IP + AI workshop Learn tab.
 * Swap `href` for real file URLs when assets are ready.
 */
export type IpAgeOfAiPdfTemplate = {
  id: string
  title: string
  description: string
  /** When null, row is disabled with “coming soon” */
  href: string | null
}

export const ipAgeOfAiLawyerContractPdfTemplates: IpAgeOfAiPdfTemplate[] = [
  {
    id: 'commission',
    title: 'Commission agreement — term sheet',
    description: 'Scope, deliverables, payment milestones, and rights retained vs. licensed.',
    href: null,
  },
  {
    id: 'license',
    title: 'Content license (image / recording)',
    description: 'Territory, duration, credit, exclusivity, and AI / training carve-outs.',
    href: null,
  },
  {
    id: 'collaboration',
    title: 'Collaboration / joint authorship',
    description: 'Split ownership, approvals, expenses, and dispute resolution.',
    href: null,
  },
  {
    id: 'work-for-hire',
    title: 'Work-for-hire clarification addendum',
    description: 'When “WFH” language appears—plain-language flags before you sign.',
    href: null,
  },
  {
    id: 'nda',
    title: 'Mutual NDA (short form)',
    description: 'Confidentiality for pitches, unreleased work, and client materials.',
    href: null,
  },
  {
    id: 'termination',
    title: 'Agreement termination letter',
    description: 'Wind-down template for ending a relationship while preserving portfolio use.',
    href: null,
  },
]
