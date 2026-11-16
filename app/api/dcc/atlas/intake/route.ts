import { NextRequest, NextResponse } from 'next/server'
import { atlasIntakeSchema } from '@/lib/dcc/community/intake'
import { atlasIntakeConfigured, stageAtlasSubmission } from '@/lib/dcc/community/airtable-atlas'

export const dynamic = 'force-dynamic'
const attempts = new Map<string, { count: number; expires: number }>()
function allowed(ip: string) {
  const now = Date.now()
  for (const [key, value] of Array.from(attempts.entries())) if (value.expires <= now) attempts.delete(key)
  const prior = attempts.get(ip)
  if (prior && prior.count >= 5) return false
  if (!prior && attempts.size >= 2000) return false
  attempts.set(ip, { count: (prior?.count ?? 0) + 1, expires: prior?.expires ?? now + 15 * 60 * 1000 })
  return true
}
async function boundedBody(request: NextRequest): Promise<string | null> {
  if (Number(request.headers.get('content-length') || 0) > 12000) return null
  const reader = request.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 12000) { await reader.cancel(); return null }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  chunks.forEach((chunk) => { bytes.set(chunk, offset); offset += chunk.byteLength })
  return new TextDecoder().decode(bytes)
}
export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' }
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Please submit through the DCC profile form.' }, { status: 403, headers })
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Please use the profile form.' }, { status: 415, headers })
  if (!atlasIntakeConfigured()) return NextResponse.json({ error: 'Profile submissions are not open yet. Your profile has not been submitted.' }, { status: 503, headers })
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!allowed(ip)) return NextResponse.json({ error: 'Please wait before trying again.' }, { status: 429, headers: { ...headers, 'Retry-After': '900' } })
  try {
    const text = await boundedBody(request)
    if (text === null) return NextResponse.json({ error: 'Please shorten your profile.' }, { status: 413, headers })
    let raw: unknown
    try { raw = JSON.parse(text) } catch { return NextResponse.json({ error: 'Please check your form and try again.' }, { status: 400, headers }) }
    const parsed = atlasIntakeSchema.safeParse(raw)
    if (!parsed.success) return NextResponse.json({ error: 'Please check the required fields, public-profile permission and full https:// links.' }, { status: 400, headers })
    await stageAtlasSubmission(parsed.data)
    return NextResponse.json({ status: 'pending', message: 'Your profile request was received for review. It is not public yet.' }, { status: 202, headers })
  } catch {
    return NextResponse.json({ error: 'We could not confirm that your profile was saved. Please try again later; your form is still here.' }, { status: 503, headers })
  }
}
