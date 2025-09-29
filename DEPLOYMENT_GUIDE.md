# 🚀 Deployment Guide - Bakehouse News

## Current Status
- ✅ App builds successfully locally
- ✅ Schema aligned with production
- ❌ Deployment failing due to missing environment variables

## Required Environment Variables

### 1. Supabase (Production)
You need to get these from your production Supabase project:

```bash
# Add to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Value: https://your-project.supabase.co

vercel env add SUPABASE_SERVICE_ROLE_KEY production --sensitive
# Value: Your production service role key

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Value: Your production anon key
```

### 2. Clerk (Production)
You need to get these from your production Clerk project:

```bash
# Add to Vercel
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Value: pk_live_... (production key)

vercel env add CLERK_SECRET_KEY production --sensitive
# Value: sk_live_... (production secret)

vercel env add CLERK_WEBHOOK_SECRET production --sensitive
# Value: Your webhook secret
```

### 3. Other Services
```bash
# Add to Vercel
vercel env add RESEND_API_KEY production --sensitive
# Value: Your Resend API key

vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production
# Value: /sign-in

vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production
# Value: /sign-up
```

## Quick Setup Commands

### Option 1: Manual Setup
Run each command and provide the values when prompted:

```bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production --sensitive
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Clerk
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production --sensitive
vercel env add CLERK_WEBHOOK_SECRET production --sensitive

# Other
vercel env add RESEND_API_KEY production --sensitive
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production
```

### Option 2: Use the Setup Script
```bash
./scripts/setup-vercel-env.sh
```

## Verify Setup
```bash
# Check environment variables
vercel env ls

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

## Troubleshooting

### Build Fails
1. Check environment variables: `vercel env ls`
2. Check build logs: `vercel logs <deployment-url>`
3. Test locally with production env: `vercel env pull .env.local`

### Environment Variables Missing
1. Make sure you're using production values (not localhost)
2. Check that sensitive variables are marked with `--sensitive`
3. Verify Supabase project is set to production mode

## Next Steps After Deployment

1. **Test the deployed app**
2. **Set up API testing** (Step 2 of our plan)
3. **Add component testing** (Step 3 of our plan)
4. **Consider Storybook** (Step 4 of our plan)

## Production URLs
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Vercel Dashboard**: https://vercel.com/dashboard