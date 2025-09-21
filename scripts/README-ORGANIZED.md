# Scripts Organization Guide

This document organizes all scripts by category and highlights which ones you need to run for different system setups.

## 📋 Quick Setup Guides

### 🎯 Survey System Setup (NEW)
**Required scripts to run in order:**

1. **Database Migration** (Run once):
   ```bash
   # Apply the survey system migration
   supabase db reset  # If starting fresh
   # OR
   supabase migration up  # If adding to existing DB
   ```

2. **Migration File**:
   - `supabase/migrations/20241222000001_create_survey_system.sql` ✅ (Already created)

3. **API Routes** (Already implemented):
   - `app/api/surveys/route.ts` ✅
   - `app/api/surveys/[id]/route.ts` ✅
   - `app/api/surveys/[id]/responses/route.ts` ✅
   - `app/api/surveys/[id]/invitations/route.ts` ✅
   - `app/api/surveys/templates/route.ts` ✅
   - `app/api/surveys/[id]/analytics/route.ts` ✅

4. **UI Pages** (Already implemented):
   - `app/o/[slug]/admin/surveys/page.tsx` ✅
   - `app/o/[slug]/surveys/page.tsx` ✅
   - `app/o/[slug]/surveys/[id]/page.tsx` ✅
   - `app/o/[slug]/surveys/[id]/thank-you/page.tsx` ✅

**Survey System is READY TO USE!** 🎉

---

## 📁 Script Categories

### 🗄️ Database Migrations
**Location**: `scripts/database/migrations/` & `supabase/migrations/`

#### Core System Migrations
- `20241220000001_create_infra24_tables.sql` - **CRITICAL** - Main database schema
- `20241220000002_create_booking_tables.sql` - Booking system tables
- `20241222000001_create_survey_system.sql` - **NEW** - Survey system tables

#### Announcements & Events
- `add-christine-cortes-september-announcements.sql` - Sample announcements
- `create-test-announcements.sql` - Test announcement data
- `publish-test-announcements.sql` - Publish test announcements
- `debug-announcements.sql` - Debug announcement queries
- `view-all-announcements.sql` - View all announcements

#### Artist & Studio Management
- `create-bakehouse-artists.sql` - Sample artist data
- `fix_artist_profiles_rls.sql` - Fix RLS policies for artist profiles
- `fix-artist-tagging.sql` - Fix artist tagging system
- `upload-artist-profile-images.sql` - Upload artist images
- `upload-artist-images-optimized.sql` - Optimized image upload

#### User & Organization Management
- `create-sample-users-and-claims.sql` - Sample user data
- `setup-user-display-system.sql` - User display system
- `create-organization-customization.sql` - Organization customization
- `add-horizontal-logo-column.sql` - Add logo column
- `add-primary-colors-organization.js` - Add primary colors

#### Maintenance & Cleanup
- `cleanup-duplicate-events.sql` - Remove duplicate events
- `cleanup-fake-organizations.sql` - Remove test organizations
- `check-org-users-and-profiles.sql` - Check user profiles
- `check-user-permissions.sql` - Check user permissions

### 🎨 Artist & Studio Scripts
**Location**: `scripts/` (root level)

#### Studio Management
- `assign-studios-to-artists.js` - Assign studios to artists
- `map-artists-to-studios.js` - Map artists to studio locations
- `populate-studio-data.js` - **CRITICAL** - Populate studio data from SVG
- `test-studio-connections.js` - Test studio connections

#### Artist Data
- `check-artist-schema.js` - Validate artist schema
- `cleanup-old-structure.js` - Clean up old data structure

### 📊 Data Management
**Location**: `scripts/data/`

#### Seed Data
- `seed/add-bakehouse-custom-types.js` - Bakehouse custom types
- `seed/add-christine-cortes-september-announcements.js` - Christine's announcements
- `seed/add-marilyn-loddi-performance.js` - Marilyn's performance data
- `seed/add-primary-colors-organization.js` - Organization colors
- `seed/add-sample-announcements.js` - Sample announcements
- `seed/create-additional-organizations.js` - Additional organizations
- `seed/upload-artist-photos.js` - Upload artist photos

#### Booking Data
- `seed/create-bakehouse-bookings.js` - Bakehouse booking data
- `seed/create-mock-booking-data.js` - Mock booking data
- `seed/create-real-booking-data.js` - Real booking data

#### Test Data
- `seed/create-test-announcements-for-smartsign.js` - SmartSign test data

### 🛠️ Setup & Configuration
**Location**: `scripts/database/setup/`

#### Initial Setup
- `setup-supabase-complete.js` - **CRITICAL** - Complete Supabase setup
- `setup-supabase.js` - Basic Supabase setup
- `setup-tables-simple.js` - Simple table setup
- `setup-auth.js` - Authentication setup
- `setup-organization-customization.js` - Organization customization

#### Migration Runner
- `run-migration.js` - Run database migrations

### 🧪 Testing Scripts
**Location**: `scripts/testing/`

#### API Testing
- `api/test-announcement-with-org.js` - Test announcements with org
- `api/test-api.js` - General API testing
- `api/test-super-admin-access.js` - Test super admin access

#### Integration Testing
- `integration/` - Integration test files

#### Performance Testing
- `performance/` - Performance test files

#### Migration Testing
- `test-migration.js` - Test migration scripts

### 🔧 Utilities
**Location**: `scripts/utilities/`

#### Build & Development
- `build/test-build-and-dev.sh` - Test build and dev processes

#### Maintenance
- `maintenance/` - Maintenance utilities

#### Monitoring
- `monitoring/` - Monitoring utilities

---

## 🚀 Quick Start Commands

### For Survey System (NEW)
```bash
# 1. Ensure Supabase is running
supabase start

# 2. Apply survey migration (if not already applied)
supabase migration up

# 3. Verify survey tables exist
supabase db diff

# 4. Test the survey system
npm run dev
# Visit: http://localhost:3000/o/bakehouse/admin/surveys
```

### For Complete System Setup
```bash
# 1. Start Supabase
supabase start

# 2. Run complete setup
node scripts/database/setup/setup-supabase-complete.js

# 3. Populate studio data
node scripts/database/populate-studio-data.js

# 4. Add sample data (optional)
node scripts/data/seed/add-sample-announcements.js
node scripts/data/seed/create-bakehouse-bookings.js

# 5. Start development server
npm run dev
```

### For Artist/Studio Setup Only
```bash
# 1. Ensure database is set up
supabase start

# 2. Populate studio data
node scripts/database/populate-studio-data.js

# 3. Assign studios to artists
node scripts/assign-studios-to-artists.js
```

---

## 📝 Notes

- **Survey System**: Fully implemented and ready to use
- **Core System**: Requires `20241220000001_create_infra24_tables.sql`
- **Studio Data**: Requires `populate-studio-data.js` for map functionality
- **Sample Data**: Optional but helpful for testing

## 🔍 Troubleshooting

If you encounter issues:
1. Check Supabase is running: `supabase status`
2. Verify migrations: `supabase migration list`
3. Check logs: `supabase logs`
4. Reset if needed: `supabase db reset` (⚠️ This will delete all data)

