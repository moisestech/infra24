'use client'

import { useEffect, useState } from 'react'

import {
  applyMemoryAgentKioskRootScale,
  getMemoryAgentKioskUiScale,
} from '@/lib/memory-agent/kiosk-viewport'

/**
 * Detect portrait smart-sign kiosks (~1080×1800) and double UI scale via root rem.
 */
export function useMemoryAgentKioskScale(): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      setScale(getMemoryAgentKioskUiScale(window.innerWidth, window.innerHeight))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (scale <= 1) return
    return applyMemoryAgentKioskRootScale(scale)
  }, [scale])

  return scale
}
