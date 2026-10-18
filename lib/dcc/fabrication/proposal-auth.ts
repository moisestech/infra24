import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

export const LOCKED_PROPOSAL_METADATA: Metadata = {
  title: 'Private proposal',
  robots: { index: false, follow: false },
}

/** Title and description stay generic until the proposal cookie matches. */
export async function proposalPageMetadata(open: Metadata): Promise<Metadata> {
  if (!(await hasFabricateProposalsAccess())) return LOCKED_PROPOSAL_METADATA
  return { ...open, robots: { index: false, follow: false } }
}

export const FABRICATE_PROPOSALS_COOKIE = 'dcc_fabricate_proposals'

/** Local-development convenience only. Never a production credential. */
export const DEFAULT_FABRICATE_PROPOSALS_PASSWORD = 'dccmiami'

function productionSecretsConfigured(): boolean {
  return Boolean(
    process.env.DCC_FABRICATE_PROPOSALS_PASSWORD?.trim() &&
    process.env.INFRA24_CONTROL_SERVICE_TOKEN?.trim()
  )
}

function password(): string {
  // Fail closed in production: a published fallback password is not private.
  if (process.env.NODE_ENV === 'production' && !productionSecretsConfigured()) {
    return ''
  }
  return process.env.DCC_FABRICATE_PROPOSALS_PASSWORD?.trim() || DEFAULT_FABRICATE_PROPOSALS_PASSWORD
}

export function isFabricateProposalsPasswordConfigured(): boolean {
  return Boolean(process.env.DCC_FABRICATE_PROPOSALS_PASSWORD?.trim())
}

function tokenForPassword(pw: string): string {
  const secret = process.env.INFRA24_CONTROL_SERVICE_TOKEN?.trim() ||
    (process.env.NODE_ENV === 'production' ? '' : 'dcc-fabricate-proposals-dev')
  if (!secret) throw new Error('Proposal cookie signing secret is not configured')
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
  if (process.env.NODE_ENV === 'production' && !productionSecretsConfigured()) {
    return false
  }
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
