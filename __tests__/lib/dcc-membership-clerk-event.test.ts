import {
  clerkMembershipCaptureConfig, normalizeClerkMembershipEvent,
  normalizeEntrySource, normalizeCampaignId,
} from '@/lib/dcc/membership/clerk-event'

const config = { enabled: true as const, instance: 'clerk_instance_1', cutover: '2026-11-22T00:00:00.000Z' }
const created = {
  type: 'user.created',
  data: {
    id: 'user_123abc', created_at: Date.parse('2026-11-23T00:00:00Z'),
    primary_email_address_id: 'id_1',
    email_addresses: [
      { id: 'id_1', email_address: 'private@example.test', verification: { status: 'verified' } },
    ],
    unsafe_metadata: { source: 'app-sign-up' },
  },
}
describe('Clerk event capture boundary — BDD for UX1', () => {
  it('is disabled without an explicit feature gate', () => {
    expect(clerkMembershipCaptureConfig({})).toEqual({ enabled: false })
    expect(normalizeClerkMembershipEvent(created, 'msg_1abcdef', { enabled: false })).toBeNull()
  })
  it('requires a production cutover and an explicitly configured instance before enabling', () => {
    expect(() => clerkMembershipCaptureConfig({ DCC_MEMBER_EVENT_CAPTURE_ENABLED: 'true' })).toThrow()
    expect(clerkMembershipCaptureConfig({
      DCC_MEMBER_EVENT_CAPTURE_ENABLED: 'true', DCC_CLERK_INSTANCE_ID: 'instance_1',
      DCC_MEMBER_CUTOVER_ISO: '2026-11-22T00:00:00Z',
    })).toEqual({ enabled: true, instance: 'instance_1', cutover: '2026-11-22T00:00:00.000Z' })
  })
  it('given a signed new-account creation, captures only private non-PII evidence', () => {
    const result = normalizeClerkMembershipEvent(created, 'msg_1abcdef', config)
    expect(result).toEqual({
      p_instance: 'clerk_instance_1',
      p_event_id: 'msg_1abcdef',
      p_subject: 'user_123abc',
      p_event_type: 'user.created',
      p_account_created_at: '2026-11-23T00:00:00.000Z',
      p_email_verified: true,
      p_cutover: '2026-11-22T00:00:00.000Z',
    })
    expect(JSON.stringify(result)).not.toContain('private@example.test')
    expect(JSON.stringify(result)).not.toContain('unsafe_metadata')
  })
  it('given an unverified email, never invents an active verified identity', () => {
    const event = JSON.parse(JSON.stringify(created))
    event.data.email_addresses[0].verification.status = 'unverified'
    expect(normalizeClerkMembershipEvent(event, 'msg_1abcdef', config)?.p_email_verified).toBe(false)
  })
  it('given a deletion before creation, still sends the tombstone without an email', () => {
    const deleted = { type: 'user.deleted', data: { id: 'user_123abc', deleted: true } }
    expect(normalizeClerkMembershipEvent(deleted, 'msg_deleted', config)?.p_event_type).toBe('user.deleted')
    expect(normalizeClerkMembershipEvent(deleted, 'msg_deleted', config)?.p_email_verified).toBe(false)
  })
  it('given a user.updated, it cannot become a user.created signal', () => {
    const updated = { ...created, type: 'user.updated' }
    expect(normalizeClerkMembershipEvent(updated, 'msg_updated', config)?.p_account_created_at).toBeNull()
    expect(normalizeClerkMembershipEvent(updated, 'msg_updated', config)?.p_event_type).toBe('user.updated')
  })
  it('rejects a malformed subject, message id or unrelated event', () => {
    expect(normalizeClerkMembershipEvent({ type: 'session.created', data: { id: 'user_1' } }, 'msg_valid', config)).toBeNull()
    expect(normalizeClerkMembershipEvent({ ...created, data: { id: '' } }, 'msg_valid', config)).toBeNull()
    expect(normalizeClerkMembershipEvent(created, '', config)).toBeNull()
  })
  it('keeps campaign metadata bounded and incapable of changing member identity', () => {
    expect(normalizeEntrySource('smart-sign')).toBe('smart-sign')
    expect(normalizeEntrySource('https://evil.test')).toBe('other')
    expect(normalizeCampaignId('td-bank-2026')).toBe('td-bank-2026')
    expect(normalizeCampaignId('name@example.test')).toBeNull()
    expect(normalizeCampaignId('a'.repeat(100))).toBeNull()
  })
})
