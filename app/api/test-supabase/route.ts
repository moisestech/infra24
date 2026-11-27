import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Retired debug endpoint: never expose provider configuration or tenant data.
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, {
    status: 404,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
