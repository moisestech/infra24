import { NextResponse } from 'next/server'
import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
} from '@/lib/airtable/client'

export const dynamic = 'force-dynamic'

const PROGRAM = 'Character Lab'
const SIGNAL_TABLE_ID = 'tblUtxYnWjGrxhwFf'

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
 * A program-specific private inquiry, NOT public directory enrollment,
 * a newsletter subscription, or a paid ticket.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InterestInput
    // Simple honeypot: a filled hidden field must never write to Airtable.
    if (value(body.website, 120)) return NextResponse.json({ ok: true })

    const name = value(body.name, 120)
    const email = value(body.email, 254).toLowerCase()
    const practice = value(body.practice, 100)
    const format = value(body.format, 100)
    const motivation = value(body.motivation, 800)
    const source = value(body.source, 120)
    if (name.length < 2 || !emailValid(email) || body.consent !== true) {
      return NextResponse.json({ error: 'Please enter your name, a valid email, and contact permission.' }, { status: 400 })
    }

    const apiKey = process.env.AIRTABLE_DCC_CRM_API_KEY?.trim()
    const baseId = process.env.AIRTABLE_DCC_CRM_BASE_ID?.trim()
    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: 'Online interest capture is unavailable. Please send the inquiry by email.', fallback: true },
        { status: 503 }
      )
    }

    const signal = `Character Lab interest | ${email}`
    const fields: Record<string, unknown> = {
      Signal: signal,
      Visibility: 'Private',
      Status: 'Open',
      Source: 'Website',
      Description: [
        `Program: ${PROGRAM}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Practice: ${practice || 'Not provided'}`,
        `Preferred format: ${format || 'Not provided'}`,
        `Interested in making: ${motivation || 'Not provided'}`,
      ].join('\n'),
      Notes: [
        'Course-only permission to contact: yes',
        'Not a DCC network signup, public profile, booking, or newsletter opt-in.',
        `Acquisition source: ${source || 'direct'}`,
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

    return NextResponse.json({ ok: true, message: 'Interest received. We will reach out if the pilot moves forward.' })
  } catch (error) {
    console.error('[dcc/character-lab-interest]', error)
    return NextResponse.json(
      { error: 'We could not save your interest. Please use the email option.', fallback: true },
      { status: 500 }
    )
  }
}
