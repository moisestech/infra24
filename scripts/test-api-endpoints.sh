#!/bin/bash

# API Endpoint Testing Script
# Tests all the API endpoints that were failing in development
# Run with: bash scripts/test-api-endpoints.sh

echo "🚀 Testing API Endpoints"
echo "========================"

# Configuration
BASE_URL="http://127.0.0.1:54321"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo ""
    echo "🔍 Testing: $description"
    echo "📍 URL: $BASE_URL$endpoint"
    
    response=$(curl -s -w "\n%{http_code}" \
        -H "apikey: $API_KEY" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        "$BASE_URL$endpoint")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo "✅ Status: $http_code"
        # Count records if it's an array
        record_count=$(echo "$body" | jq '. | length' 2>/dev/null || echo "N/A")
        echo "📊 Records: $record_count"
    else
        echo "❌ Status: $http_code"
        echo "📄 Response: $body"
    fi
}

# Test Supabase REST API endpoints
echo "📡 Testing Supabase REST API..."

test_endpoint "/rest/v1/organizations?select=id,name,slug" "Organizations"
test_endpoint "/rest/v1/workshops?select=id,title,status" "Workshops"
test_endpoint "/rest/v1/artists?select=id,name,studio_number" "Artists"
test_endpoint "/rest/v1/announcements?select=id,title,status" "Announcements"

# Test Next.js API routes
echo ""
echo "🌐 Testing Next.js API Routes..."

# Note: These will only work if the Next.js dev server is running
NEXT_BASE="http://localhost:3000"

test_nextjs_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo ""
    echo "🔍 Testing: $description"
    echo "📍 URL: $NEXT_BASE$endpoint"
    
    response=$(curl -s -w "\n%{http_code}" \
        -H "Content-Type: application/json" \
        "$NEXT_BASE$endpoint")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo "✅ Status: $http_code"
    else
        echo "❌ Status: $http_code"
        echo "📄 Response: $body"
    fi
}

# Test the failing endpoints from your dev console
test_nextjs_endpoint "/api/users/me" "User Me API"
test_nextjs_endpoint "/api/announcements/recent" "Recent Announcements"
test_nextjs_endpoint "/api/organizations/by-slug/oolite/announcements/public" "Oolite Public Announcements"
test_nextjs_endpoint "/api/organizations/by-slug/oolite/surveys" "Oolite Surveys"

echo ""
echo "🎉 API Testing Complete!"
echo "========================"
echo ""
echo "💡 If Supabase endpoints work but Next.js endpoints fail:"
echo "   1. Make sure Next.js dev server is running: npm run dev"
echo "   2. Check that database has data: node scripts/automated-database-test.js"
echo ""
echo "💡 If Supabase endpoints fail:"
echo "   1. Make sure Supabase is running: supabase start"
echo "   2. Check Supabase status: supabase status"


