/** Valid `vertical/prospect` route keys for Ask the Place demos. */
export const ASK_THE_PLACE_ROUTE_KEYS = [
  'hotel/faena',
  'club/soho-house',
  'residence/related-group',
  'district/miami-design-district',
  'institution/pamm',
  'collection/private-collection',
] as const

export type AskThePlaceRouteKey = (typeof ASK_THE_PLACE_ROUTE_KEYS)[number]
