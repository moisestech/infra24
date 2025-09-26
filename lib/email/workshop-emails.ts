import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface WorkshopRegistrationEmailData {
  to: string;
  workshopTitle: string;
  organizationName: string;
  participantName?: string;
  workshopDate?: string;
  workshopTime?: string;
  workshopLocation?: string;
  instructorName?: string;
  workshopDescription?: string;
  maxParticipants: number;
  currentParticipants: number;
  language: 'en' | 'es';
  registrationId: string;
  workshopId: string;
  organizationSlug: string;
}

export interface WorkshopCancellationEmailData {
  to: string;
  workshopTitle: string;
  organizationName: string;
  participantName?: string;
  workshopDate?: string;
  workshopTime?: string;
  language: 'en' | 'es';
  cancellationReason?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate workshop registration confirmation email
 */
export function generateWorkshopRegistrationEmail(data: WorkshopRegistrationEmailData): EmailTemplate {
  const { 
    workshopTitle, 
    organizationName, 
    participantName,
    workshopDate,
    workshopTime,
    workshopLocation,
    instructorName,
    workshopDescription,
    maxParticipants,
    currentParticipants,
    language,
    registrationId,
    organizationSlug
  } = data;

  const isSpanish = language === 'es';
  
  // Personalization
  const greeting = participantName 
    ? (isSpanish ? `Hola ${participantName},` : `Hi ${participantName},`)
    : (isSpanish ? 'Hola,' : 'Hi there,');

  const subject = isSpanish 
    ? `[${organizationName}] Confirmación de Registro: ${workshopTitle}`
    : `[${organizationName}] Registration Confirmed: ${workshopTitle}`;

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
        .workshop-title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        .success-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            margin-bottom: 30px;
        }
        .workshop-details {
            background: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .workshop-details h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 18px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e0f2fe;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #1e40af;
        }
        .detail-value {
            color: #1f2937;
        }
        .capacity-info {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .capacity-info strong {
            color: #92400e;
        }
        .next-steps {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
        }
        .next-steps h3 {
            margin-top: 0;
            color: #047857;
            font-size: 18px;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 8px;
            color: #047857;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .contact-info {
            background: #f9fafb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #6b7280;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .workshop-title {
                font-size: 24px;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                margin-bottom: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${organizationName}</div>
            <div class="success-badge">
                ${isSpanish ? '✅ Registro Confirmado' : '✅ Registration Confirmed'}
            </div>
        </div>
        
        <h1 class="workshop-title">${workshopTitle}</h1>
        
        <p>${greeting}</p>
        
        <p>${isSpanish 
          ? '¡Excelente! Tu registro para el taller ha sido confirmado exitosamente.' 
          : 'Great news! Your workshop registration has been successfully confirmed.'}</p>
        
        ${workshopDescription ? `<p>${workshopDescription}</p>` : ''}
        
        <div class="workshop-details">
            <h3>${isSpanish ? '📋 Detalles del Taller' : '📋 Workshop Details'}</h3>
            ${workshopDate ? `
            <div class="detail-row">
                <span class="detail-label">${isSpanish ? '📅 Fecha:' : '📅 Date:'}</span>
                <span class="detail-value">${workshopDate}</span>
            </div>
            ` : ''}
            ${workshopTime ? `
            <div class="detail-row">
                <span class="detail-label">⏰ Hora:</span>
                <span class="detail-value">${workshopTime}</span>
            </div>
            ` : ''}
            ${workshopLocation ? `
            <div class="detail-row">
                <span class="detail-label">📍 Ubicación:</span>
                <span class="detail-value">${workshopLocation}</span>
            </div>
            ` : ''}
            ${instructorName ? `
            <div class="detail-row">
                <span class="detail-label">👨‍🏫 Instructor:</span>
                <span class="detail-value">${instructorName}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span class="detail-label">🆔 ID de Registro:</span>
                <span class="detail-value">${registrationId}</span>
            </div>
        </div>
        
        <div class="capacity-info">
            <strong>👥 ${isSpanish ? 'Capacidad:' : 'Capacity:'} ${currentParticipants}/${maxParticipants} ${isSpanish ? 'participantes' : 'participants'}</strong>
        </div>
        
        <div class="next-steps">
            <h3>${isSpanish ? '🚀 Próximos Pasos' : '🚀 Next Steps'}</h3>
            <ul>
                <li>${isSpanish ? 'Recibirás un recordatorio 24 horas antes del taller' : 'You\'ll receive a reminder 24 hours before the workshop'}</li>
                <li>${isSpanish ? 'Llega 10 minutos antes para el registro' : 'Arrive 10 minutes early for check-in'}</li>
                <li>${isSpanish ? 'Trae tu identificación y cualquier material requerido' : 'Bring your ID and any required materials'}</li>
                <li>${isSpanish ? 'Si no puedes asistir, cancela con al menos 24 horas de anticipación' : 'If you can\'t attend, cancel at least 24 hours in advance'}</li>
            </ul>
        </div>
        
        <div class="contact-info">
            <strong>${isSpanish ? '📞 ¿Necesitas ayuda?' : '📞 Need help?'}</strong><br>
            ${isSpanish 
              ? 'Si tienes preguntas sobre este taller o necesitas hacer cambios a tu registro, contáctanos.' 
              : 'If you have questions about this workshop or need to make changes to your registration, please contact us.'}
        </div>
        
        <div class="footer">
            <p>${isSpanish 
              ? 'Gracias por ser parte de nuestra comunidad de aprendizaje.' 
              : 'Thank you for being part of our learning community.'}</p>
            <p><strong>${organizationName}</strong></p>
            <p>${isSpanish 
              ? 'Este es un correo automático, por favor no respondas directamente.' 
              : 'This is an automated email, please do not reply directly.'}</p>
        </div>
    </div>
</body>
</html>`;

  const text = `
${greeting}

${isSpanish 
  ? '¡Excelente! Tu registro para el taller ha sido confirmado exitosamente.' 
  : 'Great news! Your workshop registration has been successfully confirmed.'}

${workshopDescription ? `${workshopDescription}\n\n` : ''}

${isSpanish ? '📋 Detalles del Taller:' : '📋 Workshop Details:'}
${workshopDate ? `${isSpanish ? '📅 Fecha:' : '📅 Date:'} ${workshopDate}` : ''}
${workshopTime ? `${isSpanish ? '⏰ Hora:' : '⏰ Time:'} ${workshopTime}` : ''}
${workshopLocation ? `${isSpanish ? '📍 Ubicación:' : '📍 Location:'} ${workshopLocation}` : ''}
${instructorName ? `${isSpanish ? '👨‍🏫 Instructor:' : '👨‍🏫 Instructor:'} ${instructorName}` : ''}
🆔 ${isSpanish ? 'ID de Registro:' : 'Registration ID:'} ${registrationId}

👥 ${isSpanish ? 'Capacidad:' : 'Capacity:'} ${currentParticipants}/${maxParticipants} ${isSpanish ? 'participantes' : 'participants'}

${isSpanish ? '🚀 Próximos Pasos:' : '🚀 Next Steps:'}
• ${isSpanish ? 'Recibirás un recordatorio 24 horas antes del taller' : 'You\'ll receive a reminder 24 hours before the workshop'}
• ${isSpanish ? 'Llega 10 minutos antes para el registro' : 'Arrive 10 minutes early for check-in'}
• ${isSpanish ? 'Trae tu identificación y cualquier material requerido' : 'Bring your ID and any required materials'}
• ${isSpanish ? 'Si no puedes asistir, cancela con al menos 24 horas de anticipación' : 'If you can\'t attend, cancel at least 24 hours in advance'}

${isSpanish ? '📞 ¿Necesitas ayuda?' : '📞 Need help?'}
${isSpanish 
  ? 'Si tienes preguntas sobre este taller o necesitas hacer cambios a tu registro, contáctanos.' 
  : 'If you have questions about this workshop or need to make changes to your registration, please contact us.'}

${isSpanish 
  ? 'Gracias por ser parte de nuestra comunidad de aprendizaje.' 
  : 'Thank you for being part of our learning community.'}

${organizationName}

${isSpanish 
  ? 'Este es un correo automático, por favor no respondas directamente.' 
  : 'This is an automated email, please do not reply directly.'}
`;

  return { subject, html, text };
}

/**
 * Send workshop registration confirmation email
 */
export async function sendWorkshopRegistrationEmail(data: WorkshopRegistrationEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = generateWorkshopRegistrationEmail(data);
    
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'workshops@infra24.com',
      to: [data.to],
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'workshop_registration' },
        { name: 'organization', value: data.organizationName },
        { name: 'workshop', value: data.workshopTitle },
        { name: 'language', value: data.language },
        { name: 'registration_id', value: data.registrationId }
      ]
    });

    if (result.error) {
      console.error('Resend workshop email error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Workshop registration email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('Failed to send workshop registration email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate workshop cancellation email
 */
export function generateWorkshopCancellationEmail(data: WorkshopCancellationEmailData): EmailTemplate {
  const { 
    workshopTitle, 
    organizationName, 
    participantName,
    workshopDate,
    workshopTime,
    language,
    cancellationReason
  } = data;

  const isSpanish = language === 'es';
  
  const greeting = participantName 
    ? (isSpanish ? `Hola ${participantName},` : `Hi ${participantName},`)
    : (isSpanish ? 'Hola,' : 'Hi there,');

  const subject = isSpanish 
    ? `[${organizationName}] Taller Cancelado: ${workshopTitle}`
    : `[${organizationName}] Workshop Cancelled: ${workshopTitle}`;

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
        .workshop-title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        .cancellation-badge {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            margin-bottom: 30px;
        }
        .workshop-details {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        .workshop-details h3 {
            margin-top: 0;
            color: #dc2626;
            font-size: 18px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #fecaca;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #dc2626;
        }
        .detail-value {
            color: #1f2937;
        }
        .next-steps {
            background: #f0f9ff;
            border: 1px solid #2563eb;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
        }
        .next-steps h3 {
            margin-top: 0;
            color: #1e40af;
            font-size: 18px;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 8px;
            color: #1e40af;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .contact-info {
            background: #f9fafb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${organizationName}</div>
            <div class="cancellation-badge">
                ${isSpanish ? '❌ Taller Cancelado' : '❌ Workshop Cancelled'}
            </div>
        </div>
        
        <h1 class="workshop-title">${workshopTitle}</h1>
        
        <p>${greeting}</p>
        
        <p>${isSpanish 
          ? 'Lamentamos informarte que el taller ha sido cancelado.' 
          : 'We regret to inform you that the workshop has been cancelled.'}</p>
        
        ${cancellationReason ? `<p><strong>${isSpanish ? 'Razón:' : 'Reason:'}</strong> ${cancellationReason}</p>` : ''}
        
        <div class="workshop-details">
            <h3>${isSpanish ? '📋 Detalles del Taller Cancelado' : '📋 Cancelled Workshop Details'}</h3>
            ${workshopDate ? `
            <div class="detail-row">
                <span class="detail-label">📅 Fecha:</span>
                <span class="detail-value">${workshopDate}</span>
            </div>
            ` : ''}
            ${workshopTime ? `
            <div class="detail-row">
                <span class="detail-label">⏰ Hora:</span>
                <span class="detail-value">${workshopTime}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="next-steps">
            <h3>${isSpanish ? '🔄 Próximos Pasos' : '🔄 Next Steps'}</h3>
            <ul>
                <li>${isSpanish ? 'Tu registro ha sido automáticamente cancelado' : 'Your registration has been automatically cancelled'}</li>
                <li>${isSpanish ? 'No se requiere ninguna acción de tu parte' : 'No action is required on your part'}</li>
                <li>${isSpanish ? 'Te notificaremos si se reprograma el taller' : 'We\'ll notify you if the workshop is rescheduled'}</li>
                <li>${isSpanish ? 'Explora otros talleres disponibles en nuestro catálogo' : 'Explore other available workshops in our catalog'}</li>
            </ul>
        </div>
        
        <div class="contact-info">
            <strong>${isSpanish ? '📞 ¿Preguntas?' : '📞 Questions?'}</strong><br>
            ${isSpanish 
              ? 'Si tienes preguntas sobre esta cancelación o necesitas ayuda, contáctanos.' 
              : 'If you have questions about this cancellation or need assistance, please contact us.'}
        </div>
        
        <div class="footer">
            <p>${isSpanish 
              ? 'Gracias por tu comprensión y por ser parte de nuestra comunidad.' 
              : 'Thank you for your understanding and for being part of our community.'}</p>
            <p><strong>${organizationName}</strong></p>
        </div>
    </div>
</body>
</html>`;

  const text = `
${greeting}

${isSpanish 
  ? 'Lamentamos informarte que el taller ha sido cancelado.' 
  : 'We regret to inform you that the workshop has been cancelled.'}

${cancellationReason ? `${isSpanish ? 'Razón:' : 'Reason:'} ${cancellationReason}\n\n` : ''}

${isSpanish ? '📋 Detalles del Taller Cancelado:' : '📋 Cancelled Workshop Details:'}
${workshopDate ? `${isSpanish ? '📅 Fecha:' : '📅 Date:'} ${workshopDate}` : ''}
${workshopTime ? `${isSpanish ? '⏰ Hora:' : '⏰ Time:'} ${workshopTime}` : ''}

${isSpanish ? '🔄 Próximos Pasos:' : '🔄 Next Steps:'}
• ${isSpanish ? 'Tu registro ha sido automáticamente cancelado' : 'Your registration has been automatically cancelled'}
• ${isSpanish ? 'No se requiere ninguna acción de tu parte' : 'No action is required on your part'}
• ${isSpanish ? 'Te notificaremos si se reprograma el taller' : 'We\'ll notify you if the workshop is rescheduled'}
• ${isSpanish ? 'Explora otros talleres disponibles en nuestro catálogo' : 'Explore other available workshops in our catalog'}

${isSpanish ? '📞 ¿Preguntas?' : '📞 Questions?'}
${isSpanish 
  ? 'Si tienes preguntas sobre esta cancelación o necesitas ayuda, contáctanos.' 
  : 'If you have questions about this cancellation or need assistance, please contact us.'}

${isSpanish 
  ? 'Gracias por tu comprensión y por ser parte de nuestra comunidad.' 
  : 'Thank you for your understanding and for being part of our community.'}

${organizationName}
`;

  return { subject, html, text };
}

/**
 * Send workshop cancellation email
 */
export async function sendWorkshopCancellationEmail(data: WorkshopCancellationEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = generateWorkshopCancellationEmail(data);
    
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'workshops@infra24.com',
      to: [data.to],
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [
        { name: 'type', value: 'workshop_cancellation' },
        { name: 'organization', value: data.organizationName },
        { name: 'workshop', value: data.workshopTitle },
        { name: 'language', value: data.language }
      ]
    });

    if (result.error) {
      console.error('Resend workshop cancellation email error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Workshop cancellation email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('Failed to send workshop cancellation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
