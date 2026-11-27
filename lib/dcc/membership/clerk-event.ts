/**
 * DCC UX1 — pure, signed-Clerk-event boundary.
 * Call ONLY after Svix signature verification using the raw request body.
 * This never returns email, phone, profile data or Airtable IDs.
 */
export type DccClerkEventType = 'user.created' | 'user.updated' | 'user.deleted'
export type DccClerkCaptureConfig =
  | { enabled: false }
  | { enabled: true; instance: string; cutover: string }
export type DccClerkEventRpcArgs = {
  p_instance: string
  p_event_id: string
  p_subject: string
  p_event_type: DccClerkEventType
  p_account_created_at: string | null
  p_email_verified: boolean
  p_cutover: string
}

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null
}
function text(value: unknown, max = 160): string | null {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max
    ? value : null
}
/** Unix milliseconds from Clerk or a strictly parseable ISO timestamp. */
function timestamp(value: unknown): string | null {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 1_500_000_000_000) {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? date.toISOString() : null
  }
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value)) {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? date.toISOString() : null
  }
  return null
}
function primaryEmailVerified(data: Record<string, unknown>): boolean {
  const primaryId = text(data.primary_email_address_id)
  if (!primaryId || !Array.isArray(data.email_addresses)) return false
  return data.email_addresses.some((value) => {
    const email = object(value)
    if (!email || email.id !== primaryId) return false
    const verification = object(email.verification)
    return verification?.status === 'verified'
  })
}

/** The cutover is a security decision, not a fallback to “now.” */
export function clerkMembershipCaptureConfig(
  env: Record<string, string | undefined>,
): DccClerkCaptureConfig {
  if (env.DCC_MEMBER_EVENT_CAPTURE_ENABLED !== 'true') return { enabled: false }
  const instance = text(env.DCC_CLERK_INSTANCE_ID)
  const cutover = timestamp(env.DCC_MEMBER_CUTOVER_ISO)
  if (!instance || !cutover) {
    throw new Error('DCC membership event capture is enabled without instance/cutover configuration')
  }
  return { enabled: true, instance, cutover }
}

/** Does not treat a raw email, a login, or a user.updated event as account creation. */
export function normalizeClerkMembershipEvent(
  verifiedEvent: unknown,
  signedMessageId: string,
  config: DccClerkCaptureConfig,
): DccClerkEventRpcArgs | null {
  if (!config.enabled) return null
  const event = object(verifiedEvent)
  const data = object(event?.data)
  if (!event || !data) return null
  if (!['user.created', 'user.updated', 'user.deleted'].includes(String(event.type))) return null
  const type = event.type as DccClerkEventType
  const subject = text(data.id)
  const eventId = text(signedMessageId, 200)
  if (!subject || !eventId) return null
  // user.deleted is a tombstone even if the account payload is partial.
  return {
    p_instance: config.instance,
    p_event_id: eventId,
    p_subject: subject,
    p_event_type: type,
    p_account_created_at: type === 'user.created' ? timestamp(data.created_at) : null,
    p_email_verified: type !== 'user.deleted' && primaryEmailVerified(data),
    p_cutover: config.cutover,
  }
}

export type DccEntrySource =
  'join' | 'network-signup' | 'atlas-add' | 'passport'
  | 'smart-sign' | 'app-sign-up' | 'event-qr' | 'other'
const SOURCE_IDS: ReadonlySet<string> = new Set([
  'join','network-signup','atlas-add','passport','smart-sign','app-sign-up','event-qr','other',
])
/** Marketing context is voluntary metadata, never ownership/identity evidence. */
export function normalizeEntrySource(value: unknown): DccEntrySource {
  return typeof value === 'string' && SOURCE_IDS.has(value)
    ? value as DccEntrySource : 'other'
}
export function normalizeCampaignId(value: unknown): string | null {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(value)
    ? value : null
}
