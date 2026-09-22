import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { NextResponse } from 'next/server'
import { hasFabricateProposalsAccess } from '@/lib/dcc/fabrication/proposal-auth'
import {
  mimeForProposalFilename,
  resolveProposalMediaFile,
} from '@/lib/dcc/fabrication/proposal-media'

export const dynamic = 'force-dynamic'

type Params = { path: string[] }

export async function GET(
  _req: Request,
  { params }: { params: Params }
) {
  const unlocked = await hasFabricateProposalsAccess()
  if (!unlocked) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [slug, filename, ...rest] = params.path ?? []
  if (!slug || !filename || rest.length > 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const filePath = resolveProposalMediaFile(slug, filename)
  if (!filePath || !existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const info = await stat(filePath)
  if (!info.isFile()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await readFile(filePath)
  return new NextResponse(new Uint8Array(body), {
    headers: {
      'Content-Type': mimeForProposalFilename(filename),
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Length': String(info.size),
    },
  })
}
