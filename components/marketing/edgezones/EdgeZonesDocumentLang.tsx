'use client'

import { useEffect } from 'react'
import { useEdgeZonesLocale } from '@/components/marketing/edgezones/EdgeZonesLocaleProvider'

export function EdgeZonesDocumentLang() {
  const { locale } = useEdgeZonesLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
