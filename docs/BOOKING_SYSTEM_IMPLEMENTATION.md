# Infra24 Booking System Implementation

## Overview

The Infra24 booking system is a comprehensive, multi-tenant booking platform that allows organizations to manage consultations, studio visits, and equipment bookings. The system includes availability management, calendar integration, and automated announcement creation.

## 🎯 Core Features Implemented

### 1. Resource Management
- **Remote Studio Visits**: 30-minute remote consultations with Oolite staff
- **Print Room Consultations**: In-person technical guidance and equipment training
- **Equipment Booking**: Integration with existing digital lab equipment
- **Availability Rules**: JSON-based configuration for host windows, buffers, and blackout dates

### 2. Booking System
- **Public Booking Page** (`/book`): Mobile-first interface for artists to book consultations
- **Staff Dashboard** (`/bookings`): Management interface with filtering and search
- **Availability API**: Real-time slot generation with round-robin host assignment
- **Booking Creation**: Automated participant management and announcement generation

### 3. Calendar Integration
- **ICS File Generation**: Downloadable calendar files for all major calendar applications
- **Calendar URLs**: Direct integration links for Google, Outlook, Yahoo, and Apple Calendar
- **Timezone Support**: Proper handling of organization timezones
- **Meeting Links**: Automatic Google Meet link generation for remote visits
- **Google Calendar Sync**: Real-time availability checking and event creation
- **Microsoft Outlook Sync**: Full calendar integration with availability management
- **OAuth Integration**: Secure token management with automatic refresh
- **Availability Caching**: Performance optimization with 1-hour cache
- **Conflict Prevention**: Automatic detection of calendar conflicts

### 4. Database Schema
- **Bookings Table**: Core booking information with metadata
- **Booking Participants**: Artist and host management
- **Resources Table**: Equipment and consultation types
- **Announcements Integration**: Automatic internal announcement creation
- **Group Booking Support**: Capacity management and participant tracking
- **Waitlist System**: Queue management for full events
- **Invitation System**: Email-based group booking invitations

### 5. Group Booking System ✅ COMPLETED
- **Capacity Management**: Track remaining spots in group events
- **Waitlist System**: Queue users when events are full
- **Group Pricing**: Bulk discounts and group rates
- **Participant Management**: Add/remove participants from group bookings
- **Invitation System**: Email-based invitations with secure tokens
- **Payment Integration**: Group booking support in Stripe flow
- **Calendar Integration**: Group booking support in calendar sync

## 📁 File Structure

### API Routes
```
app/api/
├── availability/route.ts                    # Availability slot generation
├── bookings/
│   ├── route.ts                            # Booking CRUD operations
│   ├── group/route.ts                      # Group booking operations
│   └── [id]/
│       ├── calendar-urls/route.ts          # Calendar integration URLs
│       ├── ics/route.ts                    # ICS file download
│       ├── payment/route.ts                # Stripe payment processing
│       ├── refund/route.ts                 # Refund processing
│       ├── participants/route.ts           # Participant management
│       ├── waitlist/route.ts               # Waitlist management
│       └── invitations/route.ts            # Invitation management
├── calendar/
│   ├── sync/route.ts                       # Calendar sync operations
│   ├── status/route.ts                     # Calendar connection status
│   ├── connect/route.ts                    # Connect calendar provider
│   └── disconnect/route.ts                 # Disconnect calendar provider
├── auth/
│   ├── google/callback/route.ts            # Google OAuth callback
│   └── microsoft/callback/route.ts         # Microsoft OAuth callback
├── webhooks/
│   └── stripe/route.ts                     # Stripe webhook handler
└── organizations/[orgId]/resources/route.ts # Resource management
```

### Frontend Pages
```
app/
├── book/page.tsx                           # Public booking interface
├── bookings/
│   ├── page.tsx                            # Staff booking dashboard
│   └── confirmation/[id]/page.tsx          # Booking confirmation
```

