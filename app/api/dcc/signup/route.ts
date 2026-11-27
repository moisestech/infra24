import { NextResponse } from 'next/server'
import { isAirtableConnectionConfigured } from '@/lib/airtable/client'
import { getPathwayById } from '@/lib/dcc/signup/pathways'
import {
  applyAttributionFields,
  mapQuickSignupToAirtableFields,
  mapSignupToAirtableFields,
  mergeCampaignLink,
} from '@/lib/dcc/signup/map-to-airtable'
import { mergeSignupIntoExistingPerson } from '@/lib/dcc/signup/merge-person-fields'
import { dccSignupQuickSchema } from '@/lib/dcc/signup/schema-quick'
import { dccSignupFormSchema } from '@/lib/dcc/signup/schema'
import { resolveCampaignRecordId } from '@/lib/dcc/signup/resolve-campaign'
import { resolveSignupSourceLabel } from '@/lib/dcc/signup/signup-source-labels'
import { sendDccSignupWelcomeEmail } from '@/lib/dcc/signup/send-welcome-email'
import {
  existingCampaignIds,
  findPersonByEmail,
  upsertPersonRecord,
} from '@/lib/dcc/signup/upsert-person'

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

function parseSignupBody(body: unknown) {
  const raw = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const mode = raw.formMode === 'full' ? 'full' : 'quick'
  if (mode === 'full') {
    return { mode: 'full' as const, parsed: dccSignupFormSchema.safeParse(body) }
  }
  return { mode: 'quick' as const, parsed: dccSignupQuickSchema.safeParse({ ...raw, formMode: 'quick' }) }
}

export async function handleDccSignupPost(body: unknown) {
  const submission = parseSignupBody(body)
  if (!submission.parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', details: submission.parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { mode } = submission
  const input = submission.parsed.data
  const pathway = getPathwayById(input.pathway)
  // After verified enrollment launches, block email-only membership writes.
  if (process.env.DCC_MEMBER_PROFILE_ENABLED === 'true' && pathway.id === 'join_dcc_index') {
    return NextResponse.json({ error: 'Official DCC membership now uses verified accounts. Please use Join DCC.' }, { status: 410 })
  }
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

  let fields =
    submission.mode === 'full'
      ? mapSignupToAirtableFields(submission.parsed.data, pathway, submittedAt)
      : mapQuickSignupToAirtableFields(submission.parsed.data, pathway, submittedAt)

  if (existingRecord) {
    fields = mergeSignupIntoExistingPerson(existingRecord, fields, {
      signupSource: input.source,
      signupSourceLabel: resolveSignupSourceLabel(input.source),
      utmCampaign: input.utmCampaign,
    })
  }

  const campaignId = resolveCampaignRecordId(input.source, input.campaignKey)
  if (campaignId) {
    fields = mergeCampaignLink(fields, existingCampaignIds(existingRecord), campaignId)
  }

  const result = await upsertPersonRecord(baseId!, tablePeople!, apiKey!, input.email, fields)

  const email = input.email.trim()
  const fullName = input.fullName.trim()
  void sendDccSignupWelcomeEmail({ to: email, fullName }).catch((err) => {
    console.error('dcc signup welcome email:', err)
  })

  return NextResponse.json({
    ok: true,
    updated: result.updated,
    formMode: mode,
    message: 'Your contact request was received for review, not as verified website membership.',
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
