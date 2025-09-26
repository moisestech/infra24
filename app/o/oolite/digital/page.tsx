'use client';

import React, { Suspense } from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import OoliteDigitalOverviewPage from '@/components/page/OoliteDigitalOverviewPage';
import { DonateButton } from '@/components/ui/DonateButton';

function OoliteDigitalPageContent() {
  const { tenantId, tenantConfig, isLoading, error } = useTenant();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (tenantId !== 'oolite') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible for Oolite Arts.</p>
        </div>
      </div>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <div className="relative">
          <OoliteDigitalOverviewPage />
          {/* Donation Button - Fixed Position */}
          <div className="fixed bottom-6 right-6 z-40">
            <DonateButton
              organizationId="oolite"
              organizationName="Oolite Arts"
              className="shadow-lg"
            />
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

export default function OoliteDigitalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OoliteDigitalPageContent />
    </Suspense>
  );
}

