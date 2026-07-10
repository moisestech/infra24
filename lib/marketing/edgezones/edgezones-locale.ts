export type EdgeZonesLocale = 'en' | 'es'

export const EDGE_ZONES_LOCALE_STORAGE_KEY = 'edgezones-locale'

export function parseEdgeZonesLocale(value: string | null | undefined): EdgeZonesLocale {
  return value === 'es' ? 'es' : 'en'
}

export function edgeZonesLocaleFromSearchParams(
  searchParams?: { lang?: string | string[] } | null
): EdgeZonesLocale {
  const raw = searchParams?.lang
  const lang = Array.isArray(raw) ? raw[0] : raw
  return parseEdgeZonesLocale(lang)
}
