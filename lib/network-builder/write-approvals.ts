import { createAirtableRecords } from '@/lib/airtable/client'
import {
  AGENT_APPROVAL_SELECT_VALUES,
  DEFAULT_AGENT_APPROVAL_FIELD_MAP,
  type AgentApprovalFieldMap,
} from '@/lib/network-builder/approval-field-map'
import type { NetworkBuilderConnection } from '@/lib/network-builder/org-config'
import type { ProposedRelationshipAction } from '@/lib/network-builder/types'

export type WriteActionsToAirtableResult = {
  written: number
  records: Array<{
    actionId: string
    airtableRecordId: string
    contactId: string
  }>
  skipped: number
  errors: string[]
}

export type WriteActionsToAirtableOptions = {
  conn: NetworkBuilderConnection
  actions: ProposedRelationshipAction[]
  runId?: string
  fieldMap?: AgentApprovalFieldMap
  organizationLabel?: string
}

function actionToAirtableFields(
  action: ProposedRelationshipAction,
  F: AgentApprovalFieldMap,
  runId?: string,
  organizationLabel = 'DCC'
): Record<string, unknown> {
  const actionLabel =
    AGENT_APPROVAL_SELECT_VALUES.actionType[action.actionType] ?? action.actionType

  const stageLabel =
    AGENT_APPROVAL_SELECT_VALUES.relationshipStage[
      action.relationshipStage as keyof typeof AGENT_APPROVAL_SELECT_VALUES.relationshipStage
    ] ?? capitalize(action.relationshipStage)

  const fields: Record<string, unknown> = {
    [F.approvalName]: `${actionLabel} — ${action.contactName}`,
    [F.actionId]: action.id,
    [F.organization]: organizationLabel,
    [F.goal]: AGENT_APPROVAL_SELECT_VALUES.goal[action.goal],
    [F.actionType]: actionLabel,
    [F.relationshipStage]: stageLabel,
    [F.agentRecommendation]: action.agentRecommendation,
    [F.reason]: action.reason,
    [F.proposedOutput]: action.proposedMessage,
    [F.riskLevel]: AGENT_APPROVAL_SELECT_VALUES.riskLevel[action.riskLevel],
    [F.approvalStatus]: AGENT_APPROVAL_SELECT_VALUES.approvalStatus.pending,
    [F.executionStatus]: AGENT_APPROVAL_SELECT_VALUES.executionStatus.not_started,
    [F.outcome]: AGENT_APPROVAL_SELECT_VALUES.outcome.none,
    [F.readinessPercent]: action.readinessPercent,
  }

  if (runId) fields[F.runId] = runId

  if (action.contactId.startsWith('rec')) {
    fields[F.person] = [action.contactId]
  }

  return fields
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Write proposed relationship actions to the Agent Approvals table in Airtable.
 * Does not execute any actions — approval queue only.
 */
export async function writeActionsToAirtable(
  options: WriteActionsToAirtableOptions
): Promise<WriteActionsToAirtableResult> {
  const {
    conn,
    actions,
    runId,
    fieldMap = DEFAULT_AGENT_APPROVAL_FIELD_MAP,
    organizationLabel = 'DCC',
  } = options
  const tableId = conn.tables.agentApprovals

  if (!tableId) {
    throw new Error(
      `Agent Approvals table not configured for org "${conn.orgSlug}". ` +
        `Set AIRTABLE_DCC_CRM_TABLE_AGENT_APPROVALS.`
    )
  }

  const liveActions = actions.filter((a) => a.contactId.startsWith('rec'))
  const skipped = actions.length - liveActions.length

  if (liveActions.length === 0) {
    return { written: 0, records: [], skipped, errors: [] }
  }

  const payload = liveActions.map((action) => ({
    fields: actionToAirtableFields(action, fieldMap, runId, organizationLabel),
  }))

  const errors: string[] = []
  let created: Awaited<ReturnType<typeof createAirtableRecords>> = []

  try {
    created = await createAirtableRecords(conn.baseId, tableId, conn.apiKey, payload)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(msg)
    return { written: 0, records: [], skipped, errors }
  }

  const records = created.map((rec, i) => ({
    actionId: liveActions[i]?.id ?? rec.id,
    airtableRecordId: rec.id,
    contactId: liveActions[i]?.contactId ?? '',
  }))

  return { written: records.length, records, skipped, errors }
}
