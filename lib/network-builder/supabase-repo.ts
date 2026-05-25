import { createClient } from '@/lib/supabase/server'
import type { NetworkGoalLoop, ProposedRelationshipAction } from '@/lib/network-builder/types'
import type { WriteActionsToAirtableResult } from '@/lib/network-builder/write-approvals'

export type PersistNetworkRunInput = {
  orgSlug: string
  goalLoop: NetworkGoalLoop
  source: 'airtable' | 'fixture'
  summary: Record<string, unknown>
  actions: ProposedRelationshipAction[]
  airtableWrite?: WriteActionsToAirtableResult
}

export type PersistNetworkRunResult = {
  runId: string
  proposedActionIds: string[]
}

async function resolveOrganizationId(orgSlug: string): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', orgSlug)
    .maybeSingle()
  return data?.id ?? null
}

/** Persist agent run + proposed actions to Supabase (service role). */
export async function persistNetworkRun(
  input: PersistNetworkRunInput
): Promise<PersistNetworkRunResult | null> {
  const orgId = await resolveOrganizationId(input.orgSlug)
  if (!orgId) return null

  const supabase = createClient()

  const { data: run, error: runErr } = await supabase
    .from('network_agent_runs')
    .insert({
      organization_id: orgId,
      goal_loop: input.goalLoop,
      status: 'completed',
      source: input.source,
      summary: input.summary,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (runErr || !run) {
    throw new Error(runErr?.message ?? 'Failed to create network_agent_runs row')
  }

  const airtableByActionId = new Map(
    (input.airtableWrite?.records ?? []).map((r) => [r.actionId, r.airtableRecordId])
  )

  const rows = input.actions.map((action) => ({
    organization_id: orgId,
    run_id: run.id,
    external_action_id: action.id,
    airtable_record_id: airtableByActionId.get(action.id) ?? null,
    goal_loop: action.goal,
    contact_record_id: action.contactId,
    contact_name: action.contactName,
    action_type: action.actionType,
    relationship_stage: action.relationshipStage,
    agent_recommendation: action.agentRecommendation,
    reason: action.reason,
    proposed_message: action.proposedMessage,
    risk_level: action.riskLevel,
    approval_status: action.approvalStatus,
    execution_status: 'not_started',
    readiness_percent: action.readinessPercent,
    missing_fields: action.missingFields,
  }))

  if (rows.length === 0) {
    return { runId: run.id, proposedActionIds: [] }
  }

  const { data: inserted, error: actionsErr } = await supabase
    .from('network_proposed_actions')
    .insert(rows)
    .select('id')

  if (actionsErr) {
    throw new Error(actionsErr.message ?? 'Failed to insert network_proposed_actions')
  }

  return {
    runId: run.id,
    proposedActionIds: (inserted ?? []).map((r) => r.id as string),
  }
}
