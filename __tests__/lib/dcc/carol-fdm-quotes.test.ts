import {
  CAROL_CLIENT,
  CAROL_FDM_PROJECTS,
  carolProjectPath,
  isCarolProjectKey,
} from '@/lib/dcc/fabrication/proposals/carol-client'

describe('Carol two-study private quote registry', () => {
  it('groups precisely two separately addressable projects under the same client identity', () => {
    expect(CAROL_CLIENT.projectKeys).toEqual(['octopus', 'chicken-foot'])
    for (const key of CAROL_CLIENT.projectKeys) {
      const project = CAROL_FDM_PROJECTS[key]
      expect(project.clientId).toBe(CAROL_CLIENT.id)
      expect(project.slug).toBe(key)
      expect(carolProjectPath(key)).toBe(`/fabricate/proposals/carol-haggiag/${key}`)
    }
    expect(CAROL_FDM_PROJECTS.octopus.reference).not.toBe(CAROL_FDM_PROJECTS['chicken-foot'].reference)
  })

  it('does not misrepresent an FDM planning study as resin or an approved quote', () => {
    for (const project of Object.values(CAROL_FDM_PROJECTS)) {
      expect(project.process).toBe('FDM')
      expect(project.materialFamily).toBe('PLA filament')
      expect(project.quoteStatus).toBe('preparing')
      expect(project.priceUsd).toBeNull()
      expect(project.modelState).toBe('awaiting-upload')
      expect(project.color.label).toBe('High-visibility lime green')
      expect(project.color.selectionStatus).toBe('preferred-pending-stock')
      expect(project.color.hex).toMatch(/^#[\da-f]{6}$/i)
      expect(project.storageKey).toMatch(/^clients\/carol-haggiag\/[a-z-]+\/v01\.stl$/)
      expect(project.storageKey).not.toContain('..')
      expect(project.storageKey).not.toContain('/public/')
    }
  })

  it('only resolves explicitly registered project slugs', () => {
    expect(isCarolProjectKey('octopus')).toBe(true)
    expect(isCarolProjectKey('chicken-foot')).toBe(true)
    expect(isCarolProjectKey('../oscar-rieveling')).toBe(false)
    expect(isCarolProjectKey('resin')).toBe(false)
    expect(isCarolProjectKey('')).toBe(false)
    expect(isCarolProjectKey('constructor')).toBe(false)
  })

  it('keeps workshop and old resin economics out of the new client pricing', () => {
    expect(CAROL_FDM_PROJECTS.octopus.exclusions.join(' ')).toMatch(/workshop/i)
    expect(CAROL_FDM_PROJECTS['chicken-foot'].exclusions.join(' ')).toMatch(/resin/)
    expect(CAROL_FDM_PROJECTS['chicken-foot'].scope.join(' ')).toMatch(/FDM/)
  })
})
