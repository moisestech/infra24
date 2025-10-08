import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const isActive = searchParams.get('is_active');

    let query = supabaseAdmin
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    // Apply filters
    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: organizations, error } = await query;

    if (error) {
      console.error('Error fetching organizations:', error);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }

    // Transform organizations to include default pricing tiers if not set
    const transformedOrganizations = organizations?.map(org => ({
      ...org,
      pricing_tiers: org.pricing_tiers || {
        public: { discount: 0, description: 'Full price for public users' },
        member: { discount: 0.10, description: '10% discount for members' },
        resident_artist: { discount: 1.00, description: 'Free access for resident artists' },
        staff: { discount: 1.00, description: 'Free access for staff' }
      }
    })) || [];

    return NextResponse.json({ 
      organizations: transformedOrganizations,
      pagination: {
        page,
        limit,
        total: transformedOrganizations.length
      }
    });

  } catch (error) {
    console.error('Error in admin organizations API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
