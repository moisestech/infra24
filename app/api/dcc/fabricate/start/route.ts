import { NextResponse } from 'next/server'
import { getDccOsConnection } from '@/lib/dcc/os-config'
import { createInquiryJob } from '@/lib/dcc/jobs'
import { upsertPersonRecord } from '@/lib/dcc/signup/upsert-person'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'
import {
  FABRICATE_START_NOTES_PREFIX,
  fabricateStartRequestSchema,
} from '@/lib/dcc/fabrication/start-schema'
import { formatFabricateStartNotes } from '@/lib/dcc/fabrication/start-notes'
import { sendEmail } from '@/lib/email/resend-client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  const parsed = fabricateStartRequestSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const input = parsed.data
  const notesBody = formatFabricateStartNotes(input)
  const notes = `${FABRICATE_START_NOTES_PREFIX}\n${notesBody}`
  const conn = getDccOsConnection()
  const to = process.env.MARKETING_CONTACT_TO
  const from =
    process.env.MARKETING_CONTACT_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    'onboarding@resend.dev'

  let jobId: string | undefined
  let personUpdated = false
  let emailSent = false
  let emailError: string | undefined

  if (process.env.RESEND_API_KEY && to) {
    const result = await sendEmail({
      to,
      from,
      replyTo: input.email,
      subject: `DCC Fabricate inquiry: ${input.projectTitle}`,
      text: notes,
      html: `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${notes
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')}</pre>`,
    })
    emailSent = result.success
    emailError = result.error
  }

  if (conn) {
    try {
      const F = DEFAULT_DCC_PEOPLE_FIELD_MAP
      const personFields: Record<string, unknown> = {
        [F.name]: input.name,
        [F.email]: input.email.trim().toLowerCase(),
      }
      if (input.consentUpdates) personFields[F.consentToUpdates] = true
      if (input.landingPage) personFields[F.landingPage] = input.landingPage

      const person = await upsertPersonRecord(
        conn.baseId,
        conn.tables.people,
        conn.apiKey,
        input.email,
        personFields
      )
      personUpdated = person.updated

      const job = await createInquiryJob(
        {
          jobName: `${input.name} — ${input.projectTitle}`,
          customerRecordId: person.recordId,
          tier: input.isAssociate ? 'Associate' : 'Public',
          dueDate:
            input.deadline && /^\d{4}-\d{2}-\d{2}$/.test(input.deadline)
              ? input.deadline
              : undefined,
          notesBody,
          notesPrefix: FABRICATE_START_NOTES_PREFIX,
          actor: 'web:/fabricate/start',
          source: 'web:/fabricate/start',
        },
        conn
      )
      jobId = job.id
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (!emailSent) {
        return NextResponse.json({ error: msg }, { status: 502 })
      }
    }
  }

  if (!jobId && !emailSent) {
    if (emailError && to) {
      return NextResponse.json(
        { error: emailError || 'Could not send inquiry' },
        { status: 502 }
      )
    }
    return NextResponse.json({
      ok: true,
      fallback: true,
      jobId: null,
    })
  }

  return NextResponse.json({
    ok: true,
    jobId: jobId ?? null,
    emailSent,
    personUpdated,
    fallback: !jobId && !emailSent,
  })
}
