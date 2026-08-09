import { NextResponse } from 'next/server'
import {
  SCALE_UP_COOKIE,
  scaleUpCookieValue,
  verifyScaleUpPassword,
  isScaleUpPasswordConfigured,
} from '@/lib/dcc/scale-up-auth'

export async function POST(req: Request) {
  if (!isScaleUpPasswordConfigured() && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Scale-up gate not configured' }, { status: 503 })
  }

  const body = (await req.json().catch(() => null)) as { password?: string } | null
  const candidate = body?.password?.trim() ?? ''

  if (!isScaleUpPasswordConfigured()) {
    // Dev: any non-empty password unlocks when env unset
    if (!candidate) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
  } else if (!verifyScaleUpPassword(candidate)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = isScaleUpPasswordConfigured()
    ? scaleUpCookieValue()
    : 'dev-unlocked'

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SCALE_UP_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
  return res
}
