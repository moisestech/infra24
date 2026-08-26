import { isPublicRoute } from '@/lib/auth/public-routes'

describe('isPublicRoute', () => {
  it('keeps DCC artist pages public without sign-in', () => {
    expect(isPublicRoute('/artists')).toBe(true)
    expect(isPublicRoute('/artists/')).toBe(true)
    expect(isPublicRoute('/artists/moises-sanabria')).toBe(true)
    expect(isPublicRoute('/for-artists')).toBe(true)
  })

  it('keeps DCC workshop catalog pages public without sign-in', () => {
    expect(isPublicRoute('/workshops')).toBe(true)
    expect(isPublicRoute('/workshops/')).toBe(true)
    expect(isPublicRoute('/workshops/ip-age-of-ai')).toBe(true)
    expect(isPublicRoute('/workshop/saturday-lab')).toBe(true)
    expect(isPublicRoute('/workshop/resin-printing')).toBe(true)
    expect(isPublicRoute('/workshop/3d-printing-for-artists')).toBe(true)
    expect(isPublicRoute('/workshop/ai-3d-physical-object')).toBe(true)
  })

  it('keeps DCC fabricate pages public, including the /fabrication alias', () => {
    expect(isPublicRoute('/fabricate')).toBe(true)
    expect(isPublicRoute('/fabricate/pricing')).toBe(true)
    expect(isPublicRoute('/fabricate/quote')).toBe(true)
    expect(isPublicRoute('/fabricate/finishes')).toBe(true)
    expect(isPublicRoute('/fabricate/projects')).toBe(true)
    expect(isPublicRoute('/fabricate/estimate')).toBe(true)
    expect(isPublicRoute('/fabricate/field-lab')).toBe(true)
    expect(isPublicRoute('/fabrication')).toBe(true)
    expect(isPublicRoute('/fabrication/pricing')).toBe(true)
    expect(isPublicRoute('/make')).toBe(true)
  })

  it('keeps other DCC culture marketing pages public without sign-in', () => {
    expect(isPublicRoute('/programs')).toBe(true)
    expect(isPublicRoute('/programs/art-fairs/clandestine-art-fair-2026')).toBe(true)
    expect(isPublicRoute('/journal')).toBe(true)
    expect(isPublicRoute('/journal/conversations')).toBe(true)
    expect(isPublicRoute('/newsletter')).toBe(true)
    expect(isPublicRoute('/now')).toBe(true)
  })
  it('still requires sign-in for tenant workshop admin surfaces', () => {
    expect(isPublicRoute('/o/oolite/workshops')).toBe(false)
    expect(isPublicRoute('/o/oolite/workshop/ip-age-of-ai')).toBe(false)
  })
})
