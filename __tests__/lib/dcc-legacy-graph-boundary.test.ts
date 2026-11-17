/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET } from '../../app/api/marketing/dcc-network-graph/route'
import { fetchDccCrmGraphPayload } from '../../lib/airtable/crm-graph-service'
jest.mock('../../lib/airtable/crm-graph-service', () => ({ fetchDccCrmGraphPayload: jest.fn() }))
const fetchGraph = fetchDccCrmGraphPayload as jest.Mock
beforeEach(() => { jest.clearAllMocks(); fetchGraph.mockResolvedValue({ elements: [] }) })
describe('legacy marketing graph boundary', () => {
  it.each(['mode=admin', 'mode=research', 'mode=combined', 'visibility=internal', 'mode=unknown', 'visibility=unknown', 'mode=active&visibility=internal'])(
    'rejects %s without reading the CRM', async query => {
      const response = await GET(new NextRequest('https://example.test/api/marketing/dcc-network-graph?' + query))
      expect(response.status).toBe(403)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(fetchGraph).not.toHaveBeenCalled()
    }
  )
  it('permits the public active request without caching personal projections', async () => {
    const response = await GET(new NextRequest('https://example.test/api/marketing/dcc-network-graph?mode=active&visibility=public'))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(fetchGraph).toHaveBeenCalledWith({ surface: 'home', mode: 'active', visibility: 'public' })
  })
})
