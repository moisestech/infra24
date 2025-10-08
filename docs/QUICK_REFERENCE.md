# Quick Reference Card

## 🚀 Essential Commands

### Database Setup
```bash
# Start Supabase
npx supabase start

# Setup complete schema
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql

# Create booking resources
node scripts/create-booking-resources.js

# Test database
node scripts/test-database-connection.js
```

### Development Server
```bash
# Start development server
npm run dev

# Test booking system
curl "http://localhost:3000/api/availability?resource_id=7d683079-3514-4b60-9155-7e4df4c46a30&start_date=2025-01-15&end_date=2025-01-15"
```

### Testing APIs
```bash
# Test availability
curl "http://localhost:3000/api/availability?resource_id=7d683079-3514-4b60-9155-7e4df4c46a30&start_date=2025-01-15&end_date=2025-01-15"

# Create booking
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"2133fe94-fb12-41f8-ab37-ea4acd4589f6","resource_id":"7d683079-3514-4b60-9155-7e4df4c46a30","start_time":"2025-01-14T17:30:00.000Z","end_time":"2025-01-14T18:00:00.000Z","artist_name":"Test Artist","artist_email":"test@example.com","goal_text":"Testing"}'

# Test calendar URLs
curl "http://localhost:3000/api/bookings/{booking_id}/calendar-urls"

# Test ICS download
curl "http://localhost:3000/api/bookings/{booking_id}/ics"
```

## 📁 Key Files

### API Routes
- `app/api/availability/route.ts` - Availability slot generation
- `app/api/bookings/route.ts` - Booking CRUD operations
- `app/api/bookings/[id]/calendar-urls/route.ts` - Calendar integration
- `app/api/bookings/[id]/ics/route.ts` - ICS file download

### Frontend Pages
- `app/book/page.tsx` - Public booking interface
- `app/bookings/page.tsx` - Staff booking dashboard
- `app/bookings/confirmation/[id]/page.tsx` - Booking confirmation

### Utilities
- `lib/ics-generator.ts` - Calendar file generation
- `lib/supabase.ts` - Database client configuration

## 🗄️ Database Tables

### Core Tables
- `bookings` - Main booking records
- `booking_participants` - Artist and host information
- `resources` - Available resources (Remote Studio Visit, Print Room)
- `organizations` - Organization information

### Key Columns
- `bookings.org_id` - Organization reference
- `bookings.resource_id` - Resource reference
- `bookings.start_time` / `end_time` - Booking times
- `bookings.metadata` - Additional booking data (tokens, host info)

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Resend (for future)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## 🐛 Common Issues & Solutions

### Database Connection Issues
```bash
# Check Supabase status
npx supabase status

# Restart Supabase
npx supabase stop && npx supabase start
```

### Route Conflicts
- Ensure dynamic routes use consistent naming (`[id]` not `[bookingId]`)
- Check middleware.ts for proper route protection

### API 404 Errors
- Verify route files exist in correct directories
- Check middleware authentication settings
- Restart development server after route changes

## 📊 Resource IDs

### Current Resources
- **Remote Studio Visit**: `7d683079-3514-4b60-9155-7e4df4c46a30`
- **Print Room Consult**: `67e52569-d67d-4352-8ca3-c3bcbde8c43f`

### Organization ID
- **Oolite Arts**: `2133fe94-fb12-41f8-ab37-ea4acd4589f6`

## 🎯 Next Steps

1. **Sprint 2**: Implement reschedule/cancel endpoints
2. **Email Integration**: Set up Resend API for notifications
3. **Google Meet**: Add automatic meeting link generation
4. **Analytics**: Create booking metrics dashboard

## 📚 Documentation

- [Booking System Implementation](./BOOKING_SYSTEM_IMPLEMENTATION.md)
- [Scripts Reference](./SCRIPTS_REFERENCE.md)
- [Next Steps & Roadmap](./BOOKING_SYSTEM_NEXT_STEPS.md)

---

*Quick reference for Infra24 booking system development*



