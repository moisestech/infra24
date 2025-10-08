import { NextRequest, NextResponse } from 'next/server'
import { mdxProcessor } from '@/lib/mdx-processor'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { workshopId: string; chapterSlug: string } }
) {
  try {
    const { workshopId, chapterSlug } = params

    // Construct the file path
    const filePath = path.join(
      process.cwd(),
      'content',
      'workshops',
      workshopId,
      'chapters',
      `${chapterSlug}.md`
    )

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8')

    // Process the MDX content
    const processed = await mdxProcessor.processMDX(fileContent)

    return NextResponse.json({
      success: true,
      data: {
        workshopId,
        chapterSlug,
        ...processed
      }
    })
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}
