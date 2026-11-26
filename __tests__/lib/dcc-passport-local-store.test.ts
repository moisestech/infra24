/** @jest-environment node */
jest.mock('server-only', () => ({}))
jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { GET, PATCH } from '@/app/api/dcc/me/route'
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
      target.pathname = target.pathname.slice('/rest/v1'.length)
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
    // Exercise the actual HTTP handlers and ownership lookup. Only Clerk identity
    // and the local transport adapter are substituted; no production credentials.
    const keys = ['DCC_MEMBER_PROFILE_ENABLED','DCC_MEMBER_EVENT_CAPTURE_ENABLED','DCC_CLERK_INSTANCE_ID','DCC_MEMBER_CUTOVER_ISO','NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED'] as const
    const previous = keys.map(key => process.env[key])
    const originalFetch = global.fetch
    try {
      Object.assign(process.env, {
        DCC_MEMBER_PROFILE_ENABLED: 'true', DCC_MEMBER_EVENT_CAPTURE_ENABLED: 'true',
        DCC_CLERK_INSTANCE_ID: 'synthetic-store-ci', DCC_MEMBER_CUTOVER_ISO: '2026-11-22T00:00:00Z',
        NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: 'local-only',
        DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED: 'false',
      })
      global.fetch = (input, init) => {
        const target = new URL(String(input))
        if (target.origin !== url || !target.pathname.startsWith('/rest/v1/')) throw new Error('Nonlocal request refused')
        target.pathname = target.pathname.slice('/rest/v1'.length)
        const headers = new Headers(init?.headers)
        headers.delete('authorization')
        headers.delete('apikey')
        return originalFetch(target, { ...init, headers })
      }
      const identity = auth as unknown as jest.Mock
      identity.mockResolvedValue({ userId: 'user_store_ci' })
      const first = await GET()
      expect(first.status).toBe(200)
      expect(first.headers.get('cache-control')).toContain('no-store')
      expect(await first.json()).toMatchObject({ profile: { revision: 2 }, currentlyPublic: false })
      const patch = (body: unknown, origin = 'https://dcc.example') => new NextRequest('https://dcc.example/api/dcc/me', {
        method: 'PATCH', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body),
      })
      const body = { ...draft, displayName: 'HTTP resumed maker', revision: 2 }
      expect((await PATCH(patch(body, 'https://other.example'))).status).toBe(403)
      expect((await PATCH(patch({ ...body, bindingId }))).status).toBe(400)
      expect((await PATCH(patch(body))).status).toBe(200)
      expect((await PATCH(patch(body))).status).toBe(409)
      identity.mockResolvedValue({ userId: 'user_unbound_ci' })
      expect((await GET()).status).toBe(409)
      expect((await PATCH(patch({ ...body, revision: 3 }))).status).toBe(409)
      identity.mockResolvedValue({ userId: null })
      expect((await GET()).status).toBe(401)
      identity.mockResolvedValue({ userId: 'user_store_ci' })
      expect(await (await GET()).json()).toMatchObject({ profile: { displayName: 'HTTP resumed maker', revision: 3 }, currentlyPublic: false })
    } finally {
      global.fetch = originalFetch
      keys.forEach((key, index) => { const value = previous[index]; if (value === undefined) delete process.env[key]; else process.env[key] = value })
    }
  })
})
