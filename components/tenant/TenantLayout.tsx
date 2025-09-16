'use client';

import React from 'react';
import { useTenant } from './TenantProvider';

interface TenantLayoutProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TenantLayout({ children, fallback }: TenantLayoutProps) {
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
          <h1 className="text-2xl font-bold text-red-600 mb-4">Tenant Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!tenantId || !tenantConfig) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Infra24</h1>
          <p className="text-gray-600">Multi-tenant Cultural Infrastructure Platform</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="tenant-layout" data-tenant={tenantId}>
      <style jsx>{`
        .tenant-layout {
          --tenant-primary: ${tenantConfig.theme.primaryColor};
          --tenant-secondary: ${tenantConfig.theme.secondaryColor};
          --tenant-accent: ${tenantConfig.theme.accentColor};
        }
      `}</style>
      {children}
    </div>
  );
}
