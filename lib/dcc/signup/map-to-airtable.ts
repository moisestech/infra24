import type { DccAttributionPayload } from '@/lib/dcc/signup/schema-attribution'
import { resolveSignupSourceLabel } from '@/lib/dcc/signup/signup-source-labels'
import type { DccSignupQuickInput } from '@/lib/dcc/signup/schema-quick'
import type { SignupPathwayMeta } from '@/lib/dcc/signup/pathways'
import type { DccSignupFormInput } from '@/lib/dcc/signup/schema'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'
import {
  DEMO_READINESS_OPTIONS,
} from '@/lib/network-builder/demo-select-options'
import {
  GRAPH_LAYER_OPTIONS,
  PUBLIC_PROFILE_CONSENT_OPTIONS,
} from '@/lib/network-builder/people-select-options'

const F = DEFAULT_DCC_PEOPLE_FIELD_MAP

export function mapConsentAnswer(
  answer: DccSignupFormInput['consentAnswer'],
  newsletter?: boolean
): string {
  if (newsletter && answer === 'yes') return 'Subscribed'
  switch (answer) {
    case 'yes':
      return 'Permission to Contact'
    case 'specific':
      return 'Needs Confirmation'
    case 'no':
      return 'Do Not Contact'
  }
}

export function mapPublicListingConsent(answer: DccSignupFormInput['publicListingConsent']): string {
  switch (answer) {
    case 'yes':
      return PUBLIC_PROFILE_CONSENT_OPTIONS.publicListingOk
    case 'ask':
      return PUBLIC_PROFILE_CONSENT_OPTIONS.askBeforePublishing
    case 'no':
      return PUBLIC_PROFILE_CONSENT_OPTIONS.doNotPublish
  }
}

