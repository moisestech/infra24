import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Make analytics publicly accessible for now
    // const { userId } = await auth()
    // 
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const surveyId = (await params).id
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get survey details
    const { data: survey, error: surveyError } = await supabase
      .from('submission_forms')
      .select(`
        id,
        title,
        description,
        form_schema,
        organization_id,
        organizations!inner(name, slug)
      `)
      .eq('id', surveyId)
      .single()

    if (surveyError || !survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Skip permission check for now to make analytics publicly accessible
    // const { data: membership, error: membershipError } = await supabase
    //   .from('org_memberships')
    //   .select('role')
    //   .eq('organization_id', survey.organization_id)
    //   .eq('clerk_user_id', userId)
    //   .single()

    // if (membershipError || !membership || !['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
    //   return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    // }

    // Get all submissions for this survey
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('form_id', surveyId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (submissionsError) {
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    // Get distribution stats
    const { data: distributions, error: distError } = await supabase
      .from('survey_distributions')
      .select('*')
      .eq('survey_id', surveyId)
      .gte('created_at', startDate.toISOString())

    // Get magic link stats
    const { data: magicLinks, error: linksError } = await supabase
      .from('magic_links')
      .select('*')
      .eq('survey_id', surveyId)
      .gte('created_at', startDate.toISOString())

    // Calculate analytics
    const totalResponses = submissions?.length || 0
    const completedResponses = submissions?.filter(s => s.status === 'completed').length || 0
    const completionRate = totalResponses > 0 ? completedResponses / totalResponses : 0

    // Calculate average completion time
    const completedSubmissions = submissions?.filter(s => s.status === 'completed' && s.completion_time)
    const averageTime = completedSubmissions?.length > 0 
      ? completedSubmissions.reduce((sum, s) => sum + (s.completion_time || 0), 0) / completedSubmissions.length
      : 0

    // Response breakdown
    const responseBreakdown = {
      completed: completedResponses,
      partial: submissions?.filter(s => s.status === 'partial').length || 0,
      abandoned: submissions?.filter(s => s.status === 'abandoned').length || 0
    }

    // Distribution stats
    const totalSent = distributions?.reduce((sum, d) => sum + d.email_count, 0) || 0
    const totalOpened = magicLinks?.filter(link => link.opened_at).length || 0
    const totalClicked = magicLinks?.filter(link => link.clicked_at).length || 0

    const distributionStats = {
      totalSent,
      opened: totalOpened,
      clicked: totalClicked
    }

    // Time series data
    const timeSeries = generateTimeSeries(submissions || [], startDate, now)

    // Question analytics
    const questionAnalytics = generateQuestionAnalytics(survey.form_schema, submissions || [])

    const analytics = {
      surveyId,
      surveyTitle: survey.title,
      totalResponses,
      completionRate,
      averageTime,
      responseBreakdown,
      questionAnalytics,
      distributionStats,
      timeSeries
    }

    return NextResponse.json({ analytics })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateTimeSeries(submissions: any[], startDate: Date, endDate: Date) {
  const timeSeries = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const responses = submissions.filter(s => 
      s.created_at.startsWith(dateStr)
    ).length
    
    timeSeries.push({
      date: dateStr,
      responses
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return timeSeries
}

function generateQuestionAnalytics(formSchema: any, submissions: any[]) {
  if (!formSchema?.questions) return []
  
  return formSchema.questions.map((question: any) => {
    const responses = submissions
      .filter(s => s.status === 'completed')
      .map(s => s.responses?.[question.id])
      .filter(Boolean)
    
    const analytics: any = {
      questionId: question.id,
      questionText: question.question,
      questionType: question.type,
      responseCount: responses.length
    }
    
    switch (question.type) {
      case 'multiple_choice':
        analytics.analytics = generateMultipleChoiceAnalytics(question, responses)
        break
      case 'rating':
        analytics.analytics = generateRatingAnalytics(responses)
        break
      case 'open_text':
        analytics.analytics = generateOpenTextAnalytics(responses)
        break
      default:
        analytics.analytics = {}
    }
    
    return analytics
  })
}

function generateMultipleChoiceAnalytics(question: any, responses: string[]) {
  const choices = question.choices || []
  const choiceCounts = choices.map((choice: string) => ({
    option: choice,
    count: responses.filter(r => r === choice).length,
    percentage: 0
  }))
  
  const total = choiceCounts.reduce((sum: number, c: any) => sum + c.count, 0)
  choiceCounts.forEach((choice: any) => {
    choice.percentage = total > 0 ? (choice.count / total) * 100 : 0
  })
  
  return { choices: choiceCounts }
}

function generateRatingAnalytics(responses: number[]) {
  if (responses.length === 0) return {}
  
  const averageRating = responses.reduce((sum, r) => sum + r, 0) / responses.length
  
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: responses.filter(r => r === rating).length
  }))
  
  return {
    averageRating,
    ratingDistribution
  }
}

function generateOpenTextAnalytics(responses: string[]) {
  if (responses.length === 0) return {}
  
  // Enhanced word frequency analysis
  const allText = responses.join(' ').toLowerCase()
  
  // Remove common stop words and filter meaningful words
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 
    'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 
    'could', 'other', 'very', 'much', 'some', 'more', 'also', 'when', 
    'where', 'what', 'how', 'why', 'should', 'would', 'could', 'think',
    'feel', 'like', 'good', 'great', 'really', 'just', 'maybe', 'probably'
  ])
  
  const words = allText
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !stopWords.has(word) &&
      !/^\d+$/.test(word) &&
      word.length < 20
    )
  
  const wordCounts: { [key: string]: number } = {}
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })
  
  const wordCloud = Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 25)
    .map(([word, count]) => ({ word, count }))
  
  // Enhanced theme extraction with sentiment analysis
  const sentimentWords = {
    positive: ['love', 'excellent', 'amazing', 'fantastic', 'wonderful', 'great', 'awesome', 'perfect', 'best', 'outstanding', 'impressive', 'brilliant', 'incredible'],
    negative: ['hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointing', 'frustrating', 'annoying', 'useless', 'broken', 'complicated', 'difficult', 'confusing'],
    neutral: ['okay', 'fine', 'average', 'standard', 'normal', 'typical', 'adequate', 'acceptable']
  }
  
  const sentimentAnalysis = {
    positive: responses.filter(r => {
      const words = r.toLowerCase().split(/\s+/)
      return words.some(word => sentimentWords.positive.includes(word))
    }).length,
    negative: responses.filter(r => {
      const words = r.toLowerCase().split(/\s+/)
      return words.some(word => sentimentWords.negative.includes(word))
    }).length,
    neutral: responses.filter(r => {
      const words = r.toLowerCase().split(/\s+/)
      return words.some(word => sentimentWords.neutral.includes(word))
    }).length
  }
  
  // Advanced theme extraction
  const themeKeywords = {
    'Digital Innovation': ['digital', 'technology', 'tech', 'innovation', 'modern', 'online', 'virtual', 'ai', 'software', 'app', 'platform'],
    'Learning & Education': ['learn', 'education', 'training', 'workshop', 'course', 'skill', 'knowledge', 'teaching', 'study', 'practice'],
    'Community & Collaboration': ['community', 'people', 'team', 'together', 'collaborate', 'network', 'connect', 'share', 'group', 'social'],
    'Art & Creativity': ['art', 'creative', 'artistic', 'design', 'visual', 'craft', 'expression', 'inspiration', 'beautiful', 'aesthetic'],
    'Accessibility & Inclusion': ['access', 'inclusive', 'accessible', 'everyone', 'diverse', 'equity', 'fair', 'welcome', 'open', 'support'],
    'Resources & Support': ['resource', 'support', 'help', 'assistance', 'guidance', 'funding', 'equipment', 'space', 'facility', 'service'],
    'Feedback & Improvement': ['feedback', 'improve', 'better', 'enhance', 'develop', 'progress', 'advance', 'upgrade', 'optimize', 'refine']
  }
  
  const themeAnalysis = Object.entries(themeKeywords).map(([theme, keywords]) => {
    const matchingResponses = responses.filter(response => {
      const responseWords = response.toLowerCase().split(/\s+/)
      return keywords.some(keyword => responseWords.some(word => word.includes(keyword)))
    })
    
    return {
      theme,
      count: matchingResponses.length,
      percentage: responses.length > 0 ? Math.round((matchingResponses.length / responses.length) * 100) : 0,
      examples: matchingResponses.slice(0, 3).map(r => r.length > 100 ? r.substring(0, 100) + '...' : r)
    }
  }).filter(theme => theme.count > 0).sort((a, b) => b.count - a.count)
  
  // Response length analysis
  const responseLengths = responses.map(r => r.length)
  const averageLength = responseLengths.reduce((sum, len) => sum + len, 0) / responses.length
  
  return {
    wordCloud,
    commonThemes: themeAnalysis.slice(0, 8), // Top 8 themes
    sentimentAnalysis,
    responseStats: {
      totalResponses: responses.length,
      averageLength: Math.round(averageLength),
      shortestResponse: Math.min(...responseLengths),
      longestResponse: Math.max(...responseLengths)
    }
  }
}