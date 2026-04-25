import { NextRequest, NextResponse } from 'next/server'
import { mdxProcessor } from '@/lib/mdx-processor'
import { loadDiskChapterMarkdown } from '@/lib/workshops/workshop-disk-chapters'
import { resolveLearnWorkshopFolderSlug } from '@/lib/workshops/learn-workshop-folder-slug'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workshopId: string; chapterSlug: string }> }
) {
  try {
    const { workshopId, chapterSlug } = await params
    if (!workshopId?.trim() || !chapterSlug?.trim()) {
      return NextResponse.json(
        { error: 'Workshop ID and chapter slug are required' },
        { status: 400 }
      )
    }

    const resolved = await resolveLearnWorkshopFolderSlug(workshopId)
    if (!resolved) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const disk = await loadDiskChapterMarkdown(resolved.folderSlug, chapterSlug)
    if (!disk) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const processed = await mdxProcessor.processMDX(disk.raw)

    return NextResponse.json({
      success: true,
      data: {
        workshopId,
        folderSlug: resolved.folderSlug,
        workshopTitle: resolved.workshopTitle,
        chapterSlug,
        ...processed,
      },
    })
  } catch (error) {
    console.error('Error fetching learn chapter:', error)
    return NextResponse.json({ error: 'Failed to fetch chapter' }, { status: 500 })
  }
}
