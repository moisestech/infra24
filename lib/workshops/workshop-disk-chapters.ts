import 'server-only'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const WORKSHOPS_ROOT = path.join(process.cwd(), 'content', 'workshops')

function chaptersDir(workshopSlug: string): string {
  return path.join(WORKSHOPS_ROOT, workshopSlug, 'chapters')
}

export type DiskChapterFileEntry = {
  sourceFile: string
  slug: string
  title: string
  description: string
  order: number
  estimatedTime: number
  body: string
  raw: string
}

function parseChapterFile(sourceFile: string, raw: string): DiskChapterFileEntry {
  const { data, content } = matter(raw)
  const d = data as Record<string, unknown>
  const slug =
    typeof d.slug === 'string' && d.slug.trim()
      ? d.slug.trim()
      : sourceFile.replace(/\.md$/, '').replace(/^\d+-/, '')
  const title = typeof d.title === 'string' && d.title.trim() ? d.title.trim() : slug
  const description =
    typeof d.description === 'string' && d.description.trim()
      ? d.description.trim()
      : content.trim().slice(0, 160).replace(/\s+/g, ' ')
  const order =
    typeof d.order === 'number'
      ? d.order
      : typeof d.chapter_number === 'number'
        ? d.chapter_number
        : parseInt(sourceFile.match(/^(\d+)/)?.[1] ?? '0', 10) || 0
  const estimatedTime =
    typeof d.estimated_duration === 'number'
      ? d.estimated_duration
      : typeof d.estimatedTime === 'number'
        ? d.estimatedTime
        : 30

  return {
    sourceFile,
    slug,
    title,
    description,
    order,
    estimatedTime,
    body: content.trim(),
    raw,
  }
}

async function readDiskChapterEntries(workshopSlug: string): Promise<DiskChapterFileEntry[]> {
  const dir = chaptersDir(workshopSlug)
  let names: string[] = []
  try {
    names = await fs.readdir(dir)
  } catch {
    return []
  }
  const mdFiles = names.filter((n) => n.endsWith('.md')).sort()
  const out: DiskChapterFileEntry[] = []
  for (const file of mdFiles) {
    const raw = await fs.readFile(path.join(dir, file), 'utf8')
    out.push(parseChapterFile(file, raw))
  }
  out.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
  return out
}

export type DiskChapterSummary = {
  slug: string
  title: string
  description: string
  order: number
  estimatedTime: number
  sourceFile: string
}

export async function listDiskChapters(workshopSlug: string): Promise<DiskChapterSummary[]> {
  const entries = await readDiskChapterEntries(workshopSlug)
  return entries.map((e) => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    order: e.order,
    estimatedTime: e.estimatedTime,
    sourceFile: e.sourceFile,
  }))
}

export async function loadDiskChapterMarkdown(
  workshopSlug: string,
  chapterSlug: string
): Promise<DiskChapterFileEntry | null> {
  const entries = await readDiskChapterEntries(workshopSlug)
  return entries.find((e) => e.slug === chapterSlug) ?? null
}
