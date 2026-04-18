import { NextResponse } from 'next/server'

import {
  fetchAlumniFromAirtableDetailed,
  isAlumniAirtableConfigured,
} from '@/lib/airtable/alumni-service'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!isAlumniAirtableConfigured(slug)) {
    return NextResponse.json({
      organizationSlug: slug,
      supported: false,
      configured: false,
      count: 0,
      alumni: [],
    })
  }

  const result = await fetchAlumniFromAirtableDetailed(slug)
  if (!result.ok) {
    const isDev = process.env.NODE_ENV === 'development'
    const body: Record<string, unknown> = {
      organizationSlug: slug,
      supported: true,
      configured: true,
      error: 'Failed to load alumni from Airtable',
      count: 0,
      alumni: [],
    }
    if (result.reason === 'airtable_error' && isDev) {
      body.airtableErrorDetail = result.message
    }
    return NextResponse.json(body, { status: 502 })
  }

  const body: Record<string, unknown> = {
    organizationSlug: slug,
    supported: true,
    configured: true,
    count: result.alumni.length,
    alumni: result.alumni,
  }

  if (process.env.NODE_ENV === 'development') {
    body.dev = {
      airtableRecordCount: result.airtableRecordCount,
      skippedWithoutName: result.skippedWithoutName,
      ...(result.airtableRecordCount > 0 && result.alumni.length === 0
        ? {
            hint:
              'Airtable returned records but none had a value in the mapped name field (default column title: Name). Set AIRTABLE_*_ALUMNI_FIELD_NAME to your column’s exact title.',
          }
        : {}),
    }
  }

  return NextResponse.json(body)
}
