#!/bin/bash

echo "🚀 Infra24 Database Setup Test"
echo "=============================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if command_exists supabase; then
    echo "✅ Supabase CLI found"
else
    echo "❌ Supabase CLI not found. Install with: npm install -g supabase"
    exit 1
fi

if command_exists node; then
    echo "✅ Node.js found"
else
    echo "❌ Node.js not found"
    exit 1
fi

if command_exists docker; then
    echo "✅ Docker found"
else
    echo "❌ Docker not found"
    exit 1
fi

# Check if Docker is running
if docker info >/dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running. Please start Docker Desktop"
    exit 1
fi

echo ""
echo "🧹 Cleaning up any stuck processes..."

# Kill any stuck processes (ignore errors)
pkill -f "supabase" 2>/dev/null || true
pkill -f "node.*scripts" 2>/dev/null || true

echo "✅ Cleanup complete"

echo ""
echo "🚀 Starting Supabase..."
echo "This may take a few minutes..."

# Start Supabase
if supabase start; then
    echo "✅ Supabase started successfully"
else
    echo "❌ Failed to start Supabase"
    exit 1
fi

echo ""
echo "🔍 Testing database connection..."

# Test database connection
if node scripts/quick-test.js; then
    echo "✅ Database test passed"
else
    echo "❌ Database test failed"
    exit 1
fi

echo ""
echo "📊 Checking if data needs to be populated..."

# Check if we need to populate data
if node scripts/setup-database-data.js; then
    echo "✅ Database setup complete"
else
    echo "❌ Database setup failed"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "You can now:"
echo "1. Start the dev server: npm run dev"
echo "2. Open Supabase Studio: http://127.0.0.1:54323"
echo "3. Test API endpoints: bash scripts/test-api-endpoints.sh"
echo ""
echo "Database URLs:"
echo "- API: http://127.0.0.1:54321"
echo "- Studio: http://127.0.0.1:54323"
echo "- DB: postgresql://postgres:postgres@127.0.0.1:54322/postgres"


