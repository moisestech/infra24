import { canViewFabricationInternal } from '@/lib/dcc/scale-up-auth'

describe('fabrication internal access', () => {
  const production = {
    nodeEnv: 'production',
    passwordConfigured: true,
    signingSecretConfigured: true,
  }

  it('rejects a production feature flag when the cookie is missing', () => {
    expect(
      canViewFabricationInternal({
        ...production,
        cookieMatches: false,
        featureFlagEnabled: true,
      })
    ).toBe(false)
  })

  it('allows production only with a matching cookie and both secrets', () => {
    expect(
      canViewFabricationInternal({
        ...production,
        cookieMatches: true,
        featureFlagEnabled: false,
      })
    ).toBe(true)
  })

  it('rejects a missing or invalid production cookie', () => {
    expect(canViewFabricationInternal({ ...production, cookieMatches: false })).toBe(false)
  })

  it('rejects production when the signing secret or password is missing', () => {
    expect(
      canViewFabricationInternal({
        ...production,
        signingSecretConfigured: false,
        cookieMatches: true,
      })
    ).toBe(false)
    expect(
      canViewFabricationInternal({
        ...production,
        passwordConfigured: false,
        cookieMatches: true,
      })
    ).toBe(false)
  })

  it('keeps local development open only when the staff password is unset', () => {
    expect(
      canViewFabricationInternal({
        nodeEnv: 'development',
        passwordConfigured: false,
        signingSecretConfigured: false,
        cookieMatches: false,
      })
    ).toBe(true)
    expect(
      canViewFabricationInternal({
        nodeEnv: 'development',
        passwordConfigured: true,
        signingSecretConfigured: false,
        cookieMatches: false,
      })
    ).toBe(false)
  })
})
