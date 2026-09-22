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
  STUDIO_SERVICES,
  suggestStudioService,
  projectStageFromLaneParam,
  DEFAULT_DOCUMENTATION_RIGHTS,
  HEATHER_PROPOSAL,
  CAROL_PROPOSAL,
  proposalGreetingName,
  HEATHER_BASELINE_SLICE,
  HEATHER_QUOTE_LINE_ITEMS,
  HEATHER_QUOTE_TOTAL_USD,
  HEATHER_DEFAULT_FOUNDER_HOURS,
  HEATHER_COST_LINE_ITEMS,
  calculateQuoteEconomics,
  sumQuoteLineAmounts,
  clientPricingViewLeaksInternal,
  serializeClientPricingView,
  PRICE_REFERENCE_DISCLAIMER,
  FOUNDER_MARGIN_WARNING_USD,
  clientFacingJobStatus,
  getMaterial,
  getMachineCatalogEntry,
  fabricateStartRequestSchema,
} from '@/lib/dcc/fabrication'
import { isSafeProposalMediaPath } from '@/lib/dcc/fabrication/proposal-media'
import { formatFabricateStartNotes } from '@/lib/dcc/fabrication/start-notes'
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

  it('builds a quote handoff that lands on /fabricate/start', () => {
    expect(
      buildQuoteHandoffHref({
        tier: 'full_service_artist',
        printHours: 8,
        materialGrams: 250,
        laborHours: 1,
        queue: 'standard',
      })
    ).toBe('/fabricate/start?tier=full_service_artist&hours=8&grams=250&labor=1&queue=standard')
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

describe('fabricate studio system', () => {
  it('exposes two related studio services with distinct workflows', () => {
    expect(STUDIO_SERVICES.map((s) => s.id)).toEqual([
      'FABRICATE_MY_FILE',
      'PREPARE_PLUS_FABRICATE',
    ])
    expect(STUDIO_SERVICES[0]?.href).toBe('/fabricate/services/fabricate-my-file')
    expect(STUDIO_SERVICES[1]?.href).toBe('/fabricate/services/prepare-and-fabricate')
    expect(suggestStudioService('finished_3d_file')?.id).toBe('FABRICATE_MY_FILE')
    expect(suggestStudioService('sketch_reference')?.id).toBe('PREPARE_PLUS_FABRICATE')
    expect(suggestStudioService('unsure')).toBeNull()
    expect(projectStageFromLaneParam('print-my-file')).toBe('finished_3d_file')
  })

  it('defaults public documentation permissions off', () => {
    expect(DEFAULT_DOCUMENTATION_RIGHTS.publicClientName).toBe(false)
    expect(DEFAULT_DOCUMENTATION_RIGHTS.publicCADImages).toBe(false)
    expect(DEFAULT_DOCUMENTATION_RIGHTS.publicProcessImages).toBe(false)
    expect(DEFAULT_DOCUMENTATION_RIGHTS.publicFinishedObject).toBe(false)
    expect(DEFAULT_DOCUMENTATION_RIGHTS.publicProjectEconomics).toBe(false)
    expect(DEFAULT_DOCUMENTATION_RIGHTS.publicCaseStudy).toBe(false)
  })

  it('keeps Heather private, quoted, with five client lines summing to $625', () => {
    expect(HEATHER_PROPOSAL.job.jobNumber).toBe('DCC-JOB-001')
    expect(HEATHER_PROPOSAL.job.serviceType).toBe('FABRICATE_MY_FILE')
    expect(HEATHER_PROPOSAL.pricing?.amountUsd).toBe(625)
    expect(HEATHER_QUOTE_TOTAL_USD).toBe(625)
    expect(sumQuoteLineAmounts(HEATHER_QUOTE_LINE_ITEMS, { clientVisibleOnly: true })).toBe(
      625
    )
    expect(clientFacingJobStatus(HEATHER_PROPOSAL.job.status)).toBe(
      'Material confirmation'
    )
    expect(HEATHER_PROPOSAL.job.documentationRights.publicCaseStudy).toBe(false)
    expect(HEATHER_BASELINE_SLICE.caveat).toMatch(/resin approval/)
    const material = getMaterial(HEATHER_PROPOSAL.materialIds[0] ?? '')
    expect(material?.id).toBe('resin-high-clear-anycubic')
    expect(material?.pendingConfirmation).toBe(true)
    expect(material?.currentPrice).toBe(42.47)
    expect(material?.productUrl).toMatch(/high-clear-resin/)
    expect(PRICE_REFERENCE_DISCLAIMER).toMatch(/verified before purchase/)
    const machine = getMachineCatalogEntry('anycubic-photon-mono-m7-max')
    expect(machine?.accessStatus).toBe('unconfirmed')
    expect(machine?.internalHourlyRate).toBe(15)
  })

  it('pressure-tests Heather economics and hides internal fields from client view', () => {
    const atDefault = calculateQuoteEconomics({
      quoteTotal: HEATHER_QUOTE_TOTAL_USD,
      costLineItems: HEATHER_COST_LINE_ITEMS,
      founderHours: HEATHER_DEFAULT_FOUNDER_HOURS,
    })
    expect(atDefault.directCost).toBeCloseTo(278.43, 2)
    expect(atDefault.contribution).toBeCloseTo(346.57, 2)
    expect(atDefault.founderMarginPerHour).toBeCloseTo(138.63, 1)
    expect(atDefault.belowFounderThreshold).toBe(false)

    const atThreeHours = calculateQuoteEconomics({
      quoteTotal: HEATHER_QUOTE_TOTAL_USD,
      costLineItems: HEATHER_COST_LINE_ITEMS,
      founderHours: 3,
    })
    expect(atThreeHours.founderMarginPerHour).toBeCloseTo(115.52, 1)
    expect(atThreeHours.belowFounderThreshold).toBe(true)
    expect(FOUNDER_MARGIN_WARNING_USD).toBe(125)

    const clientJson = serializeClientPricingView(HEATHER_PROPOSAL)
    expect(clientPricingViewLeaksInternal(HEATHER_PROPOSAL)).toBe(false)
    expect(clientJson).not.toMatch(/internalRate|costLineItems|hourlyRate|directCost/i)
    expect(clientJson).not.toContain(String(HEATHER_PROPOSAL.costLineItems?.[0]?.internalRate))
  })

  it('greets clients by first name on the proposal unlock screen', () => {
    expect(proposalGreetingName('heather-deitch')).toBe('Heather')
    expect(proposalGreetingName('carol-haggiag')).toBe('Carol')
    expect(proposalGreetingName('heather-deitch', 'Heather Deitch')).toBe('Heather')
    expect(proposalGreetingName(undefined, 'Carol')).toBe('Carol')
  })

  it('keeps Carol as an unquoted Prepare + Fabricate shell', () => {
    expect(CAROL_PROPOSAL.job.jobNumber).toBe('DCC-JOB-002')
    expect(CAROL_PROPOSAL.job.serviceType).toBe('PREPARE_PLUS_FABRICATE')
    expect(CAROL_PROPOSAL.pricing?.amountStatus).toBe('pending')
    expect(CAROL_PROPOSAL.pricing?.amountUsd).toBeUndefined()
    expect(CAROL_PROPOSAL.job.paymentStatus).toBe('not_quoted')
  })

  it('refuses CAD and path traversal for private proposal media', () => {
    expect(
      isSafeProposalMediaPath(
        'heather-deitch',
        'H_RENDER_001_hero_translucent_prototype.png'
      )
    ).toBe(true)
    expect(isSafeProposalMediaPath('heather-deitch', 'source.pm7m')).toBe(false)
    expect(isSafeProposalMediaPath('heather-deitch', '../secret.png')).toBe(false)
    expect(isSafeProposalMediaPath('unknown-client', 'a.png')).toBe(false)
  })

  it('requires prototype-learning on fabricate start intake', () => {
    const parsed = fabricateStartRequestSchema.safeParse({
      name: 'Test',
      email: 'test@example.com',
      projectTitle: 'Lighting study',
      projectStage: 'finished_3d_file',
      description: 'A usable lighting file ready for review.',
      prototypeLearning: 'Whether the part transmits light evenly.',
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      const notes = formatFabricateStartNotes(parsed.data)
      expect(notes).toMatch(/What do you need to learn from this prototype/)
      expect(notes).toMatch(/Suggested service \(not assigned\): FABRICATE_MY_FILE/)
    }
    expect(
      fabricateStartRequestSchema.safeParse({
        name: 'Test',
        email: 'test@example.com',
        projectTitle: 'Lighting study',
        projectStage: 'finished_3d_file',
        description: 'A usable lighting file ready for review.',
      }).success
    ).toBe(false)
  })
})

