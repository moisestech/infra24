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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    // Get the requesting user's membership to check permissions
    const { data: requestingUserMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!requestingUserMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 404 });
    }

    // Only super admins and org admins can update artist profiles
    if (!['super_admin', 'org_admin'].includes(requestingUserMembership.role)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the artist profile
    const { data: artistProfile, error: artistError } = await supabase
      .from('artist_profiles')
      .select('id, organization_id, name, claimed_by_clerk_user_id')
      .eq('id', id)
      .single();

    if (artistError || !artistProfile) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 });
    }

    // Org admins can only update artists in their organization
    if (requestingUserMembership.role === 'org_admin' && requestingUserMembership.org_id !== artistProfile.organization_id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Prepare update data
    const updateData = { ...updates }
    
    // If member_type_id is being updated, we might need to update the user's role too
    if (updates.member_type_id && artistProfile.claimed_by_clerk_user_id) {
      // Get the member type to see if it has a default role
      const { data: memberType } = await supabase
        .from('org_member_types')
        .select('default_role_on_claim, is_staff')
        .eq('id', updates.member_type_id)
        .single()
      
      if (memberType) {
        // Update the user's membership role if the member type has a default role
        if (memberType.default_role_on_claim) {
          await supabase
            .from('org_memberships')
            .update({ role: memberType.default_role_on_claim })
            .eq('clerk_user_id', artistProfile.claimed_by_clerk_user_id)
            .eq('org_id', artistProfile.organization_id)
        }
        
        // If this is a staff member type, also update the role to staff
        if (memberType.is_staff) {
          await supabase
            .from('org_memberships')
            .update({ role: 'staff' })
            .eq('clerk_user_id', artistProfile.claimed_by_clerk_user_id)
            .eq('org_id', artistProfile.organization_id)
        }
      }
    }

    // Update the artist profile
    const { data: updatedArtist, error: updateError } = await supabase
      .from('artist_profiles')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        name,
        email,
        phone,
        studio_number,
        studio_type,
        studio_location,
        bio,
        website_url,
        instagram_handle,
        is_active,
        is_claimed,
        claimed_by_clerk_user_id,
        claimed_at,
        profile_type,
        created_at,
        updated_at,
        organization_id,
        member_type_id
      `)
      .single();

    if (updateError) {
      console.error('Error updating artist profile:', updateError);
      return NextResponse.json({ error: 'Failed to update artist profile' }, { status: 500 });
    }

    return NextResponse.json({
      artist: updatedArtist
    });

  } catch (error) {
    console.error('Error in artist profile update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
