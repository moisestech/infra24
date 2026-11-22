/**
 * DCC membership domain boundary — NOT an Airtable implementation.
 * The caller MUST obtain principal from a server-verified Clerk session.
 * The store MUST enforce atomic uniqueness for provider+subject and personId.
 * A CRM email match is a reconciliation candidate, not ownership proof.
 * Domain contract only; webhook, persistence, cutover and UI are NOT implemented.
 */
export type DccEntryPoint = 'join' | 'add-profile' | 'passport' | 'sign-in' | 'platform-sign-up'
export type VerifiedSessionPrincipal = {
  provider: 'clerk'
  subject: string
  verifiedEmail: string | null
  emailVerified: boolean
}
export type DccMembership = {
  privatePersonId: string
  state: 'active' | 'withdrawn' | 'suspended'
}
export type DccMembershipStore = {
  findByProviderSubject(provider: 'clerk', subject: string): Promise<DccMembership | null>
  countUnboundPeopleCandidates(verifiedEmail: string): Promise<number>
  /** Verified, durable Clerk creation-event evidence after a configured cutover. Never sourced from client input. */
  wasNewPlatformAccountCreatedUnderPolicy(provider: 'clerk', subject: string): Promise<boolean>
  /** Atomic create-or-get; never use a read-then-create Airtable upsert to implement this. */
  createOrGetVerifiedMembership(input: {
    provider: 'clerk'
    subject: string
    verifiedEmail: string
    source: 'join' | 'add-profile' | 'passport' | 'platform-account-created'
  }): Promise<DccMembership>
}
export type DccMembershipReceipt = {
  memberStatus: 'active' | 'not_member' | 'verification_required' | 'review_required'
  nextStep: 'your_profile' | 'join_dcc' | 'verify_email' | 'identity_review'
}

/** Safe to serialize; deliberately contains no People ID, email, graph ID or join timestamp. */
function receipt(status: DccMembershipReceipt['memberStatus']): DccMembershipReceipt {
  switch (status) {
    case 'active': return { memberStatus: 'active', nextStep: 'your_profile' }
    case 'not_member': return { memberStatus: 'not_member', nextStep: 'join_dcc' }
    case 'verification_required': return { memberStatus: 'verification_required', nextStep: 'verify_email' }
    case 'review_required': return { memberStatus: 'review_required', nextStep: 'identity_review' }
  }
}

const DCC_INTENTS = new Set<DccEntryPoint>(['join', 'add-profile', 'passport'])

export async function enterDccMembership(
  entry: DccEntryPoint,
  principal: VerifiedSessionPrincipal | null,
  store: DccMembershipStore
): Promise<DccMembershipReceipt> {
  // The session subject must be issued and authenticated by the server-side provider.
  if (!principal || principal.provider !== 'clerk' || !principal.subject.trim()) {
    return receipt('verification_required')
  }
  const existing = await store.findByProviderSubject(principal.provider, principal.subject)
  if (existing) {
    // Withdrawal/suspension are never silently reversed by a login or another CTA.
    return receipt(existing.state === 'active' ? 'active' : 'review_required')
  }
  // Q2: all NEW platform accounts auto-enroll, including Smart Sign. Existing pre-cutover accounts are not backfilled on sign-in.
  // Only a trusted server-side creation-event ledger may establish new-account eligibility.
  const newAccount = await store.wasNewPlatformAccountCreatedUnderPolicy(principal.provider, principal.subject)
  if (!newAccount && !DCC_INTENTS.has(entry)) return receipt('not_member')
  if (!principal.emailVerified || !principal.verifiedEmail?.trim()) {
    return receipt('verification_required')
  }
  const email = principal.verifiedEmail.trim().toLowerCase()
  // Even a verified email is insufficient to claim an older, unbound CRM People record.
  if (await store.countUnboundPeopleCandidates(email) > 0) return receipt('review_required')
  const member = await store.createOrGetVerifiedMembership({
    provider: principal.provider,
    subject: principal.subject,
    verifiedEmail: email,
    source: newAccount ? 'platform-account-created' : entry as 'join' | 'add-profile' | 'passport',
  })
  // A store failure must throw upstream; never fabricate a successful receipt.
  return receipt(member.state === 'active' ? 'active' : 'review_required')
}
