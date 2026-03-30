import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, message, interest } = body as Record<
      string,
      string | undefined
    >;

    if (!email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Work email and message are required.' },
        { status: 400 }
      );
    }

    const to = process.env.MARKETING_CONTACT_TO;
    const from =
      process.env.MARKETING_CONTACT_FROM ||
      process.env.RESEND_FROM_EMAIL ||
      'onboarding@resend.dev';

    if (process.env.RESEND_API_KEY && to) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from,
        to: [to],
        reply_to: email,
        subject: `Infra24 inquiry: ${interest || 'general'}`,
        text: [
          `Name: ${name || '—'}`,
          `Email: ${email}`,
          `Organization: ${organization || '—'}`,
          `Interest: ${interest || '—'}`,
          '',
          message,
        ].join('\n'),
      });
      if (error) {
        console.error('[marketing/contact]', error);
        return NextResponse.json({ ok: true, fallback: true });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, fallback: true });
  } catch (e) {
    console.error('[marketing/contact]', e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
