import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveScanDestination } from '@/lib/announcements/scan-target';

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

/**
 * Stable smart-sign QR target: redirects to qr_destination_url or primary_link when valid.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params;

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('id, slug')
      .eq('slug', slug)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { data: row, error } = await supabase
      .from('announcements')
      .select(
        'id, organization_id, org_id, visibility, is_active, status, qr_destination_url, primary_link'
      )
      .eq('id', id)
      .maybeSingle();

    if (error || !row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const orgMatches =
      row.organization_id === organization.id || row.org_id === organization.id;
    if (!orgMatches) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (!row.is_active) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const vis = String(row.visibility || '').toLowerCase();
    if (!['public', 'both'].includes(vis)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const status = String(row.status || 'published').toLowerCase();
    if (status !== 'published') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const target = resolveScanDestination(row.qr_destination_url, row.primary_link);
    if (!target) {
      return NextResponse.json({ error: 'No scan link configured' }, { status: 404 });
    }

    return NextResponse.redirect(target, 302);
  } catch (e) {
    console.error('announcement scan redirect:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
