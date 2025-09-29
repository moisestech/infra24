import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterSlug: string }> }
) {
  try {
    const { id: workshopId, chapterSlug } = await params
    const supabase = createClient()

    console.log('📖 Fetching chapter content:', { workshopId, chapterSlug })

    // Get workshop and chapter info
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('id, title, organization_id')
      .eq('id', workshopId)
      .single()

    if (workshopError || !workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    const { data: chapter, error: chapterError } = await supabase
      .from('workshop_chapters')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('chapter_slug', chapterSlug)
      .single()

    if (chapterError || !chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    // Get organization slug for file path
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('slug')
      .eq('id', workshop.organization_id)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Try to read the MDX file
    const contentPath = path.join(
      process.cwd(),
      'content',
      'workshops',
      org.slug,
      workshop.title.toLowerCase().replace(/\s+/g, '-'),
      'chapters',
      `${chapterSlug}.md`
    )

    console.log('📁 Looking for content file:', contentPath)

    let content = ''
    let fileExists = false

    try {
      if (fs.existsSync(contentPath)) {
        content = fs.readFileSync(contentPath, 'utf-8')
        fileExists = true
        console.log('✅ Content file found and read')
      } else {
        console.log('⚠️ Content file not found, using placeholder')
        content = generatePlaceholderContent(chapter)
      }
    } catch (error) {
      console.error('❌ Error reading content file:', error)
      content = generatePlaceholderContent(chapter)
    }

    return NextResponse.json({
      chapter: {
        id: chapter.id,
        title: chapter.title,
        slug: chapter.chapter_slug,
        description: chapter.description,
        order_index: chapter.order_index,
        estimated_time: chapter.estimated_time,
        content: content,
        file_exists: fileExists,
        content_path: contentPath
      },
      workshop: {
        id: workshop.id,
        title: workshop.title
      }
    })

  } catch (error) {
    console.error('Error in chapter content API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generatePlaceholderContent(chapter: any): string {
  return `---
title: "${chapter.title}"
description: "${chapter.description}"
estimatedTime: ${chapter.estimated_time}
difficulty: "beginner"
---

# ${chapter.title}

${chapter.description}

## Learning Objectives

By the end of this chapter, you will be able to:

- Understand the key concepts
- Apply practical techniques
- Implement best practices

## Key Concepts

This chapter covers the fundamental concepts you need to know.

## Interactive Learning

<Quiz 
  questions={[
    {
      id: "q1",
      question: "What is the main topic of this chapter?",
      options: [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      correct: 0,
      explanation: "This is the correct answer because..."
    }
  ]}
/>

## Hands-on Activity

<Activity 
  title="Practice Exercise"
  description="Apply what you've learned with this practical exercise."
  steps={[
    "Step 1: Set up your environment",
    "Step 2: Follow the instructions",
    "Step 3: Test your implementation",
    "Step 4: Review and reflect"
  ]}
/>

## Summary

In this chapter, we covered:

- Key concept 1
- Key concept 2
- Key concept 3

## Next Steps

Continue to the next chapter to build upon these concepts.
`
}
