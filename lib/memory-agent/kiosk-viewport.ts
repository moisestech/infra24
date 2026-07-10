/** UI scale for portrait smart-sign kiosks (~1080×1800 CSS px). */
export const PORTRAIT_KIOSK_UI_SCALE = 2

const HTML_FONT_PX_DEFAULT = 16

/** Width band for Oolite-style portrait kiosks (1080px class displays). */
const KIOSK_WIDTH_MIN = 1000
const KIOSK_WIDTH_MAX = 1150

/** Height band — 1800px target, allow slightly shorter panels. */
const KIOSK_HEIGHT_MIN = 1680
const KIOSK_HEIGHT_MAX = 1920

/** Aspect ratio window (~1080/1800 ≈ 0.6). */
const KIOSK_ASPECT_MIN = 0.54
const KIOSK_ASPECT_MAX = 0.68

/**
 * Portrait kiosk viewports used for Memory Agent on smart-sign hardware.
 * Matches carousel smart-sign sizing (1080×1808) with a slightly wider height band.
 */
export function isPortraitKioskViewport(width: number, height: number): boolean {
  if (width < KIOSK_WIDTH_MIN || width > KIOSK_WIDTH_MAX) return false
  if (height < KIOSK_HEIGHT_MIN || height > KIOSK_HEIGHT_MAX) return false
  if (height <= width) return false

  const aspectRatio = width / height
  return aspectRatio >= KIOSK_ASPECT_MIN && aspectRatio <= KIOSK_ASPECT_MAX
}

export function getMemoryAgentKioskUiScale(width: number, height: number): number {
  return isPortraitKioskViewport(width, height) ? PORTRAIT_KIOSK_UI_SCALE : 1
}

/** Keeps content within the viewport when root rem doubles on kiosk. */
export function memoryAgentContentMaxWidthClass(kioskScale: number): string {
  return kioskScale > 1 ? 'max-w-[min(100%,48rem)]' : 'max-w-3xl'
}

/** Apply doubled root rem for Tailwind spacing/type on kiosk; returns cleanup. */
export function applyMemoryAgentKioskRootScale(scale: number): () => void {
  if (typeof document === 'undefined') return () => {}

  const root = document.documentElement
  const previous = root.style.fontSize

  if (scale > 1) {
    root.style.fontSize = `${HTML_FONT_PX_DEFAULT * scale}px`
    root.dataset.maKioskScale = String(scale)
  }

  return () => {
    root.style.fontSize = previous
    delete root.dataset.maKioskScale
  }
}
