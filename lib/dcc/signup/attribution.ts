/** Campaign attribution — URL capture + localStorage until signup submit. */

export type DccAttribution = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  qrCodeId?: string
  signupSource?: string
  landingPage?: string
  referrer?: string
  capturedAt?: string
}

const STORAGE_PREFIX = 'dcc_attr_'

const KEYS = {
  utmSource: `${STORAGE_PREFIX}utm_source`,
  utmMedium: `${STORAGE_PREFIX}utm_medium`,
  utmCampaign: `${STORAGE_PREFIX}utm_campaign`,
  utmContent: `${STORAGE_PREFIX}utm_content`,
  utmTerm: `${STORAGE_PREFIX}utm_term`,
  qrCodeId: `${STORAGE_PREFIX}qr_code_id`,
  signupSource: `${STORAGE_PREFIX}signup_source`,
  landingPage: `${STORAGE_PREFIX}landing_page`,
  referrer: `${STORAGE_PREFIX}referrer`,
  capturedAt: `${STORAGE_PREFIX}captured_at`,
} as const

function trimOrUndefined(v: string | null | undefined): string | undefined {
  const t = v?.trim()
  return t || undefined
}

/** Read attribution params from a URL search string (browser or request). */
export function parseAttributionFromSearchParams(search: string | URLSearchParams): DccAttribution {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const signupSource =
    trimOrUndefined(params.get('source')) ??
    trimOrUndefined(params.get('signup_source'))

  return {
    utmSource: trimOrUndefined(params.get('utm_source')),
    utmMedium: trimOrUndefined(params.get('utm_medium')),
    utmCampaign: trimOrUndefined(params.get('utm_campaign')),
    utmContent: trimOrUndefined(params.get('utm_content')),
    utmTerm: trimOrUndefined(params.get('utm_term')),
    qrCodeId:
      trimOrUndefined(params.get('qr')) ??
      trimOrUndefined(params.get('qr_code_id')),
    signupSource,
  }
}

/** Merge incoming URL attribution into stored session (first-touch landing page preserved). */
export function mergeAttribution(
  existing: DccAttribution,
  incoming: DccAttribution
): DccAttribution {
  return {
    landingPage: existing.landingPage ?? incoming.landingPage,
    referrer: existing.referrer ?? incoming.referrer,
    capturedAt: existing.capturedAt ?? incoming.capturedAt,
    utmSource: incoming.utmSource ?? existing.utmSource,
    utmMedium: incoming.utmMedium ?? existing.utmMedium,
    utmCampaign: incoming.utmCampaign ?? existing.utmCampaign,
    utmContent: incoming.utmContent ?? existing.utmContent,
    utmTerm: incoming.utmTerm ?? existing.utmTerm,
    qrCodeId: incoming.qrCodeId ?? existing.qrCodeId,
    signupSource: incoming.signupSource ?? existing.signupSource,
  }
}

export function readStoredAttribution(): DccAttribution {
  if (typeof window === 'undefined') return {}
  const read = (key: string) => window.localStorage.getItem(key) || undefined
  return {
    utmSource: read(KEYS.utmSource),
    utmMedium: read(KEYS.utmMedium),
    utmCampaign: read(KEYS.utmCampaign),
    utmContent: read(KEYS.utmContent),
    utmTerm: read(KEYS.utmTerm),
    qrCodeId: read(KEYS.qrCodeId),
    signupSource: read(KEYS.signupSource),
    landingPage: read(KEYS.landingPage),
    referrer: read(KEYS.referrer),
    capturedAt: read(KEYS.capturedAt),
  }
}

export function storeAttribution(attr: DccAttribution): void {
  if (typeof window === 'undefined') return
  const write = (key: string, value: string | undefined) => {
    if (value) window.localStorage.setItem(key, value)
  }
  write(KEYS.utmSource, attr.utmSource)
  write(KEYS.utmMedium, attr.utmMedium)
  write(KEYS.utmCampaign, attr.utmCampaign)
  write(KEYS.utmContent, attr.utmContent)
  write(KEYS.utmTerm, attr.utmTerm)
  write(KEYS.qrCodeId, attr.qrCodeId)
  write(KEYS.signupSource, attr.signupSource)
  if (attr.landingPage) write(KEYS.landingPage, attr.landingPage)
  if (attr.referrer) write(KEYS.referrer, attr.referrer)
  if (attr.capturedAt) write(KEYS.capturedAt, attr.capturedAt)
}

/** Call on marketing pages / signup mount to persist campaign params. */
export function captureAttributionFromWindow(pathname?: string): DccAttribution {
  if (typeof window === 'undefined') return {}
  const fromUrl = parseAttributionFromSearchParams(window.location.search)
  const existing = readStoredAttribution()
  const landingPage = existing.landingPage ?? pathname ?? window.location.pathname
  const referrer = existing.referrer || document.referrer || undefined
  const merged = mergeAttribution(existing, {
    ...fromUrl,
    landingPage,
    referrer,
    capturedAt: existing.capturedAt ?? new Date().toISOString(),
  })
  storeAttribution(merged)
  return merged
}

/** Recommended QR / link URLs per activation (documented for staff). */
export const DCC_CAMPAIGN_URLS = {
  tvSignup:
    '/network/signup?source=dcc-tv&utm_source=tv&utm_medium=qr&utm_campaign=dcc_tv_launch&utm_content=tv_loop&qr=dcc_tv_main',
  edgezonesPortal:
    '/edgezones?source=edgezones&utm_source=edgezones&utm_medium=proposal&utm_campaign=dcc_edgezones_launch&utm_content=partnership_pdf&qr=dcc_edgezones_main',
  edgezonesJoin:
    '/network/signup?source=edgezones&utm_source=edgezones&utm_medium=proposal&utm_campaign=dcc_edgezones_launch&utm_content=partnership_pdf&qr=dcc_edgezones_main',
  joinShort: '/join?utm_source=web&utm_medium=link&utm_campaign=dcc_general',
} as const
