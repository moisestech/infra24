# 🚀 Quick Reference - Essential Scripts

## 🎯 Survey System (READY TO USE!)

**Status**: ✅ Fully implemented and ready
**Setup Time**: 0 minutes (already done!)

```bash
# Just start the dev server and go!
npm run dev
# Visit: http://localhost:3000/o/bakehouse/admin/surveys
```

---

## 🗄️ Database Setup (One-time)

### Complete System Setup
```bash
# 1. Start Supabase
supabase start

# 2. Run complete setup (includes all tables)
node scripts/database/setup/setup-supabase-complete.js

# 3. Populate studio data for map
node scripts/database/populate-studio-data.js
```

### Just Survey System
```bash
# Survey system is already set up!
# Just verify it's working:
supabase status
npm run dev
```

---

## 🎨 Studio & Artist Setup

### Populate Studio Data (for map functionality)
```bash
node scripts/database/populate-studio-data.js
```

### Assign Studios to Artists
```bash
node scripts/assign-studios-to-artists.js
```

---

## 📊 Sample Data (Optional)

### Add Sample Announcements
```bash
node scripts/data/seed/add-sample-announcements.js
```

### Add Sample Bookings
```bash
node scripts/data/seed/create-bakehouse-bookings.js
```

### Add Sample Artists
```bash
node scripts/data/seed/upload-artist-photos.js
```

---

## 🧪 Testing

### Test API Endpoints
```bash
node scripts/testing/api/test-api.js
```

### Test Build Process
```bash
npm run build
```

---

## 🔧 Maintenance

### Check Database Status
```bash
supabase status
supabase db diff
```

### View All Announcements
```bash
# Run in Supabase SQL editor
scripts/database/migrations/view-all-announcements.sql
```

### Clean Up Test Data
```bash
# Run in Supabase SQL editor
scripts/database/migrations/cleanup-fake-organizations.sql
```

---

## 📋 Most Important Files

### 🎯 Survey System (NEW)
- `supabase/migrations/20241222000001_create_survey_system.sql` - Database schema
- `app/api/surveys/` - API endpoints
- `app/o/[slug]/admin/surveys/` - Admin interface
- `app/o/[slug]/surveys/` - User interface

### 🗄️ Core System
- `supabase/migrations/20241220000001_create_infra24_tables.sql` - Main database
- `scripts/database/setup/setup-supabase-complete.js` - Complete setup
- `scripts/database/populate-studio-data.js` - Studio data

### 🎨 Studio Map
- `components/maps/InteractiveStudioMap.tsx` - Interactive map
- `app/o/bakehouse/map/page.tsx` - Map page
- `scripts/database/populate-studio-data.js` - Studio data

---

## 🚨 Emergency Commands

### Reset Everything (⚠️ Deletes all data)
```bash
supabase db reset
npm run dev
```

### Check What's Running
```bash
supabase status
npm run dev
```

### View Logs
```bash
supabase logs
```

---

## 🎉 You're All Set!

The survey system is **ready to use right now**. Just run `npm run dev` and visit the admin panel to create your first survey!

For the complete system setup, run the database setup scripts once, then you're good to go.

