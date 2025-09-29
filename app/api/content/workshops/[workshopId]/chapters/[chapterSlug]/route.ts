import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workshopId: string; chapterSlug: string }> }
) {
  try {
    const user = await currentUser()
    const userId = user?.id
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { workshopId, chapterSlug } = await params

    if (!workshopId || !chapterSlug) {
      return NextResponse.json(
        { error: 'Workshop ID and Chapter Slug are required' },
        { status: 400 }
      )
    }

    // For now, we'll use a simple file-based approach
    // In production, you might want to store content in the database
    const contentDir = path.join(process.cwd(), 'content', 'workshops', 'oolite', 'seo-workshop', 'chapters')
    const filePath = path.join(contentDir, `${chapterSlug}.md`)

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return NextResponse.json({ 
        content,
        chapterSlug,
        workshopId,
        lastModified: new Date().toISOString()
      })
    } catch (error) {
      // File doesn't exist, return empty content
      return NextResponse.json({ 
        content: '',
        chapterSlug,
        workshopId,
        lastModified: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Error fetching chapter content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter content' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workshopId: string; chapterSlug: string }> }
) {
  try {
    const user = await currentUser()
    const userId = user?.id
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { workshopId, chapterSlug } = await params
    const body = await request.json()

    if (!workshopId || !chapterSlug) {
      return NextResponse.json(
        { error: 'Workshop ID and Chapter Slug are required' },
        { status: 400 }
      )
    }

    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Create content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), 'content', 'workshops', 'oolite', 'seo-workshop', 'chapters')
    await fs.mkdir(contentDir, { recursive: true })

    // Save content to file
    const filePath = path.join(contentDir, `${chapterSlug}.md`)
    await fs.writeFile(filePath, body.content, 'utf-8')

    return NextResponse.json({ 
      message: 'Chapter content saved successfully',
      chapterSlug,
      workshopId,
      savedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error saving chapter content:', error)
    return NextResponse.json(
      { error: 'Failed to save chapter content' },
      { status: 500 }
    )
  }
}
