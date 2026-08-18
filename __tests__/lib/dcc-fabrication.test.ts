import {
  estimateQuote,
  FABRICATION_QUOTE_EXAMPLES,
  FABRICATION_FINISH_LEVELS,
  FABRICATION_RATE_CARDS,
  FABRICATION_SECTION_MEDIA,
  FABRICATION_SERVICE_LANES,
  getFabricationSectionMedia,
} from '@/lib/dcc/fabrication'
import { RESIN_RESOURCES } from '@/lib/workshop-engine/resin-printing'

describe('dcc fabrication estimateQuote', () => {
  it('matches pricing-spec worked examples', () => {
    const expected: Record<string, number[]> = {
      'small-prototype': [50, 35],
      'medium-sculpture': [151, 70, 120],
      'complex-support': [253, 126, 201],
      'large-segmented': [647, 285, 535],
    }
    for (const ex of FABRICATION_QUOTE_EXAMPLES) {
      expect(ex.lines.map((l) => l.total)).toEqual(expected[ex.id])
    }
  })

  it('applies tier minimums when raw total is below floor', () => {
    const b = estimateQuote({
      tier: 'full_service_artist',
      printHours: 2.5,
      materialGrams: 70,
    })
    expect(b.rawTotal).toBeLessThan(50)
    expect(b.appliedMinimum).toBe(true)
    expect(b.total).toBe(50)
  })

  it('exposes three rate cards and five finish levels', () => {
    expect(FABRICATION_RATE_CARDS).toHaveLength(3)
    expect(FABRICATION_FINISH_LEVELS.map((f) => f.level)).toEqual([0, 1, 2, 3, 4])
    expect(FABRICATION_FINISH_LEVELS.filter((f) => f.inHouse)).toHaveLength(3)
    expect(FABRICATION_SERVICE_LANES).toHaveLength(3)
    for (const lane of FABRICATION_SERVICE_LANES) {
      expect(lane.colorTokenId).toBeTruthy()
      expect(lane.iconKey).toBeTruthy()
    }
    for (const finish of FABRICATION_FINISH_LEVELS) {
      expect(finish.colorTokenId).toBeTruthy()
      expect(finish.mediaId).toBeTruthy()
    }
  })

  it('lists swap-ready section media slots for upcoming assets', () => {
    expect(Object.keys(FABRICATION_SECTION_MEDIA).length).toBeGreaterThanOrEqual(10)
    expect(FABRICATION_SECTION_MEDIA.hero.fileName).toBe('01-fabricate-hero.webp')
    expect(getFabricationSectionMedia('finishesHero').src).toContain(
      '113-post-processing-states'
    )
  })
})

describe('resin workshop fabricate links', () => {
  it('lists pricing, finishes, and quote resources without embedding prices', () => {
    const byId = Object.fromEntries(RESIN_RESOURCES.map((r) => [r.id, r]))
    expect(byId['fabricate-pricing']?.href).toBe('/fabricate/pricing')
    expect(byId['fabricate-finishes']?.href).toBe('/fabricate/finishes')
    expect(byId['fabricate-quote']?.href).toBe('/fabricate/quote')
    for (const id of ['fabricate-pricing', 'fabricate-finishes', 'fabricate-quote']) {
      expect(byId[id]?.description).not.toMatch(/\$\d/)
    }
  })
})
