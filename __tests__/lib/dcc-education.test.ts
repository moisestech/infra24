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

  it('reuses existing workshop banners on DCC offerings instead of inventing photos', () => {
    const resin = getWorkshopOfferingBySlug('resin-printing')
    expect(resin?.image?.src).toContain('res.cloudinary.com/dck5rzi4h')
    expect(resin?.image?.src).toContain('00-welcome-join-banner')
    expect(resin?.image?.caption).toMatch(/Conceptual/)
    expect(getWorkshopOfferingBySlug('saturday-lab')?.image?.src).toContain(
      '01_start-here-two-paths'
    )
    expect(getWorkshopOfferingBySlug('vibe-coding-net-art')?.image?.src).toContain(
      'vibe-coding-with-net-art'
    )
    expect(getWorkshopOfferingBySlug('ip-age-of-ai')?.image?.src).toContain(
      'skills-age-of-ai_landscape-banner'
    )
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
