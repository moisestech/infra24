import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { emailService, EmailRecipient, EmailContext } from '@/lib/email/EmailService';
import { EmailAnalytics } from '@/lib/email/EmailAnalytics';
import { EmailMonitoring } from '@/lib/email/EmailMonitoring';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      recipients, 
      language = 'en',
      sendIndividually = false 
    } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ 
        error: 'Recipients array is required' 
      }, { status: 400 });
    }

    // Get survey details
    const { data: survey, error: surveyError } = await supabaseAdmin
      .from('surveys')
      .select(`
        *,
        survey_templates (
          name,
          category,
          template_schema
        ),
        organizations (
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (surveyError || !survey) {
      return NextResponse.json({ 
        error: 'Survey not found' 
      }, { status: 404 });
    }

    // Check if user has permission to send invitations for this survey
    const { data: membership } = await supabaseAdmin
      .from('org_memberships')
      .select('role')
      .eq('org_id', survey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager', 'super_admin'].includes(membership.role)) {
      return NextResponse.json({ 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }

    // Generate magic links and prepare email recipients
    const emailRecipients: EmailRecipient[] = [];
    const magicLinks = [];

    for (const recipient of recipients) {
      const { email, firstName, lastName, role, department } = recipient;
      
      if (!email) {
        console.warn('Skipping recipient without email:', recipient);
        continue;
      }

      // Generate magic link
      const { data: magicLink, error: magicLinkError } = await supabaseAdmin
        .from('magic_links')
        .insert({
          token: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          survey_id: id,
          organization_id: survey.organization_id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          metadata: {
            firstName: firstName || '',
            lastName: lastName || '',
            role: role || '',
            department: department || '',
            language: language
          }
        })
        .select()
        .single();

      if (magicLinkError || !magicLink) {
        console.error('Failed to create magic link for', email, magicLinkError);
        continue;
      }

      magicLinks.push(magicLink);

      // Create email recipient data
      const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/survey/${id}?token=${magicLink.token}`;
      
      emailRecipients.push({
        email,
        name: firstName ? `${firstName} ${lastName || ''}`.trim() : undefined,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || '',
        department: department || '',
        metadata: {
          magicLinkUrl,
          magicLinkToken: magicLink.token,
          language
        }
      });
    }

    if (emailRecipients.length === 0) {
      return NextResponse.json({ 
        error: 'No valid recipients could be created' 
      }, { status: 400 });
    }

    // Prepare email context
    const surveyTitle = survey.survey_templates?.name || survey.title;
    const organizationName = survey.organizations?.name || 'Our Organization';
    const organizationSlug = survey.organizations?.slug || 'unknown';
    
    // Estimate time based on survey complexity
    const estimatedTime = survey.survey_templates?.template_schema?.sections?.length 
      ? `${survey.survey_templates.template_schema.sections.length * 2}-${survey.survey_templates.template_schema.sections.length * 4} minutes`
      : '10-15 minutes';

    const emailContext: EmailContext = {
      organizationId: survey.organization_id,
      organizationName,
      organizationSlug,
      language: language as 'en' | 'es'
    };

    // Send emails using the new email service
    const emailResults = await emailService.sendBulkEmails({
      template: 'survey_invitation',
      recipients: emailRecipients,
      context: emailContext,
      priority: 'normal',
      tags: ['survey', 'invitation', organizationSlug],
      metadata: {
        surveyId: id,
        sentBy: userId,
        language
      }
    });

    // Log the invitation sending
    const { data: logEntry } = await supabaseAdmin
      .from('survey_invitations')
      .insert({
        survey_id: id,
        sent_by: userId,
        recipient_count: emailRecipients.length,
        language: language,
        email_results: emailResults.results,
        metadata: {
          sendIndividually,
          recipients: recipients.map(r => ({ email: r.email, name: `${r.firstName || ''} ${r.lastName || ''}`.trim() }))
        }
      })
      .select()
      .single();

    // Track magic link generation
    for (const magicLink of magicLinks) {
      await supabaseAdmin
        .from('magic_link_analytics')
        .insert({
          token: magicLink.token,
          action: 'generated',
          user_agent: 'survey-invitation-system',
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
        });
    }

    // Track email analytics for each successful send
    for (const result of emailResults.results) {
      if (result.success && result.messageId) {
        await EmailAnalytics.trackEmailSent({
          messageId: result.messageId,
          recipient: result.recipient,
          template: result.template,
          organizationId: result.organizationId,
          metadata: {
            surveyId: id,
            sentBy: userId,
            language
          }
        });
      } else if (!result.success) {
        await EmailAnalytics.trackEmailFailed({
          recipient: result.recipient,
          organizationId: result.organizationId,
          reason: result.error || 'Unknown error',
          metadata: {
            surveyId: id,
            sentBy: userId,
            language
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Survey invitations sent successfully`,
      stats: {
        total: emailRecipients.length,
        successful: emailResults.stats.successful,
        failed: emailResults.stats.failed,
        successRate: emailResults.stats.successRate,
        magicLinksGenerated: magicLinks.length
      },
      results: emailResults.results,
      logEntryId: logEntry?.id
    });

  } catch (error) {
    console.error('Error sending survey invitations:', error);
    return NextResponse.json({ 
      error: 'Failed to send survey invitations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get survey details
    const { data: survey, error: surveyError } = await supabaseAdmin
      .from('surveys')
      .select(`
        *,
        organizations (
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (surveyError || !survey) {
      return NextResponse.json({ 
        error: 'Survey not found' 
      }, { status: 404 });
    }

    // Check permissions
    const { data: membership } = await supabaseAdmin
      .from('org_memberships')
      .select('role')
      .eq('org_id', survey.organization_id)
      .eq('user_id', userId)
      .single();

    if (!membership || !['admin', 'manager', 'super_admin'].includes(membership.role)) {
      return NextResponse.json({ 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }

    // Get invitation history
    const { data: invitations, error: invitationsError } = await supabaseAdmin
      .from('survey_invitations')
      .select('*')
      .eq('survey_id', id)
      .order('created_at', { ascending: false });

    if (invitationsError) {
      return NextResponse.json({ 
        error: 'Failed to fetch invitation history' 
      }, { status: 500 });
    }

    // Get magic link analytics
    const { data: magicLinks, error: magicLinksError } = await supabaseAdmin
      .from('magic_links')
      .select(`
        *,
        magic_link_analytics (
          action,
          timestamp
        )
      `)
      .eq('survey_id', id)
      .order('created_at', { ascending: false });

    if (magicLinksError) {
      console.error('Failed to fetch magic links:', magicLinksError);
    }

    return NextResponse.json({
      survey: {
        id: survey.id,
        title: survey.title,
        organization: survey.organizations
      },
      invitations: invitations || [],
      magicLinks: magicLinks || [],
      stats: {
        totalInvitations: invitations?.length || 0,
        totalMagicLinks: magicLinks?.length || 0,
        openedLinks: magicLinks?.filter(ml => 
          ml.magic_link_analytics?.some((analytics: any) => analytics.action === 'opened')
        ).length || 0,
        startedSurveys: magicLinks?.filter(ml => 
          ml.magic_link_analytics?.some((analytics: any) => analytics.action === 'started')
        ).length || 0,
        completedSurveys: magicLinks?.filter(ml => 
          ml.magic_link_analytics?.some((analytics: any) => analytics.action === 'completed')
        ).length || 0
      }
    });

  } catch (error) {
    console.error('Error fetching survey invitations:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch survey invitations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
