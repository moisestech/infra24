import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { EmailAnalytics } from '@/lib/email/EmailAnalytics';
import { EmailMonitoring } from '@/lib/email/EmailMonitoring';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const period = searchParams.get('period') || '30d';

    // If organizationId is provided, check permissions
    if (organizationId) {
      // Check if user has access to this organization
      const { supabaseAdmin } = await import('@/lib/supabase');
      const { data: membership } = await supabaseAdmin
        .from('org_memberships')
        .select('role')
        .eq('org_id', organizationId)
        .eq('user_id', userId)
        .single();

      if (!membership) {
        return NextResponse.json({ 
          error: 'Access denied to organization' 
        }, { status: 403 });
      }
    }

    // Get email analytics data
    const analyticsData = await EmailAnalytics.getDashboardData(organizationId || undefined, period);
    
    // Get monitoring data
    const monitoringData = await EmailMonitoring.getDashboardData(organizationId || undefined, period);

    // Get recent alerts
    const alerts = organizationId 
      ? await EmailMonitoring.getRecentAlerts(organizationId, 10)
      : [];

    return NextResponse.json({
      success: true,
      data: analyticsData,
      monitoring: monitoringData,
      alerts
    });

  } catch (error) {
    console.error('Error fetching email analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch email analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

