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

function buildSourceLabel(source?: string): string {
  const base = 'Online'
  if (!source?.trim()) return base
  return `${base} (${source.trim()})`
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
    [F.source]: buildSourceLabel(input.source),
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

  return fields
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
