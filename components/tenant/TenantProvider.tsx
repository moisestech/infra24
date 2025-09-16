'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { TenantConfig, getTenantConfig, getTenantCSSVariables } from '@/lib/tenant';

interface TenantContextType {
  tenantId: string | null;
  tenantConfig: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const detectTenant = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Extract tenant from pathname (e.g., /o/bakehouse/...)
        const pathSegments = pathname.split('/').filter(Boolean);
        let detectedTenantId: string | null = null;
        
        if (pathSegments[0] === 'o' && pathSegments[1]) {
          detectedTenantId = pathSegments[1];
        }
        
        // If no tenant found in path, check for subdomain
        if (!detectedTenantId && typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          const subdomain = hostname.split('.')[0];
          
          if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
            detectedTenantId = subdomain;
          }
        }
        
        if (detectedTenantId) {
          const config = getTenantConfig(detectedTenantId);
          if (config) {
            setTenantId(detectedTenantId);
            setTenantConfig(config);
            
            // Apply tenant-specific CSS variables
            const cssVariables = getTenantCSSVariables(detectedTenantId);
            const root = document.documentElement;
            Object.entries(cssVariables).forEach(([key, value]) => {
              root.style.setProperty(key, value);
            });
            
            // Update document title and favicon
            document.title = config.name;
            const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (favicon) {
              favicon.href = config.theme.favicon;
            }
          } else {
            setError(`Tenant configuration not found for: ${detectedTenantId}`);
          }
        } else {
          setTenantId(null);
          setTenantConfig(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to detect tenant');
      } finally {
        setIsLoading(false);
      }
    };
    
    detectTenant();
  }, [pathname, searchParams]);
  
  const value: TenantContextType = {
    tenantId,
    tenantConfig,
    isLoading,
    error,
  };
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}
