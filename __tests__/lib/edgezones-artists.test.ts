import type { AirtableRecord } from '@/lib/airtable/client'
import { DEFAULT_SEED_CANDIDATES_FIELD_MAP } from '@/lib/network-builder/seed-candidates-field-map'
import { edgeZonesSeedMatches } from '@/lib/marketing/edgezones-artists'

const F = DEFAULT_SEED_CANDIDATES_FIELD_MAP

function rec(fields: Record<string, unknown>): AirtableRecord {
  return { id: 'recTest', fields }
}

describe('edgeZonesSeedMatches', () => {
  it('matches Related Campaign id', () => {
    const record = rec({ [F.relatedCampaign]: ['recCampaignEdge'] })
    expect(edgeZonesSeedMatches(record, 'recCampaignEdge')).toBe(true)
  })

  it('matches Edge Zones in exhibition program text', () => {
    const record = rec({ [F.relevantExhibitionProgram]: 'Spring show at Edge Zones Gallery' })
    expect(edgeZonesSeedMatches(record)).toBe(true)
  })

  it('does not match unrelated records', () => {
    const record = rec({ [F.relevantExhibitionProgram]: 'Oolite residency' })
    expect(edgeZonesSeedMatches(record)).toBe(false)
  })
})
