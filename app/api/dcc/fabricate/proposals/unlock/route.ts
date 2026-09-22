import { NextResponse } from 'next/server'
import {
  FABRICATE_PROPOSALS_COOKIE,
  fabricateProposalsCookieValue,
  isFabricateProposalsPasswordConfigured,
  verifyFabricateProposalsPassword,
} from '@/lib/dcc/fabrication/proposal-auth'

export async function POST(req: Request) {
  if (!isFabricateProposalsPasswordConfigured() && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Proposal gate not configured' },
      { status: 503 }
    )
  }

  const body = (await req.json().catch(() => null)) as { password?: string } | null
  const candidate = body?.password?.trim() ?? ''

  if (!isFabricateProposalsPasswordConfigured()) {
    if (!candidate) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
  } else if (!verifyFabricateProposalsPassword(candidate)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = isFabricateProposalsPasswordConfigured()
    ? fabricateProposalsCookieValue()
    : 'dev-unlocked'

  const res = NextResponse.json({ ok: true })
  res.cookies.set(FABRICATE_PROPOSALS_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
  return res
}
