import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const FABRICATE_PROPOSALS_COOKIE = 'dcc_fabricate_proposals'

function password(): string | undefined {
  return process.env.DCC_FABRICATE_PROPOSALS_PASSWORD?.trim() || undefined
}

export function isFabricateProposalsPasswordConfigured(): boolean {
  return Boolean(password())
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
  if (!isFabricateProposalsPasswordConfigured()) {
    return process.env.NODE_ENV !== 'production'
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
