'use client'

import { useCallback, useEffect, useState } from 'react'

function readDevFromUrl(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('dev') === '1'
}

export function useMemoryAgentDevMode() {
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    setIsDevMode(readDevFromUrl())
    const onPop = () => setIsDevMode(readDevFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const setDevParam = useCallback((on: boolean) => {
    const url = new URL(window.location.href)
    if (on) url.searchParams.set('dev', '1')
    else url.searchParams.delete('dev')
    window.history.pushState({}, '', url.toString())
    setIsDevMode(on)
  }, [])

  return {
    isDevMode,
    enableDevMode: () => setDevParam(true),
    disableDevMode: () => setDevParam(false),
  }
}
