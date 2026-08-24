import {
  DCC_WORKSHOP_OFFERINGS,
  assertWorkshopOfferingSlugsValid,
  getWorkshopOfferingBySlug,
  listWorkshopOfferings,
} from '@/lib/dcc/education'

describe('dcc education offerings', () => {
  it('lists existing public workshop pages without inventing prices', () => {
    expect(assertWorkshopOfferingSlugsValid()).toEqual([])
    expect(listWorkshopOfferings().map((offering) => offering.slug)).toEqual([
      'saturday-lab',
      'resin-printing',
      'vibe-coding-net-art',
      'ip-age-of-ai',
    ])
    const serialized = JSON.stringify(DCC_WORKSHOP_OFFERINGS)
    expect(serialized).not.toMatch(/\$\d/)
    expect(serialized).not.toMatch(/stripe/i)
  })

  it('publishes resin capacity from the workshop engine and keeps fabricate rates out', () => {
    const resin = getWorkshopOfferingBySlug('resin-printing')
    expect(resin?.capacity).toBe(8)
    expect(resin?.durationMinutes).toBe(180)
    expect(resin?.href).toBe('/workshop/resin-printing')
    expect(resin?.shortDescription).not.toMatch(/\$/)
  })

  it('treats Saturday Lab as open lab without a fake headcount', () => {
    const lab = getWorkshopOfferingBySlug('saturday-lab')
    expect(lab?.enrollment).toBe('open-lab')
    expect(lab?.capacity).toBeUndefined()
  })
})
