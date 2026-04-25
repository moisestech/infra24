import { NextRequest, NextResponse } from 'next/server'
import { listDiskChapters } from '@/lib/workshops/workshop-disk-chapters'
import { resolveLearnWorkshopFolderSlug } from '@/lib/workshops/learn-workshop-folder-slug'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const { workshopId } = await params
    if (!workshopId?.trim()) {
      return NextResponse.json({ error: 'Workshop ID required' }, { status: 400 })
    }

    const resolved = await resolveLearnWorkshopFolderSlug(workshopId)
    if (!resolved) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const chapters = await listDiskChapters(resolved.folderSlug)

    return NextResponse.json({
      success: true,
      data: {
        workshopId,
        folderSlug: resolved.folderSlug,
        workshopTitle: resolved.workshopTitle,
        chapters: chapters.map((c) => ({
          slug: c.slug,
          title: c.title,
          description: c.description,
          order: c.order,
          estimatedTime: c.estimatedTime,
        })),
      },
    })
  } catch (error) {
    console.error('Error listing learn chapters:', error)
    return NextResponse.json({ error: 'Failed to list chapters' }, { status: 500 })
  }
}
