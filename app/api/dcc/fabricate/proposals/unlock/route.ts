import { NextResponse } from 'next/server'
import {
  FABRICATE_PROPOSALS_COOKIE,
  fabricateProposalsCookieValue,
  verifyFabricateProposalsPassword,
} from '@/lib/dcc/fabrication/proposal-auth'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { password?: string } | null
  const candidate = body?.password?.trim() ?? ''

  if (!verifyFabricateProposalsPassword(candidate)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(FABRICATE_PROPOSALS_COOKIE, fabricateProposalsCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
  return res
}
