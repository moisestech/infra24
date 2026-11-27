import {
  enterDccMembership, type DccMembershipStore, type VerifiedSessionPrincipal,
} from '../../lib/dcc/membership/enrollment'
import {
  prepareWeeklyPresenceSnapshot, publicPresenceMarks,
} from '../../lib/dcc/membership/public-snapshot'

const principal: VerifiedSessionPrincipal = {
  provider: 'clerk', subject: 'user_verified_123', verifiedEmail: 'Member@example.test', emailVerified: true,
}
function fixture(legacyCandidates = 0, newAccount = false) {
  const bindings = new Map<string, { privatePersonId: string; state: 'active' | 'withdrawn' | 'suspended' }>()
  let creates = 0
  const store: DccMembershipStore = {
    async findByProviderSubject(_provider, subject) { return bindings.get(subject) ?? null },
    async countUnboundPeopleCandidates() { return legacyCandidates },
    async wasNewPlatformAccountCreatedUnderPolicy() { return newAccount },
    async createOrGetVerifiedMembership(input) {
      // Simulates the required atomic unique constraint in the persistence adapter.
      const existing = bindings.get(input.subject)
      if (existing) return existing
      creates++
      const member = { privatePersonId: 'recPRIVATE', state: 'active' as const }
      bindings.set(input.subject, member)
      return member
    },
  }
  return { store, count: () => creates, bindings }
}

describe('BDD — one canonical DCC member across every entry', () => {
  it('Given no membership, when verified Join succeeds, then one member exists privately', async () => {
    const f = fixture()
    expect(await enterDccMembership('join', principal, f.store)).toEqual({
      memberStatus: 'active', nextStep: 'your_profile',
    })
    expect(f.count()).toBe(1)
  })

  it('Given one member, when signing in, adding profile or Passport, then no new node appears', async () => {
    const f = fixture()
    await enterDccMembership('join', principal, f.store)
    for (const entry of ['sign-in', 'add-profile', 'passport', 'join'] as const) {
      expect((await enterDccMembership(entry, principal, f.store)).memberStatus).toBe('active')
    }
    expect(f.count()).toBe(1)
  })

  it('Given a NEW verified Smart Sign account with trusted creation evidence, membership is automatic', async () => {
    const f = fixture(0, true)
    expect((await enterDccMembership('platform-sign-up', principal, f.store)).memberStatus).toBe('active')
    expect((await enterDccMembership('sign-in', principal, f.store)).memberStatus).toBe('active')
    expect(f.count()).toBe(1)
  })

  it('Given a PRE-CUTOVER account, sign-in cannot trigger automatic membership', async () => {
    const f = fixture()
    expect((await enterDccMembership('sign-in', principal, f.store)).memberStatus).toBe('not_member')
    expect(f.count()).toBe(0)
  })

  it('Given no email verification, when Join is requested, then enrollment is held', async () => {
    const f = fixture(0, true)
    expect((await enterDccMembership('platform-sign-up', { ...principal, emailVerified: false }, f.store)).memberStatus).toBe('verification_required')
    expect(f.count()).toBe(0)
  })

  it('Given an older People email match, when Join is requested, then ownership is reviewed, not claimed', async () => {
    const f = fixture(1, true)
    expect((await enterDccMembership('platform-sign-up', principal, f.store)).memberStatus).toBe('review_required')
    expect(f.count()).toBe(0)
  })

  it('Given withdrawn membership, when signing back in, then the old member is not reactivated', async () => {
    const f = fixture()
    f.bindings.set(principal.subject, { privatePersonId: 'recPRIVATE', state: 'withdrawn' })
    expect((await enterDccMembership('sign-in', principal, f.store)).memberStatus).toBe('review_required')
    expect(f.count()).toBe(0)
  })

  it('Given provider failure, when saving, then no success receipt is fabricated', async () => {
    const f = fixture()
    f.store.createOrGetVerifiedMembership = async () => { throw new Error('provider unavailable') }
    await expect(enterDccMembership('join', principal, f.store)).rejects.toThrow('provider unavailable')
  })

  it('Given concurrent verified platform-account creation deliveries, the atomic store returns one membership', async () => {
    const f = fixture(0, true)
    const receipts = await Promise.all(Array.from({ length: 8 }, () => enterDccMembership('platform-sign-up', principal, f.store)))
    expect(receipts.every(r => r.memberStatus === 'active')).toBe(true)
    expect(f.count()).toBe(1)
  })
})

describe('BDD — delayed anonymous website cohort is distinct from WhatsApp and polls', () => {
  const base = {
    aggregateCutoff: '2026-11-09T00:00:00Z',
    publishAt: '2026-11-22T00:00:00Z',
    reportedWhatsAppLowerBound: 101,
    pollSelections: 72,
  }
  it('Given one new join, when no weekly snapshot is eligible, then nothing is published', () => {
    expect(prepareWeeklyPresenceSnapshot({
      ...base, verifiedActiveMemberCount: 1, aggregateCutoff: '2026-11-21T00:00:00Z',
    })).toEqual({ action: 'defer', reason: 'too_recent' })
  })
  it('Given a tiny cohort, when a delayed snapshot is prepared, then no individual mark is shown', () => {
    const decision = prepareWeeklyPresenceSnapshot({ ...base, verifiedActiveMemberCount: 4 })
    expect(decision.action).toBe('publish')
    if (decision.action !== 'publish') throw new Error('expected publication')
    expect(decision.snapshot.verifiedWebsiteMemberPresence.markCount).toBeNull()
    expect(publicPresenceMarks(decision.snapshot)).toEqual([])
  })
  it('Given 12 verified members, when the scheduled batch runs, then only 10 anonymous decorative marks appear', () => {
    const decision = prepareWeeklyPresenceSnapshot({ ...base, verifiedActiveMemberCount: 12 })
    if (decision.action !== 'publish') throw new Error('expected publication')
    expect(decision.snapshot.verifiedWebsiteMemberPresence).toEqual({ status: 'coarsened', markCount: 10 })
    expect(publicPresenceMarks(decision.snapshot)).toHaveLength(10)
    expect(decision.snapshot.reportedWhatsAppLowerBound).toBe(101)
    expect(decision.snapshot.pollSelections).toBe(72)
    expect(decision.snapshot.countsNotAdditive).toBe(true)
    const json = JSON.stringify(decision.snapshot)
    for (const forbidden of ['email', 'privatePersonId', 'interest', 'joinedAt', 'uniqueTotal']) {
      expect(json).not.toContain(forbidden)
    }
  })
  it('Given the same week already published, when the count changes, then it stays frozen', () => {
    const first = prepareWeeklyPresenceSnapshot({ ...base, verifiedActiveMemberCount: 10 })
    if (first.action !== 'publish') throw new Error('expected publication')
    expect(prepareWeeklyPresenceSnapshot({
      ...base, verifiedActiveMemberCount: 15, lastPublished: first.snapshot,
    })).toEqual({ action: 'unchanged', snapshot: first.snapshot })
  })
})
