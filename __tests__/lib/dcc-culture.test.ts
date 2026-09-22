import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getAllCdcPaths, getCdcPageByPath, getProgramLeaves } from '@/lib/cdc/routes'
import { DCC_STUDIO_TOURS, getStudioTourByArtistSlug } from '@/lib/dcc/studios'
import {
  ARTISTS_INDEX_INTRO,
  CLANDESTINE_PLACEHOLDER,
  cultureMediaMotionEnabled,
  DCC_CULTURAL_POSITION,
  DCC_EDITORIAL,
  DCC_MIA_NAME,
  DCC_NOW_FORTHCOMING,
  DCC_NOW_LEAD,
  DCC_NOW_LIVE_INTRO,
  DCC_NOW_PARTICIPATE,
  DCC_NOW_PATH,
  DCC_NOW_PHOTOGRAPHY,
  DCC_NOW_POSITION,
  DCC_NOW_TITLE,
  DCC_PROGRAMS,
  DCC_PROJECTS,
  assertArtistSlugsValid,
  assertEditorialSlugsValid,
  assertProgramSlugsValid,
  assertProjectSlugsValid,
  editorialJournalCategory,
  getArtistsForProgram,
  getEditorialForArtist,
  getEditorialPublicPath,
  getListedProgramBySlug,
  getProgramPublicPath,
  getProgramsForArtist,
  getProjectsForArtist,
  getPublishedArtistBySlug,
  isReservedArtistSlug,
  journalHeroEffectForEntry,
  JOURNAL_READING_ORDER,
  JOURNAL_SCALE_LABELS,
  JOURNAL_THESIS,
  JOURNAL_TOPICS,
  listArtists,
  listCurrentOrUpcomingPrograms,
  listEditorial,
  listFeaturedArtists,
  listFeaturedEditorial,
  listJournalAdjacent,
  listJournalArchive,
  listJournalIndexSectionSlugs,
  listJournalOpeningSequence,
  listJournalReadingOrder,
  listPrograms,
  listProjects,
  looksLikeUuid,
  programCategoryForType,
  unresolvedRelationIds,
  type CultureRegistry,
  type DccArtist,
  type DccEditorial,
  type DccProgram,
  type DccProject,
} from '@/lib/dcc/culture'
import { listWorkshopOfferings } from '@/lib/dcc/education'

const fixtureArtist: DccArtist = {
  id: 'artist-fixture-a',
  slug: 'fixture-artist-a',
  name: 'Fixture Artist A',
  location: 'Miami, FL',
  practiceTags: ['sculpture', 'networks'],
  programIds: ['clandestine-2026'],
  projectIds: ['project-fixture-a'],
  editorialIds: ['editorial-fixture-a'],
  status: 'published',
}

const fixtureEditorial: DccEditorial = {
  id: 'editorial-fixture-a',
  slug: 'fixture-conversation-a',
  title: 'A conversation with Fixture Artist A',
  type: 'conversation',
  artistIds: ['artist-fixture-a'],
  programIds: ['clandestine-2026'],
  projectIds: ['project-fixture-a'],
  status: 'published',
}

const fixtureProject: DccProject = {
  id: 'project-fixture-a',
  slug: 'fixture-work-a',
  title: 'Fixture work A',
  artistIds: ['artist-fixture-a'],
  programIds: ['clandestine-2026'],
  status: 'published',
}

const fixtureRegistry: CultureRegistry = {
  artists: [fixtureArtist],
  programs: DCC_PROGRAMS,
  editorial: [fixtureEditorial],
  projects: [fixtureProject],
}

