import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const SCALE_UP_COOKIE = 'dcc_scale_up'

function password(): string | undefined {
  return process.env.DCC_SCALE_UP_PASSWORD?.trim() || undefined
}

export function isScaleUpPasswordConfigured(): boolean {
  return Boolean(password())
}

function tokenForPassword(pw: string): string {
  const secret = process.env.INFRA24_CONTROL_SERVICE_TOKEN?.trim() || 'dcc-scale-up-dev'
  return createHmac('sha256', secret).update(`scale-up:${pw}`).digest('hex')
}

export function verifyScaleUpPassword(candidate: string): boolean {
  const pw = password()
  if (!pw) return false
  try {
    const a = Buffer.from(tokenForPassword(candidate))
    const b = Buffer.from(tokenForPassword(pw))
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function scaleUpCookieValue(): string {
  const pw = password()
  if (!pw) throw new Error('DCC_SCALE_UP_PASSWORD not set')
  return tokenForPassword(pw)
}

export async function hasScaleUpAccess(): Promise<boolean> {
  if (!isScaleUpPasswordConfigured()) {
    // Dev convenience: if no password configured, allow (document in UI)
    return process.env.NODE_ENV !== 'production'
  }
  const jar = await cookies()
  const cookie = jar.get(SCALE_UP_COOKIE)?.value
  if (!cookie) return false
  const expected = scaleUpCookieValue()
  try {
    const a = Buffer.from(cookie)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
