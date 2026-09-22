import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const FABRICATE_PROPOSALS_COOKIE = 'dcc_fabricate_proposals'

/** Pilot default until a dedicated env var is set in production. */
export const DEFAULT_FABRICATE_PROPOSALS_PASSWORD = 'dccmiami'

function password(): string {
  return (
    process.env.DCC_FABRICATE_PROPOSALS_PASSWORD?.trim() ||
    DEFAULT_FABRICATE_PROPOSALS_PASSWORD
  )
}

export function isFabricateProposalsPasswordConfigured(): boolean {
  return Boolean(process.env.DCC_FABRICATE_PROPOSALS_PASSWORD?.trim())
}

function tokenForPassword(pw: string): string {
  const secret = process.env.INFRA24_CONTROL_SERVICE_TOKEN?.trim() || 'dcc-fabricate-proposals-dev'
  return createHmac('sha256', secret).update(`fabricate-proposals:${pw}`).digest('hex')
}

export function verifyFabricateProposalsPassword(candidate: string): boolean {
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

export function fabricateProposalsCookieValue(): string {
  const pw = password()
  if (!pw) throw new Error('DCC_FABRICATE_PROPOSALS_PASSWORD not set')
  return tokenForPassword(pw)
}

export async function hasFabricateProposalsAccess(): Promise<boolean> {
  // Dev only: skip unlock when no env override and not production.
  if (
    !isFabricateProposalsPasswordConfigured() &&
    process.env.NODE_ENV !== 'production'
  ) {
    return true
  }
  const jar = await cookies()
  const cookie = jar.get(FABRICATE_PROPOSALS_COOKIE)?.value
  if (!cookie) return false
  const expected = fabricateProposalsCookieValue()
  try {
    const a = Buffer.from(cookie)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
