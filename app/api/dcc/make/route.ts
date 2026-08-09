import { NextResponse } from 'next/server'
import { getDccOsConnection } from '@/lib/dcc/os-config'
import { makeRequestSchema } from '@/lib/dcc/make-schema'
import { estimateFabricationRange } from '@/lib/dcc/make-estimator'
import { createInquiryJob } from '@/lib/dcc/jobs'
import { upsertPersonRecord } from '@/lib/dcc/signup/upsert-person'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'

export async function POST(req: Request) {
  const conn = getDccOsConnection()
  if (!conn) {
    return NextResponse.json(
      { error: 'DCC OS not configured — cannot create jobs yet.' },
      { status: 503 }
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = makeRequestSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const input = parsed.data
  const tier = input.isAssociate ? 'Associate' : 'Public'
  const estimate = estimateFabricationRange({
    process: input.process,
    volumeBracket: input.volumeBracket,
    tier,
  })

  const F = DEFAULT_DCC_PEOPLE_FIELD_MAP
  const personFields: Record<string, unknown> = {
    [F.name]: input.name,
    [F.email]: input.email.trim().toLowerCase(),
  }
  if (input.consentUpdates) {
    personFields[F.consentToUpdates] = true
  }
  if (input.utmSource) personFields[F.utmSource] = input.utmSource
  if (input.utmMedium) personFields[F.utmMedium] = input.utmMedium
  if (input.utmCampaign) personFields[F.utmCampaign] = input.utmCampaign
  if (input.landingPage) personFields[F.landingPage] = input.landingPage

  try {
    const person = await upsertPersonRecord(
      conn.baseId,
      conn.tables.people,
      conn.apiKey,
      input.email,
      personFields
    )

    const shortDesc = input.description.slice(0, 60).replace(/\s+/g, ' ')
    const job = await createInquiryJob(
      {
        jobName: `${input.name} — ${shortDesc}`,
        customerRecordId: person.recordId,
        tier,
        dueDate: input.deadline || undefined,
        estimateShown: estimate.label,
        notesBody: [
          `Description: ${input.description}`,
          input.dimensions ? `Dimensions: ${input.dimensions}` : null,
          `Process: ${input.process}`,
          input.finish ? `Finish: ${input.finish}` : null,
          `Volume bracket: ${input.volumeBracket}`,
          input.machineId ? `Requested machine: ${input.machineId}` : null,
          `Associate: ${input.isAssociate ? 'yes' : 'no'}`,
          `Consent to updates: ${input.consentUpdates ? 'yes' : 'no'}`,
          `Contact: ${input.email}`,
        ]
          .filter(Boolean)
          .join('\n'),
      },
      conn
    )

    return NextResponse.json({
      ok: true,
      jobId: job.id,
      estimate,
      personUpdated: person.updated,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
