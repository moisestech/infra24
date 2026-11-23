import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { clerkMembershipCaptureConfig } from '@/lib/dcc/membership/clerk-event'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'private, no-store, max-age=0' }

type PublicState = 'pending_sync' | 'verification_required' | 'pending_review' |
  'identity_review' | 'active' | 'restricted'
function safeStatus(state: unknown): PublicState {
  switch (state) {
    case 'pending_verification': return 'verification_required'
    case 'pending_reconciliation': return 'pending_review'
    case 'review_required': return 'identity_review'
    case 'active': return 'active'
    case 'withdrawn':
    case 'suspended':
    case 'deleted': return 'restricted'
    default: return 'pending_sync'
  }
}

/**
 * Server-authenticated, feature-gated status only.
 * Never serializes a CRM ID, Clerk subject, email, provenance or consent draft.
 * Do not use to prove approval for directory access; that has its own gate.
 */
export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Sign in required' }, { status: 401, headers: noStore })

  try {
    const config = clerkMembershipCaptureConfig(process.env)
    if (!config.enabled) {
      return NextResponse.json(
        { memberStatus: 'not_available', message: 'DCC account sync is not enabled.' },
        { status: 503, headers: noStore },
      )
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Member status store unavailable')
    const db = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data, error } = await db
      .from('dcc_platform_member_bindings')
      .select('state')
      .eq('clerk_instance', config.instance)
      .eq('clerk_user_id', userId)
      .maybeSingle()
    if (error) throw new Error('Member status query failed')
    return NextResponse.json(
      { memberStatus: safeStatus(data?.state) },
      { status: 200, headers: noStore },
    )
  } catch {
    return NextResponse.json(
      { error: 'Unable to confirm DCC membership status.' },
      { status: 503, headers: noStore },
    )
  }
}
