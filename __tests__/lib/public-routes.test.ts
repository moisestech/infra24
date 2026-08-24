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
  })

  it('still requires sign-in for tenant workshop admin surfaces', () => {
    expect(isPublicRoute('/o/oolite/workshops')).toBe(false)
    expect(isPublicRoute('/o/oolite/workshop/ip-age-of-ai')).toBe(false)
  })
})
