import { NextResponse } from 'next/server'
import { createAirtableRecords, isAirtableConnectionConfigured } from '@/lib/airtable/client'
import { mapSuggestToAirtableFields } from '@/lib/dcc/signup/suggest/map-to-airtable'
import { dccSuggestFormSchema } from '@/lib/dcc/signup/suggest/schema'

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = dccSuggestFormSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const apiKey = env('AIRTABLE_DCC_CRM_API_KEY')
    const baseId = env('AIRTABLE_DCC_CRM_BASE_ID')
    const tableSeedCandidates = env('AIRTABLE_DCC_CRM_TABLE_SEED_CANDIDATES')

    if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId: tableSeedCandidates })) {
      return NextResponse.json(
        {
          error: 'Research suggestions are not configured yet. Please try again later.',
          fallback: true,
        },
        { status: 503 }
      )
    }

    const fields = mapSuggestToAirtableFields(parsed.data)
    const [record] = await createAirtableRecords(baseId!, tableSeedCandidates!, apiKey!, [{ fields }])
    if (!record) throw new Error('Airtable create returned no record')

    return NextResponse.json({
      ok: true,
      recordId: record.id,
      message: 'Thank you for contributing to the Research View.',
    })
  } catch (e) {
    console.error('dcc signup suggest:', e)
    return NextResponse.json({ error: 'Failed to submit suggestion. Please try again.' }, { status: 500 })
  }
}
