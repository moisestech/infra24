import { NextResponse } from 'next/server'
import {
  getLiveSessionByCode,
  patchLiveSession,
} from '@/lib/workshop-engine/session-store'
import type { PatchLiveSessionInput } from '@/lib/workshop-engine/session-store'
import { normalizeJoinCode } from '@/lib/workshop-engine/join-code'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ code: string }> | { code: string } }

async function resolveCode(params: Ctx['params']) {
  const resolved = await Promise.resolve(params)
  return normalizeJoinCode(resolved.code)
}

export async function GET(_request: Request, context: Ctx) {
  const code = await resolveCode(context.params)
  const session = await getLiveSessionByCode(code)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, session })
}

export async function PATCH(request: Request, context: Ctx) {
  const code = await resolveCode(context.params)
  let body: PatchLiveSessionInput = {}
  try {
    body = (await request.json()) as PatchLiveSessionInput
  } catch {
    body = {}
  }

  const session = await patchLiveSession(code, body)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, session })
}
