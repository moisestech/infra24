import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { fiuRatcliffeEvent as event } from '@/lib/dcc/events/fiu-ratcliffe'
import { sendEmail } from '@/lib/email/resend-client'

export const runtime = 'nodejs'
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
const base = () => process.env.DCC_PUBLIC_ORIGIN || 'https://www.dcc.miami'

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
  let token: unknown
  try { ({ token } = await request.json()) } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  const db = createClient()
  const { data: entry } = await db.from('dcc_event_rsvp_tokens').select('id,rsvp_id,expires_at,consumed_at').eq('token_hash', hash(token)).eq('purpose', 'verify').maybeSingle()
  if (!entry || entry.consumed_at || Date.parse(entry.expires_at) <= Date.now()) return NextResponse.json({ error: 'Link expired or already used. Please request a new RSVP email.' }, { status: 410 })
  const consumed = await db.from('dcc_event_rsvp_tokens').update({ consumed_at: new Date().toISOString() }).eq('id', entry.id).is('consumed_at', null).select('id').maybeSingle()
  if (!consumed.data) return NextResponse.json({ error: 'Link already used' }, { status: 410 })
  const { data: rsvp, error: updateError } = await db.from('dcc_event_rsvps').update({ email_verified_at: new Date().toISOString() }).eq('id', entry.rsvp_id).eq('event_id', event.id).select('normalized_email,full_name,status').single()
  if (updateError || !rsvp) return NextResponse.json({ error: 'Unable to verify RSVP' }, { status: 503 })
  const manageToken = randomBytes(32).toString('hex')
  const { data: manage } = await db.from('dcc_event_rsvp_tokens').insert({ rsvp_id: entry.rsvp_id, token_hash: hash(manageToken), purpose: 'manage', expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }).select('id').single()
  if (!manage) return NextResponse.json({ error: 'RSVP verified, but management link is unavailable' }, { status: 503 })
  const outbox = await db.from('dcc_event_mail_outbox').insert({ rsvp_id: entry.rsvp_id, token_id: manage.id, message_type: 'confirmation' }).select('id').single()
  const url = base() + event.path + '/manage?token=' + manageToken
  if (process.env.RESEND_API_KEY && process.env.DCC_EVENTS_FROM_EMAIL) {
    const sent = await sendEmail({ to: rsvp.normalized_email, from: process.env.DCC_EVENTS_FROM_EMAIL, subject: 'Your DCC × Ratcliffe RSVP is confirmed', html: '<p>Your RSVP is verified (' + rsvp.status + ').</p><p><a href="' + url + '">Manage or cancel your RSVP</a></p>', text: 'Your RSVP is verified. Manage or cancel: ' + url })
    if (outbox.data) await db.from('dcc_event_mail_outbox').update(sent.success ? { sent_at: new Date().toISOString(), attempts: 1 } : { attempts: 1, last_safe_error: 'delivery_failed', next_attempt_at: new Date(Date.now()+300000).toISOString() }).eq('id', outbox.data.id)
  }
  return NextResponse.json({ ok: true, message: 'Your RSVP is verified. Check your email for your management link.' })
}
