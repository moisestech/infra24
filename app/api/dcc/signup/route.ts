import { NextResponse } from 'next/server'
import { isAirtableConnectionConfigured } from '@/lib/airtable/client'
import { getPathwayById } from '@/lib/dcc/signup/pathways'
import { dccSignupFormSchema } from '@/lib/dcc/signup/schema'
import { mapSignupToAirtableFields, mergeCampaignLink } from '@/lib/dcc/signup/map-to-airtable'
import {
  existingCampaignIds,
  findPersonByEmail,
  upsertPersonRecord,
} from '@/lib/dcc/signup/upsert-person'

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

function resolveCampaignId(source?: string, campaignKey?: string): string | undefined {
  if (campaignKey?.startsWith('rec')) return campaignKey
  const explicit = env('AIRTABLE_DCC_CRM_CAMPAIGN_INDEX_SEED_ID')
  if (explicit && source?.trim()) return explicit
  return undefined
}

export async function handleDccSignupPost(body: unknown) {
  const parsed = dccSignupFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const input = parsed.data
  const pathway = getPathwayById(input.pathway)
  if (!pathway.enabled) {
    return NextResponse.json({ error: 'This signup pathway is not available yet.' }, { status: 400 })
  }

  const apiKey = env('AIRTABLE_DCC_CRM_API_KEY')
  const baseId = env('AIRTABLE_DCC_CRM_BASE_ID')
  const tablePeople = env('AIRTABLE_DCC_CRM_TABLE_PEOPLE')

  if (!isAirtableConnectionConfigured({ apiKey, baseId, tableId: tablePeople })) {
    return NextResponse.json(
      {
        error: 'DCC signup is not configured yet. Please try again later or contact DCC directly.',
        fallback: true,
      },
      { status: 503 }
    )
  }

  const submittedAt = new Date()
  const existingRecord = await findPersonByEmail(baseId!, tablePeople!, apiKey!, input.email)
  let fields = mapSignupToAirtableFields(input, pathway, submittedAt)

  const campaignId = resolveCampaignId(input.source, input.campaignKey)
  if (campaignId) {
    fields = mergeCampaignLink(fields, existingCampaignIds(existingRecord), campaignId)
  }

  const result = await upsertPersonRecord(baseId!, tablePeople!, apiKey!, input.email, fields)

  return NextResponse.json({
    ok: true,
    recordId: result.recordId,
    updated: result.updated,
    message: 'Thank you for joining the DCC Index.',
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return handleDccSignupPost(body)
  } catch (e) {
    console.error('dcc signup:', e)
    return NextResponse.json({ error: 'Failed to submit signup. Please try again.' }, { status: 500 })
  }
}
