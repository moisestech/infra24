import 'server-only'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { DccEditorial } from '@/lib/dcc/culture/types'

/** Only markdown under this directory may be loaded via `bodyPath`. */
export const JOURNAL_CONTENT_ROOT = 'content/journal'

function journalRootAbs(): string {
  return path.resolve(process.cwd(), JOURNAL_CONTENT_ROOT)
}

/**
 * Map a registry `bodyPath` to an absolute file under `content/journal/`.
 * Accepts `content/journal/slug.md` or a bare `slug.md`. Rejects `..`,
 * absolute paths, nested directories, and anything that would escape the root.
 */
export function resolveJournalBodyFile(bodyPath: string): string | null {
  const trimmed = bodyPath.trim()
  if (!trimmed) return null

  const withoutRoot = trimmed.replace(/^(?:\.\/)?content\/journal\/?/i, '')
  if (!withoutRoot || path.isAbsolute(withoutRoot) || withoutRoot.includes('..')) {
    return null
  }
  if (withoutRoot.includes('/') || withoutRoot.includes('\\')) {
    return null
  }
  if (!withoutRoot.toLowerCase().endsWith('.md')) return null

  const root = journalRootAbs()
  const abs = path.resolve(root, withoutRoot)
  const rel = path.relative(root, abs)
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null
  return abs
}

export function resolveEditorialMarkdown(entry: DccEditorial): string {
  if (entry.bodyPath) {
    const file = resolveJournalBodyFile(entry.bodyPath)
    if (file) {
      try {
        return readFileSync(file, 'utf8')
      } catch {
        /* fall through to inline body */
      }
    }
  }
  return entry.body ?? ''
}

export async function renderEditorialMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}
