import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Route: /api/surveys/submit - Starting request')
    
    const body = await request.json()
    const { surveyId, organizationId, responses, metadata } = body

    if (!surveyId || !responses) {
      return NextResponse.json(
        { error: 'Survey ID and responses are required' },
        { status: 400 }
      )
    }

    console.log('📋 Submitting survey:', { surveyId, organizationId, responseCount: Object.keys(responses).length })

    // Verify the survey exists and is active
    const { data: survey, error: surveyError } = await supabaseAdmin
      .from('submission_forms')
      .select('id, title, organization_id, submission_settings')
      .eq('id', surveyId)
      .eq('type', 'survey')
      .eq('is_active', true)
      .single()

    if (surveyError || !survey) {
      console.log('❌ Survey not found or inactive:', surveyError)
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Create the submission
    const submissionData = {
      form_id: surveyId,
      organization_id: organizationId || survey.organization_id,
      title: survey.title, // Required field
      content: responses, // Use 'content' instead of 'responses'
      metadata: {
        ...metadata,
        submitted_at: new Date().toISOString(),
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      },
      status: 'submitted',
      submitted_at: new Date().toISOString()
    }

    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .insert(submissionData)
      .select()
      .single()

    if (submissionError) {
      console.error('❌ Error creating submission:', submissionError)
      return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 })
    }

    console.log('✅ Survey submitted successfully:', submission.id)

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Survey submitted successfully'
    })

  } catch (error) {
    console.error('Error in survey submission API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
