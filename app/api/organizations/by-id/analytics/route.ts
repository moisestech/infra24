import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { orgId } = await params;
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('start_date') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end_date') || new Date().toISOString().split('T')[0];
    const metricType = searchParams.get('type') || 'all'; // 'bookings', 'submissions', 'all'

    // Check if user has permission to view analytics for this organization
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    const analytics: any = {};

    // Booking Analytics
    if (metricType === 'all' || metricType === 'bookings') {
      // Total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      // Total participants
      const { data: bookingParticipants } = await supabase
        .from('bookings')
        .select('current_participants')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const totalParticipants = bookingParticipants?.reduce((sum, booking) => sum + (booking.current_participants || 0), 0) || 0;

      // Revenue
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('price, current_participants')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .in('status', ['confirmed', 'completed']);

      const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.price * booking.current_participants), 0) || 0;

      // Booking completion rate
      const { count: completedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .eq('status', 'completed')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const completionRate = totalBookings && completedBookings ? (completedBookings / totalBookings) * 100 : 0;

      // Bookings by status
      const { data: bookingsByStatus } = await supabase
        .from('bookings')
        .select('status')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const statusCounts = bookingsByStatus?.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Bookings by resource type
      const { data: bookingsByType } = await supabase
        .from('bookings')
        .select('resource_type')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const typeCounts = bookingsByType?.reduce((acc, booking) => {
        acc[booking.resource_type] = (acc[booking.resource_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      analytics.bookings = {
        total: totalBookings || 0,
        totalParticipants,
        totalRevenue,
        completionRate: Math.round(completionRate * 100) / 100,
        byStatus: statusCounts,
        byResourceType: typeCounts
      };
    }

    // Submission Analytics
    if (metricType === 'all' || metricType === 'submissions') {
      // Total submissions
      const { count: totalSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      // Submissions by status
      const { data: submissionsByStatus } = await supabase
        .from('submissions')
        .select('status')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const submissionStatusCounts = submissionsByStatus?.reduce((acc, submission) => {
        acc[submission.status] = (acc[submission.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Approval rate
      const { count: approvedSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .eq('status', 'approved')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const { count: reviewedSubmissions } = await supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .eq('organization_id', orgId)
        .in('status', ['approved', 'rejected'])
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const approvalRate = reviewedSubmissions && approvedSubmissions ? (approvedSubmissions / reviewedSubmissions) * 100 : 0;

      // Average review time
      const { data: reviewTimes } = await supabase
        .from('submissions')
        .select('submitted_at, reviewed_at')
        .eq('organization_id', orgId)
        .not('submitted_at', 'is', null)
        .not('reviewed_at', 'is', null)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const avgReviewTime = reviewTimes?.length ? 
        reviewTimes.reduce((sum, submission) => {
          const submitted = new Date(submission.submitted_at);
          const reviewed = new Date(submission.reviewed_at);
          return sum + (reviewed.getTime() - submitted.getTime());
        }, 0) / reviewTimes.length / (1000 * 60 * 60 * 24) : 0; // in days

      // Submissions by form
      const { data: submissionsByForm } = await supabase
        .from('submissions')
        .select('form_id, submission_forms(title)')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const formCounts = submissionsByForm?.reduce((acc, submission) => {
        const formTitle = (submission.submission_forms as any)?.title || 'Unknown Form';
        acc[formTitle] = (acc[formTitle] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      analytics.submissions = {
        total: totalSubmissions || 0,
        byStatus: submissionStatusCounts,
        approvalRate: Math.round(approvalRate * 100) / 100,
        avgReviewTimeDays: Math.round(avgReviewTime * 100) / 100,
        byForm: formCounts
      };
    }

    // User Analytics
    if (metricType === 'all') {
      // Total active users (users who have made bookings or submissions)
      const { data: activeUsers } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const { data: submissionUsers } = await supabase
        .from('submissions')
        .select('user_id')
        .eq('organization_id', orgId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const uniqueUsers = new Set([
        ...(activeUsers?.map(b => b.user_id) || []),
        ...(submissionUsers?.map(s => s.user_id) || [])
      ]);

      analytics.users = {
        totalActive: uniqueUsers.size
      };
    }

    // Time series data for charts
    const { data: dailyBookings } = await supabase
      .from('bookings')
      .select('created_at, current_participants, price')
      .eq('organization_id', orgId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    const { data: dailySubmissions } = await supabase
      .from('submissions')
      .select('created_at')
      .eq('organization_id', orgId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    // Group by date
    const dailyData: Record<string, any> = {};
    
    dailyBookings?.forEach(booking => {
      const date = booking.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { bookings: 0, participants: 0, revenue: 0, submissions: 0 };
      }
      dailyData[date].bookings += 1;
      dailyData[date].participants += booking.current_participants || 0;
      dailyData[date].revenue += (booking.price || 0) * (booking.current_participants || 0);
    });

    dailySubmissions?.forEach(submission => {
      const date = submission.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { bookings: 0, participants: 0, revenue: 0, submissions: 0 };
      }
      dailyData[date].submissions += 1;
    });

    analytics.timeSeries = Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Error in analytics GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
