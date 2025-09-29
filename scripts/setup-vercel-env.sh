#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps set up the required environment variables for deployment

echo "🚀 Setting up Vercel Environment Variables for Bakehouse News"
echo "=============================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"

# Check if we're logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"

echo ""
echo "📋 Required Environment Variables:"
echo "1. NEXT_PUBLIC_SUPABASE_URL"
echo "2. SUPABASE_SERVICE_ROLE_KEY"
echo "3. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "4. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "5. CLERK_SECRET_KEY"
echo "6. CLERK_WEBHOOK_SECRET"
echo "7. RESEND_API_KEY"
echo ""

# Function to add environment variable
add_env_var() {
    local var_name=$1
    local is_sensitive=$2
    
    echo "🔧 Adding $var_name..."
    
    if [ "$is_sensitive" = "true" ]; then
        vercel env add "$var_name" production --sensitive
    else
        vercel env add "$var_name" production
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ $var_name added successfully"
    else
        echo "❌ Failed to add $var_name"
    fi
    echo ""
}

# Add environment variables
echo "Please provide the values for each environment variable:"
echo ""

# Public variables (not sensitive)
add_env_var "NEXT_PUBLIC_SUPABASE_URL" false
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" false
add_env_var "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" false

# Sensitive variables
add_env_var "SUPABASE_SERVICE_ROLE_KEY" true
add_env_var "CLERK_SECRET_KEY" true
add_env_var "CLERK_WEBHOOK_SECRET" true
add_env_var "RESEND_API_KEY" true

echo "🎉 Environment variables setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify environment variables: vercel env ls"
echo "2. Deploy to production: vercel --prod"
echo "3. Check deployment status: vercel ls"
echo ""
echo "🔗 Useful commands:"
echo "   vercel env ls                    # List all environment variables"
echo "   vercel env rm <name>             # Remove an environment variable"
echo "   vercel logs <deployment-url>     # Check deployment logs"
echo "   vercel --prod                    # Deploy to production"
