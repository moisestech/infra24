import {
  getMemoryAgentKioskUiScale,
  isPortraitKioskViewport,
  memoryAgentContentMaxWidthClass,
  PORTRAIT_KIOSK_UI_SCALE,
} from '@/lib/memory-agent/kiosk-viewport'

describe('memory-agent kiosk viewport', () => {
  it('detects 1080×1800 and 1080×1808 portrait kiosks', () => {
    expect(isPortraitKioskViewport(1080, 1800)).toBe(true)
    expect(isPortraitKioskViewport(1080, 1808)).toBe(true)
    expect(isPortraitKioskViewport(1080, 1720)).toBe(true)
  })

  it('rejects landscape and off-size viewports', () => {
    expect(isPortraitKioskViewport(1920, 1080)).toBe(false)
    expect(isPortraitKioskViewport(768, 1800)).toBe(false)
    expect(isPortraitKioskViewport(1080, 1400)).toBe(false)
    expect(isPortraitKioskViewport(1440, 900)).toBe(false)
  })

  it('returns double UI scale on portrait kiosk', () => {
    expect(getMemoryAgentKioskUiScale(1080, 1800)).toBe(PORTRAIT_KIOSK_UI_SCALE)
    expect(getMemoryAgentKioskUiScale(1280, 800)).toBe(1)
  })

  it('uses viewport-safe max width when scaled', () => {
    expect(memoryAgentContentMaxWidthClass(1)).toBe('max-w-3xl')
    expect(memoryAgentContentMaxWidthClass(2)).toBe('max-w-[min(100%,48rem)]')
  })
})
