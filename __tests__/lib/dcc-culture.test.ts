import { getCdcPageByPath, getProgramLeaves } from '@/lib/cdc/routes'
import { DCC_STUDIO_TOURS } from '@/lib/dcc/studios'
import {
  ARTISTS_INDEX_INTRO,
  cultureMediaMotionEnabled,
  DCC_ARTISTS,
  DCC_CULTURAL_POSITION,
  DCC_EDITORIAL,
  DCC_MIA_NAME,
  DCC_PROGRAMS,
  DCC_PROJECTS,
  assertArtistSlugsValid,
  assertEditorialSlugsValid,
  assertProgramSlugsValid,
  assertProjectSlugsValid,
  editorialJournalCategory,
  getArtistsForProgram,
  getEditorialForArtist,
  getListedProgramBySlug,
  getProgramPublicPath,
  getProgramsForArtist,
  getProjectsForArtist,
  getPublishedArtistBySlug,
  isReservedArtistSlug,
  listArtists,
  listCurrentOrUpcomingPrograms,
  listEditorial,
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
  it('uses DCC MIA naming and does not invent public artists or editorial', () => {
    expect(DCC_MIA_NAME).toBe('DCC MIA')
    expect(DCC_CULTURAL_POSITION).toMatch(/technological conditions of the present/)
    expect(ARTISTS_INDEX_INTRO).toMatch(/not an open directory/)
    expect(DCC_ARTISTS).toEqual([])
    expect(DCC_EDITORIAL).toEqual([])
    expect(DCC_PROJECTS).toEqual([])
    expect(listArtists()).toEqual([])
    expect(listEditorial()).toEqual([])
    expect(listProjects()).toEqual([])
    expect(
      DCC_STUDIO_TOURS.every((tour) => !DCC_ARTISTS.some((artist) => artist.slug === tour.artistSlug))
    ).toBe(true)
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
    expect(clandestine?.description).not.toMatch(/\b(10|15)\s*%/)
    expect(getProgramPublicPath(clandestine!)).toBe(
      '/programs/art-fairs/clandestine-art-fair-2026'
    )
    expect(listCurrentOrUpcomingPrograms().map((p) => p.id)).toEqual(['clandestine-2026'])
    expect(getCdcPageByPath('/programs/art-fairs/clandestine-art-fair-2026')?.title).toBe(
      'DCC MIA at Clandestine Art Fair 2026'
    )
    expect(getCdcPageByPath('/artists')?.title).toBe('Artists')
    expect(getProgramLeaves('art-fairs').map((leaf) => leaf.slug)).toEqual([
      'clandestine-art-fair-2026',
    ])
  })

  it('keeps unique slugs and resolved public relations', () => {
    expect(assertArtistSlugsValid()).toEqual([])
    expect(assertProgramSlugsValid()).toEqual([])
    expect(assertEditorialSlugsValid()).toEqual([])
    expect(assertProjectSlugsValid()).toEqual([])
    expect(unresolvedRelationIds()).toEqual([])
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