### Components
```
components/booking/
├── BookingForm.tsx                         # Booking creation form
├── BookingCalendar.tsx                     # Calendar interface
├── ResourceCalendar.tsx                    # Resource-specific calendar
├── PaymentButton.tsx                       # Stripe payment button
├── BookingFormWithPayment.tsx              # Integrated booking + payment
├── CalendarIntegration.tsx                 # Calendar connection UI
├── GroupBookingForm.tsx                    # Group booking form
├── ParticipantManagement.tsx               # Participant management UI
├── WaitlistManagement.tsx                  # Waitlist management UI
└── InvitationSystem.tsx                    # Invitation system UI
```

### Utilities
```
lib/
├── ics-generator.ts                        # Calendar file generation
├── supabase.ts                            # Database client configuration
├── stripe/
│   ├── config.ts                          # Stripe configuration
│   └── service.ts                         # Stripe service layer
├── calendar/
│   ├── google-calendar.ts                 # Google Calendar service
│   └── outlook-calendar.ts                # Outlook Calendar service
└── group-booking/
    └── service.ts                         # Group booking service layer
```

## 🗄️ Database Schema

### Resources Table
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  type TEXT NOT NULL CHECK (type IN ('equipment', 'space', 'workshop')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  capacity INTEGER DEFAULT 1,
  duration_minutes INTEGER,
  price NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  requirements TEXT[],
  availability_rules JSONB,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_bookable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system'
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  resource_id UUID NOT NULL REFERENCES resources(id),
  user_id TEXT,
  user_name TEXT,
  user_email TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  capacity INTEGER DEFAULT 1,
  current_participants INTEGER DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_clerk_id TEXT NOT NULL,
  updated_by_clerk_id TEXT,
  resource_type TEXT NOT NULL DEFAULT 'workshop' CHECK (resource_type IN ('workshop', 'equipment', 'space', 'event')),
  requirements TEXT[],
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system'
);
```

### Booking Participants Table
```sql
CREATE TABLE booking_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'no_show')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);
```

## 🔧 Configuration

### Availability Rules JSON Structure
```json
{
  "timezone": "America/New_York",
  "slot_minutes": 30,
  "buffer_before": 10,
  "buffer_after": 10,
  "max_per_day_per_host": 4,
  "windows": [
    {
      "by": "host",
      "host": "mo@oolite.org",
      "days": ["Tuesday", "Wednesday", "Thursday"],
      "start": "12:00",
      "end": "16:00"
    }
  ],
  "blackouts": [
    {"date": "2025-10-21"},
    {"range": ["2025-11-25", "2025-11-28"]}
  ],
  "pooling": "round_robin"
}
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Resend Email (for future implementation)
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## 🚀 API Endpoints

### Availability API
```http
GET /api/availability?resource_id={id}&start_date={date}&end_date={date}
```
Returns available time slots for a resource within the specified date range.

### Booking API
```http
POST /api/bookings
Content-Type: application/json

{
  "org_id": "uuid",
  "resource_id": "uuid",
  "start_time": "2025-01-15T14:00:00.000Z",
  "end_time": "2025-01-15T14:30:00.000Z",
  "artist_name": "Artist Name",
  "artist_email": "artist@example.com",
  "goal_text": "Portfolio feedback",
  "consent_recording": false
}
```

### Calendar Integration APIs
```http
GET /api/bookings/{id}/calendar-urls
GET /api/bookings/{id}/ics
```

## 🎨 User Interface

### Public Booking Page (`/book`)
- **Mobile-first design** with responsive layout
- **Resource selection** with status indicators
- **Date/time picker** with real-time availability
- **Form validation** and error handling
- **Confirmation page** with calendar integration

### Staff Dashboard (`/bookings`)
- **Filtering system** (Today/Week/All, Owner, Type, Status)
- **Search functionality** by artist name or email
- **Booking management** with status updates
- **Calendar integration** for easy scheduling

## 🔄 Workflow

### Booking Creation Flow
1. **Artist visits** `/book` page
2. **Selects resource** (Remote Studio Visit or Print Room)
3. **Chooses date/time** from available slots
4. **Fills out form** with contact information and goals
5. **System creates booking** with participants and announcement
6. **Confirmation page** shows booking details and calendar links
7. **Email notifications** sent to artist and host (future implementation)

