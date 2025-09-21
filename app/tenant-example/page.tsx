'use client';

import React from 'react';
import { useTenant } from '@/components/tenant/TenantProvider';
import { TenantLayout } from '@/components/tenant/TenantLayout';

export default function TenantExamplePage() {
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

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tenant Configuration Demo
              </h1>
              <p className="text-lg text-gray-600">
                This page demonstrates the multi-tenant routing and theming system for Infra24.
              </p>
            </div>

            {tenantId && tenantConfig ? (
              <div className="space-y-8">
                {/* Tenant Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Current Tenant: {tenantConfig.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><strong>ID:</strong> {tenantId}</li>
                        <li><strong>Slug:</strong> {tenantConfig.slug}</li>
                        <li><strong>Domain:</strong> {tenantConfig.domain}</li>
                        <li><strong>Subdomain:</strong> {tenantConfig.subdomain}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Theme Colors</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: tenantConfig.theme.primaryColor }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            Primary: {tenantConfig.theme.primaryColor}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: tenantConfig.theme.secondaryColor }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            Secondary: {tenantConfig.theme.secondaryColor}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: tenantConfig.theme.accentColor }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            Accent: {tenantConfig.theme.accentColor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Enabled Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(tenantConfig.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600 capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Localization</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><strong>Timezone:</strong> {tenantConfig.settings.timezone}</li>
                        <li><strong>Date Format:</strong> {tenantConfig.settings.dateFormat}</li>
                        <li><strong>Currency:</strong> {tenantConfig.settings.currency}</li>
                        <li><strong>Language:</strong> {tenantConfig.settings.language}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Branding</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li><strong>Logo:</strong> {tenantConfig.theme.logo}</li>
                        <li><strong>Favicon:</strong> {tenantConfig.theme.favicon}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CSS Variables Demo */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">CSS Variables in Action</h3>
                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: 'var(--tenant-primary)' }}
                    >
                      Primary Color Button
                    </div>
                    <div 
                      className="p-4 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: 'var(--tenant-secondary)' }}
                    >
                      Secondary Color Button
                    </div>
                    <div 
                      className="p-4 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: 'var(--tenant-accent)' }}
                    >
                      Accent Color Button
                    </div>
                  </div>
                </div>

                {/* Navigation Examples */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant-Specific Navigation</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-4">
                      Based on the tenant configuration, different navigation options would be available:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-2">Available Routes</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• /o/{tenantConfig.slug}/announcements</li>
                          <li>• /o/{tenantConfig.slug}/dashboard</li>
                          {tenantConfig.features.bookings && (
                            <li>• /o/{tenantConfig.slug}/bookings</li>
                          )}
                          {tenantConfig.features.workshops && (
                            <li>• /o/{tenantConfig.slug}/workshops</li>
                          )}
                          {tenantConfig.features.submissions && (
                            <li>• /o/{tenantConfig.slug}/submissions</li>
                          )}
                          {tenantConfig.features.analytics && (
                            <li>• /o/{tenantConfig.slug}/analytics</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-2">Domain Options</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• {tenantConfig.domain}</li>
                          <li>• {tenantConfig.subdomain}.infra24.digital</li>
                          <li>• localhost:3000/o/{tenantConfig.slug}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Tenant Detected
                </h2>
                <p className="text-gray-600 mb-6">
                  This page demonstrates tenant routing. To see tenant-specific content, access it via:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• /o/bakehouse/tenant-example</p>
                  <p>• /o/oolite/tenant-example</p>
                  <p>• /o/edgezones/tenant-example</p>
                  <p>• /o/locust/tenant-example</p>
                  <p>• /o/ai24/tenant-example</p>
                </div>
              </div>
            )}

            {/* Implementation Notes */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Implementation Notes</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>
                  <strong>Tenant Detection:</strong> The system automatically detects tenants based on:
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• Subdomain (e.g., bakehouse.infra24.digital)</li>
                  <li>• Custom domain (e.g., bakehouse.digital)</li>
                  <li>• Path-based routing (e.g., /o/bakehouse/...)</li>
                </ul>
                <p>
                  <strong>Theme Application:</strong> CSS variables are automatically applied based on tenant configuration.
                </p>
                <p>
                  <strong>Feature Gating:</strong> Different features are enabled/disabled per tenant based on their configuration.
                </p>
                <p>
                  <strong>Data Isolation:</strong> All data is isolated per tenant using Row Level Security (RLS) in Supabase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
}

