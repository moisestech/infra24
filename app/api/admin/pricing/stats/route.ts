import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '30d';

    // Get all organizations with their pricing tiers
    const supabaseAdmin = getSupabaseAdmin();
    const { data: organizations, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, name, pricing_tiers, is_active');

    if (orgError) {
      console.error('Error fetching organizations:', orgError);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }

    // Get user role distribution
    const { data: participants, error: participantsError } = await supabaseAdmin
      .from('booking_participants')
      .select('role, user_id');

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
    }

    // Calculate stats
    const totalOrganizations = organizations?.length || 0;
    const activeOrganizations = organizations?.filter(org => org.is_active).length || 0;

    // Calculate average discount across all organizations
    let totalDiscount = 0;
    let discountCount = 0;

    organizations?.forEach(org => {
      const pricingTiers = org.pricing_tiers || {};
      Object.values(pricingTiers).forEach((tier: any) => {
        if (typeof tier.discount === 'number') {
          totalDiscount += tier.discount;
          discountCount++;
        }
      });
    });

    const averageDiscount = discountCount > 0 ? totalDiscount / discountCount : 0;

    // Count users by role
    const roleCounts = {
      public: 0,
      member: 0,
      resident_artist: 0,
      staff: 0
    };

    const uniqueUsers = new Set();
    participants?.forEach(participant => {
      uniqueUsers.add(participant.user_id);
      if (participant.role in roleCounts) {
        roleCounts[participant.role as keyof typeof roleCounts]++;
      }
    });

    const freeUsers = roleCounts.resident_artist + roleCounts.staff;
    const paidUsers = roleCounts.public + roleCounts.member;

    // Calculate pricing distribution
    const pricingDistribution = {
      free_users: 0,
      discounted_users: 0,
      full_price_users: 0
    };

    organizations?.forEach(org => {
      const pricingTiers = org.pricing_tiers || {};
      Object.values(pricingTiers).forEach((tier: any) => {
        if (tier.discount === 1) {
          pricingDistribution.free_users++;
        } else if (tier.discount > 0) {
          pricingDistribution.discounted_users++;
        } else {
          pricingDistribution.full_price_users++;
        }
      });
    });

    const stats = {
      total_organizations: totalOrganizations,
      active_organizations: activeOrganizations,
      average_discount: averageDiscount,
      free_users: freeUsers,
      paid_users: paidUsers,
      total_users: uniqueUsers.size,
      pricing_distribution: pricingDistribution,
      role_distribution: roleCounts,
      organizations_with_custom_pricing: organizations?.filter(org => 
        org.pricing_tiers && Object.keys(org.pricing_tiers).length > 0
      ).length || 0
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching pricing stats:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing stats' }, { status: 500 });
  }
}
