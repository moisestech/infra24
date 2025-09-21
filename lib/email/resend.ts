import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SurveyInvitationEmailData {
  to: string;
  surveyTitle: string;
  organizationName: string;
  magicLinkUrl: string;
  estimatedTime: string;
  language: 'en' | 'es';
  recipientName?: string;
  recipientRole?: string;
  surveyDescription?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate email templates for survey invitations
 */
export function generateSurveyInvitationEmail(data: SurveyInvitationEmailData): EmailTemplate {
  const { 
    surveyTitle, 
    organizationName, 
    magicLinkUrl, 
    estimatedTime, 
    language, 
    recipientName,
    recipientRole,
    surveyDescription 
  } = data;

  const isSpanish = language === 'es';
  
  // Personalization
  const greeting = recipientName 
    ? (isSpanish ? `Hola ${recipientName},` : `Hi ${recipientName},`)
    : (isSpanish ? 'Hola,' : 'Hi there,');

  const roleContext = recipientRole 
    ? (isSpanish 
        ? `Como ${recipientRole} en ${organizationName},` 
        : `As a ${recipientRole} at ${organizationName},`)
    : (isSpanish 
        ? `Como miembro de ${organizationName},` 
        : `As a member of ${organizationName},`);

  const subject = isSpanish 
    ? `[${organizationName}] Encuesta: ${surveyTitle}`
    : `[${organizationName}] Survey: ${surveyTitle}`;

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
            color: #2563eb;
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
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .benefits h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 18px;
        }
        .benefits ul {
            margin: 0;
            padding-left: 20px;
        }
        .benefits li {
            margin-bottom: 8px;
            color: #1e40af;
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
            <div class="logo">${organizationName}</div>
        </div>
        
        <h1 class="survey-title">${surveyTitle}</h1>
        
        <p>${greeting}</p>
        
        <p>${roleContext} ${isSpanish 
          ? 'tu opinión es invaluable para ayudarnos a mejorar nuestros programas y servicios.' 
          : 'your input is invaluable in helping us improve our programs and services.'}</p>
        
        ${surveyDescription ? `<p>${surveyDescription}</p>` : ''}
        
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
            <p><strong>${organizationName}</strong></p>
        </div>
    </div>
</body>
</html>`;

  const text = `
${greeting}

${roleContext} ${isSpanish 
  ? 'tu opinión es invaluable para ayudarnos a mejorar nuestros programas y servicios.' 
  : 'your input is invaluable in helping us improve our programs and services.'}

${surveyDescription ? `${surveyDescription}\n\n` : ''}

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

${organizationName}
`;

  return { subject, html, text };
}

/**
 * Send survey invitation email via Resend
 */
export async function sendSurveyInvitationEmail(data: SurveyInvitationEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = generateSurveyInvitationEmail(data);
    
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'surveys@infra24.com',
      to: [data.to],
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'survey_invitation' },
        { name: 'organization', value: data.organizationName },
        { name: 'survey', value: data.surveyTitle },
        { name: 'language', value: data.language }
      ]
    });

    if (result.error) {
      console.error('Resend email error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Survey invitation email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('Failed to send survey invitation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send bulk survey invitations
 */
export async function sendBulkSurveyInvitations(
  invitations: SurveyInvitationEmailData[]
): Promise<{ success: boolean; results: Array<{ email: string; success: boolean; messageId?: string; error?: string }> }> {
  const results = [];
  
  for (const invitation of invitations) {
    const result = await sendSurveyInvitationEmail(invitation);
    results.push({
      email: invitation.to,
      success: result.success,
      messageId: result.messageId,
      error: result.error
    });
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`Bulk email sending completed: ${successCount}/${totalCount} successful`);
  
  return {
    success: successCount > 0,
    results
  };
}

/**
 * Send reminder email for incomplete surveys
 */
export async function sendSurveyReminderEmail(
  data: SurveyInvitationEmailData & { daysRemaining: number }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const reminderData = {
    ...data,
    surveyTitle: `${data.surveyTitle} - ${data.language === 'es' ? 'Recordatorio' : 'Reminder'}`,
    estimatedTime: data.estimatedTime,
    language: data.language
  };
  
  // Modify the template for reminder
  const template = generateSurveyInvitationEmail(reminderData);
  const reminderSubject = data.language === 'es' 
    ? `[Recordatorio] ${template.subject}`
    : `[Reminder] ${template.subject}`;
  
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'surveys@infra24.com',
      to: [data.to],
      subject: reminderSubject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'survey_reminder' },
        { name: 'organization', value: data.organizationName },
        { name: 'survey', value: data.surveyTitle },
        { name: 'language', value: data.language },
        { name: 'days_remaining', value: data.daysRemaining.toString() }
      ]
    });

    if (result.error) {
      console.error('Resend reminder email error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Survey reminder email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('Failed to send survey reminder email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

