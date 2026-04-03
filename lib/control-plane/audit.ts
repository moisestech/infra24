import { createHash } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

export function hashPayload(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload ?? {})).digest('hex')
}

export async function logControlAction(input: {
  supabase: SupabaseClient
  organizationId: string
  actorClerkId: string
  channel: string
  actionName: string
  payload: unknown
  success: boolean
  resultMessage?: string
  correlationId?: string | null
  proposalId?: string | null
}) {
  const payload_hash = hashPayload(input.payload)
  await input.supabase.from('control_action_logs').insert({
    organization_id: input.organizationId,
    actor_clerk_id: input.actorClerkId,
    channel: input.channel,
    action_name: input.actionName,
    payload: input.payload as object,
    payload_hash,
    success: input.success,
    result_message: input.resultMessage ?? null,
    correlation_id: input.correlationId ?? null,
    proposal_id: input.proposalId ?? null,
  })
}
