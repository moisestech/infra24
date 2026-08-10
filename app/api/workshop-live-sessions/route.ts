import { NextResponse } from 'next/server'
import { createLiveSession } from '@/lib/workshop-engine/session-store'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: { workshopSlug?: string; venueConfigId?: string } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    body = {}
  }

  try {
    const { session, storage } = await createLiveSession({
      workshopSlug: body.workshopSlug,
      venueConfigId: body.venueConfigId,
    })
    return NextResponse.json({ ok: true, session, storage })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Could not create session',
      },
      { status: 500 }
    )
  }
}
