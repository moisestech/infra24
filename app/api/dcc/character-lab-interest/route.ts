import { NextResponse } from 'next/server'
import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
} from '@/lib/airtable/client'

export const dynamic = 'force-dynamic'

const PROGRAM = 'Character Lab'
const SIGNAL_TABLE_ID = 'tblUtxYnWjGrxhwFf'
const INTEREST_INBOX = 'm@moises.tech'

type InterestInput = {
  name?: unknown
  email?: unknown
  practice?: unknown
  format?: unknown
  motivation?: unknown
  source?: unknown
  consent?: unknown
  website?: unknown
}

type ValidInterest = {
  name: string
  email: string
  practice: string
  format: string
  motivation: string
  source: string
}

function value(input: unknown, max: number): string {
  return typeof input === 'string' ? input.trim().slice(0, max) : ''
}

function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

function escapeFormula(input: string): string {
  return input.replace(/'/g, "''")
}

/**
 * Send the interest lead to the DCC producer when Airtable PAT credentials
 * have not been installed in Vercel. Do not claim submission succeeded
 * unless Resend actually accepts the message.
 *
 * This is private production mail, not a visitor subscription or booking.
 */
async function deliverByEmail(input: ValidInterest): Promise<boolean> {
  if (!process.env.RESEND_API_KEY?.trim()) return false

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = [
    'DCC Character Lab — new interest',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Creative practice: ${input.practice || 'Not supplied'}`,
    `Preferred format: ${input.format || 'Not supplied'}`,
    `What they want to make: ${input.motivation || 'Not supplied'}`,
    `Acquisition source: ${input.source || 'direct'}`,
    'Consent: may contact about Character Lab only; no newsletter or public profile permission',
    '',
    'Please follow up with this person about the potential Character Lab cohort.',
  ].join('\n')

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'DCC Miami <onboarding@resend.dev>',
    to: [INTEREST_INBOX],
    subject: '[DCC Character Lab] Interest — ' + input.name,
    text: body,
    tags: [{ name: 'category', value: 'character_lab_interest' }],
  })
  if (error || !data?.id) {
    console.error('[dcc/character-lab-interest] delivery failed', error)
    return false
  }
  return true
}

async function saveInAirtable(input: ValidInterest, apiKey: string, baseId: string): Promise<void> {
  const signal = `Character Lab interest | ${input.email}`
  const fields: Record<string, unknown> = {
    Signal: signal,
    Visibility: 'Private',
    Status: 'Open',
    Source: 'Website',
    Description: [
      `Program: ${PROGRAM}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Practice: ${input.practice || 'Not provided'}`,
      `Preferred format: ${input.format || 'Not provided'}`,
      `Interested in making: ${input.motivation || 'Not provided'}`,
    ].join('\n'),
    Notes: [
      'Course-only permission to contact: yes',
      'Not a DCC network signup, public profile, booking, or newsletter opt-in.',
      `Acquisition source: ${input.source || 'direct'}`,
      `Last submitted: ${new Date().toISOString()}`,
    ].join('\n'),
  }

  const previous = await fetchAllRecords(baseId, SIGNAL_TABLE_ID, apiKey, {
    filterFormula: `{Signal} = '${escapeFormula(signal)}'`,
  })
  if (previous.length > 0) {
    await patchAirtableRecord(baseId, SIGNAL_TABLE_ID, apiKey, previous[0].id, fields)
  } else {
    await createAirtableRecords(baseId, SIGNAL_TABLE_ID, apiKey, [{ fields }])
  }
}

/**
 * Course interest only. A successful response means either a private
 * DCC CRM record was saved, or an actual message was accepted by Resend.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InterestInput
    // Honeypot: ignore obvious automated submissions without contacting anyone.
    if (value(body.website, 120)) return NextResponse.json({ ok: true })

    const input: ValidInterest = {
      name: value(body.name, 120),
      email: value(body.email, 254).toLowerCase(),
      practice: value(body.practice, 100),
      format: value(body.format, 100),
      motivation: value(body.motivation, 800),
      source: value(body.source, 120),
    }

    if (input.name.length < 2 || !emailValid(input.email) || body.consent !== true) {
      return NextResponse.json(
        { error: 'Please enter your name, a valid email, and contact permission.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.AIRTABLE_DCC_CRM_API_KEY?.trim()
    const baseId = process.env.AIRTABLE_DCC_CRM_BASE_ID?.trim()
    if (apiKey && baseId) {
      try {
        await saveInAirtable(input, apiKey, baseId)
        return NextResponse.json({ ok: true, delivery: 'airtable' })
      } catch (error) {
        console.error('[dcc/character-lab-interest] Airtable failed; trying delivery backup', error)
      }
    }

    if (await deliverByEmail(input)) {
      return NextResponse.json({
        ok: true,
        delivery: 'email',
        message: 'Your interest was sent to the DCC team.',
      })
    }

    return NextResponse.json(
      { error: 'Online submission is temporarily unavailable. You can email DCC directly.', fallback: true },
      { status: 503 }
    )
  } catch (error) {
    console.error('[dcc/character-lab-interest]', error)
    return NextResponse.json(
      { error: 'Your interest could not be delivered. Please send it by email.', fallback: true },
      { status: 503 }
    )
  }
}
