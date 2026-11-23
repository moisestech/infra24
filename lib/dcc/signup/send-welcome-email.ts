import { sendEmail } from '@/lib/email/resend-client'
import { getSiteUrl } from '@/lib/marketing/site-url'

function safeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch] ?? '')
}

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
    <p>Hi ${safeHtml(firstName)},</p>
    <p>Thanks for sharing your interest in Miami's Digital Culture Map.</p>
    <p>We received your contact request for review. It is not verified website membership or consent to a public profile in the network sculpture. Newsletter subscriptions are separate.</p>
    <p><a href="${site}">Explore the platform</a> · <a href="${site}/network">Network</a> · <a href="${site}/programs">Programs</a> · <a href="${site}/workshops">Workshops</a></p>
    <p>— Digital Culture Center Miami</p>
  `.trim()

  const text = [
    `Hi ${firstName},`,
    '',
    "Thanks for sharing your interest in Miami's Digital Culture Map.",
    '',
    "We received your contact request for review. This does not verify website membership, publish a sculpture node or subscribe you to updates.",
    '',
    `Explore: ${site}`,
    '',
    '— Digital Culture Center Miami',
  ].join('\n')

  await sendEmail({
    to: opts.to,
    from,
    subject: 'DCC Miami — we received your interest',
    html,
    text,
    tags: [{ name: 'category', value: 'dcc_interest_receipt' }],
  })
}
