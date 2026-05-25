import {
  DCC_NETWORK_GOAL_DEFAULTS,
  READINESS_FIELD_SPECS,
} from '@/lib/network-builder/field-map'
import type {
  FollowUpCadence,
  NetworkContact,
  NetworkReadinessScore,
  ReadinessFieldResult,
  ReadinessStatus,
  RelationshipActionType,
} from '@/lib/network-builder/types'

const MAX_SCORE = 100
const DEFAULT_STALE_DAYS = DCC_NETWORK_GOAL_DEFAULTS.defaultStaleDays
const DEFAULT_READINESS_THRESHOLD = DCC_NETWORK_GOAL_DEFAULTS.readinessThreshold

function daysSince(iso: string | undefined, now: Date): number | undefined {
  if (!iso) return undefined
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return undefined
  return Math.floor((now.getTime() - t) / (1000 * 60 * 60 * 24))
}

function cadenceToStaleDays(cadence: FollowUpCadence, fallback: number): number | null {
  switch (cadence) {
    case '30_days':
      return 30
    case '60_days':
      return 60
    case '90_days':
      return 90
    case 'pause':
    case 'do_not_contact':
      return null
    case 'custom':
      return null
    default:
      return fallback
  }
}

function isDoNotContact(contact: NetworkContact): boolean {
  const consent = (contact.consentStatus ?? '').toLowerCase()
  const cadence = contact.followUpCadence
  return (
    cadence === 'do_not_contact' ||
    consent.includes('do not contact') ||
    consent.includes('dnc')
  )
}

function hasSocialSignifier(contact: NetworkContact): boolean {
  return Boolean(contact.website || contact.instagram || contact.linkedin)
}

function hasDigitalOrientation(contact: NetworkContact): boolean {
  if (contact.digitalOrientationStatement?.trim()) return true
  return contact.practiceTags.length > 0
}

