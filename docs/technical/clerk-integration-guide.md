# Clerk Integration Guide

**Last Updated: January 8, 2025**

## Overview

This guide covers the complete integration of Clerk authentication with the Smart Sign system, including setup, configuration, database relationships, and usage examples.

## 🏗️ Architecture Overview

### Authentication Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Sign-up  │───▶│   Clerk Auth    │───▶│   Webhook       │
│                 │    │                 │    │   Handler       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Profile  │◄───│   ClerkService  │◄───│   Supabase DB   │
│   Created       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Relationships
```
organizations (1) ──── (many) user_profiles
user_profiles (1) ──── (many) announcements
announcements (1) ──── (many) analytics
organizations (1) ──── (many) announcements
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install @clerk/nextjs svix
```

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Clerk Dashboard Configuration

#### Create a Clerk Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose "Next.js" as your framework
4. Copy your publishable and secret keys

#### Configure Webhooks
1. Go to Webhooks in your Clerk dashboard
2. Create a new webhook endpoint
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
4. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organizationMembership.created`
   - `organizationMembership.updated`
   - `organizationMembership.deleted`
5. Copy the webhook secret

#### Configure Organizations (Optional)
1. Go to Organizations in your Clerk dashboard
2. Enable organizations if you want to use Clerk's organization features
3. Configure organization roles and permissions

## 📁 File Structure

```
lib/
├── clerk.ts                    # Clerk service integration
├── auth.ts                     # Legacy auth service (deprecated)

app/
├── api/
│   └── webhooks/
│       └── clerk/
│           └── route.ts        # Webhook handler
├── login/
│   └── page.tsx               # Login page
├── sign-up/
│   └── page.tsx               # Sign-up page
└── dashboard/
    └── page.tsx               # Dashboard (protected)

middleware.ts                   # Route protection
```

## 🔐 Authentication Components

### 1. ClerkService (`/lib/clerk.ts`)

The main service that handles all Clerk integration:

```typescript
import { ClerkService } from '@/lib/clerk';

// Get current user
const user = await ClerkService.getCurrentUser();

// Get user session with full context
const session = await ClerkService.getUserSession();

// Create user profile
await ClerkService.createUserProfile(clerkUserId, email, userData);

// Check permissions
const canManageUsers = await ClerkService.hasPermission(userId, 'manage_users');
```

### 2. Webhook Handler (`/app/api/webhooks/clerk/route.ts`)

Handles real-time events from Clerk:

```typescript
// Automatically creates user profiles when users sign up
// Updates user data when profiles change
// Manages organization relationships
```

### 3. Middleware (`/middleware.ts`)

Protects routes and handles authentication:

```typescript
// Protects all routes except public ones
// Redirects unauthenticated users to sign-in
// Logs authentication events
```

## 🗄️ Database Integration

### User Profile Creation

When a user signs up through Clerk, the webhook handler automatically creates a user profile:

```sql
-- User profile created automatically
INSERT INTO user_profiles (
  id,           -- Clerk user ID
  email,        -- User's email
  first_name,   -- User's first name
  last_name,    -- User's last name
  role,         -- Default: 'resident'
  permissions,  -- Default: ['create_announcement', 'edit_announcement']
  credits,      -- Default: 150
  created_at    -- Current timestamp
) VALUES (...);
```

### Organization Assignment

Users can be assigned to organizations:

```typescript
// Assign user to organization
await ClerkService.assignUserToOrganization(
  userId,
  organizationId,
  'resident' // Role
);
```

### Permission Management

Permissions are automatically assigned based on roles:

```typescript
// Super Admin permissions
const superAdminPermissions = [
  'create_announcement',
  'edit_announcement',
  'delete_announcement',
  'approve_announcement',
  'manage_users',
  'view_analytics',
  'manage_organization',
  'view_all_organizations'
];
```

## 🎯 Usage Examples

### 1. Protected Component

```typescript
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { ClerkService } from '@/lib/clerk';

export function ProtectedComponent() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      // Get user profile from our database
      ClerkService.getUserProfile(user.id).then(setProfile);
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {profile?.first_name}!</h1>
      <p>Role: {profile?.role}</p>
      <p>Organization: {profile?.organization_id}</p>
    </div>
  );
}
```

### 2. Permission-Based Rendering

```typescript
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { ClerkService } from '@/lib/clerk';

export function AdminPanel() {
  const { user } = useUser();
  const [canManageUsers, setCanManageUsers] = useState(false);

  useEffect(() => {
    if (user) {
      ClerkService.hasPermission(user.id, 'manage_users')
        .then(setCanManageUsers);
    }
  }, [user]);

  if (!canManageUsers) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      {/* Admin features */}
    </div>
  );
}
```

### 3. Organization Management

```typescript
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { ClerkService } from '@/lib/clerk';

