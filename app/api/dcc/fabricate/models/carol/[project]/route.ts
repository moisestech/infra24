import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hasFabricateProposalsAccess } from '@/lib/dcc/fabrication/proposal-auth'
import { CAROL_FDM_PROJECTS, isCarolProjectKey } from '@/lib/dcc/fabrication/proposals/carol-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRIVATE_MODEL_BUCKET = 'dcc-client-models'
const MAX_STL_BYTES = 20 * 1024 * 1024

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  Vary: 'Cookie',
  'X-Content-Type-Options': 'nosniff',
}

/**
 * Read-only, same-origin, cookie-protected proxy for allowlisted STL objects.
 * There is deliberately NO arbitrary object-path or URL input and NO public upload endpoint.
 * Required configuration: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Provision a PRIVATE Supabase Storage bucket named "dcc-client-models".
 *
 * Note: Existing proposal password is shared across clients. Before using this
 * for sensitive production CAD, replace/extend it with client-scoped identity.
 */
export async function GET(
  _request: Request,
  { params }: { params: { project: string } }
) {
  if (!(await hasFabricateProposalsAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: PRIVATE_HEADERS })
  }

  if (!isCarolProjectKey(params.project)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: PRIVATE_HEADERS })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'Not available' }, { status: 503, headers: PRIVATE_HEADERS })
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  // Whitelisted path comes from server code, never from query strings.
  const file = CAROL_FDM_PROJECTS[params.project].storageKey
  const { data, error } = await supabase.storage.from(PRIVATE_MODEL_BUCKET).download(file)
  if (error || !data) {
    return NextResponse.json({ error: 'Not uploaded' }, { status: 404, headers: PRIVATE_HEADERS })
  }

  if (data.size === 0 || data.size > MAX_STL_BYTES) {
    return NextResponse.json({ error: 'Model size unsupported' }, { status: 413, headers: PRIVATE_HEADERS })
  }

  return new NextResponse(await data.arrayBuffer(), {
    status: 200,
    headers: {
      ...PRIVATE_HEADERS,
      'Content-Type': 'model/stl',
      'Content-Length': String(data.size),
      'Content-Disposition': 'inline; filename="model-preview.stl"',
    },
  })
}
