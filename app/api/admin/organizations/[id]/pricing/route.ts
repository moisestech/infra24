import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: organizationId } = params;
    const { pricing_tiers } = await req.json();

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    if (!pricing_tiers) {
      return NextResponse.json({ error: 'Pricing tiers are required' }, { status: 400 });
    }

    // Validate pricing tiers structure
    const validRoles = ['public', 'member', 'resident_artist', 'staff'];
    const validatedTiers: Record<string, any> = {};

    for (const role of validRoles) {
      if (pricing_tiers[role]) {
        const tier = pricing_tiers[role];
        if (typeof tier.discount !== 'number' || tier.discount < 0 || tier.discount > 1) {
          return NextResponse.json({ 
            error: `Invalid discount value for ${role}. Must be between 0 and 1.` 
          }, { status: 400 });
        }
        validatedTiers[role] = {
          discount: tier.discount,
          description: tier.description || `${role} pricing tier`
        };
      }
    }

    // Update organization pricing tiers
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .update({ 
        pricing_tiers: validatedTiers,
        updated_at: new Date().toISOString()
      })
      .eq('id', organizationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization pricing:', error);
      return NextResponse.json({ error: 'Failed to update pricing tiers' }, { status: 500 });
    }

    return NextResponse.json({ 
      organization: data,
      message: 'Pricing tiers updated successfully'
    });

  } catch (error) {
    console.error('Error in organization pricing update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
