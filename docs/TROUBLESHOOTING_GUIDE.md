# Infra24 Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Database Issues

#### Database Connection Failed
**Error:** `relation "public.organizations" does not exist`

**Solution:**
```bash
# Check Supabase status
npx supabase status

# Restart Supabase
npx supabase stop
npx supabase start

# Run schema setup
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql
```

#### Column Not Found
**Error:** `column "slug" does not exist`

**Solution:**
```bash
# Check table structure
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d workshop_chapters"

# Use correct column name (chapter_slug instead of slug)
```

#### Foreign Key Constraint
**Error:** `violates foreign key constraint`

**Solution:**
```bash
# Check if organization exists
psql postgresql://postgres:postgres@localhost:54322/postgres -c "SELECT id FROM organizations WHERE slug = 'oolite';"

# Create organization if missing
node scripts/create-organization.js
```

### Authentication Issues

#### Clerk Authentication Failed
**Error:** `No organization ID found for slug`

**Solution:**
```bash
# Check middleware configuration
cat middleware.ts

# Verify organization exists
psql postgresql://postgres:postgres@localhost:54322/postgres -c "SELECT * FROM organizations;"

# Check Clerk configuration
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

#### Route Protection Issues
**Error:** `401 Unauthorized`

**Solution:**
```bash
# Check middleware routes
grep -n "isPublicRoute" middleware.ts

# Add route to public routes if needed
# isPublicRoute: ['/api/availability(.*)', '/api/bookings(.*)']
```

### API Issues

#### 404 Not Found
**Error:** `No Route matched with those values`

**Solution:**
```bash
# Check API route structure
ls -la app/api/

# Verify dynamic route naming
# Use [id] not [bookingId] for consistency
```

#### Database Column Mismatch
**Error:** `Could not find the 'organization_id' column`

**Solution:**
```bash
# Check database schema
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d bookings"

# Use correct column name (org_id instead of organization_id)
```

### Frontend Issues

#### Component Not Rendering
**Error:** Loading spinner stuck

**Solution:**
```bash
# Check browser console for errors
# Verify API responses
curl "http://localhost:3000/api/organizations/by-slug/oolite"

# Check component props
console.log('Component props:', props);
```

#### Styling Issues
**Error:** Colors not applying

**Solution:**
```bash
# Check tenant configuration
console.log('Tenant config:', tenantConfig);

# Verify primary color values
# Use !important for inline styles if needed
```

### Booking System Issues

#### Availability API 404
**Error:** `GET /api/availability 404`

**Solution:**
```bash
# Check middleware configuration
grep -n "availability" middleware.ts

# Verify API route exists
ls -la app/api/availability/

# Test with curl
curl "http://localhost:3000/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"
```

#### Booking Creation Failed
**Error:** `Failed to create booking`

**Solution:**
```bash
# Check server logs
npm run dev

# Verify resource exists
psql postgresql://postgres:postgres@localhost:54322/postgres -c "SELECT * FROM resources;"

# Test with correct resource ID
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"2133fe94-fb12-41f8-ab37-ea4acd4589f6","resource_id":"remote_visit","start_time":"2025-10-07T12:00:00-04:00","end_time":"2025-10-07T12:30:00-04:00","artist_name":"Test Artist","artist_email":"test@example.com","goal_text":"Test booking"}'
```

#### Calendar URLs 404
**Error:** `GET /api/bookings/{id}/calendar-urls 404`

**Solution:**
```bash
# Check dynamic route structure
ls -la app/api/bookings/

# Verify booking exists
psql postgresql://postgres:postgres@localhost:54322/postgres -c "SELECT id FROM bookings LIMIT 1;"

# Use correct booking ID
curl "http://localhost:3000/api/bookings/{correct-booking-id}/calendar-urls"
```

## 🔧 Debugging Tools

### Database Debugging
```bash
# Test database connection
node scripts/test-database-connection.js

# Check table structure
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\d table_name"

# Run specific queries
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/test-user-progress-structure.sql
```

### API Debugging
```bash
# Test API endpoints
curl "http://localhost:3000/api/health"

# Check server logs
npm run dev

# Test with verbose output
curl -v "http://localhost:3000/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"
```

### Frontend Debugging
```bash
# Check browser console
# Add debug logs
console.log('Debug info:', data);

# Use React DevTools
# Check component props and state
```

## 🛠️ Maintenance Scripts

### Database Maintenance
```bash
# Backup database
pg_dump postgresql://postgres:postgres@localhost:54322/postgres > backup.sql

# Restore database
psql postgresql://postgres:postgres@localhost:54322/postgres < backup.sql

# Clean up test data
psql postgresql://postgres:postgres@localhost:54322/postgres -c "DELETE FROM bookings WHERE artist_email LIKE '%test%';"
```

### Data Synchronization
```bash
# Sync with production
node scripts/database-sync.js

# Populate sample data
node scripts/populate-artists.js

# Create booking resources
node scripts/create-booking-resources.js
```

## 📊 Performance Issues

### Slow API Responses
**Symptoms:** API calls taking >2 seconds

**Solutions:**
```bash
# Check database queries
# Add indexes if needed
CREATE INDEX idx_bookings_start_time ON bookings(start_time);

# Optimize queries
# Use EXPLAIN ANALYZE for slow queries
EXPLAIN ANALYZE SELECT * FROM bookings WHERE start_time > NOW();
```

### Memory Issues
**Symptoms:** Application crashes or slow performance

**Solutions:**
```bash
# Check memory usage
ps aux | grep node

# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next
```

## 🔍 Log Analysis

### Server Logs
```bash
# Check Next.js logs
npm run dev

# Check Supabase logs
npx supabase logs

# Check Vercel logs (production)
npx vercel logs
```

### Database Logs
```bash
# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-*.log

# Check Supabase logs
npx supabase logs
```

## 🚨 Emergency Procedures

### Database Recovery
```bash
# Stop application
npm run dev

# Restore from backup
psql postgresql://postgres:postgres@localhost:54322/postgres < backup.sql

# Restart application
npm run dev
```

### Application Rollback
```bash
# Rollback to previous commit
git checkout HEAD~1

# Restart application
npm run dev

# Verify functionality
curl "http://localhost:3000/api/health"
```

## 📞 Getting Help

### Documentation
- [Booking System Implementation](./BOOKING_SYSTEM_IMPLEMENTATION.md)
- [API Reference](./API_REFERENCE.md)
- [Database Testing Guide](./DATABASE_TESTING_GUIDE.md)

### Common Commands
```bash
# Quick health check
curl "http://localhost:3000/api/health"

# Database status
npx supabase status

# Test booking system
curl "http://localhost:3000/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"
```

### Support Resources
- GitHub Issues
- Development team
- Documentation in `docs/` directory

---

*Last updated: September 30, 2025*



