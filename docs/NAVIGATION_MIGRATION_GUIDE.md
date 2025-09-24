# Navigation Migration Guide

## Overview
This guide explains how to migrate from the old navigation components (`Navigation` and `OoliteNavigation`) to the new unified `UnifiedNavigation` component.

## Quick Migration Steps

### 1. Update Imports
```typescript
// Old
import { OoliteNavigation } from '@/components/tenant/OoliteNavigation'
import Navigation from '@/components/ui/Navigation'

// New
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
```

### 2. Replace Component Usage
```typescript
// Old
<OoliteNavigation />

// New
<UnifiedNavigation config={ooliteConfig} userRole="admin" />
```

### 3. Configuration Options

#### For Oolite Arts:
```typescript
<UnifiedNavigation config={ooliteConfig} userRole="admin" />
```

#### For Bakehouse Art Complex:
```typescript
<UnifiedNavigation config={bakehouseConfig} userRole="user" />
```

#### For Custom Organizations:
```typescript
const customConfig: NavigationConfig = {
  organization: {
    id: 'your-org-id',
    name: 'Your Organization',
    slug: 'your-slug',
    logo_url: '/your-logo.png'
  },
  colors: {
    primary: '#your-color',
    // ... other colors
  },
  features: {
    adminTools: true,
    surveys: true,
    // ... other features
  },
  navigation: {
    userItems: [
      // ... your navigation items
    ],
    adminItems: [
      // ... your admin items
    ]
  }
}

<UnifiedNavigation config={customConfig} userRole="admin" />
```

## User Roles
- `user`: Standard user access
- `admin`: Admin access with admin tools
- `super_admin`: Full admin access

## Feature Flags
Each organization can enable/disable specific features:
- `adminTools`: Show admin tools dropdown
- `surveys`: Enable survey functionality
- `analytics`: Enable analytics features
- `digitalLab`: Enable digital lab features
- `workshops`: Enable workshop features
- `announcements`: Enable announcements
- `members`: Enable member management
- `submissions`: Enable submission management
- `roadmap`: Enable roadmap features
- `budget`: Enable budget features
- `impactRoi`: Enable impact & ROI tracking
- `aiTools`: Enable AI tools
- `bookings`: Enable booking management

## Migration Checklist
- [x] Update imports
- [x] Replace component usage
- [x] Choose appropriate configuration
- [x] Set correct user role
- [x] Test navigation functionality
- [x] Verify feature flags work correctly
- [x] Test mobile navigation
- [x] Verify theme colors

## Migration Status ✅ COMPLETE

### Successfully Migrated (36 files):
- ✅ All Oolite pages (analytics, workshops, digital lab, etc.)
- ✅ All Bakehouse pages (workshops, artists, etc.)
- ✅ All dynamic organization pages (`/o/[slug]/*`)
- ✅ All user management pages
- ✅ All announcement pages
- ✅ All survey pages
- ✅ All admin pages

### Migration Script
A migration script was created and successfully executed:
```bash
node scripts/migrate-navigation.js
```

**Results:**
- ✅ 36 files migrated successfully
- ❌ 0 failures
- 📄 Detailed report: `migration-report.json`

## Benefits of New Navigation
- **Unified**: Single component for all organizations
- **Configurable**: Easy to customize per organization
- **Feature Flags**: Enable/disable features per org
- **Role-based**: Different navigation based on user role
- **Responsive**: Better mobile experience
- **Maintainable**: Modular subcomponents
- **Themeable**: Organization-specific colors and branding

## Next Steps
1. **Remove old components**: Delete `OoliteNavigation.tsx` and old `Navigation.tsx`
2. **Clean up imports**: Remove any remaining references to old components
3. **Test thoroughly**: Verify all pages work correctly
4. **Update documentation**: Update any remaining docs that reference old navigation
