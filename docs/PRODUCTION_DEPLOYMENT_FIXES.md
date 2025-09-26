# Production Deployment Fixes

## Issues Identified

### 1. 🔑 **Clerk Development Keys in Production**
**Error**: `Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production.`

**Solution**: Update your production environment variables in Vercel:

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to Environment Variables
4. Update the following variables with your **production** Clerk keys:

```bash
# Replace these with your PRODUCTION Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 2. 🌐 **CORS Issues with Clerk Authentication**
**Error**: `Access to fetch at 'https://relieved-akita-40.accounts.dev/sign-in' has been blocked by CORS policy`

**Solution**: This is related to the development keys issue above. Once you update to production keys, this should resolve.

### 3. 🔄 **Navigation Routing Issues**
**Error**: `Failed to fetch RSC payload for https://infra24.vercel.app/surveys/dashboard`

**Solution**: This might be due to browser cache or old navigation references. Let's fix this:

#### A. Clear Browser Cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache and cookies for the domain

#### B. Check for Old Navigation References
The error suggests there might be a link to `/surveys/dashboard` somewhere. Let's verify our navigation config is correct.

### 4. 🏗️ **Environment Configuration**

Make sure your production environment has these variables set:

```bash
# Clerk (PRODUCTION keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://infra24.vercel.app
```

## Step-by-Step Fix Process

### Step 1: Update Clerk Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your production application
3. Copy the production keys
4. Update Vercel environment variables
5. Redeploy the application

### Step 2: Verify Navigation Configuration
The unified navigation should be working correctly. If you're still seeing issues:

1. Check browser console for any remaining old navigation references
2. Clear browser cache completely
3. Test in an incognito/private window

### Step 3: Test Production Deployment
After updating the environment variables:

1. Redeploy the application
2. Test the main pages:
   - `/o/oolite` - Main Oolite page
   - `/o/oolite/surveys` - Surveys page
   - `/o/oolite/announcements` - Announcements page
   - `/o/oolite/users` - Users page

### Step 4: Monitor for Issues
Watch for these specific issues:
- ✅ No more "development keys" warnings
- ✅ No CORS errors
- ✅ Navigation works correctly
- ✅ Authentication flows properly

## Quick Fix Commands

If you need to quickly redeploy with updated environment variables:

```bash
# If using Vercel CLI
vercel --prod

# Or trigger a new deployment from GitHub
git commit --allow-empty -m "Trigger production deployment with updated env vars"
git push origin main
```

## Verification Checklist

- [ ] Clerk production keys are set in Vercel
- [ ] No "development keys" warning in console
- [ ] No CORS errors
- [ ] Navigation works on all pages
- [ ] Authentication flows work correctly
- [ ] All organization pages load properly

## If Issues Persist

If you're still seeing issues after following these steps:

1. **Check Vercel Function Logs**: Look at the Vercel dashboard for any server-side errors
2. **Browser Network Tab**: Check for any failed requests
3. **Console Errors**: Look for any remaining JavaScript errors
4. **Environment Variables**: Double-check all environment variables are set correctly

The main issue is likely the Clerk development keys being used in production. Once that's fixed, the CORS and navigation issues should resolve automatically.
