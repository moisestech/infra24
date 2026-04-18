import { isAdultStudioWorkshop, isExcludedFromDccPublicCatalog } from './workshop-filters'

describe('isAdultStudioWorkshop', () => {
  it('is true for adult_studio_classes category', () => {
    expect(isAdultStudioWorkshop({ category: 'adult_studio_classes', metadata: null })).toBe(true)
  })

  it('is true when metadata.program is adult_art_classes', () => {
    expect(
      isAdultStudioWorkshop({ category: 'general', metadata: { program: 'adult_art_classes' } })
    ).toBe(true)
  })

  it('is false for general digital-lab style category', () => {
    expect(isAdultStudioWorkshop({ category: 'general', metadata: {} })).toBe(false)
  })
})

describe('isExcludedFromDccPublicCatalog', () => {
  it('excludes adult studio rows', () => {
    expect(
      isExcludedFromDccPublicCatalog({
        title: 'Any title',
        category: 'adult_studio_classes',
        metadata: null,
      })
    ).toBe(true)
  })

  it('excludes known Oolite studio title phrases', () => {
    expect(
      isExcludedFromDccPublicCatalog({
        title: 'Figure Drawing Studio',
        category: 'general',
        metadata: null,
      })
    ).toBe(true)
  })

  it('does not exclude arbitrary digital lab titles', () => {
    expect(
      isExcludedFromDccPublicCatalog({
        title: 'Own Your Digital Presence',
        category: 'general',
        metadata: null,
      })
    ).toBe(false)
  })

  it('allows explicit opt-in when title would match blocklist', () => {
    expect(
      isExcludedFromDccPublicCatalog({
        title: 'Open Studio Night — digital edition',
        category: 'general',
        metadata: { dcc_public_catalog: true },
      })
    ).toBe(false)
  })

  it('still excludes adult studio even with dcc_public_catalog true', () => {
    expect(
      isExcludedFromDccPublicCatalog({
        title: 'Figure Drawing Studio',
        category: 'adult_studio_classes',
        metadata: { dcc_public_catalog: true },
      })
    ).toBe(true)
  })
})