describe('dcc culture public seed', () => {
  it('uses DCC MIA naming and publishes founders without inventing Clandestine artists', () => {
    expect(DCC_MIA_NAME).toBe('DCC MIA')
    expect(DCC_CULTURAL_POSITION).toMatch(/technological conditions of the present/)
    expect(ARTISTS_INDEX_INTRO).toMatch(/not an open directory/)
    expect(listArtists().map((artist) => artist.slug)).toEqual([
      'moises-sanabria',
      'fabiola-larios',
      'angelo-caruso',
    ])
    expect(listArtists().every((artist) => !artist.programIds?.length)).toBe(true)
    expect(listFeaturedArtists().map((artist) => artist.slug)).toEqual(['moises-sanabria'])
    expect(DCC_PROJECTS).toEqual([])
    expect(listProjects()).toEqual([])
    expect(getStudioTourByArtistSlug('moises-sanabria')?.artistSlug).toBe('moises-sanabria')
    expect(getStudioTourByArtistSlug('fabiola-larios')?.artistSlug).toBe('fabiola-larios')
    expect(DCC_STUDIO_TOURS.some((tour) => tour.artistSlug === 'angelo-caruso')).toBe(false)
  })

  it('seeds Clandestine as the first upcoming art-fair program without invented facts', () => {
    const programs = listPrograms()
    expect(programs).toHaveLength(1)
    const clandestine = getListedProgramBySlug('clandestine-art-fair-2026')
    expect(clandestine?.id).toBe('clandestine-2026')
    expect(clandestine?.title).toBe('DCC MIA at Clandestine Art Fair 2026')
    expect(clandestine?.type).toBe('art-fair')
    expect(clandestine?.node).toBe('DCC MIA')
    expect(clandestine?.status).toBe('upcoming')
    expect(clandestine?.artistIds).toEqual([])
    expect(clandestine?.startDate).toBeUndefined()
    expect(clandestine?.endDate).toBeUndefined()
    expect(clandestine?.locationName).toBeUndefined()
    expect(clandestine?.description).toMatch(/when those facts are confirmed/)
    expect(clandestine?.description).not.toMatch(/\b(10|15)\s*%/)
    expect(getProgramPublicPath(clandestine!)).toBe(
      '/programs/art-fairs/clandestine-art-fair-2026'
    )
    expect(listCurrentOrUpcomingPrograms().map((p) => p.id)).toEqual(['clandestine-2026'])
    expect(getCdcPageByPath('/programs/art-fairs/clandestine-art-fair-2026')?.title).toBe(
      'DCC MIA at Clandestine Art Fair 2026'
    )
    expect(getCdcPageByPath('/artists')?.title).toBe('Artists')
    expect(getCdcPageByPath('/now')?.title).toBe('Where DCC MIA is now')
    expect(getProgramLeaves('art-fairs').map((leaf) => leaf.slug)).toEqual([
      'clandestine-art-fair-2026',
    ])
  })

  it('publishes five journal essays without placeholder shells or invented relations', () => {
    expect(DCC_EDITORIAL).toHaveLength(5)
    expect(listEditorial().map((entry) => entry.slug)).toEqual([
      'what-does-it-cost-to-run-digital-culture',
      'when-public-art-becomes-infrastructure',
      'the-artist-doesnt-need-to-learn-everything',
      'miami-doesnt-have-a-digital-art-problem',
      'a-digital-lab-is-not-a-room-full-of-equipment',
    ])

    const essay01 = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'a-digital-lab-is-not-a-room-full-of-equipment'
    )
    expect(essay01?.type).toBe('essay')
    expect(essay01?.author).toBe('Moises Sanabria')
    expect(essay01?.status).toBe('published')
    expect(essay01?.featured).toBe(true)
    expect(essay01?.heroImage).toContain(
      'dccmiami/journal/a-digital-lab-is-not-a-room-full-of-equipment_rqhmks'
    )
    expect(essay01?.heroSlot).toBeUndefined()
    expect(essay01?.body).toBeUndefined()
    expect(essay01?.bodyPath).toBe(
      'content/journal/a-digital-lab-is-not-a-room-full-of-equipment.mdx'
    )
    expect(essay01?.artistIds).toBeUndefined()
    expect(essay01?.programIds).toBeUndefined()
    expect(essay01?.projectIds).toBeUndefined()
    expect(existsSync(join(process.cwd(), essay01!.bodyPath!))).toBe(true)
    expect(readFileSync(join(process.cwd(), essay01!.bodyPath!), 'utf8')).toMatch(
      /## Acquisition is not access/
    )
    expect(listJournalIndexSectionSlugs()).toEqual(['essays', 'conversations'])
    expect(JOURNAL_THESIS).toMatch(/artist/)
    expect(JOURNAL_THESIS).toMatch(/institution/)
    expect(JOURNAL_THESIS).toMatch(/cities inherit/)
    expect([...JOURNAL_TOPICS]).toEqual([
      'Infrastructure',
      'Art & Technology',
      'Institutions',
      'Fabrication',
      'Public Space',
      'Digital Literacy',
    ])
    expect([...JOURNAL_SCALE_LABELS]).toEqual([
      'Artist',
      'Studio',
      'Institution',
      'Network',
      'City',
    ])
    expect(listJournalOpeningSequence().map((item) => item.entry.slug)).toEqual([
      'a-digital-lab-is-not-a-room-full-of-equipment',
      'what-does-it-cost-to-run-digital-culture',
      'when-public-art-becomes-infrastructure',
    ])
    expect(listJournalOpeningSequence().find((item) => item.lead)?.entry.slug).toBe(
      'what-does-it-cost-to-run-digital-culture'
    )
    expect(listJournalArchive().map((entry) => entry.slug)).toEqual([
      'the-artist-doesnt-need-to-learn-everything',
      'miami-doesnt-have-a-digital-art-problem',
    ])
    expect([...JOURNAL_READING_ORDER]).toEqual([
      'a-digital-lab-is-not-a-room-full-of-equipment',
      'what-does-it-cost-to-run-digital-culture',
      'when-public-art-becomes-infrastructure',
      'the-artist-doesnt-need-to-learn-everything',
      'miami-doesnt-have-a-digital-art-problem',
    ])
    expect(listJournalReadingOrder().map((entry) => entry.slug)).toEqual([
      ...JOURNAL_READING_ORDER,
    ])
    const lab = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'a-digital-lab-is-not-a-room-full-of-equipment'
    )!
    const cost = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'what-does-it-cost-to-run-digital-culture'
    )!
    const publicArtEssay = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'when-public-art-becomes-infrastructure'
    )!
    const miami = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'miami-doesnt-have-a-digital-art-problem'
    )!
    expect(listJournalAdjacent(lab)).toEqual({
      prev: null,
      next: expect.objectContaining({ slug: 'what-does-it-cost-to-run-digital-culture' }),
      sequenceItem: expect.objectContaining({ n: '01', scale: 'Artist' }),
    })
    expect(listJournalAdjacent(cost).prev?.slug).toBe(
      'a-digital-lab-is-not-a-room-full-of-equipment'
    )
    expect(listJournalAdjacent(cost).next?.slug).toBe(
      'when-public-art-becomes-infrastructure'
    )
    expect(listJournalAdjacent(cost).sequenceItem?.scale).toBe('Institution')
    expect(listJournalAdjacent(miami).next).toBeNull()
    expect(listJournalAdjacent(miami).prev?.slug).toBe(
      'the-artist-doesnt-need-to-learn-everything'
    )
    expect(listJournalAdjacent(miami).sequenceItem).toBeNull()
    expect(journalHeroEffectForEntry(lab)).toBeNull()
    expect(journalHeroEffectForEntry(cost)).toBe('particle-dispatch')
    expect(journalHeroEffectForEntry(publicArtEssay)).toBe('city-scan')
    expect(
      journalHeroEffectForEntry(
        DCC_EDITORIAL.find(
          (entry) => entry.slug === 'the-artist-doesnt-need-to-learn-everything'
        )!
      )
    ).toBeNull()
    for (const entry of listEditorial()) {
      expect(entry.topics?.length).toBeGreaterThan(0)
      for (const topic of entry.topics ?? []) {
        expect(JOURNAL_TOPICS).toContain(topic)
      }
    }
    expect(getCdcPageByPath('/journal')?.description).toMatch(
      /The infrastructure behind digital culture/
    )
    expect(listFeaturedEditorial().map((entry) => entry.slug)).toEqual([essay01?.slug])
    expect(getEditorialPublicPath(essay01!)).toBe(
      '/journal/essays/a-digital-lab-is-not-a-room-full-of-equipment'
    )
    expect(
      getCdcPageByPath('/journal/essays/a-digital-lab-is-not-a-room-full-of-equipment')?.title
    ).toBe(essay01?.title)

    const essay02 = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'the-artist-doesnt-need-to-learn-everything'
    )
    const essay03 = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'miami-doesnt-have-a-digital-art-problem'
    )
    expect(essay02?.status).toBe('published')
    expect(essay02?.featured).toBe(false)
    expect(essay02?.body).toBeUndefined()
    expect(essay02?.bodyPath).toBe(
      'content/journal/the-artist-doesnt-need-to-learn-everything.mdx'
    )
    expect(essay02?.artistIds).toBeUndefined()
    expect(essay02?.programIds).toBeUndefined()
    expect(essay02?.projectIds).toBeUndefined()
    expect(essay02?.heroImage).toContain(
      'dccmiami/journal/artist-doesnt-need-to-learn-everything_oz7ipo'
    )
    expect(essay03?.heroImage).toContain(
      'dccmiami/journal/miami-doesnt-have-a-digital-art-problem-it-has-an-infrastructure-problem_kz4qjt'
    )
    expect(essay02?.heroSlot?.id).toBe('02-hero')
    expect(essay03?.bodyPath).toBe('content/journal/miami-doesnt-have-a-digital-art-problem.mdx')
    expect(essay03?.artistIds).toBeUndefined()
    expect(essay03?.programIds).toBeUndefined()
    expect(essay03?.projectIds).toBeUndefined()
    expect(existsSync(join(process.cwd(), essay02!.bodyPath!))).toBe(true)
    expect(existsSync(join(process.cwd(), essay03!.bodyPath!))).toBe(true)

    const costEssay = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'what-does-it-cost-to-run-digital-culture'
    )
    expect(costEssay?.type).toBe('essay')
    expect(costEssay?.status).toBe('published')
    expect(costEssay?.featured).toBe(false)
    expect(costEssay?.living).toBe(true)
    expect(costEssay?.version).toBe('0.1')
    expect(costEssay?.heroImage).toBeUndefined()
    expect(costEssay?.heroSlot?.id).toBe('cost-hero')
    expect(costEssay?.bodyPath).toBe(
      'content/journal/what-does-it-cost-to-run-digital-culture.mdx'
    )
    expect(costEssay?.relatedEditorialIds).toEqual([
      'a-digital-lab-is-not-a-room-full-of-equipment',
      'the-artist-doesnt-need-to-learn-everything',
      'miami-doesnt-have-a-digital-art-problem',
      'when-public-art-becomes-infrastructure',
    ])
    expect(costEssay?.sources?.some((source) => source.id === 'mcn' && source.href)).toBe(true)
    expect(costEssay?.sources?.some((source) => source.needsResearch)).toBe(true)
    expect(existsSync(join(process.cwd(), costEssay!.bodyPath!))).toBe(true)
    const costBody = readFileSync(join(process.cwd(), costEssay!.bodyPath!), 'utf8')
    expect(costBody).toMatch(/<EditorialPullQuote>/)
    expect(costBody).toMatch(/<CapacityChainDiagram/)
    expect(costBody).toMatch(/<OperatingLoopDiagram/)
    expect(costBody).toMatch(/<FounderDependencyDiagram/)
    expect(costBody).toMatch(/<EditorialFramework/)
    expect(costBody).toMatch(/<PublishTheReceiptTable/)
    expect(costBody).toMatch(/Measurement begins with the DCC pilot/)
    expect(costBody).not.toMatch(/\$\d/)
    expect(getEditorialPublicPath(costEssay!)).toBe(
      '/journal/essays/what-does-it-cost-to-run-digital-culture'
    )
    expect(
      getCdcPageByPath('/journal/essays/what-does-it-cost-to-run-digital-culture')?.title
    ).toBe(costEssay?.title)

    const publicArt = DCC_EDITORIAL.find(
      (entry) => entry.slug === 'when-public-art-becomes-infrastructure'
    )
    expect(publicArt?.type).toBe('essay')
    expect(publicArt?.status).toBe('published')
    expect(publicArt?.living).toBeUndefined()
    expect(publicArt?.heroImage).toBeUndefined()
    expect(publicArt?.heroSlot?.id).toBe('public-art-hero')
    expect(publicArt?.bodyPath).toBe(
      'content/journal/when-public-art-becomes-infrastructure.mdx'
    )
    expect(publicArt?.sources?.some((source) => source.id === 'mdc-app' && source.href)).toBe(
      true
    )
    expect(publicArt?.sources?.some((source) => source.needsResearch)).toBe(true)
    expect(existsSync(join(process.cwd(), publicArt!.bodyPath!))).toBe(true)
    const publicArtBody = readFileSync(join(process.cwd(), publicArt!.bodyPath!), 'utf8')
    expect(publicArtBody).toMatch(/<EditorialFigure/)
    expect(publicArtBody).toMatch(/<ResponsibilityStackDiagram/)
    expect(publicArtBody).toMatch(/<BudgetPhaseCompare/)
    expect(publicArtBody).toMatch(/Digital Public Art Technical Rider/)
    expect(publicArtBody).not.toMatch(/\$\d/)
    expect(getEditorialPublicPath(publicArt!)).toBe(
      '/journal/essays/when-public-art-becomes-infrastructure'
    )
    expect(
      getCdcPageByPath('/journal/essays/when-public-art-becomes-infrastructure')?.title
    ).toBe(publicArt?.title)

    const paths = getAllCdcPaths()
    expect(paths).toContain('/journal/essays/a-digital-lab-is-not-a-room-full-of-equipment')
    expect(paths).toContain('/journal/essays/the-artist-doesnt-need-to-learn-everything')
    expect(paths).toContain('/journal/essays/miami-doesnt-have-a-digital-art-problem')
    expect(paths).toContain('/journal/essays/what-does-it-cost-to-run-digital-culture')
    expect(paths).toContain('/journal/essays/when-public-art-becomes-infrastructure')
    expect(paths).not.toContain('/journal/essays/why-miami-needs-digital-culture-infrastructure')
    expect(paths).not.toContain('/journal/essays/what-is-artist-centered-digital-infrastructure')
    expect(paths).not.toContain('/journal/field-notes/notes-from-a-public-interface-pilot')
    expect(paths).not.toContain('/journal/project-updates/building-smart-signs-for-cultural-organizations')
    expect(paths).not.toContain('/journal/workshop-notes/lessons-from-workshop-design-in-2026')
    expect(paths).not.toContain('/journal/miami/why-digital-presence-is-cultural-infrastructure')
  })

  it('keeps unique slugs and resolved public relations', () => {
    expect(assertArtistSlugsValid()).toEqual([])
    expect(assertProgramSlugsValid()).toEqual([])
    expect(assertEditorialSlugsValid()).toEqual([])
    expect(assertProjectSlugsValid()).toEqual([])
    expect(unresolvedRelationIds()).toEqual([])
  })

  it('publishes /now as a known-facts ledger without prices or a fake storefront', () => {
    expect(DCC_NOW_PATH).toBe('/now')
    expect(DCC_NOW_POSITION).toBe(DCC_CULTURAL_POSITION)
    expect(DCC_NOW_FORTHCOMING[0]?.body).toBe(CLANDESTINE_PLACEHOLDER)
    expect(DCC_NOW_FORTHCOMING[1]?.title).toBe('DCC Conversations')
    expect(DCC_NOW_FORTHCOMING[1]?.body).toMatch(/journal itself is live/)
    expect(DCC_NOW_PARTICIPATE.links?.map((link) => link.href)).toEqual([
      '/workshops',
      '/newsletter',
      '/fabricate/quote',
    ])
    const ledger = [
      DCC_NOW_TITLE,
      DCC_NOW_LEAD,
      DCC_NOW_LIVE_INTRO,
      DCC_NOW_PHOTOGRAPHY.body,
      DCC_NOW_PARTICIPATE.body,
      ...DCC_NOW_FORTHCOMING.map((item) => `${item.title} ${item.body}`),
    ].join('\n')
    expect(ledger).not.toMatch(/\$/)
    expect(ledger).not.toMatch(/stripe/i)
    expect(ledger).not.toMatch(/fake storefront/i)
    expect(listWorkshopOfferings().map((offering) => offering.title)).toEqual([
      'Saturday Lab',
      '3D Printing for Artists',
      'AI → 3D Physical Object',
      'Vibecoding & Net Art',
    ])
  })
})

