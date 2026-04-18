import { LEARN_AI_WORKSHOP_SLUG } from './constants'

const DEFAULT_EMAIL = 'm@moises.tech'

export function getLearnAiContactEmail(): string {
  return (
    (typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_LEARN_AI_EMAIL?.trim()) ||
    DEFAULT_EMAIL
  )
}

export function buildLearnAiMailto(opts: {
  subject: string
  body?: string
  email?: string
}): string {
  const email = opts.email ?? getLearnAiContactEmail()
  const params = new URLSearchParams()
  params.set('subject', opts.subject)
  if (opts.body) params.set('body', opts.body)
  return `mailto:${email}?${params.toString()}`
}

export function learnAiInstitutionalInquiryMailto(workshopTitle: string): string {
  return buildLearnAiMailto({
    subject: `Bring “${workshopTitle}” to our space`,
    body: `Hello,\n\nWe are interested in hosting "${workshopTitle}" (${LEARN_AI_WORKSHOP_SLUG}).\n\nOrganization / venue:\nPreferred dates:\nAudience size:\nTech setup available:\n\nThank you,`,
  })
}
