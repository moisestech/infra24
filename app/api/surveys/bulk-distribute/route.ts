import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const bulkDistributeSchema = z.object({
  surveyId: z.string().uuid(),
  emailList: z.array(z.string().email()),
  organizationId: z.string().uuid(),
  customMessage: z.string().optional(),
  senderName: z.string().optional(),
  senderEmail: z.string().email().optional()
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { surveyId, emailList, organizationId, customMessage, senderName, senderEmail } = bulkDistributeSchema.parse(body)

    // Verify user has admin access to the organization
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('org_memberships')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('clerk_user_id', userId)
      .single()

    if (membershipError || !membership || !['org_admin', 'super_admin', 'moderator'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get survey details
    const { data: survey, error: surveyError } = await supabaseAdmin
      .from('submission_forms')
      .select('id, title, description, form_schema')
      .eq('id', surveyId)
      .eq('organization_id', organizationId)
      .single()

    if (surveyError || !survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('name, slug')
      .eq('id', organizationId)
      .single()

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each email
    for (const email of emailList) {
      try {
        // Generate magic link for this email
        const { data: magicLink, error: linkError } = await supabaseAdmin
          .from('magic_links')
          .insert({
            survey_id: surveyId,
            email: email,
            organization_id: organizationId,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            metadata: {
              bulk_distribution: true,
              distributed_by: userId,
              distributed_at: new Date().toISOString()
            }
          })
          .select()
          .single()

        if (linkError) {
          results.failed++
          results.errors.push(`Failed to create magic link for ${email}: ${linkError.message}`)
          continue
        }

        // Send email with magic link
        const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/survey/${surveyId}?token=${magicLink.token}`
        
        const emailHtml = generateSurveyEmailHTML({
          surveyTitle: survey.title,
          surveyDescription: survey.description,
          organizationName: organization.name,
          surveyUrl,
          customMessage,
          senderName: senderName || organization.name
        })

        const { error: emailError } = await resend.emails.send({
          from: senderEmail || `Digital Lab <noreply@${process.env.RESEND_DOMAIN || 'bakehouse-news.com'}>`,
          to: [email],
          subject: `Digital Lab Survey: ${survey.title}`,
          html: emailHtml
        })

        if (emailError) {
          results.failed++
          results.errors.push(`Failed to send email to ${email}: ${emailError.message}`)
        } else {
          results.successful++
        }

      } catch (error) {
        results.failed++
        results.errors.push(`Error processing ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Log the bulk distribution
    await supabaseAdmin
      .from('survey_distributions')
      .insert({
        survey_id: surveyId,
        organization_id: organizationId,
        distributed_by: userId,
        email_count: emailList.length,
        successful_count: results.successful,
        failed_count: results.failed,
        metadata: {
          custom_message: customMessage,
          sender_name: senderName,
          sender_email: senderEmail
        }
      })

    return NextResponse.json({
      success: true,
      results,
      message: `Successfully sent ${results.successful} out of ${emailList.length} survey invitations`
    })

  } catch (error) {
    console.error('Bulk distribution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateSurveyEmailHTML({
  surveyTitle,
  surveyDescription,
  organizationName,
  surveyUrl,
  customMessage,
  senderName
}: {
  surveyTitle: string
  surveyDescription: string
  organizationName: string
  surveyUrl: string
  customMessage?: string
  senderName: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Digital Lab Survey Invitation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .survey-card { background: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #667eea; }
        .survey-title { font-size: 20px; font-weight: 600; color: #1a202c; margin: 0 0 8px 0; }
        .survey-description { color: #4a5568; margin: 0 0 16px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 16px 0; }
        .cta-button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        .custom-message { background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .custom-message h3 { color: #234e52; margin: 0 0 8px 0; font-size: 16px; }
        .custom-message p { color: #2d3748; margin: 0; }
        .footer { background: #f7fafc; padding: 30px; text-align: center; color: #718096; font-size: 14px; }
        .footer a { color: #667eea; text-decoration: none; }
        .security-note { background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 16px; margin: 24px 0; }
        .security-note p { color: #742a2a; margin: 0; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Digital Lab Survey</h1>
          <p>Help shape the future of digital innovation at ${organizationName}</p>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          
          <p>You're invited to participate in our Digital Lab survey to help us understand your needs and improve our digital tools and services.</p>
          
          ${customMessage ? `
            <div class="custom-message">
              <h3>Personal Message</h3>
              <p>${customMessage}</p>
            </div>
          ` : ''}
          
          <div class="survey-card">
            <h2 class="survey-title">${surveyTitle}</h2>
            <p class="survey-description">${surveyDescription}</p>
            <a href="${surveyUrl}" class="cta-button">Take Survey Now</a>
          </div>
          
          <div class="security-note">
            <p><strong>🔒 Secure Access:</strong> This link is personalized for you and will expire in 30 days. Please don't share it with others.</p>
          </div>
          
          <p>Your feedback is invaluable in helping us create a better Digital Lab experience for our community.</p>
          
          <p>Best regards,<br>
          <strong>${senderName}</strong><br>
          Digital Lab Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by the Digital Lab team at ${organizationName}</p>
          <p>If you have any questions, please contact us at <a href="mailto:digital-lab@${organizationName.toLowerCase().replace(/\s+/g, '-')}.com">digital-lab@${organizationName.toLowerCase().replace(/\s+/g, '-')}.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}