describe('dcc culture cross-links', () => {
  it('resolves one artist to a program, conversation and project without duplicating records', () => {
    const program = DCC_PROGRAMS[0]
    const artists = getArtistsForProgram(
      { ...program, artistIds: ['artist-fixture-a'] },
      fixtureRegistry
    )
    expect(artists.map((a) => a.slug)).toEqual(['fixture-artist-a'])
    expect(getProgramsForArtist(fixtureArtist, fixtureRegistry).map((p) => p.id)).toEqual([
      'clandestine-2026',
    ])
    expect(getEditorialForArtist(fixtureArtist, fixtureRegistry).map((e) => e.type)).toEqual([
      'conversation',
    ])
    expect(getProjectsForArtist(fixtureArtist, fixtureRegistry).map((p) => p.slug)).toEqual([
      'fixture-work-a',
    ])
    expect(editorialJournalCategory('conversation')).toBe('conversations')
    expect(programCategoryForType('art-fair')).toBe('art-fairs')
  })

  it('flags broken relation IDs and ignores unpublished artists on public lookups', () => {
    const broken: CultureRegistry = {
      artists: [{ ...fixtureArtist, programIds: ['missing-program'] }],
      programs: DCC_PROGRAMS,
      editorial: [],
      projects: [],
    }
    expect(unresolvedRelationIds(broken)).toContain(
      'artist artist-fixture-a programIds → missing missing-program'
    )
    expect(
      getPublishedArtistBySlug('fixture-artist-a', [
        { ...fixtureArtist, status: 'draft' },
      ])
    ).toBeUndefined()
  })

  it('protects reserved artist slugs and UUID directory profiles', () => {
    expect(isReservedArtistSlug('claim')).toBe(true)
    expect(isReservedArtistSlug('create')).toBe(true)
    expect(looksLikeUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    expect(looksLikeUuid('clandestine-artist')).toBe(false)
    expect(
      assertArtistSlugsValid([{ ...fixtureArtist, slug: 'claim' }])
    ).toContain('artist slug "claim" is reserved')
  })

  it('keeps card motion off until a real image src exists', () => {
    expect(cultureMediaMotionEnabled(undefined)).toBe(false)
    expect(cultureMediaMotionEnabled('')).toBe(false)
    expect(cultureMediaMotionEnabled('   ')).toBe(false)
    expect(cultureMediaMotionEnabled('/dcc/culture/artists/example/hero.webp')).toBe(
      true
    )
  })

  it('keeps culture projects off civic /projects and does not invent a culture index', () => {
    expect(DCC_PROJECTS).toEqual([])
    expect(getCdcPageByPath('/projects')?.description).toMatch(/Infra24/)
    expect(getCdcPageByPath('/projects')?.title).toBe('Projects')
  })
})
