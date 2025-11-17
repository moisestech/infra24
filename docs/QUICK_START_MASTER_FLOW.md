# Quick Start: MASTER Flow Integration 🚀

> **Get up and running with MASTER flow integration in 15 minutes**

## 🎯 What This Does

This integration mirrors Cherese's MASTER flow into Infra24 for filtering, conflicts, and reports while using AppSheet as the interim front-end for requests and rentals. Infra24 becomes the validation + calendar brain.

## ⚡ Quick Start (15 minutes)

### 1. Run the Setup Script
```bash
# Navigate to project directory
cd /Users/moisessanabria/Documents/website/infra24

# Run the setup script
node scripts/start-master-flow-integration.js
```

### 2. Apply Database Migrations
```bash
# Run the generated migration
psql -f scripts/master-flow-integration-migration.sql
```

### 3. Configure API Keys
```bash
# Edit the generated config file
nano config/master-flow-config.json
```

Add your API keys:
```json
{
  "integration": {
    "google_calendar": {
      "enabled": true,
      "api_key": "YOUR_GOOGLE_CALENDAR_API_KEY",
      "client_id": "YOUR_GOOGLE_CLIENT_ID",
      "client_secret": "YOUR_GOOGLE_CLIENT_SECRET"
    },
    "appsheet": {
      "enabled": true,
      "app_id": "YOUR_APPSHEET_APP_ID",
      "api_key": "YOUR_APPSHEET_API_KEY"
    }
  }
}
```

### 4. Test the Setup
```bash
# Test the system
node scripts/comprehensive-system-test.js
```

## 🗄️ What Gets Created

### New Database Tables
- `calendar_integrations` - Google Calendar sync configuration
- `external_requests` - AppSheet request handling
- `conflict_logs` - Booking conflict tracking
- `ai_digests` - AI-generated summaries
- `analytics_events` - User behavior tracking

### New API Endpoints
- `/api/organizations/[orgId]/calendar/*` - Calendar integration
- `/api/organizations/[orgId]/appsheet/*` - AppSheet integration
- `/api/organizations/[orgId]/conflicts/*` - Conflict management
- `/api/organizations/[orgId]/ai/*` - AI features

### New UI Components
- `CalendarIntegrationSetup` - Google Calendar connection
- `ConflictResolutionModal` - Handle booking conflicts
- `AppSheetRequestViewer` - External request management
- `AIDigestPanel` - AI-generated insights

## 🔧 Configuration Options

### Google Calendar Integration
```json
{
  "google_calendar": {
    "enabled": true,
    "sync_frequency": "realtime",
    "conflict_detection": true,
    "auto_resolve": false
  }
}
```

### AppSheet Integration
```json
{
  "appsheet": {
    "enabled": true,
    "auto_approve": false,
    "notification_webhook": true,
    "data_mapping": "custom"
  }
}
```

### AI Features
```json
{
  "ai": {
    "digest_enabled": true,
    "digest_frequency": "weekly",
    "natural_language_queries": true,
    "insight_generation": true
  }
}
```

## 🧪 Testing Your Setup

### 1. Test Database Schema
```bash
# Check if tables were created
node scripts/test-schema.js
```

### 2. Test API Endpoints
```bash
# Test calendar integration
curl -X GET "http://localhost:3000/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/calendar/events"

# Test conflict detection
curl -X GET "http://localhost:3000/api/organizations/cf088ac1-39a5-4948-a72c-d8059c1ab739/conflicts"
```

### 3. Test UI Components
```bash
# Start the development server
npm run dev

# Visit the booking page
open http://localhost:3000/o/oolite/bookings
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test database connection
node scripts/test-database-connection.js
```

#### Migration Fails
```bash
# Check if tables already exist
psql -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# Drop and recreate if needed
psql -c "DROP TABLE IF EXISTS calendar_integrations, external_requests, conflict_logs CASCADE;"
```

#### API Keys Not Working
```bash
# Test Google Calendar API
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://www.googleapis.com/calendar/v3/calendars/primary/events"

# Test AppSheet API
curl -H "ApplicationAccessKey: YOUR_APPSHEET_KEY" \
  "https://api.appsheet.com/api/v2/apps/YOUR_APP_ID/tables/Requests"
```

## 📊 Monitoring

### Check System Status
```bash
# Run comprehensive test
node scripts/comprehensive-system-test.js

# Check database health
node scripts/test-database-connection.js

# Monitor API endpoints
node scripts/test-api-endpoints.js
```

### View Logs
```bash
# Check application logs
tail -f logs/app.log

# Check database logs
tail -f logs/database.log

# Check integration logs
tail -f logs/integrations.log
```

## 🎯 Next Steps

### Phase 1: Basic Integration (Week 1)
- [ ] Set up Google Calendar sync
- [ ] Implement conflict detection
- [ ] Create AppSheet webhook
- [ ] Test end-to-end flow

### Phase 2: Advanced Features (Week 2)
- [ ] Add AI digest system
- [ ] Implement natural language queries
- [ ] Create analytics dashboard
- [ ] Add mobile optimization

### Phase 3: Production Ready (Week 3)
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing
- [ ] Documentation completion

## 📚 Documentation

### Core Documentation
- [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) - Complete project overview
- [MASTER_FLOW_INTEGRATION_ROADMAP.md](./MASTER_FLOW_INTEGRATION_ROADMAP.md) - Detailed roadmap
- [DATABASE_SCHEMA_ANALYSIS.md](./DATABASE_SCHEMA_ANALYSIS.md) - Database design
- [SCRIPTS_BIBLE.md](./SCRIPTS_BIBLE.md) - Scripts reference

### API Documentation
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API docs
- [API_ROUTES_REFERENCE.md](./API_ROUTES_REFERENCE.md) - Route reference

### Development Guides
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Local development
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment

## 🆘 Support

### Getting Help
1. **Check the logs** - Most issues are logged
2. **Run the test suite** - `node scripts/comprehensive-system-test.js`
3. **Review documentation** - Check the relevant docs
4. **Check GitHub issues** - Look for similar problems

### Common Commands
```bash
# Quick system check
npm run test

# Reset database
npm run db:reset

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

---

## 🎉 Success!

If you've completed all steps, you should now have:
- ✅ Database schema extended for MASTER flow
- ✅ API endpoints ready for integration
- ✅ UI components prepared for new features
- ✅ Configuration files set up
- ✅ Testing framework in place

**Next**: Start implementing the actual integration logic following the roadmap!

---

*Last updated: January 2025*
*Status: Ready for Implementation*
