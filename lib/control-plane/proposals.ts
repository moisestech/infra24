import { randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_TTL_MS = 15 * 60 * 1000

export function generateCommitToken(): string {
  return randomBytes(24).toString('hex')
}

export async function createProposal(input: {
  supabase: SupabaseClient
  organizationId: string
  actorClerkId: string
  actorChannel: string
  actionName: string
  payload: unknown
  preview: unknown
  correlationId?: string | null
  idempotencyKey?: string | null
  ttlMs?: number
}): Promise<{ id: string; commitToken: string; expiresAt: string }> {
  const commitToken = generateCommitToken()
  const expiresAt = new Date(Date.now() + (input.ttlMs ?? DEFAULT_TTL_MS)).toISOString()

  const { data, error } = await input.supabase
    .from('control_proposals')
    .insert({
      organization_id: input.organizationId,
      actor_clerk_id: input.actorClerkId,
      actor_channel: input.actorChannel,
      action_name: input.actionName,
      payload: input.payload as object,
      preview: input.preview as object,
      status: 'pending',
      commit_token: commitToken,
      idempotency_key: input.idempotencyKey || null,
      correlation_id: input.correlationId || null,
      expires_at: expiresAt,
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create proposal')
  }

  return { id: data.id, commitToken, expiresAt }
}

export async function loadPendingProposal(
  supabase: SupabaseClient,
  proposalId: string,
  organizationId: string
) {
  const { data } = await supabase
    .from('control_proposals')
    .select('*')
    .eq('id', proposalId)
    .eq('organization_id', organizationId)
    .eq('status', 'pending')
    .maybeSingle()

  return data
}

export async function markProposalCommitted(
  supabase: SupabaseClient,
  proposalId: string
): Promise<void> {
  await supabase
    .from('control_proposals')
    .update({ status: 'committed', committed_at: new Date().toISOString() })
    .eq('id', proposalId)
}

export async function markProposalExpired(supabase: SupabaseClient, proposalId: string): Promise<void> {
  await supabase.from('control_proposals').update({ status: 'expired' }).eq('id', proposalId)
}
