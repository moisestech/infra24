import { NextResponse } from 'next/server'
import { randomBytes, createHash } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { fiuRatcliffeEvent } from '@/lib/dcc/events/fiu-ratcliffe'
import { sendEmail } from '@/lib/email/resend-client'

export const runtime = 'nodejs'
const response = { ok: true, message: 'If your address can receive mail, check your inbox for the RSVP link.' }
const digest = (token: string) => createHash('sha256').update(token).digest('hex')
const rate = new Map<string, { count: number; reset: number }>()
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 4096) return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now(), current = rate.get(ip)
  if (current && current.reset > now && current.count >= 8) return NextResponse.json({ error: 'Please try again later' }, { status: 429 })
  rate.set(ip, current && current.reset > now ? { count: current.count + 1, reset: current.reset } : { count: 1, reset: now + 600000 })
  if (!process.env.RESEND_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.DCC_EVENTS_FROM_EMAIL) return NextResponse.json({ error: 'Registration is not available yet' }, { status: 503 })
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  if (body.website) return NextResponse.json(response)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const status = body.status
  if (name.length < 2 || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['going', 'maybe'].includes(String(status))) return NextResponse.json({ error: 'Please enter your name, email, and RSVP choice.' }, { status: 400 })
  const db = createClient()
  const { data: existing, error: lookupError } = await db.from('dcc_event_rsvps').select('id,email_verified_at').eq('event_id', fiuRatcliffeEvent.id).eq('normalized_email', email).maybeSingle()
  if (lookupError) return NextResponse.json({ error: 'Registration is temporarily unavailable' }, { status: 503 })
  let id = existing?.id as string | undefined
  if (!id) {
    const created = await db.from('dcc_event_rsvps').insert({ event_id: fiuRatcliffeEvent.id, normalized_email: email, full_name: name, status }).select('id').single()
    if (created.error) {
      if (created.error.code === '23505') return NextResponse.json(response)
      return NextResponse.json({ error: 'Registration is temporarily unavailable' }, { status: 503 })
    }
    id = created.data.id
  }
  // Do not overwrite an existing RSVP without email ownership verification.
  const token = randomBytes(32).toString('hex')
  const saved = await db.from('dcc_event_rsvp_tokens').insert({ rsvp_id: id, token_hash: digest(token), purpose: 'verify', expires_at: new Date(now + 86400000).toISOString() }).select('id').single()
  if (saved.error) return NextResponse.json({ error: 'Registration is temporarily unavailable' }, { status: 503 })
  const outbox = await db.from('dcc_event_mail_outbox').insert({ rsvp_id: id, token_id: saved.data.id, message_type: 'verify' })
  if (outbox.error) return NextResponse.json({ error: 'Registration is temporarily unavailable' }, { status: 503 })
  const origin = new URL(request.url).origin
  const url = origin + fiuRatcliffeEvent.path + '/verify?token=' + token
  const sent = await sendEmail({ to: email, from: process.env.DCC_EVENTS_FROM_EMAIL, subject: 'Confirm your DCC × Ratcliffe RSVP', text: 'Confirm your RSVP for November 10, 6:00–7:30 PM at FIU Biscayne Bay Campus: ' + url, html: '<p>Confirm your DCC × Ratcliffe RSVP:</p><p><a href="' + url + '">Confirm my RSVP</a></p><p>November 10, 6:00–7:30 PM · FIU Biscayne Bay Campus</p>' })
  if (sent.success) await db.from('dcc_event_mail_outbox').update({ sent_at: new Date().toISOString(), attempts: 1 }).eq('token_id', saved.data.id)
  else await db.from('dcc_event_mail_outbox').update({ attempts: 1, next_attempt_at: new Date(now + 300000).toISOString(), last_safe_error: 'delivery_failed' }).eq('token_id', saved.data.id)
  return NextResponse.json(response)
}
