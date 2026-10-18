import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const SCALE_UP_COOKIE = 'dcc_scale_up'

const DEV_SIGNING_SECRET = 'dcc-scale-up-dev'

function password(): string | undefined {
  return process.env.DCC_SCALE_UP_PASSWORD?.trim() || undefined
}

function signingSecret(): string | undefined {
  return process.env.INFRA24_CONTROL_SERVICE_TOKEN?.trim() || undefined
}

export function isScaleUpPasswordConfigured(): boolean {
  return Boolean(password())
}

export function isScaleUpSigningSecretConfigured(): boolean {
  return Boolean(signingSecret())
}

function tokenForPassword(pw: string): string {
  const secret = signingSecret()
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Scale-up cookie signing secret is not configured')
    }
    return createHmac('sha256', DEV_SIGNING_SECRET).update(`scale-up:${pw}`).digest('hex')
  }
  return createHmac('sha256', secret).update(`scale-up:${pw}`).digest('hex')
}

/**
 * Staff fabrication pages. A feature flag never grants access.
 * Production requires the password, the signing secret, and a matching cookie.
 * Local development stays open only when the password is unset.
 */
export function canViewFabricationInternal(input: {
  nodeEnv: string | undefined
  passwordConfigured: boolean
  signingSecretConfigured: boolean
  cookieMatches: boolean
  featureFlagEnabled?: boolean
}): boolean {
  if (input.nodeEnv === 'production') {
    if (!input.passwordConfigured || !input.signingSecretConfigured) return false
    return input.cookieMatches
  }
  if (!input.passwordConfigured) return true
  return input.cookieMatches
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

export async function hasFabricationInternalAccess(): Promise<boolean> {
  return canViewFabricationInternal({
    nodeEnv: process.env.NODE_ENV,
    passwordConfigured: isScaleUpPasswordConfigured(),
    signingSecretConfigured: isScaleUpSigningSecretConfigured(),
    cookieMatches: await hasScaleUpCookie(),
    featureFlagEnabled: process.env.DCC_CEO_DASHBOARD_ENABLED === 'true',
  })
}

async function hasScaleUpCookie(): Promise<boolean> {
  if (!isScaleUpPasswordConfigured()) return false
  if (process.env.NODE_ENV === 'production' && !isScaleUpSigningSecretConfigured()) return false
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

export async function hasScaleUpAccess(): Promise<boolean> {
  if (!isScaleUpPasswordConfigured()) {
    // Dev convenience: if no password configured, allow (document in UI)
    return process.env.NODE_ENV !== 'production'
  }
  return hasScaleUpCookie()
}
