/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET } from '../../app/api/marketing/community-atlas/route'
import { POST } from '../../app/api/dcc/atlas/intake/route'
import { atlasIntakeConfigured, atlasReadConfigured, readPublicAtlas, stageAtlasSubmission } from '../../lib/dcc/community/airtable-atlas'
import { ATLAS_DISCLOSURE_VERSION } from '../../lib/dcc/community/intake'
import { isPublicRoute } from '../../lib/auth/public-routes'

jest.mock('../../lib/dcc/community/airtable-atlas', () => ({ atlasIntakeConfigured: jest.fn(), atlasReadConfigured: jest.fn(), readPublicAtlas: jest.fn(), stageAtlasSubmission: jest.fn() }))
const enabled = atlasIntakeConfigured as jest.Mock
const configured = atlasReadConfigured as jest.Mock
const read = readPublicAtlas as jest.Mock
const stage = stageAtlasSubmission as jest.Mock
let ip = 0
const body = { submissionKey: '0df4bbe3-547e-4826-b041-62ff2402a571', name: 'Test Artist', email: 'private@example.test', summary: 'I make experimental objects.', practice: 'Sculpture', interests: ['making'], links: [{ label: 'Portfolio', url: 'https://example.test' }], publicConsent: true, disclosureVersion: ATLAS_DISCLOSURE_VERSION, company: '' }
function request(value: unknown, origin = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000/api/dcc/atlas/intake', { method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': `test-${++ip}` }, body: JSON.stringify(value) })
}
beforeEach(() => { jest.clearAllMocks(); enabled.mockReturnValue(true); configured.mockReturnValue(true); stage.mockResolvedValue(undefined) })

describe('Atlas HTTP boundaries', () => {
  it('serves only projected data and reflects a later approved update without rebuilding', async () => {
    read.mockResolvedValueOnce([{ slug: 'first', name: 'First Artist' }]).mockResolvedValueOnce([])
    const initial = await GET()
    expect(await initial.json()).toMatchObject({ mode: 'live', profiles: [{ slug: 'first' }] })
    expect(initial.headers.get('cache-control')).toBe('no-store')
    expect((await (await GET()).json()).profiles).toEqual([])
  })
  it('labels unconfigured data as preview and fails closed on a configured upstream error', async () => {
    configured.mockReturnValue(false)
    expect((await (await GET()).json()).mode).toBe('preview')
    configured.mockReturnValue(true); read.mockRejectedValue(new Error('private-source-data'))
    const response = await GET()
    expect(response.status).toBe(503)
    expect(JSON.stringify(await response.json())).not.toMatch(/private-source-data|profiles/)
  })
  it('accepts a valid request as pending only after a confirmed staging write', async () => {
    const response = await POST(request(body))
    expect(response.status).toBe(202)
    expect(await response.json()).toMatchObject({ status: 'pending' })
    expect(stage).toHaveBeenCalledWith(expect.objectContaining({ email: 'private@example.test' }))
    expect(isPublicRoute('/api/dcc/atlas/intake')).toBe(true)
  })
  it('rejects cross-origin and unconsented input before writing', async () => {
    expect((await POST(request(body, 'https://another.test'))).status).toBe(403)
    expect((await POST(request({ ...body, publicConsent: false }))).status).toBe(400)
    expect(stage).not.toHaveBeenCalled()
  })
  it('reports unavailable capacity/configuration without a successful submission claim', async () => {
    enabled.mockReturnValue(false)
    expect((await POST(request(body))).status).toBe(503)
    enabled.mockReturnValue(true); stage.mockRejectedValue(new Error('provider-private-error'))
    const response = await POST(request(body))
    expect(response.status).toBe(503)
    expect(JSON.stringify(await response.json())).not.toMatch(/provider-private-error|"pending"/)
  })
  it('rejects an oversized profile payload before staging', async () => {
    expect((await POST(request({ ...body, summary: 'a'.repeat(15000) }))).status).toBe(413)
    expect(stage).not.toHaveBeenCalled()
  })
})
