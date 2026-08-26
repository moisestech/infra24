import {
  RESIN_BANNER_CDN,
  RESIN_CONCEPT_CDN,
  RESIN_MODULE_BANNERS,
  RESIN_MODULE_INSTRUCTIONAL_CONCEPTS,
  RESIN_MODULE_TECHNIQUE_BOARDS,
  RESIN_MODULE_VOCAB,
  RESIN_PRINTING_MODULES,
} from '@/lib/workshop-engine/resin-printing'

describe('resin cloudinary media + vocab', () => {
  it('points every module banner at Cloudinary CDN', () => {
    expect(Object.keys(RESIN_BANNER_CDN)).toHaveLength(9)
    for (const banner of Object.values(RESIN_MODULE_BANNERS)) {
      expect(banner.src).toContain('res.cloudinary.com/dck5rzi4h')
      expect(banner.src).toContain('resin-printing-for-artist')
    }
  })

  it('registers instructional concepts 107–135 and module stills 200–214 on Cloudinary', () => {
    const ids = Object.keys(RESIN_CONCEPT_CDN)
    expect(ids).toHaveLength(44)
    expect(ids).toContain('107-slicer-orientation-compare')
    expect(ids).toContain('200-m00-participant-path')
    expect(ids).toContain('214-m08-readiness-pathways')
    for (const src of Object.values(RESIN_CONCEPT_CDN)) {
      expect(src).toContain('res.cloudinary.com/dck5rzi4h')
    }
    expect(RESIN_MODULE_TECHNIQUE_BOARDS.welcome?.boards[0]?.id).toBe(
      '200-m00-participant-path'
    )
    expect(RESIN_MODULE_TECHNIQUE_BOARDS['safety-zones']?.boards[0]?.id).toBe(
      '202-m02-safety-zone-behaviors'
    )
    expect(
      RESIN_MODULE_INSTRUCTIONAL_CONCEPTS['failure-clinic']?.items.length
    ).toBeGreaterThanOrEqual(5)
  })

  it('attaches vocab to each resin module', () => {
    for (const mod of RESIN_PRINTING_MODULES) {
      expect(RESIN_MODULE_VOCAB[mod.id]?.length).toBeGreaterThan(0)
      expect(mod.vocab?.length).toBeGreaterThan(0)
      expect(mod.banner?.src).toContain('cloudinary')
    }
  })
})
