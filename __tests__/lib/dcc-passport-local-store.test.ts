/** @jest-environment node */
jest.mock('server-only', () => ({}))
jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
import { createClient } from '@supabase/supabase-js'
import { readOwnerPassport, saveOwnerPassport } from '@/lib/dcc/membership/profile-store'

const enabled = process.env.DCC_LOCAL_STORE_TEST === '1'
const suite = enabled ? describe : describe.skip
suite('Passport application store against disposable PostgREST', () => {
  it('saves, reloads, edits and rejects stale revisions using the real store', async () => {
    const url = 'http://127.0.0.1:3009'
    const bindingId = process.env.DCC_TEST_BINDING_ID
    if (!bindingId || !/^[0-9a-f-]{36}$/.test(bindingId)) throw new Error('Missing synthetic binding')
    // The isolated gateway mounts PostgREST at its root, not Supabase's /rest/v1.
    const localFetch: typeof fetch = (input, init) => {
      const target = new URL(String(input))
      if (target.origin !== url || !target.pathname.startsWith('/rest/v1/')) throw new Error('Nonlocal request refused')
      target.pathname = target.pathname.replace(/^\/rest\/v1/, '')
      const headers = new Headers(init?.headers)
      headers.delete('authorization')
      headers.delete('apikey')
      return fetch(target, { ...init, headers })
    }
    const client = () => createClient(url, 'local-only', { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: localFetch } })
    const binding = { id: bindingId, state: 'pending_reconciliation', airtablePersonId: null }
    const draft = { displayName: 'Synthetic maker', summary: 'Private integration test biography', practices: [], interests: [], links: [] }
    expect((await readOwnerPassport(client(), binding)).revision).toBe(0)
    expect(await saveOwnerPassport(client(), binding, draft, 0)).toEqual({ saved: true, publication: 'private', revision: 1 })
    expect(await readOwnerPassport(client(), binding)).toMatchObject({ displayName: draft.displayName, revision: 1, publication: 'private' })
    expect(await saveOwnerPassport(client(), binding, { ...draft, displayName: 'Resumed maker' }, 1)).toMatchObject({ revision: 2 })
    await expect(saveOwnerPassport(client(), binding, draft, 1)).rejects.toMatchObject({ status: 409 })
    expect(await readOwnerPassport(client(), binding)).toMatchObject({ displayName: 'Resumed maker', revision: 2, publication: 'private' })
  })
})
