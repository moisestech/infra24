import { edgeZonesPortalEn } from './edgezones-content.en'
import { edgeZonesPortalEs } from './edgezones-content.es'
import type { EdgeZonesLocale } from './edgezones-locale'
import type { EdgeZonesModuleStatus, EdgeZonesPortalContent } from './types'

export function getEdgeZonesPortal(locale: EdgeZonesLocale): EdgeZonesPortalContent {
  return locale === 'es' ? edgeZonesPortalEs : edgeZonesPortalEn
}

export function getEdgeZonesNavAnchors(locale: EdgeZonesLocale) {
  return getEdgeZonesPortal(locale).navAnchors
}

export function edgeZonesModuleStatusLabel(status: EdgeZonesModuleStatus, locale: EdgeZonesLocale = 'en') {
  return getEdgeZonesPortal(locale).moduleStatusLabels[status]
}

export const edgeZonesPortal = edgeZonesPortalEn

export const edgeZonesNavAnchors = edgeZonesPortalEn.navAnchors
