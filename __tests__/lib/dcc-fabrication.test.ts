import {
  estimateQuote,
  FABRICATION_QUOTE_EXAMPLES,
  FABRICATION_FINISH_LEVELS,
  FABRICATION_RATE_CARDS,
  FABRICATION_SECTION_MEDIA,
  FABRICATION_SERVICE_LANES,
  FABRICATION_CAPABILITIES,
  FABRICATION_FIELD_TESTS,
  PLANNING_ESTIMATE_SEED,
  buildQuoteHandoffHref,
  getFabricationPublicMetrics,
  getFabricationSectionMedia,
  getPublicProject,
  isFabricationRecordPublic,
  listPublicCapabilities,
  listPublicFieldTests,
  listPublicProjects,
  projectEconomics,
  rushPercentageForQueue,
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
    expect(FABRICATION_SECTION_MEDIA.hero.src).toContain(
      '01-fabricate-hero-conceptual-01'
    )
    expect(FABRICATION_SECTION_MEDIA.hero.kind).toBe('conceptual')
    expect(getFabricationSectionMedia('fieldLab').src).toContain(
      'field-lab-joint-testing-overhead-conceptual-01'
    )
    expect(getFabricationSectionMedia('fieldLab').kind).toBe('conceptual')
    expect(getFabricationSectionMedia('lanes').src).toContain('02-service-lanes')
    expect(getFabricationSectionMedia('pricing').src).toContain('03-pricing-transparency')
    expect(getFabricationSectionMedia('access').src).toContain('05-artist-access')
    expect(getFabricationSectionMedia('quote').src).toContain('06-quote-intake')
    expect(getFabricationSectionMedia('lanes').kind).toBe('conceptual')
    expect(getFabricationSectionMedia('finishesHero').src).toContain(
      '300-finishes-l0-l4-hero'
    )
    expect(getFabricationSectionMedia('finishesHero').src).toContain(
      'res.cloudinary.com'
    )
    expect(getFabricationSectionMedia('finishRaw').src).toContain('301-finish-l0')
    expect(getFabricationSectionMedia('finishClean').src).toContain('302-finish-l1')
    expect(getFabricationSectionMedia('finishAssembly').src).toContain(
      '303-finish-l2-refined'
    )
    expect(getFabricationSectionMedia('finishExhibition').src).toContain(
      '304-finish-l3-primed'
    )
    expect(getFabricationSectionMedia('finishFinished').src).toContain(
      '305-finish-l4-artist-finished'
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

describe('fabrication publicSafe boundary', () => {
  it('never publishes peer/vendor records without both flags', () => {
    const peer = FABRICATION_CAPABILITIES.find((c) => c.id === 'peer-shop-adhesive')
    const vendor = FABRICATION_CAPABILITIES.find((c) => c.id === 'vendor-material-note')
    expect(peer).toBeTruthy()
    expect(vendor).toBeTruthy()
    expect(isFabricationRecordPublic(peer!)).toBe(false)
    expect(isFabricationRecordPublic(vendor!)).toBe(false)
    expect(listPublicCapabilities().map((c) => c.id)).not.toContain('peer-shop-adhesive')
    expect(listPublicCapabilities().map((c) => c.id)).not.toContain('vendor-material-note')
  })

  it('strips privateNotes and hides unpublished field tests', () => {
    const privateTest = FABRICATION_FIELD_TESTS.find((t) => t.id === 'FIELD-PRIV-PEER')
    expect(privateTest?.publicSafe).toBe(false)
    expect(isFabricationRecordPublic(privateTest!)).toBe(false)
    const publicTests = listPublicFieldTests()
    expect(publicTests.map((t) => t.id)).toEqual(['FIELD-001', 'FIELD-002', 'FIELD-003'])
    for (const test of publicTests) {
      expect('privateNotes' in test).toBe(false)
      expect(JSON.stringify(test.publicLearning)).not.toMatch(/ITS3D|Rad |adhesive brand/i)
    }
  })
})

describe('fabrication estimate planner', () => {
  it('seeds the medium-sculpture Full-Service total of $151', () => {
    const b = estimateQuote({
      ...PLANNING_ESTIMATE_SEED,
      rushPercentage: rushPercentageForQueue(PLANNING_ESTIMATE_SEED.queue),
    })
    expect(b.setup).toBe(25)
    expect(b.machine).toBe(56)
    expect(b.material).toBe(20)
    expect(b.labor).toBe(50)
    expect(b.total).toBe(151)
  })

  it('maps priority queue surcharge into estimateQuote', () => {
    const b = estimateQuote({
      tier: 'full_service_artist',
      printHours: 8,
      materialGrams: 250,
      laborHours: 1,
      rushPercentage: rushPercentageForQueue('priority'),
    })
    expect(b.rushFee).toBe(30.2)
    expect(b.total).toBe(181.2)
  })

  it('builds a quote handoff that stays on the existing intake', () => {
    expect(
      buildQuoteHandoffHref({
        tier: 'full_service_artist',
        printHours: 8,
        materialGrams: 250,
        laborHours: 1,
        queue: 'standard',
      })
    ).toBe('/fabricate/quote?tier=full_service_artist&hours=8&grams=250&labor=1&queue=standard')
  })
})

describe('fabrication projects', () => {
  it('resolves the three DCC test slugs with estimateQuote economics', () => {
    const slugs = [
      'large-part-joining-test-001',
      'support-interface-test-001',
      'finish-level-test-001',
    ]
    expect(listPublicProjects().map((p) => p.slug)).toEqual(slugs)
    for (const slug of slugs) {
      const project = getPublicProject(slug)
      expect(project?.kind).toBe('dcc-test')
      const { breakdown } = projectEconomics(project!)
      expect(breakdown.total).toBe(
        estimateQuote(project!.economics).total
      )
    }
  })
})

describe('fabrication metrics', () => {
  it('aggregates only public records', () => {
    const metrics = getFabricationPublicMetrics()
    expect(metrics.publicCapabilityCount).toBe(listPublicCapabilities().length)
    expect(metrics.publicFieldTestCount).toBe(3)
    expect(metrics.dccTestProjectCount).toBe(3)
    expect(metrics.clientProjectCount).toBe(0)
    expect(metrics.publicCapabilityCount).toBeLessThan(FABRICATION_CAPABILITIES.length)
  })
})