### Staff Management Flow
1. **Staff accesses** `/bookings` dashboard
2. **Views bookings** with filtering and search
3. **Manages bookings** with status updates
4. **Handles reschedules** and cancellations
5. **Tracks metrics** and usage patterns

## 🐛 Known Issues & Solutions

### Database Schema Issues
- **Fixed**: Column name mismatches (`org_id` vs `organization_id`)
- **Fixed**: Foreign key relationship issues with `booking_participants`
- **Fixed**: Announcement creation with proper organization references

### Route Conflicts
- **Fixed**: Dynamic route naming conflicts (`[id]` vs `[bookingId]`)
- **Fixed**: Middleware authentication for public booking routes

### Calendar Integration
- **Working**: ICS file generation and download
- **Working**: Calendar URL generation for all major providers
- **Working**: Timezone handling and proper date formatting

## 📊 Current Status

### ✅ Completed Features (Sprint 1 & 2)
- [x] Resource management and availability rules
- [x] Booking creation and participant management
- [x] Public booking interface (`/book`)
- [x] Staff booking dashboard (`/bookings`)
- [x] ICS file generation and download
- [x] Calendar integration URLs
- [x] Database schema and relationships
- [x] API endpoints for all operations
- [x] Mobile-responsive design
- [x] Error handling and validation
- [x] Google Meet link auto-generation for remote visits
- [x] Reschedule/cancel endpoints with tokenized access
- [x] Reschedule and cancel UI pages
- [x] Dynamic route conflict resolution
- [x] Database constraint fixes
- [x] Comprehensive testing framework

### 🚧 In Progress (Sprint 3)
- [ ] Email notifications via Resend API
- [ ] Enhanced announcement integration
- [ ] Booking metrics and analytics

### 📋 Next Steps (Future Sprints)
- [ ] Advanced availability rules (blackout dates, max bookings per day)
- [ ] Waitlist functionality
- [ ] Recurring booking support
- [ ] Payment integration
- [ ] Mobile app integration
- [ ] Performance optimization and caching

## 🧪 Testing

### Automated Testing Framework

The booking system includes comprehensive automated testing across multiple layers:

#### 1. Unit Tests (`__tests__/`)
- **API Tests**: `api/bookings.test.ts`, `api/availability.test.ts`
- **Component Tests**: `components/BookingForm.test.tsx`
- **Integration Tests**: `integration/booking-flow.test.ts`
- **Utility Tests**: `utils/ics-generator.test.ts`

#### 2. Script-Based Testing (`scripts/booking/`)
- **System Tests**: `test-booking-system.js` - End-to-end booking flow testing
- **Data Validation**: `create-simple-bookings.js` - Creates test data and validates structure
- **API Endpoint Tests**: `test-api-endpoints.js` - Comprehensive API testing

#### 3. Test Commands
```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test                    # Jest unit tests
npm run test:api               # API endpoint tests
npm run test:booking           # Booking system integration tests
npm run test:comprehensive     # Full system test suite

# Run individual test files
npm test __tests__/api/bookings.test.ts
npm test __tests__/components/BookingForm.test.tsx
```

### Manual Testing Checklist

#### Core Functionality
- [ ] Create booking through `/book` page
- [ ] Verify booking appears in staff dashboard (`/bookings`)
- [ ] Test calendar integration (ICS download)
- [ ] Test calendar URL generation
- [ ] Verify announcement creation
- [ ] Test availability API with different date ranges
- [ ] Test error handling for invalid bookings

#### Advanced Features
- [ ] Test reschedule functionality (`/bookings/reschedule/[token]`)
- [ ] Test cancellation flow (`/bookings/cancel/[token]`)
- [ ] Verify Google Meet link generation for remote visits
- [ ] Test timezone handling across different regions
- [ ] Validate booking confirmation emails (when implemented)

#### Edge Cases
- [ ] Test booking conflicts (double-booking prevention)
- [ ] Test availability edge cases (weekends, holidays)
- [ ] Test large date range queries
- [ ] Test invalid resource IDs
- [ ] Test malformed booking data

### API Testing Commands

