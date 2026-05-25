/** Network Builder — goal-seeking relationship growth layer */

export type NetworkGoalLoop =
  | 'network_readiness'
  | 'program_activation'
  | 'partner_pipeline'
  | 'public_signal'
  | 'opportunity_radar'

export type RelationshipStage = 'new' | 'warm' | 'active' | 'partner' | 'dormant'

export type FollowUpCadence =
  | '30_days'
  | '60_days'
  | '90_days'
  | 'custom'
  | 'pause'
  | 'do_not_contact'
  | 'unknown'

export type ReadinessStatus =
  | 'not_ready'
  | 'partial'
  | 'ready'
  | 'high_value'
  | 'needs_review'
  | 'do_not_contact'

export type RelationshipActionType =
  | 'ask_for_missing_info'
  | 'invite_to_dcc_index'
  | 'invite_to_workshop'
  | 'create_followup_task'
  | 'draft_partner_followup'
  | 'draft_program_invite'
  | 'draft_public_signal_post'

export type ActionRiskLevel = 'low' | 'medium' | 'high'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_edit' | 'executed'

export type ExecutionStatus = 'not_started' | 'running' | 'success' | 'failed'

export type ActionOutcome =
  | 'replied'
  | 'attended'
  | 'completed_form'
  | 'ignored'
  | 'unsubscribed'
  | 'meeting_scheduled'
  | 'unknown'

/** Normalized person record from org CRM (Airtable). */
export type NetworkContact = {
  recordId: string
  fullName: string
  email?: string
  titleRole?: string
  roleType?: string
  contactCategory?: string
  practiceTags: string[]
  interestTags: string[]
  location?: string
  miamiArea?: boolean
  organizationAffiliations: string[]
  website?: string
  instagram?: string
  linkedin?: string
  warmth?: string
  relationshipStrength?: string
  relationshipType?: string
  relationshipStage: RelationshipStage
  consentStatus?: string
  dccSignupStatus?: string
  digitalOrientationStatement?: string
  source?: string
  recordType?: string
  canHelpWith: string[]
  nextBestAsk?: string
  strategicValue?: string
  /** Explicit Last Contact Date from Airtable */
  lastContactDate?: string
  /** Explicit Last Meaningful Touch from Airtable */
  lastMeaningfulTouch?: string
  /** Derived: max(meaningful touch, contact date, interaction-derived) */
  lastRecencyAt?: string
  /** @deprecated use lastRecencyAt — kept for compat */
  lastContactedAt?: string
  nextFollowUpDate?: string
  followUpStatus?: string
  followUpCadence: FollowUpCadence
  interactionCount: number
  rawFields: Record<string, unknown>
}

export type ReadinessFieldKey =
  | 'full_name'
  | 'email'
  | 'role_type'
  | 'practice_tags'
  | 'interest_tags'
  | 'digital_orientation'
  | 'website_or_social'
  | 'consent_status'
  | 'last_contacted'

export type ReadinessFieldResult = {
  key: ReadinessFieldKey
  label: string
  points: number
  earned: number
  present: boolean
  value?: string
  note?: string
}

export type NetworkReadinessScore = {
  contactId: string
  fullName: string
  score: number
  maxScore: number
  percentReady: number
  readinessStatus: ReadinessStatus
  networkReady: boolean
  fields: ReadinessFieldResult[]
  missingFields: string[]
  staleRelationship: boolean
  daysSinceContact?: number
  followUpCadence: FollowUpCadence
  relationshipStage: RelationshipStage
  priorityScore: number
  recommendedAction: RelationshipActionType
  recommendationReason: string
  isArtistSegment: boolean
}

export type ProposedRelationshipAction = {
  id: string
  goal: NetworkGoalLoop
  contactId: string
  contactName: string
  actionType: RelationshipActionType
  relationshipStage: RelationshipStage
  agentRecommendation: string
  reason: string
  proposedMessage: string
  riskLevel: ActionRiskLevel
  approvalStatus: ApprovalStatus
  readinessPercent: number
  missingFields: string[]
}

export type NetworkReadinessRunSummary = {
  orgSlug: string
  goal: NetworkGoalLoop
  runAt: string
  source: 'airtable' | 'fixture'
  totalContacts: number
  networkReadyCount: number
  incompleteCount: number
  staleCount: number
  highPriorityCount: number
  artistSegmentCount: number
  networkReadyArtistCount: number
  proposedActions: ProposedRelationshipAction[]
  topIncomplete: NetworkReadinessScore[]
  runId?: string
  airtableWrite?: {
    written: number
    skipped: number
    errors: string[]
  }
  supabasePersisted?: boolean
  reportMarkdown?: string
}

export type NetworkReadinessRunOptions = {
  orgSlug: string
  limit?: number
  staleDays?: number
  readinessThreshold?: number
  includeFixture?: boolean
  writeApprovals?: boolean
  persistToSupabase?: boolean
  reportOutPath?: string
}

export type NetworkGoalConfig = {
  goalId: string
  readinessThreshold: number
  artistTargetMvp: number
  totalContactsStretch12Mo: number
}
