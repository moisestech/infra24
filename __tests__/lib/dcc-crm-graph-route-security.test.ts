/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET } from '../../app/api/marketing/dcc-network-graph/route'
import { fetchDccCrmGraphPayload } from '../../lib/airtable/crm-graph-service'
import { auth } from '@clerk/nextjs/server'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('../../lib/airtable/crm-graph-service', () => ({
  fetchDccCrmGraphPayload: jest.fn(),
}))

const graph = fetchDccCrmGraphPayload as jest.Mock
const clerk = auth as jest.Mock
const savedFlag = process.env.DCC_NETWORK_ADMIN_ENABLED
const savedAllowlist = process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS

beforeEach(() => {
  jest.clearAllMocks()
  graph.mockResolvedValue({ elements: [], meta: { source: 'fixture' } })
  clerk.mockReturnValue({ userId: null })
  delete process.env.DCC_NETWORK_ADMIN_ENABLED
  delete process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS
})
afterAll(() => {
  if (savedFlag === undefined) delete process.env.DCC_NETWORK_ADMIN_ENABLED
  else process.env.DCC_NETWORK_ADMIN_ENABLED = savedFlag
  if (savedAllowlist === undefined) delete process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS
  else process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS = savedAllowlist
})

function call(query: string) {
  return GET(new NextRequest('https://example.test/api/marketing/dcc-network-graph' + (query ? '?' + query : '')))
}

describe('public CRM graph route', () => {
  it('permits only public active projection and prevents caching', async () => {
    const response = await call('mode=active&visibility=public')
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(graph).toHaveBeenCalledWith({ surface: 'home', mode: 'active', visibility: 'public' })
    expect(clerk).not.toHaveBeenCalled()
  })

  it.each([
    'mode=research', 'mode=combined', 'mode=admin', 'visibility=internal',
    'mode=admin&visibility=internal', 'mode=unknown', 'visibility=unknown',
  ])('fails closed without an authorized staff account for %s', async query => {
    const response = await call(query)
    expect(response.status).toBe(403)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(graph).not.toHaveBeenCalled()
  })

  it('does not turn an admin feature flag into access without Clerk identity', async () => {
    process.env.DCC_NETWORK_ADMIN_ENABLED = 'true'
    process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS = 'user_staff'
    const response = await call('visibility=internal')
    expect(response.status).toBe(403)
    expect(graph).not.toHaveBeenCalled()
  })

  it('allows explicitly configured staff and never caches internal responses', async () => {
    process.env.DCC_NETWORK_ADMIN_ENABLED = 'true'
    process.env.DCC_NETWORK_ADMIN_CLERK_USER_IDS = 'user_staff'
    clerk.mockReturnValue({ userId: 'user_staff' })
    const response = await call('mode=research&visibility=internal')
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(graph).toHaveBeenCalledWith({ surface: 'home', mode: 'research', visibility: 'internal' })
  })
})
