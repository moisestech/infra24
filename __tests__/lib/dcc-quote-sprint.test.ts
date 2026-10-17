import { estimatePaymentFee } from '@/lib/dcc/fabrication/quote-economics'
import {
  CAROL_PROPOSAL,
  FRANKIE_PROPOSAL,
  HEATHER_PROPOSAL,
  OSCAR_PROPOSAL,
  SANDRA_PROPOSAL,
} from '@/lib/dcc/fabrication/proposals'
import {
  getQuoteSprintEntry,
  listActiveQuoteSprint,
  PENDING_TECHNICAL_REVIEW,
  QUOTE_SPRINT,
  sprintContributionReady,
  sprintKnownCostUsd,
  sprintPendingRows,
} from '@/lib/dcc/fabrication/sprint/quote-sprint'

describe('quote sprint registry', () => {
  it('links the four active inquiries to the canonical Airtable jobs', () => {
    expect(listActiveQuoteSprint().map((entry) => entry.airtableRecordId)).toEqual([
      'recSejBYq324jEpoq',
      'recNEiD7GmiUXgaiV',
      'recgNYcTAfSkE8Cwb',
      'recMxJ2kWFsvreTnq',
    ])
    for (const proposal of [CAROL_PROPOSAL, OSCAR_PROPOSAL, FRANKIE_PROPOSAL, SANDRA_PROPOSAL]) {
      expect(getQuoteSprintEntry(proposal.slug)?.airtableRecordId).toBe(proposal.job.id)
      expect(getQuoteSprintEntry(proposal.slug)?.nextAction).toBe(proposal.approvalNextStep)
    }
  })

  it('prices only the payment-fee formula and leaves production buckets pending', () => {
    const carol = getQuoteSprintEntry('carol-haggiag')
    const oscar = getQuoteSprintEntry('oscar-rieveling')
    const frankie = getQuoteSprintEntry('frankie-hsu')
    const sandra = getQuoteSprintEntry('sandra-ramos')
    expect(carol && oscar && frankie && sandra).toBeTruthy()
    if (!carol || !oscar || !frankie || !sandra) return

    expect(sprintKnownCostUsd(carol.rows)).toBe(Number(estimatePaymentFee(225).toFixed(2)))
    expect(sprintKnownCostUsd(oscar.rows)).toBe(Number(estimatePaymentFee(350).toFixed(2)))
    expect(sprintKnownCostUsd(frankie.rows)).toBe(0)
    expect(sprintKnownCostUsd(sandra.rows)).toBe(0)
    for (const entry of [carol, oscar, frankie, sandra]) {
      expect(sprintContributionReady(entry.rows)).toBe(false)
      expect(sprintPendingRows(entry.rows).every((row) => row.costUsd == null)).toBe(true)
      expect(sprintPendingRows(entry.rows).every((row) => row.notes === PENDING_TECHNICAL_REVIEW)).toBe(true)
      expect(entry.rows.some((row) => row.costUsd === 0)).toBe(false)
    }
    expect(frankie.workingAllowanceUsd).toBeNull()
    expect(sandra.workingAllowanceUsd).toBeNull()
    expect(frankie.rows.find((row) => row.bucket === 'payment_fee')?.costUsd).toBeNull()
  })

  it('keeps Heather historical and Gianni a candidate, and keeps client records free of internal rates', () => {
    expect(getQuoteSprintEntry('heather-deitch')).toBeUndefined()
    expect(QUOTE_SPRINT.find((entry) => entry.slug === 'heather-deitch')?.role).toBe('historical')
    expect(QUOTE_SPRINT.find((entry) => entry.slug === 'gianni-dalerta')?.role).toBe('candidate')
    expect(QUOTE_SPRINT.find((entry) => entry.slug === 'gianni-dalerta')?.airtableRecordId).toBeUndefined()
    expect(HEATHER_PROPOSAL.pricing?.amountUsd).toBe(625)
    expect(HEATHER_PROPOSAL.job.id).toBe('dcc-job-001')

    const clientJson = JSON.stringify([
      CAROL_PROPOSAL,
      OSCAR_PROPOSAL,
      FRANKIE_PROPOSAL,
      SANDRA_PROPOSAL,
    ])
    expect(clientJson).not.toContain('internalRate')
    expect(clientJson).not.toContain(PENDING_TECHNICAL_REVIEW)
    expect(FRANKIE_PROPOSAL.quoteLineItems?.every((line) => line.amount == null)).toBe(true)
    expect(FRANKIE_PROPOSAL.pricing?.reprintNote).toMatch(/\$75/)
    expect(FRANKIE_PROPOSAL.pricing?.reprintNote).toMatch(/does not apply/i)
  })
})
