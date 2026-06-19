import {
  OPPORTUNITIES_INDEX_PATH,
  getIndexableOpportunityPaths,
  opportunitiesBySection,
} from '@/lib/marketing/opportunities-index'

describe('opportunities-index', () => {
  it('includes cultural and career sections', () => {
    expect(opportunitiesBySection('cultural').length).toBeGreaterThan(0)
    expect(opportunitiesBySection('career').length).toBeGreaterThan(0)
  })

  it('keeps Touching Grass and Playwire out of indexable sitemap paths', () => {
    const paths = getIndexableOpportunityPaths()
    expect(paths).not.toContain('/edgezones')
    expect(paths).not.toContain('/opportunities/playwire')
  })

  it('includes the opportunities hub in CDC registry path constant', () => {
    expect(OPPORTUNITIES_INDEX_PATH).toBe('/opportunities')
  })
})
