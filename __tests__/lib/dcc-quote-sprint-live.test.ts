import { QUOTE_SPRINT } from '@/lib/dcc/fabrication/sprint/quote-sprint'
import {
  filterSprintEntries,
  operatingStageForAirtableStatus,
  PAYMENT_NOT_CONFIRMED,
  sprintOperatingCounts,
  type QuoteSprintLiveRead,
} from '@/lib/dcc/fabrication/sprint/live-jobs'

const emptyLive: QuoteSprintLiveRead = {
  available: false,
  detail: 'fallback',
  jobs: {},
}

describe('quote sprint live status', () => {
  it('maps Airtable status without treating acceptance as payment', () => {
    expect(operatingStageForAirtableStatus('Needs Info')).toBe('Inquiry')
    expect(operatingStageForAirtableStatus('Scoping')).toBe('Scoped')
    expect(operatingStageForAirtableStatus('Accepted / Paid')).toBe('Accepted')
    expect(operatingStageForAirtableStatus('Closed / Lost')).toBe('Closed')
    expect(PAYMENT_NOT_CONFIRMED).toMatch(/not confirmed/i)
  })

  it('counts prepared scopes and keeps paid at zero until accounting confirms it', () => {
    const counts = sprintOperatingCounts(QUOTE_SPRINT, emptyLive)
    expect(counts.scopesPrepared).toBe(4)
    expect(counts.quotesIssued).toBe(0)
    expect(counts.paid).toBe(0)
    expect(counts.inProduction).toBe(0)
    expect(counts.productionCap).toBe(3)
  })

  it('keeps Accepted / Paid out of the paid count', () => {
    const live: QuoteSprintLiveRead = {
      available: true,
      detail: 'live',
      jobs: {
        recSejBYq324jEpoq: {
          recordId: 'recSejBYq324jEpoq',
          airtableStatus: 'Accepted / Paid',
          operatingStage: operatingStageForAirtableStatus('Accepted / Paid'),
          paymentStatus: PAYMENT_NOT_CONFIRMED,
          productionStatus: 'Not in production',
          documentationStatus: 'Not documented',
          blocker: null,
          budgetRange: null,
          proposalRoute: '/fabricate/proposals/carol-haggiag',
          proposalReleaseStage: 'Draft PR',
        },
      },
    }
    const counts = sprintOperatingCounts(QUOTE_SPRINT, live)
    expect(counts.accepted).toBe(1)
    expect(counts.paid).toBe(0)
    expect(live.jobs.recSejBYq324jEpoq?.proposalReleaseStage).toBe('Draft PR')
  })

  it('filters active blocked inquiries without dropping the historical row from all', () => {
    const blocked = filterSprintEntries(QUOTE_SPRINT, emptyLive, { readiness: 'blocked' })
    expect(blocked.map((entry) => entry.slug)).toEqual([
      'carol-haggiag',
      'oscar-rieveling',
      'frankie-hsu',
      'sandra-ramos',
    ])
    const ready = filterSprintEntries(QUOTE_SPRINT, emptyLive, { readiness: 'ready' })
    expect(ready).toHaveLength(0)
    const scoped = filterSprintEntries(QUOTE_SPRINT, emptyLive, { stage: 'Scoping' })
    expect(scoped.map((entry) => entry.slug)).toEqual(['carol-haggiag'])
  })
})
