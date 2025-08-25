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
      .select('role, org_id')
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
        body,
        status,
        created_at,
        published_at,
        expires_at,
        priority,
        tags,
        org_id,
        author_clerk_id,
        organizations!inner(id, name, slug)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10);

    // Super admins can see all announcements
    // Org admins and moderators can see announcements from their organization
    // Regular users can only see their own announcements
    if (requestingUserMembership.role === 'super_admin') {
      // No additional filters needed
    } else if (['org_admin', 'moderator'].includes(requestingUserMembership.role)) {
      query = query.eq('org_id', requestingUserMembership.org_id);
    } else {
      query = query.eq('author_clerk_id', userId);
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
            clerk_user_id,
            user_profiles!inner(first_name, last_name, email)
          `)
          .eq('clerk_user_id', announcement.author_clerk_id)
          .single();

        return {
          ...announcement,
          organization: announcement.organizations,
          author: authorData?.user_profiles?.[0] ? {
            name: `${authorData.user_profiles[0].first_name || ''} ${authorData.user_profiles[0].last_name || ''}`.trim() || 'Unknown User',
            email: authorData.user_profiles[0].email
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
