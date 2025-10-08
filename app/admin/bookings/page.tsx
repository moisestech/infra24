import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingDashboard } from '@/components/admin/BookingDashboard';
import { PaymentDashboard } from '@/components/admin/PaymentDashboard';
import { UserRoleManagement } from '@/components/admin/UserRoleManagement';
import { PricingConfiguration } from '@/components/admin/PricingConfiguration';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminBookingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive admin interface for managing bookings, payments, and user roles
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="users">User Roles</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <BookingDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <PaymentDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <UserRoleManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <PricingConfiguration />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <AnalyticsDashboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