export function normalizeUrl(raw?: string): string | undefined {
  const v = raw?.trim()
  if (!v) return undefined
  if (/^https?:\/\//i.test(v)) return v
  if (v.startsWith('www.')) return `https://${v}`
  return v
}

/** CRM Source channel — not the same as Signup Source (activation label). */
export const DCC_SIGNUP_CRM_SOURCE = 'Online' as const

function mapConsentToUpdates(
  consentAnswer: 'yes' | 'specific' | 'no',
  newsletterOptIn?: boolean
): boolean {
  return consentAnswer === 'yes' || Boolean(newsletterOptIn)
}

export function applyAttributionFields(
  fields: Record<string, unknown>,
  attr: DccAttributionPayload & { source?: string }
): Record<string, unknown> {
  const out = { ...fields }
  if (attr.utmSource) out[F.utmSource] = attr.utmSource
  if (attr.utmMedium) out[F.utmMedium] = attr.utmMedium
  if (attr.utmCampaign) out[F.utmCampaign] = attr.utmCampaign
  if (attr.utmContent) out[F.utmContent] = attr.utmContent
  // UTM Term: optional — only written when present in URL; skip adding column in Airtable unless needed.
  if (attr.utmTerm) out[F.utmTerm] = attr.utmTerm
  if (attr.qrCodeId) out[F.qrCodeId] = attr.qrCodeId
  if (attr.landingPage) out[F.landingPage] = attr.landingPage
  if (attr.referrer) out[F.referrer] = attr.referrer
  const signupLabel = resolveSignupSourceLabel(attr.source)
  if (signupLabel) out[F.signupSource] = signupLabel
  return out
}

/** Map validated signup → Airtable People fields (including hidden defaults). */
export function mapSignupToAirtableFields(
  input: DccSignupFormInput,
  pathway: SignupPathwayMeta,
  submittedAt: Date = new Date()
): Record<string, unknown> {
  const consentStatus = mapConsentAnswer(input.consentAnswer, input.newsletterOptIn)
  const publicProfileConsent = mapPublicListingConsent(input.publicListingConsent)

  const fields: Record<string, unknown> = {
    [F.name]: input.fullName,
    [F.email]: input.email,
    [F.city]: input.city,
    [F.contactCategory]: input.contactCategory,
    [F.practiceTags]: input.practiceTags,
    [F.digitalOrientationStatement]: input.digitalOrientationStatement,
    [F.interestTags]: input.interestTags,
    [F.consentStatus]: consentStatus,
    [F.publicProfileConsent]: publicProfileConsent,
    [F.signupPathway]: pathway.signupPathwayValue,
    [F.signupSubmittedAt]: submittedAt.toISOString(),
    [F.source]: DCC_SIGNUP_CRM_SOURCE,
    [F.consentToUpdates]: mapConsentToUpdates(input.consentAnswer, input.newsletterOptIn),
    [F.dccSignupStatus]: 'Signed Up',
    [F.relationshipStrength]: 'Unknown',
    [F.warmth]: 'Warm',
    [F.followUpStatus]: 'New signup',
    [F.followUpCadence]: '60 Days',
    [F.recordType]: 'Named Person',
    [F.graphLayer]: GRAPH_LAYER_OPTIONS.networkNode,
    [F.networkReadinessStatus]: 'Partial',
    [F.demoReadiness]: DEMO_READINESS_OPTIONS.needsReview,
    [F.researchParticipationStatus]: input.researchContributor
      ? 'Interested in Research View'
      : 'Not Asked',
    [F.researchAccessLevel]: input.researchContributor ? 'Contributor View' : 'None',
    [F.agentNotes]: 'New DCC Index signup via /network/signup. Needs review/scoring.',
  }

  const website = normalizeUrl(input.website)
  if (website) fields[F.website] = website
  if (input.instagram?.trim()) fields[F.instagram] = input.instagram.trim()
  const linkedin = normalizeUrl(input.linkedin)
  if (linkedin) fields[F.linkedin] = linkedin

  if (/miami|hialeah|coral gables|fort lauderdale|south florida/i.test(input.city)) {
    fields[F.miami] = true
  }

  return applyAttributionFields(fields, input)
}

/** Short campaign signup → People with sensible defaults for index review. */
export function mapQuickSignupToAirtableFields(
  input: DccSignupQuickInput,
  pathway: SignupPathwayMeta,
  submittedAt: Date = new Date()
): Record<string, unknown> {
  const consentStatus = mapConsentAnswer(input.consentAnswer, input.newsletterOptIn)
  const orientation =
    input.message?.trim() ||
    'Joined via DCC campaign signup (short form). Profile to be completed or reviewed.'

  const fields: Record<string, unknown> = {
    [F.name]: input.fullName,
    [F.email]: input.email,
    [F.city]: 'Miami',
    [F.contactCategory]: input.contactCategory,
    [F.practiceTags]: ['Digital Culture'],
    [F.digitalOrientationStatement]: orientation,
    [F.interestTags]: input.interestTags,
    [F.consentStatus]: consentStatus,
    [F.publicProfileConsent]: PUBLIC_PROFILE_CONSENT_OPTIONS.askBeforePublishing,
    [F.signupPathway]: pathway.signupPathwayValue,
    [F.signupSubmittedAt]: submittedAt.toISOString(),
    [F.source]: DCC_SIGNUP_CRM_SOURCE,
    [F.consentToUpdates]: mapConsentToUpdates(input.consentAnswer, input.newsletterOptIn),
    [F.dccSignupStatus]: 'Signed Up',
    [F.relationshipStrength]: 'Unknown',
    [F.warmth]: 'Warm',
    [F.followUpStatus]: 'New signup',
    [F.followUpCadence]: '60 Days',
    [F.recordType]: 'Named Person',
    [F.graphLayer]: GRAPH_LAYER_OPTIONS.networkNode,
    [F.networkReadinessStatus]: 'Partial',
    [F.demoReadiness]: DEMO_READINESS_OPTIONS.needsReview,
    [F.researchParticipationStatus]: 'Not Asked',
    [F.researchAccessLevel]: 'None',
    [F.agentNotes]: 'New DCC campaign signup (short form). Needs review/scoring.',
    [F.miami]: true,
  }

  if (input.organization?.trim()) fields[F.institution] = input.organization.trim()
  const website = normalizeUrl(input.website)
  if (website) fields[F.website] = website
  if (input.instagram?.trim()) fields[F.instagram] = input.instagram.trim()

  return applyAttributionFields(fields, input)
}

export function mergeCampaignLink(
  fields: Record<string, unknown>,
  existingCampaignIds: string[] | undefined,
  campaignId: string | undefined
): Record<string, unknown> {
  if (!campaignId?.startsWith('rec')) return fields
  const merged = new Set<string>(existingCampaignIds ?? [])
  merged.add(campaignId)
  return { ...fields, [F.campaigns]: [...merged] }
}
