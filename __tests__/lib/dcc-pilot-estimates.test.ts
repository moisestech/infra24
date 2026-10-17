import {
  CAROL_PILOT_ESTIMATE,
  OSCAR_PILOT_ESTIMATE,
  pilotEstimateLinesTotal,
  CAROL_PROPOSAL,
  OSCAR_PROPOSAL,
  SANDRA_PROPOSAL,
  FRANKIE_PROPOSAL,
  getClientProposal,
  getMachineCatalogEntry,
  proposalGreetingName,
} from '@/lib/dcc/fabrication'

describe('DCC pilot quote planning pages', () => {
  it('keeps both planning allowances internally consistent, unapproved and nonpayable', () => {
    expect(CAROL_PILOT_ESTIMATE.amountUsd).toBe(225)
    expect(pilotEstimateLinesTotal(CAROL_PILOT_ESTIMATE)).toBe(225)
    expect(CAROL_PILOT_ESTIMATE.depositIllustrationUsd).toBe(112.5)
    expect(OSCAR_PILOT_ESTIMATE.amountUsd).toBe(350)
    expect(pilotEstimateLinesTotal(OSCAR_PILOT_ESTIMATE)).toBe(350)
    expect(OSCAR_PILOT_ESTIMATE.depositIllustrationUsd).toBe(175)

    for (const proposal of [CAROL_PROPOSAL, OSCAR_PROPOSAL]) {
      expect(proposal.job.status).toBe('PROTOTYPE_SCOPING')
      expect(proposal.job.paymentStatus).toBe('not_quoted')
      expect(proposal.job.quoteAmount).toBeUndefined()
      expect(proposal.pricing?.amountStatus).toBe('pending')
      expect(proposal.pricing?.amountUsd).toBeUndefined()
      expect(proposal.job.documentationRights.publicClientName).toBe(false)
      expect(proposal.job.documentationRights.publicCaseStudy).toBe(false)
    }
  })

  it("preserves Carol's two requested colors while limiting the first planning test", () => {
    expect(CAROL_PROPOSAL.job.prototypeGoal).toContain('approximately 2-inch')
    expect(CAROL_PILOT_ESTIMATE.includes.join(' ')).toMatch(/one initial hollow-shell/i)
    expect(CAROL_PILOT_ESTIMATE.exclusions.join(' ')).toMatch(/second requested colorway/i)
    expect(CAROL_PROPOSAL.pricing?.materialNote).toMatch(/fuchsia/i)
    expect(CAROL_PROPOSAL.pricing?.materialNote).toMatch(/green/i)
    expect(CAROL_PROPOSAL.pricing?.amountStatus).toBe('pending')
  })

  it('registers Oscar and only proposes an unverified FDM machine', () => {
    expect(getClientProposal('oscar-rieveling')).toBe(OSCAR_PROPOSAL)
    expect(proposalGreetingName('oscar-rieveling')).toBe('Oscar')
    expect(OSCAR_PROPOSAL.job.serviceType).toBe('PREPARE_PLUS_FABRICATE')
    expect(OSCAR_PROPOSAL.media).toHaveLength(0)
    expect(getMachineCatalogEntry('bambu-lab-h2s')?.accessStatus).toBe('unconfirmed')
    expect(getMachineCatalogEntry('bambu-lab-h2d')?.accessStatus).toBe('unconfirmed')
    expect(OSCAR_PILOT_ESTIMATE.exclusions.join(' ')).toMatch(/structural/i)
  })
})


describe('discovery proposal protections', () => {
  it('keeps Sandra and Frankie in unquoted, private scope review', () => {
    for (const proposal of [SANDRA_PROPOSAL, FRANKIE_PROPOSAL]) {
      expect(getClientProposal(proposal.slug)).toBe(proposal)
      expect(proposal.job.paymentStatus).toBe('not_quoted')
      expect(proposal.pricing?.amountStatus).toBe('pending')
      expect(proposal.pricing?.amountUsd).toBeUndefined()
      expect(proposal.quoteLineItems?.every((line) => line.amountStatus === 'pending')).toBe(true)
      expect(proposal.job.documentationRights.publicCaseStudy).toBe(false)
    }
    expect(SANDRA_PROPOSAL.media).toHaveLength(0)
    expect(FRANKIE_PROPOSAL.media).toHaveLength(0)
    expect(FRANKIE_PROPOSAL.pricing?.terms).toMatch(/separately approved/i)
  })
})
