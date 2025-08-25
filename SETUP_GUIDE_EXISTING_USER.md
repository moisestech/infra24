# Smart Sign Setup Guide for Existing User Table

This guide helps you integrate Smart Sign functionality with your existing User table structure.

## Prerequisites

- Existing Next.js app with Clerk authentication
- Existing User table in Supabase with `clerk_user_id`, `email`, etc.
- Supabase project with RLS enabled

## 1. Environment Variables

Add these to your `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 2. Install Dependencies

```bash
npm install @clerk/nextjs @supabase/supabase-js svix
```

## 3. Update Your User Table

Run this SQL in your Supabase SQL Editor to add Smart Sign fields to your existing User table:

```sql
-- Add organization and role fields to existing User table
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS organization_id uuid;
ALTER TABLE public."User" ADD COLUMN IF NOT EXISTS role text DEFAULT 'resident';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_org ON public."User"(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_clerk ON public."User"(clerk_user_id);
```

## 4. Run Smart Sign Schema

Run the `supabase/smart-sign-setup.sql` file in your Supabase SQL Editor. This will:

- Create ENUM types for announcements and roles
- Create organizations table
- Create artist_profiles table (extends User table)
- Create announcements table
- Create artist_claim_requests table
- Set up RLS policies
- Add helper functions
- Create indexes for performance

## 5. Configure Clerk Webhook

1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Create a new webhook endpoint
4. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
5. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Copy the webhook secret and add it to your `.env.local`

## 6. Update Your Layout

Make sure your `app/layout.tsx` includes ClerkProvider:

```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

## 7. Add Middleware

Create or update `middleware.ts` in your root directory:

```tsx
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/webhooks/clerk"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## 8. Test the Integration

1. **Test Authentication**: Visit `/sign-in` and `/sign-up` pages
2. **Test Webhook**: Create a new user in Clerk and check if they appear in your User table
3. **Test RLS**: Try accessing protected routes and verify permissions work

## 9. Add Smart Sign Pages

The following pages are now available:

- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/profile` - User profile page
- `/artists` - Artist directory
- `/artists/claim` - Artist claim requests
- `/artists/[id]` - Individual artist profile

## 10. API Endpoints

These API endpoints are now available:

- `GET /api/users/profile` - Get current user profile
- `GET /api/organizations` - Get organizations
- `GET /api/artists` - Get artists
- `POST /api/artists/claim` - Submit claim request
- `GET /api/artists/[id]` - Get specific artist

## 11. Database Structure

Your database now has these main tables:

### User (existing, extended)
- `clerk_user_id` - Links to Clerk user
- `organization_id` - Links to organization
- `role` - User role (resident, moderator, org_admin, super_admin)

### organizations
- `id`, `name`, `slug`
- `subscription_tier`, `subscription_status`
- `settings` - JSON configuration

### artist_profiles
- `user_id` - Links to User table
- `organization_id` - Links to organization
- `studio_number`, `studio_type`, `bio`
- `is_claimed`, `claimed_at`

### announcements
- `organization_id` - Links to organization
- `author_user_id` - Links to User table
- `title`, `body`, `status`
- `published_at`, `expires_at`

## 12. Role-Based Permissions

The system supports these roles:

- **super_admin**: Full system access
- **org_admin**: Organization management
- **moderator**: Content moderation
- **resident**: Basic user access
- **guest**: Public content only

## 13. Testing

Run these SQL queries to test RLS:

```sql
-- Test as a specific user
SELECT public.test_as_user('user_2abc123');

-- Test RLS policies
SELECT * FROM public.test_rls();
```

## 14. Next Steps

1. **Customize UI**: Update the sign-in/sign-up pages to match your design
2. **Add Features**: Implement announcement creation, artist claiming
3. **Configure Organizations**: Set up your first organization (Bakehouse)
4. **Add Artists**: Import existing artist data
5. **Set Up Analytics**: Track engagement and usage

## Troubleshooting

### Webhook Issues
- Check webhook secret in `.env.local`
- Verify webhook URL is accessible
- Check Supabase logs for errors

### RLS Issues
- Ensure user has proper role assigned
- Check organization_id is set correctly
- Verify JWT claims are being passed

### Authentication Issues
- Verify Clerk keys are correct
- Check middleware configuration
- Ensure ClerkProvider is in layout

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set
4. Test webhook delivery in Clerk dashboard
