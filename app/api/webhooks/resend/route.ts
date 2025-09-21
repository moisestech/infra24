import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EmailAnalytics } from '@/lib/email/EmailAnalytics';
import { EmailMonitoring } from '@/lib/email/EmailMonitoring';
import crypto from 'crypto';

// Resend webhook signature verification
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Process different event types
async function processEvent(eventType: string, eventData: any) {
  const webhookData = {
    type: eventType,
    messageId: eventData.id || 'unknown',
    recipient: eventData.recipient || 'unknown',
    metadata: {
      event_id: eventData.id,
      timestamp: eventData.timestamp,
      domain: eventData.domain
    }
  };

  try {
    switch (eventType) {
      case 'email.sent':
        await processEmailSent(eventData);
        break;
      case 'email.delivered':
        await processEmailDelivered(eventData);
        break;
      case 'email.delivery_delayed':
        await processEmailDeliveryDelayed(eventData);
        break;
      case 'email.bounced':
        await processEmailBounced(eventData);
        break;
      case 'email.failed':
        await processEmailFailed(eventData);
        break;
      case 'email.opened':
        await processEmailOpened(eventData);
        break;
      case 'email.clicked':
        await processEmailClicked(eventData);
        break;
      case 'email.complained':
        await processEmailComplained(eventData);
        break;
      case 'email.scheduled':
        await processEmailScheduled(eventData);
        break;
      default:
        console.warn(`Unknown event type: ${eventType}`);
        return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error);
    throw error;
  }
}

// Email event processors
async function processEmailSent(data: any) {
  return await processEmailEvent('email.sent', data);
}

async function processEmailDelivered(data: any) {
  return await processEmailEvent('email.delivered', data);
}

async function processEmailDeliveryDelayed(data: any) {
  return await processEmailEvent('email.delivery_delayed', data);
}

async function processEmailBounced(data: any) {
  return await processEmailEvent('email.bounced', data, {
    bounce_reason: data.reason || data.bounce_reason
  });
}

async function processEmailFailed(data: any) {
  return await processEmailEvent('email.failed', data);
}

async function processEmailOpened(data: any) {
  return await processEmailEvent('email.opened', data);
}

async function processEmailClicked(data: any) {
  return await processEmailEvent('email.clicked', data);
}

async function processEmailComplained(data: any) {
  return await processEmailEvent('email.complained', data, {
    complaint_reason: data.reason || data.complaint_reason
  });
}

async function processEmailScheduled(data: any) {
  return await processEmailEvent('email.scheduled', data);
}

// Generic email event processor
async function processEmailEvent(eventType: string, data: any, additionalData: any = {}) {
  // Get organization ID from email headers or metadata
  let organizationId = null;
  if (data.headers && data.headers['X-Organization-ID']) {
    organizationId = data.headers['X-Organization-ID'];
  }

  // Get template from email headers or metadata
  let template = 'unknown';
  if (data.headers && data.headers['X-Template']) {
    template = data.headers['X-Template'];
  }

  // Get language from email headers or metadata
  let language = 'en';
  if (data.headers && data.headers['X-Language']) {
    language = data.headers['X-Language'];
  }

  // Create email event record
  const { data: event, error } = await supabaseAdmin
    .from('email_analytics')
    .insert({
      event_type: eventType,
      email_id: data.email_id || data.id,
      organization_id: organizationId,
      template: template,
      recipient_email: data.recipient,
      sender_email: data.from,
      subject: data.subject,
      template_id: data.template_id,
      event_data: data,
      delivery_time_ms: data.delivery_time_ms,
      ...additionalData
    })
    .select()
    .single();

  if (error) {
    console.error(`Error creating ${eventType} event:`, error);
    throw error;
  }

  // Track with enhanced analytics based on event type
  switch (eventType) {
    case 'email.delivered':
      await EmailAnalytics.trackEmailDelivered({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        metadata: {
          domain: data.domain,
          delivery_time_ms: data.delivery_time_ms
        }
      });
      break;
    case 'email.opened':
      await EmailAnalytics.trackEmailOpened({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        metadata: {
          domain: data.domain,
          user_agent: data.user_agent
        }
      });
      break;
    case 'email.clicked':
      await EmailAnalytics.trackEmailClicked({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        link: data.url || 'unknown',
        metadata: {
          domain: data.domain,
          url: data.url
        }
      });
      break;
    case 'email.bounced':
      await EmailAnalytics.trackEmailBounced({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        reason: data.reason || data.bounce_reason || 'unknown',
        metadata: {
          domain: data.domain,
          bounce_type: data.bounce_type
        }
      });
      break;
    case 'email.failed':
      await EmailAnalytics.trackEmailFailed({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        reason: data.reason || 'unknown',
        metadata: {
          domain: data.domain,
          error_code: data.error_code
        }
      });
      break;
    case 'email.complained':
      // Track complaint as a bounce event
      await EmailAnalytics.trackEmailBounced({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        reason: 'Complaint received',
        metadata: {
          domain: data.domain,
          complaint_type: data.complaint_type
        }
      });
      break;
    case 'email.scheduled':
      await EmailAnalytics.trackEmailScheduled({
        template: event.template_id || 'unknown',
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        scheduledAt: data.scheduled_at,
        metadata: {
          domain: data.domain,
          scheduled_at: data.scheduled_at,
          subject: event.subject || 'No Subject',
          messageId: event.email_id
        }
      });
      break;
    case 'email.delivery_delayed':
      await EmailAnalytics.trackEmailDeliveryDelayed({
        messageId: event.email_id,
        recipient: event.recipient_email,
        organizationId: organizationId || '',
        reason: data.reason || 'unknown',
        metadata: {
          domain: data.domain,
          retry_count: data.retry_count
        }
      });
      break;
  }

  return event;
}

// Main webhook handler
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('resend-signature');
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(rawBody, signature, webhookSecret);
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    const { type: eventType, data: eventData } = payload;

    // Log webhook receipt
    const webhookLog = {
      webhook_id: payload.id || `webhook_${Date.now()}`,
      event_type: eventType,
      payload,
      signature_valid: true,
      processed_successfully: false,
      processing_time_ms: 0
    };

    // Process the event
    const processedSuccessfully = await processEvent(eventType, eventData);
    
    // Update webhook log
    webhookLog.processed_successfully = processedSuccessfully;
    webhookLog.processing_time_ms = Date.now() - startTime;

    // Store webhook log
    const { error: logError } = await supabaseAdmin
      .from('email_webhook_logs')
      .insert(webhookLog);

    if (logError) {
      console.error('Error logging webhook:', logError);
    }

    if (!processedSuccessfully) {
      return NextResponse.json(
        { error: 'Event processing failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      event_type: eventType,
      processing_time_ms: webhookLog.processing_time_ms
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Log failed webhook
    try {
      const webhookLog = {
        webhook_id: `webhook_${Date.now()}`,
        event_type: 'unknown',
        payload: { error: error instanceof Error ? error.message : String(error) },
        signature_valid: false,
        processed_successfully: false,
        error_message: error instanceof Error ? error.message : String(error),
        processing_time_ms: Date.now() - startTime
      };

      await supabaseAdmin
        .from('email_webhook_logs')
        .insert(webhookLog);
    } catch (logError) {
      console.error('Error logging failed webhook:', logError);
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    message: 'Resend webhook endpoint is running',
    timestamp: new Date().toISOString()
  });
}