#### Availability Testing
```bash
# Test availability for specific resource and date
curl "http://localhost:3000/api/availability?resource_id=7d683079-3514-4b60-9155-7e4df4c46a30&start_date=2025-01-15&end_date=2025-01-15"

# Test availability for date range
curl "http://localhost:3000/api/availability?resource_id=7d683079-3514-4b60-9155-7e4df4c46a30&start_date=2025-01-15&end_date=2025-01-22"
```

#### Booking Operations
```bash
# Create new booking
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": "2133fe94-fb12-41f8-ab37-ea4acd4589f6",
    "resource_id": "7d683079-3514-4b60-9155-7e4df4c46a30",
    "start_time": "2025-01-14T17:30:00.000Z",
    "end_time": "2025-01-14T18:00:00.000Z",
    "artist_name": "Test Artist",
    "artist_email": "test@example.com",
    "goal_text": "Testing booking system"
  }'

# Get booking details
curl "http://localhost:3000/api/bookings/{booking_id}"

# Update booking
curl -X PUT "http://localhost:3000/api/bookings/{booking_id}" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

#### Calendar Integration
```bash
# Get calendar URLs
curl "http://localhost:3000/api/bookings/{booking_id}/calendar-urls"

# Download ICS file
curl "http://localhost:3000/api/bookings/{booking_id}/ics" -o booking.ics
```

### Database Testing

#### Schema Validation
```sql
-- Test booking table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings';

-- Test foreign key relationships
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'bookings';
```

#### Data Integrity Tests
```sql
-- Test booking data consistency
SELECT 
  b.id,
  b.status,
  COUNT(bp.id) as participant_count
FROM bookings b
LEFT JOIN booking_participants bp ON b.id = bp.booking_id
GROUP BY b.id, b.status
HAVING COUNT(bp.id) = 0 AND b.status != 'cancelled';
```

### Performance Testing

#### Load Testing
```bash
# Test availability API under load
for i in {1..100}; do
  curl -s "http://localhost:3000/api/availability?resource_id=7d683079-3514-4b60-9155-7e4df4c46a30&start_date=2025-01-15&end_date=2025-01-15" &
done
wait
```

#### Database Performance
```sql
-- Test query performance
EXPLAIN ANALYZE 
SELECT * FROM bookings 
WHERE org_id = '2133fe94-fb12-41f8-ab37-ea4acd4589f6' 
  AND start_time >= '2025-01-01' 
  AND start_time < '2025-02-01';
```

### Test Data Management

#### Creating Test Data
```bash
# Create simple test bookings
node scripts/booking/create-simple-bookings.js

# Create comprehensive demo data
node scripts/booking/seed-demo-booking-data.js

# Create organization-specific data
node scripts/booking/create-bakehouse-bookings.js
```

#### Cleaning Test Data
```sql
-- Clean up test bookings (use with caution)
DELETE FROM booking_participants 
WHERE booking_id IN (
  SELECT id FROM bookings 
  WHERE artist_email LIKE '%test%' 
     OR artist_name LIKE '%Test%'
);

DELETE FROM bookings 
WHERE artist_email LIKE '%test%' 
   OR artist_name LIKE '%Test%';
```

### Continuous Integration

The booking system tests are integrated into the CI/CD pipeline:

1. **Pre-commit Hooks**: Run unit tests before commits
2. **Pull Request Checks**: Full test suite on PR creation
3. **Deployment Validation**: Integration tests before production deployment
4. **Monitoring**: Automated health checks in production

### Test Coverage Goals

- **Unit Tests**: >90% code coverage
- **Integration Tests**: All critical user flows
- **API Tests**: All endpoints and error cases
- **End-to-End Tests**: Complete booking lifecycle

## 📚 Resources

### Documentation
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [ICS File Format](https://tools.ietf.org/html/rfc5545)
- [Clerk Authentication](https://clerk.com/docs)

### External Services
- **Supabase**: Database and real-time subscriptions
- **Clerk**: User authentication and authorization
- **Resend**: Email delivery service (planned)
- **Google Calendar API**: Meeting link generation (planned)

---

*Last updated: September 30, 2025*
*Version: 1.0.0*
