import { buildAnonymousNodes, filterProfiles, PILOT_PREVIEWS, projectPublicProfiles, readPassportPreview, type ApprovedProfileInput } from '../../lib/dcc/community/atlas'

const eligible: ApprovedProfileInput = { ...PILOT_PREVIEWS[0], identityVerified: true, publicConsent: true, approved: true, withdrawn: false }

describe('Community Atlas publication boundary', () => {
  it.each(['identityVerified', 'publicConsent', 'approved'] as const)('requires affirmative %s', (flag) => {
    expect(projectPublicProfiles([{ ...eligible, [flag]: false }])).toEqual([])
    expect(projectPublicProfiles([{ ...eligible, [flag]: undefined } as unknown as ApprovedProfileInput])).toEqual([])
  })
  it('removes withdrawn profiles and strips unexpected private properties', () => {
    expect(projectPublicProfiles([{ ...eligible, withdrawn: true }])).toEqual([])
    const raw = { ...eligible, email: 'never-public@example.test', phone: 'private', recordId: 'rec-private', notes: 'internal' }
    const serialized = JSON.stringify(projectPublicProfiles([raw]))
    expect(serialized).not.toMatch(/never-public|private|internal|publicConsent/)
    expect(JSON.parse(serialized)[0].name).toBe('Moises Sanabria')
  })
  it('does not carry unsafe links into the public projection', () => {
    expect(projectPublicProfiles([{ ...eligible, website: 'javascript:alert(1)' }])[0].website).toBeUndefined()
  })
  it('generates unlinked anonymous dots, including bounded malformed counts', () => {
    const nodes = buildAnonymousNodes(8)
    expect(nodes).toHaveLength(8)
    expect(Object.keys(nodes[0]).sort()).toEqual(['color', 'id', 'kind', 'position'])
    expect(buildAnonymousNodes(Infinity)).toEqual([])
    expect(buildAnonymousNodes(-1)).toEqual([])
    expect(buildAnonymousNodes(5000)).toHaveLength(1024)
  })
})

describe('Member discovery and local Passport preview', () => {
  it('matches any chosen interest and combines that with search', () => {
    expect(filterProfiles(PILOT_PREVIEWS, ['interactive']).map((p) => p.slug)).toEqual(['moises-sanabria', 'angelo-caruso'])
    expect(filterProfiles(PILOT_PREVIEWS, ['interactive', 'code-ai'])).toHaveLength(3)
    expect(filterProfiles(PILOT_PREVIEWS, ['code-ai'], 'fabiola')).toHaveLength(1)
    expect(filterProfiles(PILOT_PREVIEWS, ['exploring']).map((p) => p.slug)).toEqual(['moises-sanabria'])
  })
  it('treats a saved Passport preference as a preview with no publication grant', () => {
    expect(readPassportPreview('bad-json')).toBeNull()
    expect(readPassportPreview('{"name":"X","interests":[],"visibility":"admin"}')).toBeNull()
    expect(readPassportPreview(JSON.stringify({ name: ' Test ', interests: ['making', 'private-inferred-interest'], visibility: 'private', consent: true }))).toEqual({ name: 'Test', interests: ['making'], visibility: 'private' })
  })
})
