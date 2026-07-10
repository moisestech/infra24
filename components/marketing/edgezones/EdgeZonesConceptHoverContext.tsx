'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EdgeZonesIconName, EdgeZonesThemeAccent } from '@/lib/marketing/edgezones-icons'

export type EdgeZonesConceptHoverState = {
  icon: EdgeZonesIconName
  accent: EdgeZonesThemeAccent
} | null

type ContextValue = {
  hover: EdgeZonesConceptHoverState
  setHover: (state: EdgeZonesConceptHoverState) => void
}

const EdgeZonesConceptHoverContext = createContext<ContextValue | null>(null)

export function EdgeZonesConceptHoverProvider({ children }: { children: ReactNode }) {
  const [hover, setHoverState] = useState<EdgeZonesConceptHoverState>(null)
  const setHover = useCallback((state: EdgeZonesConceptHoverState) => setHoverState(state), [])

  const value = useMemo(() => ({ hover, setHover }), [hover, setHover])

  return (
    <EdgeZonesConceptHoverContext.Provider value={value}>
      <div onMouseLeave={() => setHover(null)}>{children}</div>
    </EdgeZonesConceptHoverContext.Provider>
  )
}

export function useEdgeZonesConceptHover() {
  const ctx = useContext(EdgeZonesConceptHoverContext)
  if (!ctx) {
    throw new Error('useEdgeZonesConceptHover must be used within EdgeZonesConceptHoverProvider')
  }
  return ctx
}
