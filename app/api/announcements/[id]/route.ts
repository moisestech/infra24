import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { getValidatedAnnouncementRedirectTarget } from '@/lib/announcements/scan-target';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const PATCHABLE_KEYS = new Set([
  'title',
  'body',
  'content',
  'status',
  'priority',
  'tags',
  'visibility',
  'scheduled_at',
  'expires_at',
  'start_date',
  'end_date',
  'starts_at',
  'ends_at',
  'location',
  'key_people',
  'people',
  'metadata',
  'image_url',
  'image_layout',
  'is_active',
  'primary_link',
  'qr_destination_url',
  'type',
  'sub_type',
  'published_at',
  'author_clerk_id',
]);

function normalizeOptionalUrlField(
  v: unknown
): { ok: true; value: string | null | undefined } | { ok: false; message: string } {
  if (v === undefined) return { ok: true, value: undefined };
  if (v === null || v === '') return { ok: true, value: null };
  if (typeof v !== 'string') return { ok: false, message: 'URL must be a string' };
  const t = v.trim();
  if (!t || t === '#') return { ok: true, value: null };
  const validated = getValidatedAnnouncementRedirectTarget(t);
  if (!validated) {
    return {
      ok: false,
      message: 'Invalid URL (use http(s) only; localhost and private IPs are not allowed)',
    };
  }
  return { ok: true, value: validated };
}

function buildAnnouncementPatch(
  body: Record<string, unknown>,
  userId: string
): { ok: true; data: Record<string, unknown> } | { ok: false; message: string } {
  const data: Record<string, unknown> = {
    updated_by: userId,
    updated_at: new Date().toISOString(),
  };

  for (const key of PATCHABLE_KEYS) {
    if (!(key in body)) continue;
    const val = body[key];

    if (key === 'primary_link' || key === 'qr_destination_url') {
      const n = normalizeOptionalUrlField(val);
      if (!n.ok) return { ok: false, message: n.message };
      if (n.value !== undefined) data[key] = n.value;
      continue;
    }

    data[key] = val;
  }

  return { ok: true, data };
}

function announcementOrgId(row: { organization_id?: string | null; org_id?: string | null }) {
  return row.organization_id ?? row.org_id ?? null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      return NextResponse.json({ error: 'User membership not found' }, { status: 401 });
    }

    const orgId = announcementOrgId(announcement);
    const canRead =
      userMembership.role === 'super_admin' ||
      (orgId && userMembership.org_id === orgId) ||
      announcement.created_by === userId ||
      announcement.author_clerk_id === userId;

    if (!canRead) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error('GET announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    console.log('🗑️ Delete announcement - userId:', userId ? 'present' : 'missing');

    if (!userId) {
      console.log('🗑️ No userId, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log('🗑️ Deleting announcement ID:', id);

    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('organization_id, org_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !announcement) {
      console.log('🗑️ Announcement not found:', fetchError);
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      console.log('🗑️ User membership not found for userId:', userId);
      return NextResponse.json({ error: 'User membership not found' }, { status: 401 });
    }

    const orgId = announcementOrgId(announcement);
    const canDelete =
      userMembership.role === 'super_admin' ||
      (userMembership.role === 'org_admin' && orgId && userMembership.org_id === orgId) ||
      (userMembership.role === 'moderator' && orgId && userMembership.org_id === orgId) ||
      announcement.created_by === userId;

    if (!canDelete) {
      console.log('🗑️ User does not have permission to delete this announcement');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { error: deleteError } = await supabase.from('announcements').delete().eq('id', id);

    if (deleteError) {
      console.error('🗑️ Error deleting announcement:', deleteError);
      return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
    }

    console.log('🗑️ Successfully deleted announcement:', id);

    return NextResponse.json({
      message: 'Announcement deleted successfully',
      id: id,
    });
  } catch (error) {
    console.error('🗑️ Error in delete announcement API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    console.log('✏️ Update announcement - userId:', userId ? 'present' : 'missing');

    if (!userId) {
      console.log('✏️ No userId, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    console.log('✏️ Updating announcement ID:', id, 'with data:', body);

    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('organization_id, org_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !announcement) {
      console.log('✏️ Announcement not found:', fetchError);
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    const { data: userMembership } = await supabase
      .from('org_memberships')
      .select('role, org_id')
      .eq('clerk_user_id', userId)
      .single();

    if (!userMembership) {
      console.log('✏️ User membership not found for userId:', userId);
      return NextResponse.json({ error: 'User membership not found' }, { status: 401 });
    }

    const orgId = announcementOrgId(announcement);
    const canEdit =
      userMembership.role === 'super_admin' ||
      (userMembership.role === 'org_admin' && orgId && userMembership.org_id === orgId) ||
      (userMembership.role === 'moderator' && orgId && userMembership.org_id === orgId) ||
      announcement.created_by === userId;

    if (!canEdit) {
      console.log('✏️ User does not have permission to edit this announcement');
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const built = buildAnnouncementPatch(body, userId);
    if (!built.ok) {
      return NextResponse.json({ error: built.message }, { status: 400 });
    }

    const { data: updatedAnnouncement, error: updateError } = await supabase
      .from('announcements')
      .update(built.data)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('✏️ Error updating announcement:', updateError);
      return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
    }

    console.log('✏️ Successfully updated announcement:', id);

    return NextResponse.json({
      announcement: updatedAnnouncement,
      message: 'Announcement updated successfully',
    });
  } catch (error) {
    console.error('✏️ Error in update announcement API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
