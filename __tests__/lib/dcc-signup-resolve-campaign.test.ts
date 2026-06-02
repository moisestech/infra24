import { resolveCampaignRecordId } from '@/lib/dcc/signup/resolve-campaign'

describe('resolveCampaignRecordId', () => {
  const orig = process.env

  beforeEach(() => {
    process.env = { ...orig }
  })

  afterAll(() => {
    process.env = orig
  })

  it('uses TV campaign id for dcc-tv source', () => {
    process.env.AIRTABLE_DCC_CRM_CAMPAIGN_TV_ID = 'recTV'
    expect(resolveCampaignRecordId('dcc-tv')).toBe('recTV')
  })

  it('uses explicit campaignKey when rec id', () => {
    expect(resolveCampaignRecordId('dcc-tv', 'recExplicit')).toBe('recExplicit')
  })
})
