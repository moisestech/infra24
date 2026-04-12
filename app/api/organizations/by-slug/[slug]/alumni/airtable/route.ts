import { NextResponse } from 'next/server'

import {
  fetchAlumniFromAirtable,
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

  const alumni = await fetchAlumniFromAirtable(slug)
  if (alumni === null) {
    return NextResponse.json(
      {
        organizationSlug: slug,
        supported: true,
        configured: true,
        error: 'Failed to load alumni from Airtable',
        count: 0,
        alumni: [],
      },
      { status: 502 }
    )
  }

  return NextResponse.json({
    organizationSlug: slug,
    supported: true,
    configured: true,
    count: alumni.length,
    alumni,
  })
}
