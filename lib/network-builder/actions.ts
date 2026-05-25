import { randomBytes } from 'crypto'
import type { NetworkContact } from '@/lib/network-builder/read-contacts'
import type {
  NetworkReadinessScore,
  ProposedRelationshipAction,
  RelationshipActionType,
} from '@/lib/network-builder/types'

function actionId(): string {
  return `act_${randomBytes(6).toString('hex')}`
}

function riskForAction(type: RelationshipActionType): ProposedRelationshipAction['riskLevel'] {
  switch (type) {
    case 'create_followup_task':
    case 'ask_for_missing_info':
      return 'low'
    case 'invite_to_dcc_index':
    case 'invite_to_workshop':
    case 'draft_program_invite':
      return 'medium'
    case 'draft_partner_followup':
    case 'draft_public_signal_post':
      return 'medium'
    default:
      return 'low'
  }
}

function draftMessage(
  contact: NetworkContact,
  actionType: RelationshipActionType,
  missingFields: string[]
): string {
  const firstName = contact.fullName.split(/\s+/)[0] || contact.fullName

  switch (actionType) {
    case 'ask_for_missing_info':
      return `Hi ${firstName},

We're updating the DCC network index and would love to include you accurately. Could you share ${missingFields.slice(0, 2).join(' and ').toLowerCase()}?

Thank you,
DCC Miami`

    case 'invite_to_dcc_index':
      return `Hi ${firstName},

We'd like to invite you to complete your profile in the DCC Index — Miami's map of people working at the intersection of art, software, and digital culture.

It takes about 5 minutes and helps us connect you to workshops, partners, and opportunities that fit your practice.

Best,
DCC Miami`

    case 'invite_to_workshop':
      return `Hi ${firstName},

Based on your interests${contact.interestTags.length ? ` (${contact.interestTags.slice(0, 2).join(', ')})` : ''}, we'd love to invite you to an upcoming DCC workshop.

We run practical clinics for artists working with AI, web, video, and digital tools — and your profile looks like a strong fit.

Would you like details on the next session?

Best,
DCC Miami`

    case 'create_followup_task':
      return `Follow up with ${contact.fullName}${contact.roleType ? ` (${contact.roleType})` : ''}. Last contact: ${contact.lastContactedAt ?? 'unknown'}. Goal: reactivate warm relationship and identify next program or partner fit.`

    case 'draft_partner_followup':
      return `Hi ${firstName},

Following up on our recent conversation about digital culture infrastructure in Miami. We'd love to explore a concrete next step — whether a workshop pilot, clinic, or co-hosted program.

Are you available for a 20-minute call in the next two weeks?

Best,
DCC Miami`

    case 'draft_program_invite':
      return `Hi ${firstName},

We're putting together the next DCC program and think you'd be a great fit for the room. Would you like an invite to the upcoming session?

Best,
DCC Miami`

    case 'draft_public_signal_post':
      return `[Draft social/recap post featuring ${contact.fullName} — to be reviewed before publishing]`

    default:
      return `Draft outreach for ${contact.fullName}.`
  }
}

function agentRecommendation(actionType: RelationshipActionType, contact: NetworkContact): string {
  switch (actionType) {
    case 'ask_for_missing_info':
      return `Request missing profile fields from ${contact.fullName} before activation.`
    case 'invite_to_dcc_index':
      return `Invite ${contact.fullName} to complete or update their DCC Index profile.`
    case 'invite_to_workshop':
      return `Send a segmented workshop invitation to ${contact.fullName}.`
    case 'create_followup_task':
      return `Create an internal follow-up task for ${contact.fullName}.`
    case 'draft_partner_followup':
      return `Draft a partner follow-up email for ${contact.fullName}.`
    case 'draft_program_invite':
      return `Draft a program invitation for ${contact.fullName}.`
    default:
      return `Propose relationship action for ${contact.fullName}.`
  }
}

/** Generate proposed relationship actions from ranked readiness scores. */
export function generateRelationshipActions(
  rankedScores: NetworkReadinessScore[],
  contactsById: Map<string, NetworkContact>,
  limit = 25
): ProposedRelationshipAction[] {
  const actions: ProposedRelationshipAction[] = []
  const seenContacts = new Set<string>()

  for (const score of rankedScores) {
    if (actions.length >= limit) break
    if (seenContacts.has(score.contactId)) continue

    const contact = contactsById.get(score.contactId)
    if (!contact) continue

    // Skip fully ready, non-stale contacts
    if (score.networkReady && !score.staleRelationship) continue

    seenContacts.add(score.contactId)

    actions.push({
      id: actionId(),
      goal: 'network_readiness',
      contactId: score.contactId,
      contactName: score.fullName,
      actionType: score.recommendedAction,
      relationshipStage: score.relationshipStage,
      agentRecommendation: agentRecommendation(score.recommendedAction, contact),
      reason: score.recommendationReason,
      proposedMessage: draftMessage(contact, score.recommendedAction, score.missingFields),
      riskLevel: riskForAction(score.recommendedAction),
      approvalStatus: 'pending',
      readinessPercent: score.percentReady,
      missingFields: score.missingFields,
    })
  }

  return actions
}
