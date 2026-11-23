import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import {
  clerkMembershipCaptureConfig, normalizeClerkMembershipEvent,
} from '@/lib/dcc/membership/clerk-event'

export const dynamic = 'force-dynamic'

// Server-side only. No browser may reach service_role data or the event RPC.
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Server database is not configured')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function POST(req: Request) {
  const h = await headers()
  const messageId = h.get('svix-id')
  const timestamp = h.get('svix-timestamp')
  const signature = h.get('svix-signature')
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!messageId || !timestamp || !signature) return new Response('Missing webhook signature', { status: 400 })
  if (!secret) return new Response('Webhook is not configured', { status: 503 })

  // Svix must verify the ORIGINAL raw bytes, not JSON parse + reserialization.
  const rawBody = await req.text()
  let evt: WebhookEvent
  try {
    evt = new Webhook(secret).verify(rawBody, {
      'svix-id': messageId, 'svix-timestamp': timestamp, 'svix-signature': signature,
    }) as WebhookEvent
  } catch {
    return new Response('Invalid webhook signature', { status: 400 })
  }

  // No raw event logs, email, full names or webhook payloads in application logs.
  // The server-side event contract only records Clerk subject + verified boolean.
  try {
    const supabase = getServerSupabase()
    const config = clerkMembershipCaptureConfig(process.env)
    const event = normalizeClerkMembershipEvent(evt, messageId, config)
    let dccState: string | null = null
    if (event) {
      const { data, error } = await supabase.rpc('dcc_capture_clerk_membership_event', event)
      if (error) throw new Error('DCC member event persistence failed')
      dccState = typeof data === 'string' ? data : null
    }

    if (evt.type === 'user.created') {
      // If a previously deleted account's CREATE arrived late, do not revive
      // the legacy Smart Sign organization row. The private event ledger wins.
      if (dccState === 'deleted') return new Response('Previously deleted account', { status: 200 })
      const userId = evt.data.id
      const primary = evt.data.email_addresses?.find(
        (e) => e.id === evt.data.primary_email_address_id
      )
      // Preserve prior Smart Sign organization functionality without making
      // an org role evidence of DCC People membership.
      if (primary) {
        const { data: existing, error: existingError } = await supabase
          .from('org_memberships')
          .select('id')
          .eq('clerk_user_id', userId)
          .is('org_id', null)
          .limit(1)
        if (existingError) throw new Error('Organization membership lookup failed')
        if (!existing?.length) {
          const { error } = await supabase.from('org_memberships').insert({
            clerk_user_id: userId,
            role: 'resident',
            org_id: null,
            joined_at: new Date().toISOString(),
          })
          // Concurrent delivery can race in the legacy org table. Its own
          // unique constraint should be audited separately before activation.
          if (error && error.code !== '23505') throw new Error('Organization membership insert failed')
        }
      }
      return new Response('Account creation handled', { status: 200 })
    }

    if (evt.type === 'user.updated') {
      return new Response('Account update handled', { status: 200 })
    }

    if (evt.type === 'user.deleted') {
      if (typeof evt.data.id !== 'string' || !evt.data.id) {
        return new Response('Deleted account identifier missing', { status: 400 })
      }
      const { error } = await supabase
        .from('org_memberships')
        .delete()
        .eq('clerk_user_id', evt.data.id)
      if (error) throw new Error('Organization membership removal failed')
      return new Response('Account deletion handled', { status: 200 })
    }

    return new Response('Webhook ignored', { status: 200 })
  } catch {
    // Non-2xx prompts Clerk to retry. No false "member active" receipts.
    return new Response('Webhook persistence unavailable', { status: 503 })
  }
}
