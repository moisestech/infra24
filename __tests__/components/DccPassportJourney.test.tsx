import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react'
import { YourDccProfile } from '@/components/dcc/community/YourDccProfile'

jest.mock('@/components/dcc/community/YourConstellationPreview', () => ({
  YourConstellationPreview: () => null,
}))

const privateDraft = {
  revision: 0,
  displayName: '',
  summary: '',
  practices: [],
  interests: [],
  links: [],
  publication: 'private',
}

function fakeResponse(status: number, payload: object) {
  return { status, ok: status >= 200 && status < 300, json: async () => payload } as Response
}

describe('DCC isolated owner Passport journey (synthetic provider)', () => {
  let stored = { ...privateDraft }
  const requests: Array<{ path: string; method: string; body?: Record<string, unknown> }> = []

  beforeEach(() => {
    stored = { ...privateDraft }
    requests.length = 0
    window.history.replaceState(null, '', '/network/your-profile')
    global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const path = String(input)
      const method = init?.method ?? 'GET'
      const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined
      requests.push({ path, method, body })
      if (path === '/api/dcc/me' && method === 'GET') {
        return fakeResponse(200, { membership: 'pending_reconciliation', profile: stored, currentlyPublic: false, publicSlug: null })
      }
      if (path === '/api/dcc/me' && method === 'PATCH') {
        if (body.revision !== stored.revision) return fakeResponse(409, { error: 'profile_revision_conflict' })
        stored = { ...stored, ...body, revision: stored.revision + 1 }
        return fakeResponse(200, { saved: true, publication: 'private', revision: stored.revision })
      }
      if (path === '/api/dcc/me/entry') return fakeResponse(200, { saved: true })
      throw new Error('Unexpected backend call: ' + method + ' ' + path)
    }) as typeof fetch
  })
  afterEach(() => { cleanup(); jest.restoreAllMocks() })

  it('creates and edits a private draft and resumes it on a new mount without publication', async () => {
    const page = render(<YourDccProfile />)
    expect(await screen.findByText('Identity reconciliation in progress')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Synthetic Maker' } })
    fireEvent.change(screen.getByLabelText('What do you make, teach, or explore?'), {
      target: { value: 'I make installation prototypes.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save private draft' }))
    expect(await screen.findByText('Private profile saved. It is not public or part of the named sculpture yet.')).toBeInTheDocument()
    expect(stored.displayName).toBe('Synthetic Maker')
    expect(stored.summary).toBe('I make installation prototypes.')
    expect(stored.revision).toBe(1)
    expect(requests.some(r => r.path.includes('/publish'))).toBe(false)
    expect(screen.getByRole('button', { name: 'Request public listing' })).toBeDisabled()

    page.unmount()
    render(<YourDccProfile />)
    await waitFor(() => expect(screen.getByLabelText('Display name')).toHaveValue('Synthetic Maker'))
    expect(screen.getByLabelText('What do you make, teach, or explore?'))
      .toHaveValue('I make installation prototypes.')
  })

  it('keeps signup routed through the same profile editor when signed out', async () => {
    global.fetch = jest.fn(async () => fakeResponse(401, { error: 'sign_in_required' })) as typeof fetch
    render(<YourDccProfile />)
    expect(await screen.findByText('Sign in to keep your profile across devices.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create an account' }))
      .toHaveAttribute('href', '/sign-up?redirect_url=%2Fnetwork%2Fyour-profile')
  })

  it('does not show an editable member form when enrollment is disabled', async () => {
    global.fetch = jest.fn(async () => fakeResponse(503, { error: 'profile_not_enabled' })) as typeof fetch
    render(<YourDccProfile />)
    expect(await screen.findByText('Private profiles are being prepared. You can explore the network in the meantime.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Display name')).not.toBeInTheDocument()
  })
})
