'use client'

import { useEffect } from 'react'

/** Backward compat: old PDF/memory-agent links to #exhibition scroll to #concept. */
export function EdgeZonesHashAlias() {
  useEffect(() => {
    if (window.location.hash === '#exhibition') {
      const el = document.getElementById('concept')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        history.replaceState(null, '', '#concept')
      }
    }
  }, [])

  return null
}
