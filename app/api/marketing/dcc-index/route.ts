import { handleDccSignupPost } from '@/app/api/dcc/signup/route'

export const dynamic = 'force-dynamic'

/** @deprecated Use POST /api/dcc/signup */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    return handleDccSignupPost(body)
  } catch (e) {
    console.error('dcc-index signup (legacy):', e)
    return Response.json({ error: 'Failed to submit signup. Please try again.' }, { status: 500 })
  }
}
