#!/bin/bash

echo "🚀 Quick Deploy Setup for Bakehouse News"
echo "=========================================="

# Check if we're logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Please login to Vercel first: vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"

echo ""
echo "🔧 Setting up environment variables with placeholder values..."
echo "   (You can update these with real production values later)"
echo ""

# Set up environment variables with placeholder values
echo "Setting NEXT_PUBLIC_SUPABASE_URL..."
echo "https://placeholder.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
echo "placeholder-service-role-key" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --sensitive

echo "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "placeholder-anon-key" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Setting NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY..."
echo "pk_test_placeholder" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

echo "Setting CLERK_SECRET_KEY..."
echo "sk_test_placeholder" | vercel env add CLERK_SECRET_KEY production --sensitive

echo "Setting CLERK_WEBHOOK_SECRET..."
echo "placeholder-webhook-secret" | vercel env add CLERK_WEBHOOK_SECRET production --sensitive

echo "Setting RESEND_API_KEY..."
echo "placeholder-resend-key" | vercel env add RESEND_API_KEY production --sensitive

echo "Setting NEXT_PUBLIC_CLERK_SIGN_IN_URL..."
echo "/sign-in" | vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production

echo "Setting NEXT_PUBLIC_CLERK_SIGN_UP_URL..."
echo "/sign-up" | vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production

echo ""
echo "✅ Environment variables set up!"
echo ""
echo "📋 Next steps:"
echo "1. Verify: vercel env ls"
echo "2. Deploy: vercel --prod"
echo "3. Update with real values in Vercel dashboard if needed"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
