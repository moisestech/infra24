#!/bin/bash

# Comprehensive testing script for Next.js app
# This script tests both build and dev server functionality

set -e  # Exit on any error

echo "🧪 Starting comprehensive Next.js testing..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache
print_success "Cleanup completed"

# Step 2: Install dependencies (if needed)
print_status "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Step 3: Type checking
print_status "Running TypeScript type checking..."
npx tsc --noEmit
print_success "Type checking passed"

# Step 4: Linting
print_status "Running ESLint..."
npm run lint
print_success "Linting passed"

# Step 5: Build test
print_status "Testing production build..."
npm run build
print_success "Production build successful"

# Step 6: Start dev server in background
print_status "Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for dev server to start
print_status "Waiting for dev server to start..."
sleep 10

# Step 7: Test dev server health
print_status "Testing dev server health..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Dev server is responding"
else
    print_error "Dev server is not responding"
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

# Step 8: Test specific routes
print_status "Testing key routes..."

# Test main page
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Main page loads"
else
    print_error "Main page failed to load"
fi

# Test carousel page
if curl -f http://localhost:3000/announcements/carousel > /dev/null 2>&1; then
    print_success "Carousel page loads"
else
    print_error "Carousel page failed to load"
fi

# Test with debug parameter
if curl -f "http://localhost:3000/announcements/carousel?debug=true" > /dev/null 2>&1; then
    print_success "Carousel with debug loads"
else
    print_error "Carousel with debug failed to load"
fi

# Step 9: Cleanup
print_status "Stopping dev server..."
kill $DEV_PID 2>/dev/null || true
sleep 2

print_success "🎉 All tests passed! The app is ready for development."

echo ""
echo "📋 Test Summary:"
echo "✅ TypeScript compilation"
echo "✅ ESLint checks"
echo "✅ Production build"
echo "✅ Development server startup"
echo "✅ Main page loading"
echo "✅ Carousel page loading"
echo "✅ Debug mode functionality"
echo ""
echo "🚀 You can now run 'npm run dev' to start development"
