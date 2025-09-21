import { NextRequest, NextResponse } from 'next/server';
import { validateMagicLink } from '@/lib/auth/magic-link';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await validateMagicLink(token);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating magic link:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

