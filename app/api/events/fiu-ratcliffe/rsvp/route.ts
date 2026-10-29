import { NextResponse } from 'next/server'
import { randomBytes, createHash } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { fiuRatcliffeEvent } from '@/lib/dcc/events/fiu-ratcliffe'
import { encryptEventEmail } from '@/lib/dcc/events/mail-crypto'

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
  if (!process.env.RESEND_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.DCC_EVENTS_FROM_EMAIL || !process.env.DCC_MAIL_ENCRYPTION_KEY) return NextResponse.json({ error: 'Registration is not available yet' }, { status: 503 })
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  if (body.website) return NextResponse.json(response)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const status = body.status
  if (name.length < 2 || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['going', 'maybe'].includes(String(status))) return NextResponse.json({ error: 'Please enter your name, email, and RSVP choice.' }, { status: 400 })
  const token = randomBytes(32).toString('hex')
  const origin = process.env.DCC_PUBLIC_ORIGIN || 'https://www.dcc.miami'
  const url = origin + fiuRatcliffeEvent.path + '/verify?token=' + token
  let ciphertext: string
  try {
    ciphertext = encryptEventEmail({
      to: email,
      subject: 'Confirm your DCC × Ratcliffe RSVP',
      text: 'Confirm your RSVP for November 10, 6:00–7:30 PM at FIU Biscayne Bay Campus: ' + url,
      html: '<p>Confirm your DCC × Ratcliffe RSVP:</p><p><a href="' + url + '">Confirm my RSVP</a></p><p>November 10, 6:00–7:30 PM · FIU Biscayne Bay Campus</p>',
    })
  } catch {
    return NextResponse.json({ error: 'Mail configuration unavailable' }, { status: 503 })
  }
  const db = createClient()
  const { error } = await db.rpc('dcc_event_register_and_queue', {
    p_event_id: fiuRatcliffeEvent.id,
    p_email: email,
    p_full_name: name,
    p_status: status,
    p_verify_hash: digest(token),
    p_ciphertext: ciphertext,
  })
  if (error) return NextResponse.json({ error: 'Registration is temporarily unavailable' }, { status: 503 })
  return NextResponse.json(response)
}
