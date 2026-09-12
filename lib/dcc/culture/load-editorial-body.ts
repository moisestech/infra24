import 'server-only'

import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { ReactNode } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { EditorialImageSlot } from '@/components/dcc/culture/EditorialImageSlot'
import type { DccEditorial } from '@/lib/dcc/culture/types'

const JOURNAL_DIR = 'content/journal'

export function resolveJournalBodyPath(bodyPath: string): string {
  const normalized = bodyPath.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!normalized.startsWith(`${JOURNAL_DIR}/`) || normalized.includes('..')) {
    throw new Error(`Invalid editorial bodyPath: ${bodyPath}`)
  }
  const abs = path.resolve(process.cwd(), normalized)
  const root = path.resolve(process.cwd(), JOURNAL_DIR)
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    throw new Error(`Invalid editorial bodyPath: ${bodyPath}`)
  }
  return abs
}

export async function compileEditorialBody(
  entry: DccEditorial
): Promise<ReactNode | null> {
  if (!entry.bodyPath) return null
  const filePath = resolveJournalBodyPath(entry.bodyPath)
  const source = await fs.readFile(filePath, 'utf8')
  const { content } = await compileMDX({
    source,
    components: { EditorialImageSlot },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  })
  return content
}
