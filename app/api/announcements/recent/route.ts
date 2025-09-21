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
      .select('role, organization_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!requestingUserMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Build query based on user role
    let query = supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        type,
        priority,
        visibility,
        start_date,
        end_date,
        location,
        created_at,
        updated_at,
        created_by,
        organization_id,
        organizations!inner(id, name, slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);

    // Super admins can see all announcements
    // Org admins and moderators can see announcements from their organization
    // Regular users can only see their own announcements
    if (requestingUserMembership.role === 'super_admin') {
      // No additional filters needed
    } else if (['admin', 'manager'].includes(requestingUserMembership.role)) {
      query = query.eq('organization_id', requestingUserMembership.organization_id);
    } else {
      query = query.eq('created_by', userId);
    }

    const { data: announcements, error: announcementsError } = await query;

    if (announcementsError) {
      console.error('Error fetching recent announcements:', announcementsError);
      return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }

    // Get author information for each announcement
    const announcementsWithAuthors = await Promise.all(
      (announcements || []).map(async (announcement) => {
        // Get author information
        const { data: authorData } = await supabase
          .from('org_memberships')
          .select(`
            clerk_user_id
          `)
          .eq('clerk_user_id', announcement.created_by)
          .single();

        return {
          ...announcement,
          organization: announcement.organizations,
          author: authorData ? {
            name: 'User',
            email: announcement.created_by
          } : null
        };
      })
    );

    return NextResponse.json({
      announcements: announcementsWithAuthors
    });

  } catch (error) {
    console.error('Error in recent announcements API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
