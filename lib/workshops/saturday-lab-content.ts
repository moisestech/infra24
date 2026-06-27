import 'server-only'

import fs from 'fs/promises'
import path from 'path'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { rehypeExternalLessonLinks } from '@/lib/workshops/rehype-external-lesson-links'

export {
  SATURDAY_LAB_FACILITATOR_HREF,
  SATURDAY_LAB_HUB_PATH,
  SATURDAY_LAB_QR_IMAGE,
  SATURDAY_LAB_STARTER_ZIP,
} from '@/lib/workshops/saturday-lab-public-assets'

const CONTENT_DIR = path.join(process.cwd(), 'content/workshops/saturday-lab')

export type SaturdayLabDocKey =
  | 'facilitator-run-of-show'
  | 'packet-beginner-artist-website'
  | 'packet-vibe-coding-for-artists'
  | 'student-paths'
  | 'shared-resources'
  | 'print-start-here'
  | 'print-beginner-cheat-sheet'
  | 'print-vibe-coding-cheat-sheet'
  | 'print-exit-ticket'

const DOC_FILES: Record<SaturdayLabDocKey, string> = {
  'facilitator-run-of-show': 'facilitator-run-of-show.md',
  'packet-beginner-artist-website': 'packet-beginner-artist-website.md',
  'packet-vibe-coding-for-artists': 'packet-vibe-coding-for-artists.md',
  'student-paths': 'student-paths.md',
  'shared-resources': 'shared-resources.md',
  'print-start-here': 'print/start-here-half-sheet.md',
  'print-beginner-cheat-sheet': 'print/beginner-cheat-sheet.md',
  'print-vibe-coding-cheat-sheet': 'print/vibe-coding-cheat-sheet.md',
  'print-exit-ticket': 'print/exit-ticket.md',
}

function titleFromMarkdown(body: string): string {
  const match = body.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? 'Saturday Lab'
}

export async function loadSaturdayLabDoc(
  key: SaturdayLabDocKey
): Promise<{ title: string; html: string } | null> {
  const filename = DOC_FILES[key]
  if (!filename) return null

  const filePath = path.join(CONTENT_DIR, filename)
  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }

  const fileResult = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeExternalLessonLinks)
    .use(rehypeStringify)
    .process(raw)

  return {
    title: titleFromMarkdown(raw),
    html: String(fileResult),
  }
}

export const SATURDAY_LAB_NAV = [
  { href: '/workshop/saturday-lab', label: 'Start Here' },
  { href: '/workshop/saturday-lab/beginner', label: 'Beginner Website' },
  { href: '/workshop/saturday-lab/vibe-coding', label: 'Vibe Coding' },
  { href: '/workshop/saturday-lab/paths', label: 'Student Paths' },
  { href: '/workshop/saturday-lab/resources', label: 'Resources' },
  { href: '/workshop/saturday-lab/print', label: 'Print' },
  { href: '/workshop/saturday-lab/exit-ticket', label: 'Exit Ticket' },
] as const

/** Canonical vibe coding chapter URL (marketing reader). */
export function vibeCodingChapterHref(slug: string): string {
  return `/workshop/vibe-coding-and-net-art/${slug}`
}
