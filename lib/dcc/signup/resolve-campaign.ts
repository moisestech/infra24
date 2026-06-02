function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined
}

/**
 * Resolve linked Campaign record id from signup source + optional explicit campaignKey.
 * Prefers per-activation env vars; falls back to legacy AIRTABLE_DCC_CRM_CAMPAIGN_INDEX_SEED_ID.
 */
export function resolveCampaignRecordId(
  source?: string,
  campaignKey?: string
): string | undefined {
  if (campaignKey?.startsWith('rec')) return campaignKey

  const s = source?.trim().toLowerCase()
  if (s === 'dcc-tv') return env('AIRTABLE_DCC_CRM_CAMPAIGN_TV_ID')
  if (s === 'edgezones') return env('AIRTABLE_DCC_CRM_CAMPAIGN_EDGE_ZONES_ID')
  if (s === 'dcc-general' || s === 'join') return env('AIRTABLE_DCC_CRM_CAMPAIGN_GENERAL_ID')

  return env('AIRTABLE_DCC_CRM_CAMPAIGN_INDEX_SEED_ID')
}
