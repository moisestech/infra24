export type EdgeZonesLocale = 'en' | 'es'

export const EDGE_ZONES_LOCALE_STORAGE_KEY = 'edgezones-locale'
export const EDGE_ZONES_LOCALE_COOKIE_KEY = 'edgezones-locale'

export function parseEdgeZonesLocale(value: string | null | undefined): EdgeZonesLocale {
  return value === 'es' ? 'es' : 'en'
}

export function edgeZonesLocaleFromSearchParams(
  searchParams?: { lang?: string | string[] } | null
): EdgeZonesLocale | null {
  const raw = searchParams?.lang
  if (raw === undefined) return null
  const lang = Array.isArray(raw) ? raw[0] : raw
  return parseEdgeZonesLocale(lang)
}

export function resolveEdgeZonesLocale(input?: {
  searchParams?: { lang?: string | string[] } | null
  cookieValue?: string | null
}): EdgeZonesLocale {
  const fromQuery = edgeZonesLocaleFromSearchParams(input?.searchParams)
  if (fromQuery !== null) return fromQuery
  return parseEdgeZonesLocale(input?.cookieValue)
}

export function edgeZonesLocaleCookieValue(locale: EdgeZonesLocale): string {
  return locale
}
