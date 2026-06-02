import { sendEmail } from '@/lib/email/resend-client'
import { getSiteUrl } from '@/lib/marketing/site-url'

export async function sendDccSignupWelcomeEmail(opts: {
  to: string
  fullName: string
}): Promise<void> {
  const site = getSiteUrl().replace(/\/$/, '')
  const firstName = opts.fullName.trim().split(/\s+/)[0] || 'there'

  const from =
    process.env.DCC_SIGNUP_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    'DCC Miami <onboarding@resend.dev>'

  const html = `
    <p>Hi ${firstName},</p>
    <p>Thanks for joining Miami's Digital Culture Map.</p>
    <p>You'll receive updates about artists, public programs, workshops, and digital culture opportunities in Miami.</p>
    <p><a href="${site}">Explore the platform</a> · <a href="${site}/network">Network</a> · <a href="${site}/programs">Programs</a> · <a href="${site}/workshops">Workshops</a></p>
    <p>— Digital Culture Center Miami</p>
  `.trim()

  const text = [
    `Hi ${firstName},`,
    '',
    "Thanks for joining Miami's Digital Culture Map.",
    '',
    "You'll receive updates about artists, public programs, workshops, and digital culture opportunities in Miami.",
    '',
    `Explore: ${site}`,
    '',
    '— Digital Culture Center Miami',
  ].join('\n')

  await sendEmail({
    to: opts.to,
    from,
    subject: 'Welcome to DCC Miami',
    html,
    text,
    tags: [{ name: 'category', value: 'dcc_signup_welcome' }],
  })
}
