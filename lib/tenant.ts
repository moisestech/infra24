/**
 * Tenant routing and configuration system for Infra24
 * Handles multi-tenant routing, theming, and configuration
 */

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
    favicon: string;
    banner?: string;
    customCSS?: string;
  };
  features: {
    smartSign: boolean;
    bookings: boolean;
    submissions: boolean;
    analytics: boolean;
    workshops: boolean;
    calendar: boolean;
  };
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
}

// Predefined tenant configurations
export const TENANT_CONFIGS: Record<string, TenantConfig> = {
  bakehouse: {
    id: 'bakehouse',
    name: 'Bakehouse Art Complex',
    slug: 'bakehouse',
    domain: 'bakehouse.infra24.com',
    subdomain: 'bakehouse',
    theme: {
      primaryColor: '#8B4513',
      secondaryColor: '#D2691E',
      accentColor: '#CD853F',
      logo: '/logos/bakehouse-logo.png',
      favicon: '/favicons/bakehouse-favicon.ico',
    },
    features: {
      smartSign: true,
      bookings: true,
      submissions: true,
      analytics: true,
      workshops: true,
      calendar: true,
    },
    settings: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
  },
  oolite: {
    id: 'oolite',
    name: 'Oolite Arts',
    slug: 'oolite',
    domain: 'oolite.infra24.com',
    subdomain: 'oolite',
    theme: {
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      accentColor: '#60A5FA',
      logo: '/logos/oolite-logo.png',
      favicon: '/favicons/oolite-favicon.ico',
      banner: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758247127/smart-sign/orgs/oolite/oolite-digital-arts-program_ai-sketch_mqtbm9.png',
    },
    features: {
      smartSign: true,
      bookings: true,
      submissions: true,
      analytics: true,
      workshops: true,
      calendar: true,
    },
    settings: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
  },
  edgezones: {
    id: 'edgezones',
    name: 'Edge Zones',
    slug: 'edgezones',
    domain: 'edgezones.infra24.com',
    subdomain: 'edgezones',
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#EF4444',
      accentColor: '#F87171',
      logo: '/logos/edgezones-logo.png',
      favicon: '/favicons/edgezones-favicon.ico',
    },
    features: {
      smartSign: true,
      bookings: false,
      submissions: true,
      analytics: true,
      workshops: false,
      calendar: false,
    },
    settings: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
  },
  locust: {
    id: 'locust',
    name: 'Locust Projects',
    slug: 'locust',
    domain: 'locust.infra24.com',
    subdomain: 'locust',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      accentColor: '#34D399',
      logo: '/logos/locust-logo.png',
      favicon: '/favicons/locust-favicon.ico',
    },
    features: {
      smartSign: true,
      bookings: true,
      submissions: true,
      analytics: true,
      workshops: true,
      calendar: true,
    },
    settings: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
  },
  ai24: {
    id: 'ai24',
    name: 'AI24',
    slug: 'ai24',
    domain: 'ai24.infra24.com',
    subdomain: 'ai24',
    theme: {
      primaryColor: '#7C3AED',
      secondaryColor: '#8B5CF6',
      accentColor: '#A78BFA',
      logo: '/logos/ai24-logo.png',
      favicon: '/favicons/ai24-favicon.ico',
    },
    features: {
      smartSign: false,
      bookings: false,
      submissions: false,
      analytics: true,
      workshops: true,
      calendar: false,
    },
    settings: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
    },
  },
};

/**
 * Extract tenant information from request
 */
export function getTenantFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Check for custom domain (e.g., bakehouse.infra24.com)
  for (const [tenantId, config] of Object.entries(TENANT_CONFIGS)) {
    if (hostname === config.domain) {
      return tenantId;
    }
  }
  
  // Check for subdomain pattern (e.g., bakehouse.infra24.com)
  if (hostname.endsWith('.infra24.com')) {
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www') {
      for (const [tenantId, config] of Object.entries(TENANT_CONFIGS)) {
        if (config.subdomain === subdomain) {
          return tenantId;
        }
      }
    }
  }
  
  
  // Check for legacy .digital domains
  if (hostname.endsWith('.digital')) {
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www') {
      for (const [tenantId, config] of Object.entries(TENANT_CONFIGS)) {
        if (config.subdomain === subdomain) {
          return tenantId;
        }
      }
    }
  }
  
  // Check for path-based routing (e.g., /o/bakehouse)
  const pathSegments = url.pathname.split('/').filter(Boolean);
  if (pathSegments[0] === 'o' && pathSegments[1]) {
    return pathSegments[1];
  }
  
  return null;
}

/**
 * Get tenant configuration by ID
 */
export function getTenantConfig(tenantId: string): TenantConfig | null {
  return TENANT_CONFIGS[tenantId] || null;
}

/**
 * Get all available tenants
 */
export function getAllTenants(): TenantConfig[] {
  return Object.values(TENANT_CONFIGS);
}

/**
 * Check if a feature is enabled for a tenant
 */
export function isFeatureEnabled(tenantId: string, feature: keyof TenantConfig['features']): boolean {
  const config = getTenantConfig(tenantId);
  return config?.features[feature] ?? false;
}

/**
 * Get tenant-specific CSS variables
 */
export function getTenantCSSVariables(tenantId: string): Record<string, string> {
  const config = getTenantConfig(tenantId);
  if (!config) return {};
  
  return {
    '--tenant-primary': config.theme.primaryColor,
    '--tenant-secondary': config.theme.secondaryColor,
    '--tenant-accent': config.theme.accentColor,
    '--tenant-logo': `url(${config.theme.logo})`,
  };
}

/**
 * Generate tenant-specific metadata
 */
export function getTenantMetadata(tenantId: string) {
  const config = getTenantConfig(tenantId);
  if (!config) return {};
  
  return {
    title: config.name,
    description: `${config.name} - Cultural Infrastructure Platform`,
    favicon: config.theme.favicon,
    logo: config.theme.logo,
  };
}

