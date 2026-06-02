import { DCC_TV_QR_PATH, DCC_TV_QR_SOURCE, DCC_TV_SLIDES, dccTvSignupUrl } from '@/lib/marketing/dcc-tv-slides'

describe('dcc-tv-slides', () => {
  it('has 7 slides with no edgezones dependency', () => {
    expect(DCC_TV_SLIDES).toHaveLength(7)
    const json = JSON.stringify(DCC_TV_SLIDES)
    expect(json.toLowerCase()).not.toContain('edgezones')
  })

  it('uses signup as persistent QR target', () => {
    expect(DCC_TV_QR_PATH).toBe('/network/signup')
    expect(DCC_TV_QR_SOURCE).toBe('dcc-tv')
    expect(dccTvSignupUrl('https://dcc.miami')).toContain('utm_campaign=dcc_tv_launch')
    expect(dccTvSignupUrl('https://dcc.miami')).toContain('qr=dcc_tv_main')
  })

  it('gives join slide extra duration', () => {
    const join = DCC_TV_SLIDES.find((s) => s.id === 'join-index')
    expect(join?.durationMs).toBeGreaterThan(DCC_TV_SLIDES[0].durationMs)
    expect(join?.emphasize).toBe(true)
  })
})
