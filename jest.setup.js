// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// jsdom does not implement these browser APIs. Keep the shims test-only;
// tests asserting intersection or geometry should supply their own observations.
if (typeof window !== 'undefined') {
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    class TestIntersectionObserver {
      constructor(callback, options = {}) {
        this.callback = callback
        this.root = options.root ?? null
        this.rootMargin = options.rootMargin ?? '0px'
        this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0]
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
    }
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true, writable: true, value: TestIntersectionObserver,
    })
  }

  if (typeof window.PointerEvent === 'undefined') {
    class TestPointerEvent extends window.MouseEvent {
      constructor(type, init = {}) {
        super(type, init)
        Object.defineProperties(this, {
          pointerId: { value: init.pointerId ?? 0 },
          pointerType: { value: init.pointerType ?? '' },
          isPrimary: { value: init.isPrimary ?? false },
        })
      }
    }
    Object.defineProperty(window, 'PointerEvent', {
      configurable: true, writable: true, value: TestPointerEvent,
    })
  }

  const captures = new Map()
  const methods = {
    setPointerCapture(pointerId) { captures.set(pointerId, this) },
    releasePointerCapture(pointerId) {
      if (captures.get(pointerId) === this) captures.delete(pointerId)
    },
    hasPointerCapture(pointerId) { return captures.get(pointerId) === this },
  }
  for (const [name, method] of Object.entries(methods)) {
    if (typeof window.Element.prototype[name] !== 'function') {
      Object.defineProperty(window.Element.prototype, name, {
        configurable: true, writable: true, value: method,
      })
    }
  }
  afterEach(() => captures.clear())
}
