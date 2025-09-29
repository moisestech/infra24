import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const supabase = createClient()

    console.log('📊 Fetching workshop analytics for organization:', orgId)

    // Get workshop overview with Learn Canvas status
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select(`
        id,
        title,
        status,
        featured,
        has_learn_content,
        learning_objectives,
        estimated_learn_time,
        learn_difficulty,
        instructor,
        duration_minutes,
        max_participants,
        price,
        created_at,
        updated_at
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })

    if (workshopsError) {
      console.error('Error fetching workshops:', workshopsError)
      return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
    }

    // Get chapter counts for each workshop
    const { data: chapterCounts, error: chapterError } = await supabase
      .from('workshop_chapters')
      .select('workshop_id, estimated_time')
      .in('workshop_id', workshops.map(w => w.id))

    if (chapterError) {
      console.error('Error fetching chapter counts:', chapterError)
    }

    // Get user progress data
    const { data: progressData, error: progressError } = await supabase
      .from('user_workshop_progress')
      .select('workshop_id, user_id, completed_at')
      .in('workshop_id', workshops.map(w => w.id))

    if (progressError) {
      console.error('Error fetching progress data:', progressError)
    }

    // Process the data
    const workshopsWithAnalytics = workshops.map(workshop => {
      const chapters = chapterCounts?.filter(c => c.workshop_id === workshop.id) || []
      const progress = progressData?.filter(p => p.workshop_id === workshop.id) || []
      
      const completedChapters = progress.filter(p => p.completed_at !== null).length
      const uniqueUsers = new Set(progress.map(p => p.user_id)).size
      const completionRate = progress.length > 0 ? (completedChapters / progress.length) * 100 : 0

      return {
        ...workshop,
        chapter_count: chapters.length,
        total_chapter_time: chapters.reduce((sum, c) => sum + (c.estimated_time || 0), 0),
        total_progress_records: progress.length,
        completed_chapters: completedChapters,
        unique_users: uniqueUsers,
        completion_rate_percent: Math.round(completionRate * 100) / 100
      }
    })

    // Calculate summary statistics
    const summary = {
      total_workshops: workshops.length,
      published_workshops: workshops.filter(w => w.status === 'published').length,
      draft_workshops: workshops.filter(w => w.status === 'draft').length,
      learn_canvas_enabled: workshops.filter(w => w.has_learn_content).length,
      total_chapters: chapterCounts?.length || 0,
      active_users: new Set(progressData?.map(p => p.user_id) || []).size
    }

    console.log('✅ Analytics data fetched successfully:', {
      workshops: workshopsWithAnalytics.length,
      summary
    })

    return NextResponse.json({
      workshops: workshopsWithAnalytics,
      summary
    })

  } catch (error) {
    console.error('Error in workshop analytics API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
