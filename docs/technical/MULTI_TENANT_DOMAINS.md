# Multi-Tenant Domain Configuration

## Overview

This document outlines the implementation of custom domains for the Infra24 multi-tenant platform, enabling each organization to have their own branded domain like `[org-name].infra24.com`.

## Domain Structure

### Primary Domains
- **Platform**: `infra24.com` (master platform)
- **Tenants**: `[org-name].infra24.com` (organization-specific subdomains)

### Current Tenant Domains
- `bakehouse.infra24.com` - Bakehouse Art Complex
- `oolite.infra24.com` - Oolite Arts  
- `edgezones.infra24.com` - Edge Zones
- `locust.infra24.com` - Locust Projects
- `ai24.infra24.com` - AI24

## Technical Implementation

### 1. Next.js Configuration

The `next.config.ts` file includes rewrites to handle subdomain routing:

```typescript
async rewrites() {
  return [
    // Rewrite subdomain requests to path-based routing
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: '(?<subdomain>.*)\\.infra24\\.com',
        },
      ],
      destination: '/o/:subdomain/:path*',
    },
  ];
}
```

### 2. Tenant Detection

The `getTenantFromRequest()` function in `lib/tenant.ts` handles multiple domain patterns:

1. **Exact domain match**: `bakehouse.infra24.com`
2. **Subdomain pattern**: `*.infra24.com`
3. **Legacy domains**: `*.digital`
4. **Path-based routing**: `/o/[org-slug]/...`

### 3. Vercel Configuration

The `vercel.json` file configures:
- Build settings for Next.js
- Headers for security
- Redirects for www subdomain
- Environment variables

## DNS Configuration

### Required DNS Records

For each tenant domain, you need to configure:

#### 1. A Records (for Vercel deployment)
```
bakehouse.infra24.com    A    76.76.19.61
oolite.infra24.com       A    76.76.19.61
edgezones.infra24.com    A    76.76.19.61
locust.infra24.com       A    76.76.19.61
ai24.infra24.com         A    76.76.19.61
```

#### 2. CNAME Records (alternative to A records)
```
bakehouse.infra24.com    CNAME    cname.vercel-dns.com
oolite.infra24.com       CNAME    cname.vercel-dns.com
edgezones.infra24.com    CNAME    cname.vercel-dns.com
locust.infra24.com       CNAME    cname.vercel-dns.com
ai24.infra24.com         CNAME    cname.vercel-dns.com
```

#### 3. Wildcard CNAME (for dynamic subdomains)
```
*.infra24.com            CNAME    cname.vercel-dns.com
```

### SSL Certificates

Vercel automatically provides SSL certificates for:
- Custom domains added through the Vercel dashboard
- Wildcard certificates for `*.infra24.com`

## Deployment Steps

### 1. Domain Registration
- Register `infra24.com` domain
- Configure DNS settings as outlined above

### 2. Vercel Configuration
1. Add custom domains in Vercel dashboard:
   - `bakehouse.infra24.com`
   - `oolite.infra24.com`
   - `edgezones.infra24.com`
   - `locust.infra24.com`
   - `ai24.infra24.com`

2. Verify DNS configuration
3. Wait for SSL certificate provisioning

### 3. Environment Variables
Set the following environment variables in Vercel:

```bash
NEXT_PUBLIC_APP_URL=https://infra24.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Testing

### Local Development
To test subdomain routing locally, add entries to your `/etc/hosts` file:

```
127.0.0.1 bakehouse.infra24.com
127.0.0.1 oolite.infra24.com
127.0.0.1 edgezones.infra24.com
127.0.0.1 locust.infra24.com
127.0.0.1 ai24.infra24.com
```

Then access:
- `http://bakehouse.infra24.com:3000`
- `http://oolite.infra24.com:3000`
- etc.

### Production Testing
1. Verify DNS propagation: `nslookup bakehouse.infra24.com`
2. Test SSL certificates: `https://bakehouse.infra24.com`
3. Verify tenant detection and theming
4. Test all organization-specific features

## Adding New Tenants

### 1. Update Tenant Configuration
Add new tenant to `lib/tenant.ts`:

```typescript
neworg: {
  id: 'neworg',
  name: 'New Organization',
  slug: 'neworg',
  domain: 'neworg.infra24.com',
  subdomain: 'neworg',
  theme: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#4ECDC4',
    accentColor: '#45B7D1',
    logo: '/logos/neworg-logo.png',
    favicon: '/favicons/neworg-favicon.ico',
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
```

### 2. Configure DNS
Add DNS record for new domain:
```
neworg.infra24.com    A    76.76.19.61
```

### 3. Add to Vercel
Add custom domain in Vercel dashboard and verify SSL certificate.

## Security Considerations

### 1. CORS Configuration
Ensure API routes handle cross-origin requests properly for subdomains.

### 2. Authentication
Clerk authentication works across subdomains with proper configuration.

### 3. Data Isolation
Row-level security (RLS) in Supabase ensures tenant data isolation.

### 4. Rate Limiting
Implement rate limiting per tenant to prevent abuse.

## Monitoring

### 1. Domain Health
Monitor DNS resolution and SSL certificate status.

### 2. Performance
Track page load times across different domains.

### 3. Analytics
Separate analytics tracking for each tenant domain.

## Troubleshooting

### Common Issues

1. **DNS Not Resolving**
   - Check DNS propagation: `dig bakehouse.infra24.com`
   - Verify DNS records are correct
   - Wait for propagation (up to 48 hours)

2. **SSL Certificate Issues**
   - Check Vercel dashboard for certificate status
   - Verify domain ownership
   - Wait for certificate provisioning

3. **Tenant Not Detected**
   - Check `getTenantFromRequest()` logic
   - Verify domain configuration in `TENANT_CONFIGS`
   - Check browser developer tools for headers

4. **Styling Not Applied**
   - Verify tenant detection in `TenantProvider`
   - Check CSS variable injection
   - Verify theme configuration

### Debug Commands

```bash
# Check DNS resolution
nslookup bakehouse.infra24.com

# Test SSL certificate
openssl s_client -connect bakehouse.infra24.com:443 -servername bakehouse.infra24.com

# Check HTTP headers
curl -I https://bakehouse.infra24.com

# Test tenant detection
curl -H "Host: bakehouse.infra24.com" http://localhost:3000/api/health
```

## Future Enhancements

### 1. Custom Domains
Allow organizations to use their own domains (e.g., `bakehouse.com`).

### 2. Dynamic Subdomains
Support dynamic subdomain creation for new organizations.

### 3. Domain Aliases
Support multiple domains pointing to the same tenant.

### 4. Geographic Routing
Route users to nearest server based on location.

---

**Last Updated**: January 2025
**Status**: Ready for Implementation