export function isArtistSegment(contact: NetworkContact): boolean {
  const blob = [
    contact.contactCategory,
    contact.roleType,
    contact.titleRole,
    contact.recordType,
    ...contact.practiceTags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return (
    /artist|creator|creative technologist|technologist|maker|designer/i.test(blob) &&
    !/institutional|partner|funder|venue only/i.test(blob)
  )
}

function readinessStatusFromScore(percent: number, dnc: boolean): ReadinessStatus {
  if (dnc) return 'do_not_contact'
  if (percent >= 85) return 'high_value'
  if (percent >= 70) return 'ready'
  if (percent >= 40) return 'partial'
  return 'not_ready'
}

function evaluateField(contact: NetworkContact, key: ReadinessFieldResult['key']): ReadinessFieldResult {
  const spec = READINESS_FIELD_SPECS.find((s) => s.key === key)!
  let present = false
  let value: string | undefined
  let note: string | undefined

  switch (key) {
    case 'full_name':
      present = Boolean(contact.fullName && contact.fullName !== 'Unknown')
      value = contact.fullName
      break
    case 'email':
      present = Boolean(contact.email)
      value = contact.email
      break
    case 'role_type':
      present = Boolean(contact.roleType || contact.contactCategory)
      value = contact.roleType ?? contact.contactCategory
      break
    case 'practice_tags':
      present = contact.practiceTags.length > 0
      value = contact.practiceTags.join(', ') || undefined
      break
    case 'interest_tags':
      present = contact.interestTags.length > 0
      value = contact.interestTags.join(', ') || undefined
      break
    case 'digital_orientation':
      present = hasDigitalOrientation(contact)
      value =
        contact.digitalOrientationStatement ??
        (contact.practiceTags.length ? contact.practiceTags.join(', ') : undefined)
      if (!contact.digitalOrientationStatement && contact.practiceTags.length) {
        note = 'Practice tags used as proxy'
      }
      break
    case 'website_or_social':
      present = hasSocialSignifier(contact)
      value = contact.website ?? contact.instagram ?? contact.linkedin
      break
    case 'consent_status':
      present = Boolean(contact.consentStatus)
      value = contact.consentStatus
      break
    case 'last_contacted':
      present = Boolean(contact.lastMeaningfulTouch || contact.lastContactDate || contact.lastRecencyAt)
      value = contact.lastMeaningfulTouch ?? contact.lastContactDate ?? contact.lastRecencyAt
      if (contact.lastMeaningfulTouch && contact.lastContactDate) {
        note = `Meaningful: ${contact.lastMeaningfulTouch}; Contact: ${contact.lastContactDate}`
      }
      break
  }

  const earned = present ? spec.points : 0
  return {
    key,
    label: spec.label,
    points: spec.points,
    earned,
    present,
    value,
    note,
  }
}

function isStaleRelationship(
  contact: NetworkContact,
  daysSinceContact: number | undefined,
  now: Date,
  orgStaleDaysOverride?: number
): boolean {
  if (contact.followUpCadence === 'pause' || contact.followUpCadence === 'do_not_contact') {
    return false
  }
  if (isDoNotContact(contact)) return false

  if (contact.followUpCadence === 'custom' && contact.nextFollowUpDate) {
    const due = Date.parse(contact.nextFollowUpDate)
    if (!Number.isNaN(due) && due < now.getTime()) return true
    return false
  }

  const threshold =
    cadenceToStaleDays(contact.followUpCadence, orgStaleDaysOverride ?? DEFAULT_STALE_DAYS) ??
    orgStaleDaysOverride ??
    DEFAULT_STALE_DAYS

  if (daysSinceContact === undefined) return contact.interactionCount === 0
  return daysSinceContact >= threshold
}

function computePriorityScore(
  contact: NetworkContact,
  percentReady: number,
  staleRelationship: boolean,
  daysSinceContact: number | undefined
): number {
  let score = 100 - percentReady

  const warmth = (contact.warmth ?? '').toLowerCase()
  if (warmth.includes('active') || warmth.includes('very warm')) score += 15
  else if (warmth.includes('warm')) score += 10

  const rs = (contact.relationshipStrength ?? '').toLowerCase()
  if (rs.includes('high') || rs.includes('strong')) score += 8

  if (isArtistSegment(contact)) score += 12

  const role = [
    contact.roleType,
    contact.contactCategory,
    contact.recordType,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  if (role.includes('partner') || role.includes('institutional')) score += 6

  if (contact.miamiArea) score += 5
  if (contact.interestTags.some((t) => /workshop|clinic|lab|program|dcc index/i.test(t))) score += 10
  if (contact.canHelpWith.some((t) => /workshop|program|lab/i.test(t))) score += 8
  if (staleRelationship) score += 12
  if (daysSinceContact !== undefined && daysSinceContact > 180) score += 8

  const sv = (contact.strategicValue ?? '').toLowerCase()
  if (sv.includes('high')) score += 6

  return Math.round(score)
}

function recommendAction(
  contact: NetworkContact,
  missingFields: string[],
  staleRelationship: boolean,
  networkReady: boolean
): { action: RelationshipActionType; reason: string } {
  if (networkReady && staleRelationship) {
    return {
      action: 'create_followup_task',
      reason: `Profile is network-ready but relationship is stale. Last touch: ${contact.lastRecencyAt ?? 'unknown'}.`,
    }
  }

  const missingEmail = missingFields.includes('Email')
  const missingDigital =
    missingFields.includes('Digital orientation') ||
    missingFields.includes('Practice tags')
  const missingSocial = missingFields.includes('Website / Instagram / LinkedIn')

  if (missingEmail || missingDigital || missingSocial) {
    return {
      action: 'ask_for_missing_info',
      reason: `Missing ${missingFields.slice(0, 3).join(', ')}. Cannot activate until network-ready.`,
    }
  }

  const role = [contact.contactCategory, contact.roleType].join(' ').toLowerCase()
  if (role.includes('partner') || role.includes('institutional')) {
    return {
      action: 'draft_partner_followup',
      reason: 'Institutional contact with baseline profile — draft partner follow-up.',
    }
  }

  if (!contact.dccSignupStatus || /not invited|invited/i.test(contact.dccSignupStatus)) {
    return {
      action: 'invite_to_dcc_index',
      reason: 'Invite to complete DCC Index signup and digital orientation.',
    }
  }

  if (contact.interestTags.some((t) => /workshop|clinic|lab/i.test(t))) {
    return {
      action: 'invite_to_workshop',
      reason: 'Interest tags suggest workshop fit — draft segmented invite.',
    }
  }

  return {
    action: 'invite_to_dcc_index',
    reason: 'Baseline data present — recommend DCC Index profile completion.',
  }
}

function hasContactConsent(contact: NetworkContact): boolean {
  const consent = (contact.consentStatus ?? '').toLowerCase()
  return consent.includes('permission to contact') || consent.includes('subscribed')
}

function passesNetworkReadyGates(contact: NetworkContact, percentReady: number, threshold: number): boolean {
  if (percentReady < threshold) return false
  if (!contact.fullName || contact.fullName === 'Unknown') return false
  if (!contact.email) return false
  if (isDoNotContact(contact)) return false
  if (!contact.roleType && !contact.contactCategory) return false
  if (!hasDigitalOrientation(contact)) return false
  if (contact.interestTags.length === 0) return false
  if (!hasSocialSignifier(contact)) return false
  if (!hasContactConsent(contact)) return false
  return true
}

/** Score a single contact using the DCC 100-point model. */
export function scoreNetworkReadiness(
  contact: NetworkContact,
  opts?: { staleDays?: number; readinessThreshold?: number; now?: Date }
): NetworkReadinessScore {
  const now = opts?.now ?? new Date()
  const readinessThreshold = opts?.readinessThreshold ?? DEFAULT_READINESS_THRESHOLD
  const orgStaleDays = opts?.staleDays

  const fields = READINESS_FIELD_SPECS.map((spec) => evaluateField(contact, spec.key))

  let score = 0
  for (const field of fields) {
    score += field.earned
  }

  const maxScore = MAX_SCORE
  const percentReady = Math.round(score)
  const missingFields = fields.filter((f) => !f.present).map((f) => f.label)
  const daysSinceContact = daysSince(contact.lastRecencyAt, now)
  const staleRelationship = isStaleRelationship(contact, daysSinceContact, now, orgStaleDays)
  const dnc = isDoNotContact(contact)
  const readinessStatus = readinessStatusFromScore(percentReady, dnc)
  const networkReady = passesNetworkReadyGates(contact, percentReady, readinessThreshold)

  const { action, reason } = recommendAction(contact, missingFields, staleRelationship, networkReady)

  return {
    contactId: contact.recordId,
    fullName: contact.fullName,
    score,
    maxScore,
    percentReady,
    readinessStatus,
    networkReady,
    fields,
    missingFields,
    staleRelationship,
    daysSinceContact,
    followUpCadence: contact.followUpCadence,
    relationshipStage: contact.relationshipStage,
    priorityScore: computePriorityScore(contact, percentReady, staleRelationship, daysSinceContact),
    recommendedAction: action,
    recommendationReason: reason,
    isArtistSegment: isArtistSegment(contact),
  }
}

export function scoreAllContacts(
  contacts: NetworkContact[],
  opts?: { staleDays?: number; readinessThreshold?: number }
): NetworkReadinessScore[] {
  return contacts.map((c) => scoreNetworkReadiness(c, opts))
}

export function detectMissingFields(scores: NetworkReadinessScore[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const s of scores) {
    for (const field of s.missingFields) {
      counts.set(field, (counts.get(field) ?? 0) + 1)
    }
  }
  return counts
}

export function detectStaleRelationships(scores: NetworkReadinessScore[]): NetworkReadinessScore[] {
  return scores.filter((s) => s.staleRelationship)
}

export function rankPriorityContacts(
  scores: NetworkReadinessScore[],
  limit?: number
): NetworkReadinessScore[] {
  const sorted = [...scores].sort((a, b) => b.priorityScore - a.priorityScore)
  return limit ? sorted.slice(0, limit) : sorted
}

export function summarizeReadiness(scores: NetworkReadinessScore[]) {
  const networkReadyCount = scores.filter((s) => s.networkReady).length
  const staleCount = scores.filter((s) => s.staleRelationship).length
  const highPriorityCount = scores.filter((s) => s.priorityScore >= 80).length
  const artistSegmentCount = scores.filter((s) => s.isArtistSegment).length
  const networkReadyArtistCount = scores.filter((s) => s.isArtistSegment && s.networkReady).length

  return {
    totalContacts: scores.length,
    networkReadyCount,
    incompleteCount: scores.length - networkReadyCount,
    staleCount,
    highPriorityCount,
    artistSegmentCount,
    networkReadyArtistCount,
    readinessPercent:
      scores.length > 0 ? Math.round((networkReadyCount / scores.length) * 100) : 0,
  }
}
