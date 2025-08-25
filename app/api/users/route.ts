import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the requesting user's membership to check permissions
    const { data: requestingUserMembership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('clerk_user_id', userId)
      .single();

    if (!requestingUserMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Only super admins can see all users
    if (requestingUserMembership.role !== 'super_admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all memberships (users)
    const { data: memberships, error: membershipsError } = await supabase
      .from('org_memberships')
      .select(`
        id,
        clerk_user_id,
        role,
        org_id,
        joined_at,
        organizations (
          id,
          name,
          slug
        )
      `)
      .order('joined_at', { ascending: false });

    if (membershipsError) {
      console.error('Error fetching memberships:', membershipsError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({
      users: memberships || []
    });

  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
