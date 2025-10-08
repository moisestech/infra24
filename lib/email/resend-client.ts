/**
 * Resend API Client
 * Handles email sending through Resend API
 */

import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string | string[]
  from?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  tags?: Array<{ name: string; value: string }>
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, email will not be sent')
      return {
        success: false,
        error: 'Email service not configured'
      }
    }

    const { data, error } = await resend.emails.send({
      from: options.from || 'Infra24 <noreply@infra24.com>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      tags: options.tags
    })

    if (error) {
      console.error('Resend API error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email'
      }
    }

    console.log('Email sent successfully:', data?.id)
    return {
      success: true,
      messageId: data?.id
    }

  } catch (error: any) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Send multiple emails in batch
 */
export async function sendBatchEmails(emails: EmailOptions[]): Promise<EmailResponse[]> {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  )

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      console.error(`Batch email ${index} failed:`, result.reason)
      return {
        success: false,
        error: result.reason?.message || 'Batch email failed'
      }
    }
  })
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get email domain from email address
 */
export function getEmailDomain(email: string): string {
  return email.split('@')[1] || ''
}

/**
 * Check if email is from a known organization domain
 */
export function isOrganizationEmail(email: string, organizationDomains: string[]): boolean {
  const domain = getEmailDomain(email)
  return organizationDomains.includes(domain)
}



