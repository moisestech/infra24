'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { shareUrl } from './url-state'

/** Hydrate after mount, retain Next's history metadata, and restore Back/Forward. */
export function useUrlState<T>(initial: T, read: (params: URLSearchParams) => T, write: (state: T) => URLSearchParams) {
  const [state, setState] = useState(initial)
  const current = useRef(initial)
  const ready = useRef(false)
  useEffect(() => {
    const restore = () => {
      const next = read(new URLSearchParams(window.location.search))
      current.current = next
      setState(next)
      ready.current = true
    }
    restore()
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [read])
  const update = useCallback((change: Partial<T> | ((previous: T) => T), history: 'push' | 'replace' = 'push') => {
    const next = typeof change === 'function' ? change(current.current) : { ...current.current, ...change }
    current.current = next
    setState(next)
    if (ready.current) {
      const url = shareUrl(window.location.href, write(next))
      if (url !== window.location.href) {
        window.history[history === 'replace' ? 'replaceState' : 'pushState'](window.history.state, '', url)
      }
    }
  }, [write])
  return [state, update] as const
}
