import {
  ownerPassportSchema, ownerPassportSaveSchema, mayEditOwnerPassport, mayRequestPublicPassport,
  requestPublicPassportSchema, DCC_PUBLIC_PROFILE_DISCLOSURE,
} from '@/lib/dcc/membership/profile-schema'

const sample = {
  displayName: 'Community Artist',
  summary: 'I build interactive installations',
  practices: ['Digital fabrication'],
  interests: ['making','code-ai'],
  links: [{ label:'Portfolio',url:'https://example.org/' }],
}

describe('BDD — owner Passport is private until independently approved', () => {
  it('can edit a private draft while reconciliation is pending; cannot request publication', () => {
    expect(mayEditOwnerPassport('pending_reconciliation')).toBe(true)
    expect(mayRequestPublicPassport('pending_reconciliation')).toBe(false)
  })
  it('does not allow deleted, unverified or review-held members to edit or publish', () => {
    for (const state of ['pending_verification','review_required','withdrawn','suspended','deleted'] as const) {
      expect(mayEditOwnerPassport(state)).toBe(false)
      expect(mayRequestPublicPassport(state)).toBe(false)
    }
  })
  it('requires active verified membership for a public listing request', () => {
    expect(mayRequestPublicPassport('active')).toBe(true)
  })
  it('validates user-owned fields and does not accept an injected identity/approval property', () => {
    expect(ownerPassportSchema.safeParse(sample).success).toBe(true)
    expect(ownerPassportSchema.safeParse({...sample, bindingId:'someone-else'}).success).toBe(false)
    expect(ownerPassportSchema.safeParse({...sample, approved:true}).success).toBe(false)
    expect(ownerPassportSchema.safeParse({...sample, interests:['unknown']}).success).toBe(false)
  })
  it('has a separate, exact and opt-in public publication grant', () => {
    expect(requestPublicPassportSchema.safeParse({
      revision:1,consent:true,disclosureVersion:DCC_PUBLIC_PROFILE_DISCLOSURE,
    }).success).toBe(true)
    expect(ownerPassportSaveSchema.safeParse({...sample,revision:0}).success).toBe(true)
    expect(ownerPassportSaveSchema.safeParse(sample).success).toBe(false)
    expect(requestPublicPassportSchema.safeParse({consent:true,disclosureVersion:DCC_PUBLIC_PROFILE_DISCLOSURE}).success).toBe(false)
    expect(requestPublicPassportSchema.safeParse({revision:1,consent:false,disclosureVersion:DCC_PUBLIC_PROFILE_DISCLOSURE}).success).toBe(false)
    expect(requestPublicPassportSchema.safeParse({revision:1,consent:true,disclosureVersion:'old'}).success).toBe(false)
  })
  it('rejects links that include credentials, non-https URL or unknown properties', () => {
    expect(ownerPassportSchema.safeParse({...sample, links:[{label:'x',url:'http://example.org'}]}).success).toBe(false)
    expect(ownerPassportSchema.safeParse({...sample, links:[{label:'x',url:'https://user:pass@example.org'}]}).success).toBe(false)
  })
})
