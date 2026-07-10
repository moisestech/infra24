'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  EDGE_ZONES_LOCALE_STORAGE_KEY,
  parseEdgeZonesLocale,
  type EdgeZonesLocale,
} from '@/lib/marketing/edgezones/edgezones-locale'
import { getEdgeZonesPortal } from '@/lib/marketing/edgezones/content'
import type { EdgeZonesPortalContent } from '@/lib/marketing/edgezones/types'

type EdgeZonesLocaleContextValue = {
  locale: EdgeZonesLocale
  portal: EdgeZonesPortalContent
  setLocale: (locale: EdgeZonesLocale) => void
}

const EdgeZonesLocaleContext = createContext<EdgeZonesLocaleContextValue | null>(null)

type Props = {
  initialLocale: EdgeZonesLocale
  children: ReactNode
}

export function EdgeZonesLocaleProvider({ initialLocale, children }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [locale, setLocaleState] = useState<EdgeZonesLocale>(initialLocale)

  useEffect(() => {
    setLocaleState(initialLocale)
  }, [initialLocale])

  useEffect(() => {
    const urlLang = parseEdgeZonesLocale(searchParams.get('lang'))
    if (searchParams.has('lang')) {
      setLocaleState(urlLang)
      localStorage.setItem(EDGE_ZONES_LOCALE_STORAGE_KEY, urlLang)
      return
    }

    const stored = localStorage.getItem(EDGE_ZONES_LOCALE_STORAGE_KEY)
    if (stored === 'es' || stored === 'en') {
      const next = stored as EdgeZonesLocale
      if (next !== 'en') {
        const url = new URL(window.location.href)
        url.searchParams.set('lang', next)
        router.replace(`${url.pathname}${url.search}${url.hash}`)
      }
    }
  }, [searchParams, router])

  const setLocale = useCallback(
    (next: EdgeZonesLocale) => {
      localStorage.setItem(EDGE_ZONES_LOCALE_STORAGE_KEY, next)
      const url = new URL(window.location.href)
      if (next === 'en') url.searchParams.delete('lang')
      else url.searchParams.set('lang', next)
      router.replace(`${url.pathname}${url.search}${url.hash}`)
    },
    [router]
  )

  const value = useMemo(
    () => ({
      locale,
      portal: getEdgeZonesPortal(locale),
      setLocale,
    }),
    [locale, setLocale]
  )

  return <EdgeZonesLocaleContext.Provider value={value}>{children}</EdgeZonesLocaleContext.Provider>
}

export function useEdgeZonesLocale(): EdgeZonesLocaleContextValue {
  const ctx = useContext(EdgeZonesLocaleContext)
  if (!ctx) {
    throw new Error('useEdgeZonesLocale must be used within EdgeZonesLocaleProvider')
  }
  return ctx
}
