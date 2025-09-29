import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  department?: string;
  metadata?: Record<string, any>;
}

export interface EmailContext {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  language: 'en' | 'es';
  branding?: {
    primaryColor: string;
    logoUrl?: string;
    websiteUrl?: string;
    supportEmail?: string;
  };
}

export interface EmailOptions {
  template: string;
  recipients: EmailRecipient[];
  context: EmailContext;
  priority?: 'low' | 'normal' | 'high';
  scheduledAt?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipient: string;
  template: string;
  organizationId: string;
}

export interface BulkEmailResult {
  success: boolean;
  results: EmailResult[];
  stats: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
}

/**
 * Multi-tenant Email Service
 * Handles email sending for all organizations with proper branding and analytics
 */
export class EmailService {
  private resend: Resend;
  private analyticsEnabled: boolean;

  constructor() {
    this.resend = resend;
    this.analyticsEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Send a single email with organization context
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    const startTime = Date.now();
    
    try {
      // Get organization branding
      const branding = await this.getOrganizationBranding(options.context.organizationId);
      
      // Generate email template
      const template = await this.generateEmailTemplate(
        options.template,
        options.recipients[0],
        { ...options.context, branding }
      );

      // Send email via Resend
      const result = await this.resend.emails.send({
        from: this.getFromEmail(options.context),
        to: [options.recipients[0].email],
        subject: template.subject,
        html: template.html,
        text: template.text,
        tags: [
          { name: 'organization', value: options.context.organizationSlug },
          { name: 'template', value: options.template },
          { name: 'language', value: options.context.language },
          ...(options.tags || []).map(tag => ({ name: 'custom', value: tag }))
        ],
        headers: {
          'X-Organization-ID': options.context.organizationId,
          'X-Template': options.template,
          'X-Language': options.context.language
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const emailResult: EmailResult = {
        success: true,
        messageId: result.data?.id,
        recipient: options.recipients[0].email,
        template: options.template,
        organizationId: options.context.organizationId
      };

      // Track analytics
      await this.trackEmailEvent('email_sent', {
        ...emailResult,
        duration: Date.now() - startTime,
        metadata: options.metadata
      });

      return emailResult;

    } catch (error) {
      const emailResult: EmailResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        recipient: options.recipients[0].email,
        template: options.template,
        organizationId: options.context.organizationId
      };

      // Track error
      await this.trackEmailEvent('email_failed', {
        ...emailResult,
        duration: Date.now() - startTime,
        metadata: options.metadata
      });

      return emailResult;
    }
  }

  /**
   * Send bulk emails with rate limiting and error handling
   */
  async sendBulkEmails(options: EmailOptions): Promise<BulkEmailResult> {
    const results: EmailResult[] = [];
    const batchSize = 10; // Process in batches to avoid rate limits
    const delay = 100; // 100ms delay between batches

    for (let i = 0; i < options.recipients.length; i += batchSize) {
      const batch = options.recipients.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchPromises = batch.map(recipient => 
        this.sendEmail({
          ...options,
          recipients: [recipient]
        })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches (except for the last batch)
      if (i + batchSize < options.recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: successful > 0,
      results,
      stats: {
        total: results.length,
        successful,
        failed,
        successRate: results.length > 0 ? (successful / results.length) * 100 : 0
      }
    };
  }

  /**
   * Get organization branding and configuration
   */
  private async getOrganizationBranding(organizationId: string) {
    try {
      const supabaseAdmin = getSupabaseAdmin()
      const { data: org, error } = await supabaseAdmin
        .from('organizations')
        .select('name, slug, primary_color, logo_url, website_url, support_email')
        .eq('id', organizationId)
        .single();

      if (error || !org) {
        return this.getDefaultBranding();
      }

      return {
        primaryColor: org.primary_color || '#2563eb',
        logoUrl: org.logo_url,
        websiteUrl: org.website_url,
        supportEmail: org.support_email || 'support@infra24.com',
        organizationName: org.name,
        organizationSlug: org.slug
      };
    } catch (error) {
      console.error('Error fetching organization branding:', error);
      return this.getDefaultBranding();
    }
  }

  /**
   * Get default branding for fallback
   */
  private getDefaultBranding() {
    return {
      primaryColor: '#2563eb',
      logoUrl: undefined,
      websiteUrl: 'https://infra24.com',
      supportEmail: 'support@infra24.com',
      organizationName: 'Infra24',
      organizationSlug: 'infra24'
    };
  }

  /**
   * Generate email template based on template type and context
   */
  private async generateEmailTemplate(
    templateType: string,
    recipient: EmailRecipient,
    context: EmailContext & { branding: any }
  ): Promise<EmailTemplate> {
    const templateGenerators = {
      'survey_invitation': () => this.generateSurveyInvitationTemplate(recipient, context),
      'survey_reminder': () => this.generateSurveyReminderTemplate(recipient, context),
      'survey_completion': () => this.generateSurveyCompletionTemplate(recipient, context),
      'welcome': () => this.generateWelcomeTemplate(recipient, context),
      'onboarding': () => this.generateOnboardingTemplate(recipient, context),
      'workshop_invitation': () => this.generateWorkshopInvitationTemplate(recipient, context),
      'announcement': () => this.generateAnnouncementTemplate(recipient, context),
      'magic_link': () => this.generateMagicLinkTemplate(recipient, context)
    };

    const generator = templateGenerators[templateType as keyof typeof templateGenerators];
    if (!generator) {
      throw new Error(`Unknown email template: ${templateType}`);
    }

    return await generator();
  }

  /**
   * Generate survey invitation email template
   */
  private async generateSurveyInvitationTemplate(
    recipient: EmailRecipient,
    context: EmailContext & { branding: any; metadata?: Record<string, any> }
  ): Promise<EmailTemplate> {
    const { branding, language } = context;
    const isSpanish = language === 'es';
    
    const greeting = recipient.firstName 
      ? (isSpanish ? `Hola ${recipient.firstName},` : `Hi ${recipient.firstName},`)
      : (isSpanish ? 'Hola,' : 'Hi there,');

    const subject = isSpanish 
      ? `[${branding.organizationName}] Encuesta: ${context.metadata?.surveyTitle || 'Nueva Encuesta'}`
      : `[${branding.organizationName}] Survey: ${context.metadata?.surveyTitle || 'New Survey'}`;

    const magicLinkUrl = context.metadata?.magicLinkUrl;
    const estimatedTime = context.metadata?.estimatedTime || '10-15 minutes';

    const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: ${branding.primaryColor};
            margin-bottom: 10px;
        }
        .survey-title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${this.darkenColor(branding.primaryColor, 20)} 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 18px;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            transition: all 0.2s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        .benefits {
            background: #f0f9ff;
            border-left: 4px solid ${branding.primaryColor};
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .benefits h3 {
            margin-top: 0;
            color: ${branding.primaryColor};
            font-size: 18px;
        }
        .benefits ul {
            margin: 0;
            padding-left: 20px;
        }
        .benefits li {
            margin-bottom: 8px;
            color: ${branding.primaryColor};
        }
        .time-estimate {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .time-estimate strong {
            color: #92400e;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .privacy-note {
            background: #f9fafb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .mobile-friendly {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .mobile-friendly strong {
            color: #047857;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .survey-title {
                font-size: 24px;
            }
            .cta-button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${branding.organizationName}</div>
        </div>
        
        <h1 class="survey-title">${context.metadata?.surveyTitle || (isSpanish ? 'Nueva Encuesta' : 'New Survey')}</h1>
        
        <p>${greeting}</p>
        
        <p>${isSpanish 
          ? 'Tu opinión es invaluable para ayudarnos a mejorar nuestros programas y servicios.' 
          : 'Your input is invaluable in helping us improve our programs and services.'}</p>
        
        ${context.metadata?.surveyDescription ? `<p>${context.metadata.surveyDescription}</p>` : ''}
        
        <div class="benefits">
            <h3>${isSpanish ? '¿Por qué participar?' : 'Why participate?'}</h3>
            <ul>
                <li>${isSpanish ? 'Ayuda a dar forma al futuro de nuestros programas' : 'Help shape the future of our programs'}</li>
                <li>${isSpanish ? 'Tus respuestas son completamente confidenciales' : 'Your responses are completely confidential'}</li>
                <li>${isSpanish ? 'Impacto directo en mejoras que te beneficiarán' : 'Direct impact on improvements that will benefit you'}</li>
                <li>${isSpanish ? 'Acceso prioritario a nuevos recursos y talleres' : 'Priority access to new resources and workshops'}</li>
            </ul>
        </div>
        
        <div class="time-estimate">
            <strong>${isSpanish ? '⏱️ Tiempo estimado:' : '⏱️ Estimated time:'} ${estimatedTime}</strong>
        </div>
        
        <div class="mobile-friendly">
            <strong>📱 ${isSpanish ? 'Compatible con móviles' : 'Mobile-friendly'}</strong><br>
            ${isSpanish 
              ? 'Puedes completar esta encuesta desde tu teléfono, tablet o computadora.' 
              : 'You can complete this survey from your phone, tablet, or computer.'}
        </div>
        
        <div style="text-align: center;">
            <a href="${magicLinkUrl}" class="cta-button">
                ${isSpanish ? '🚀 Comenzar Encuesta' : '🚀 Start Survey'}
            </a>
        </div>
        
        <div class="privacy-note">
            <strong>${isSpanish ? '🔒 Privacidad y Seguridad:' : '🔒 Privacy & Security:'}</strong><br>
            ${isSpanish 
              ? 'Tus respuestas son anónimas y seguras. No compartimos información personal con terceros.' 
              : 'Your responses are anonymous and secure. We do not share personal information with third parties.'}
        </div>
        
        <p>${isSpanish 
          ? 'Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.' 
          : 'If you have any questions or need assistance, please don\'t hesitate to reach out.'}</p>
        
        <div class="footer">
            <p>${isSpanish 
              ? 'Este enlace es personal y seguro. No lo compartas con otros.' 
              : 'This link is personal and secure. Please do not share it with others.'}</p>
            <p>${isSpanish 
              ? 'Gracias por ser parte de nuestra comunidad.' 
              : 'Thank you for being part of our community.'}</p>
            <p><strong>${branding.organizationName}</strong></p>
        </div>
    </div>
</body>
</html>`;

    const text = `
${greeting}

${isSpanish 
  ? 'Tu opinión es invaluable para ayudarnos a mejorar nuestros programas y servicios.' 
  : 'Your input is invaluable in helping us improve our programs and services.'}

${context.metadata?.surveyDescription ? `${context.metadata.surveyDescription}\n\n` : ''}

${isSpanish ? '¿Por qué participar?' : 'Why participate?'}
• ${isSpanish ? 'Ayuda a dar forma al futuro de nuestros programas' : 'Help shape the future of our programs'}
• ${isSpanish ? 'Tus respuestas son completamente confidenciales' : 'Your responses are completely confidential'}
• ${isSpanish ? 'Impacto directo en mejoras que te beneficiarán' : 'Direct impact on improvements that will benefit you'}
• ${isSpanish ? 'Acceso prioritario a nuevos recursos y talleres' : 'Priority access to new resources and workshops'}

⏱️ ${isSpanish ? 'Tiempo estimado:' : 'Estimated time:'} ${estimatedTime}
📱 ${isSpanish ? 'Compatible con móviles' : 'Mobile-friendly'}

${isSpanish ? '🚀 Comenzar Encuesta:' : '🚀 Start Survey:'} ${magicLinkUrl}

🔒 ${isSpanish ? 'Privacidad y Seguridad:' : 'Privacy & Security:'}
${isSpanish 
  ? 'Tus respuestas son anónimas y seguras. No compartimos información personal con terceros.' 
  : 'Your responses are anonymous and secure. We do not share personal information with third parties.'}

${isSpanish 
  ? 'Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.' 
  : 'If you have any questions or need assistance, please don\'t hesitate to reach out.'}

${isSpanish 
  ? 'Este enlace es personal y seguro. No lo compartas con otros.' 
  : 'This link is personal and secure. Please do not share it with others.'}

${isSpanish 
  ? 'Gracias por ser parte de nuestra comunidad.' 
  : 'Thank you for being part of our community.'}

${branding.organizationName}
`;

    return { subject, html, text };
  }

  /**
   * Generate other email templates (placeholder implementations)
   */
  private async generateSurveyReminderTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any; metadata?: Record<string, any> }): Promise<EmailTemplate> {
    // Implementation for survey reminder template
    return this.generateSurveyInvitationTemplate(recipient, { ...context, metadata: { ...context.metadata, isReminder: true } });
  }

  private async generateSurveyCompletionTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any }): Promise<EmailTemplate> {
    // Implementation for survey completion template
    return { subject: 'Survey Completed', html: '<p>Thank you for completing the survey!</p>', text: 'Thank you for completing the survey!' };
  }

  private async generateWelcomeTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any }): Promise<EmailTemplate> {
    // Implementation for welcome template
    return { subject: 'Welcome!', html: '<p>Welcome to our platform!</p>', text: 'Welcome to our platform!' };
  }

  private async generateOnboardingTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any }): Promise<EmailTemplate> {
    // Implementation for onboarding template
    return { subject: 'Get Started', html: '<p>Let\'s get you started!</p>', text: 'Let\'s get you started!' };
  }

  private async generateWorkshopInvitationTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any }): Promise<EmailTemplate> {
    // Implementation for workshop invitation template
    return { subject: 'Workshop Invitation', html: '<p>You\'re invited to a workshop!</p>', text: 'You\'re invited to a workshop!' };
  }

  private async generateAnnouncementTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any }): Promise<EmailTemplate> {
    // Implementation for announcement template
    return { subject: 'Important Announcement', html: '<p>Important announcement!</p>', text: 'Important announcement!' };
  }

  private async generateMagicLinkTemplate(recipient: EmailRecipient, context: EmailContext & { branding: any }): Promise<EmailTemplate> {
    // Implementation for magic link template
    return { subject: 'Your Secure Link', html: '<p>Here\'s your secure link!</p>', text: 'Here\'s your secure link!' };
  }

  /**
   * Get from email address based on organization context
   */
  private getFromEmail(context: EmailContext): string {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@infra24.com';
    
    // For now, use the default from email
    // In the future, this could be organization-specific
    return fromEmail;
  }

  /**
   * Darken a color by a percentage
   */
  private darkenColor(color: string, percent: number): string {
    // Simple color darkening implementation
    // In a real implementation, you'd want a proper color manipulation library
    return color;
  }

  /**
   * Track email events for analytics
   */
  private async trackEmailEvent(eventType: string, data: any) {
    if (!this.analyticsEnabled) return;

    try {
      // Store in database for analytics
      const supabaseAdmin = getSupabaseAdmin()
      await supabaseAdmin
        .from('email_analytics')
        .insert({
          event_type: eventType,
          organization_id: data.organizationId,
          template: data.template,
          recipient: data.recipient,
          message_id: data.messageId,
          success: data.success,
          error_message: data.error,
          duration_ms: data.duration,
          metadata: data.metadata,
          timestamp: new Date().toISOString()
        });

      // Track in PostHog if available
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture(eventType, {
          organization_id: data.organizationId,
          template: data.template,
          recipient: data.recipient,
          success: data.success,
          duration_ms: data.duration,
          ...data.metadata
        });
      }
    } catch (error) {
      console.error('Error tracking email event:', error);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

