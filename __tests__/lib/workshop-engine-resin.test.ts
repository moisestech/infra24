import {
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
  getResinModuleBySlug,
  getResinVenue,
} from '@/lib/workshop-engine'

describe('resin workshop curriculum', () => {
  it('has nine ordered modules', () => {
    expect(RESIN_PRINTING_MODULES).toHaveLength(9)
    expect(RESIN_PRINTING_WORKSHOP.moduleIds).toHaveLength(9)
    expect(RESIN_PRINTING_MODULES.map((m) => m.order)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('keeps safety boundary language off certification', () => {
    expect(RESIN_PRINTING_WORKSHOP.safetyBoundary.toLowerCase()).toContain('do not independently operate')
    expect(RESIN_PRINTING_WORKSHOP.expectationStatement.toLowerCase()).toContain('not be certified')
  })

  it('resolves modules and venues', () => {
    expect(getResinModuleBySlug('safety-zones')?.safetyLevel).toBe('required')
    expect(getResinVenue('oolite')?.printerModel).toContain('Photon')
    expect(getResinVenue('bakehouse')?.namingNote).toBeTruthy()
  })
})
