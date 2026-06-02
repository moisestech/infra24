/** Maps URL `source` param → Airtable Signup Source single-select / text label. */
const SIGNUP_SOURCE_LABELS: Record<string, string> = {
  'dcc-tv': 'TV QR',
  edgezones: 'Edge Zones',
  'born-digital-era-may': 'Born-Digital Era May',
  'dcc-general': 'DCC General Join',
}

export function resolveSignupSourceLabel(source?: string): string | undefined {
  const key = source?.trim()
  if (!key) return undefined
  return SIGNUP_SOURCE_LABELS[key] ?? key
}
