/** Airtable column names for the Agent Approvals table (INFRA24 CRM base). */
export type AgentApprovalFieldMap = {
  approvalName: string
  actionId: string
  organization: string
  goal: string
  person: string
  institution: string
  opportunity: string
  campaign: string
  actionType: string
  relationshipStage: string
  agentRecommendation: string
  reason: string
  proposedOutput: string
  riskLevel: string
  approvalStatus: string
  humanNotes: string
  approvedBy: string
  approvedAt: string
  executionStatus: string
  executionResult: string
  outcome: string
  runId: string
  readinessPercent: string
}

export const DEFAULT_AGENT_APPROVAL_FIELD_MAP: AgentApprovalFieldMap = {
  approvalName: 'Approval Name',
  actionId: 'Action ID',
  organization: 'Organization',
  goal: 'Goal',
  person: 'Person / Partner',
  institution: 'Institution',
  opportunity: 'Opportunity',
  campaign: 'Campaign',
  actionType: 'Action Type',
  relationshipStage: 'Relationship Stage',
  agentRecommendation: 'Agent Recommendation',
  reason: 'Reason',
  proposedOutput: 'Proposed Output',
  riskLevel: 'Risk Level',
  approvalStatus: 'Approval Status',
  humanNotes: 'Human Notes',
  approvedBy: 'Approved By',
  approvedAt: 'Approved At',
  executionStatus: 'Execution Status',
  executionResult: 'Execution Result',
  outcome: 'Outcome',
  runId: 'Run ID',
  readinessPercent: 'Readiness Percent',
}

export const AGENT_APPROVAL_SELECT_VALUES = {
  organization: {
    dcc: 'DCC',
    oolite: 'Oolite',
    bakehouse: 'Bakehouse',
    soho_house: 'Soho House',
    other: 'Other',
  },
  goal: {
    network_readiness: 'Network readiness',
    program_activation: 'Program activation',
    partner_pipeline: 'Partner pipeline',
    public_signal: 'Public signal',
    opportunity_radar: 'Opportunity radar',
  },
  actionType: {
    ask_for_missing_info: 'Ask for missing info',
    invite_to_dcc_index: 'Invite to DCC Index',
    invite_to_workshop: 'Invite to workshop',
    create_followup_task: 'Create follow-up task',
    draft_partner_followup: 'Draft partner follow-up',
    draft_program_invite: 'Draft program invite',
    draft_public_signal_post: 'Draft public signal post',
    update_contact_status: 'Update contact status',
    generate_report: 'Generate report',
  },
  relationshipStage: {
    new: 'New',
    warm: 'Warm',
    active: 'Active',
    partner: 'Partner',
    dormant: 'Dormant',
    needs_review: 'Needs Review',
    do_not_contact: 'Do Not Contact',
  },
  approvalStatus: {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    needs_edit: 'Needs Edit',
    executed: 'Executed',
    skipped: 'Skipped',
  },
  executionStatus: {
    not_started: 'Not started',
    running: 'Running',
    success: 'Success',
    failed: 'Failed',
    skipped: 'Skipped',
  },
  outcome: {
    none: 'No outcome yet',
    draft_created: 'Draft created',
    task_created: 'Task created',
    reply_received: 'Reply received',
    profile_completed: 'Profile completed',
    rsvp_received: 'RSVP received',
    meeting_booked: 'Meeting booked',
    ignored: 'Ignored',
    unsubscribed: 'Unsubscribed',
    rejected: 'Rejected',
    needs_human: 'Needs human follow-up',
  },
  riskLevel: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
} as const

/** Phase 1 action types the agent may propose. */
export const PHASE1_ACTION_TYPES = [
  AGENT_APPROVAL_SELECT_VALUES.actionType.ask_for_missing_info,
  AGENT_APPROVAL_SELECT_VALUES.actionType.invite_to_dcc_index,
  AGENT_APPROVAL_SELECT_VALUES.actionType.create_followup_task,
  AGENT_APPROVAL_SELECT_VALUES.actionType.draft_partner_followup,
] as const
