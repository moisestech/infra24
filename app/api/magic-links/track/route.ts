import { NextRequest, NextResponse } from 'next/server';
import { trackMagicLinkUsage } from '@/lib/auth/magic-link';

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json();

    if (!token || !action) {
      return NextResponse.json(
        { error: 'Token and action are required' },
        { status: 400 }
      );
    }

    if (!['opened', 'started', 'completed'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await trackMagicLinkUsage(token, action);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking magic link usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

