import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateMagicLink } from '@/lib/auth/magic-link';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, surveyId, organizationId, metadata } = await request.json();

    if (!email || !surveyId || !organizationId) {
      return NextResponse.json(
        { error: 'Email, surveyId, and organizationId are required' },
        { status: 400 }
      );
    }

    const magicLink = await generateMagicLink({
      email,
      surveyId,
      organizationId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata
    });

    return NextResponse.json({
      success: true,
      magicLink
    });
  } catch (error) {
    console.error('Error generating magic link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

