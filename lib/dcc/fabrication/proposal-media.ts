import path from 'node:path'

import { listProposalSlugs } from '@/lib/dcc/fabrication/proposals'

export const PRIVATE_PROPOSAL_MEDIA_ROOT = path.join(
  process.cwd(),
  'content/dcc/fabricate/private'
)

const SAFE_SEGMENT = /^[a-zA-Z0-9._-]+$/
const ALLOWED_MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])

export function isSafeProposalMediaPath(
  slug: string,
  filename: string
): boolean {
  if (!SAFE_SEGMENT.test(slug) || !SAFE_SEGMENT.test(filename)) return false
  if (filename.includes('..') || slug.includes('..')) return false
  const ext = path.extname(filename).toLowerCase()
  if (!ALLOWED_MEDIA_EXT.has(ext)) return false
  return listProposalSlugs().includes(slug)
}

export function resolveProposalMediaFile(
  slug: string,
  filename: string
): string | null {
  if (!isSafeProposalMediaPath(slug, filename)) return null
  return path.join(PRIVATE_PROPOSAL_MEDIA_ROOT, slug, filename)
}

export function proposalMediaSrc(slug: string, filename: string): string {
  return `/api/dcc/fabricate/media/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`
}

export function mimeForProposalFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}