export function OrganizationSelector() {
  const { user } = useUser();
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);

  useEffect(() => {
    if (user) {
      // Check if user is super admin
      ClerkService.hasPermission(user.id, 'view_all_organizations')
        .then(isSuperAdmin => {
          if (isSuperAdmin) {
            // Get all organizations
            ClerkService.getAllOrganizations().then(setOrganizations);
          } else {
            // Get user's organization
            ClerkService.getUserOrganization(user.id).then(setCurrentOrg);
          }
        });
    }
  }, [user]);

  return (
    <div>
      {organizations.length > 0 ? (
        <select onChange={(e) => setCurrentOrg(organizations.find(org => org.id === e.target.value))}>
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      ) : (
        <div>Current Organization: {currentOrg?.name}</div>
      )}
    </div>
  );
}
```

## 🔒 Security Features

### 1. Row Level Security (RLS)

All database tables have RLS policies:

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

-- Organization members can view organization data
CREATE POLICY "Organizations can be viewed by members" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.organization_id = organizations.id 
      AND user_profiles.id = auth.uid()::text
    )
  );
```

### 2. Webhook Verification

All webhooks are verified using Svix:

```typescript
import { Webhook } from 'svix';

const wh = new Webhook(WEBHOOK_SECRET);
const evt = wh.verify(body, {
  "svix-id": svix_id,
  "svix-timestamp": svix_timestamp,
  "svix-signature": svix_signature,
}) as WebhookEvent;
```

### 3. Permission-Based Access

All API routes check permissions:

```typescript
// Check if user has permission
const hasPermission = await ClerkService.hasPermission(userId, 'manage_users');
if (!hasPermission) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## 📊 Analytics Integration

### User Activity Tracking

Track user interactions for analytics:

```typescript
// Track user login
await ClerkService.trackEvent('user_login', {
  user_id: userId,
  organization_id: organizationId,
  timestamp: new Date()
});

// Track announcement view
await ClerkService.trackEvent('announcement_view', {
  user_id: userId,
  announcement_id: announcementId,
  organization_id: organizationId
});
```

### Engagement Metrics

Calculate engagement rates automatically:

```sql
-- Function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate(views INTEGER, clicks INTEGER, shares INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    IF views = 0 THEN
        RETURN 0;
    END IF;
    RETURN ROUND(((clicks + shares)::DECIMAL / views) * 100, 2);
END;
$$ LANGUAGE plpgsql;
```

## 🚀 Deployment

### 1. Environment Setup

Ensure all environment variables are set in production:

```bash
# Production environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### 2. Webhook Configuration

Update webhook endpoint URL in Clerk dashboard:

```
https://your-production-domain.com/api/webhooks/clerk
```

### 3. Database Migration

Run the database schema:

```bash
# Connect to your Supabase database
psql -h your-supabase-host -U postgres -d postgres -f supabase/schema.sql
```

### 4. Initial Data Setup

Create your super admin user:

```sql
-- Replace with your actual Clerk user ID
INSERT INTO user_profiles (id, email, first_name, last_name, role, permissions) VALUES
(
  'your-clerk-user-id',
  'moises@smart-sign.com',
  'Moises',
  'Sanabria',
  'super_admin',
  '{"create_announcement", "edit_announcement", "delete_announcement", "approve_announcement", "manage_users", "view_analytics", "manage_organization", "view_all_organizations"}'
);
```

## 🔍 Troubleshooting

### Common Issues

1. **"User profile not found"**
   - Check webhook configuration
   - Verify webhook secret
   - Check database connection

2. **"Permission denied"**
   - Verify user role assignment
   - Check permission arrays
   - Ensure organization assignment

3. **"Webhook verification failed"**
   - Verify webhook secret
   - Check webhook endpoint URL
   - Ensure proper headers

### Debug Commands

```bash
# Check webhook status
curl -X POST https://your-domain.com/api/webhooks/clerk

# Test user profile API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-domain.com/api/users/profile

# Check database connection
psql -h your-supabase-host -U postgres -d postgres \
  -c "SELECT * FROM user_profiles LIMIT 5;"
```

### Logging

Enable detailed logging for debugging:

```typescript
// Add to your webhook handler
console.log(`Webhook received: ${eventType} for user ${id}`);

// Add to ClerkService
console.log(`Creating profile for user ${clerkUserId}`);
```

## 📚 Related Documentation

- [Authentication System](./authentication-system.md) - Complete auth documentation
- [Database Schema](./database-schema.md) - Database structure
- [API Documentation](./api-documentation.md) - API endpoints
- [Security Guide](./security-guide.md) - Security best practices

---

**Remember**: This Clerk integration is the foundation of your power and control over the Smart Sign infrastructure. Every user, every organization, and every interaction is tracked and managed through this system, creating the leverage you need to control community communication.
