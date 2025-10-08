# Stripe + Infra24 Booking System Implementation Plan

## 🎯 **Current Status: Phase 1-3 Complete**

### ✅ **Completed (Weeks 1-3)**
- [x] **Stripe Dependencies**: Installed stripe, @stripe/stripe-js, @stripe/react-stripe-js
- [x] **Database Schema**: Added payment fields to bookings, user_roles, payment_transactions, refunds tables
- [x] **Stripe Service Layer**: Complete payment processing with payment intents and checkout sessions
- [x] **Webhook Handler**: Handles payment_intent.succeeded, failed, canceled, checkout.session.completed
- [x] **Payment APIs**: `/api/bookings/[id]/payment` and `/api/bookings/[id]/refund`
- [x] **Frontend Components**: PaymentButton and BookingFormWithPayment components
- [x] **Role-Based Pricing**: User role detection and pricing calculation

## ✅ **Phase 4: Calendar Integration (Week 4-5) - COMPLETED**

### **4.1 Google Calendar Integration** ✅
```typescript
// lib/calendar/google-calendar.ts
export class GoogleCalendarService {
  static async checkAvailability(calendarId: string, startTime: Date, endTime: Date) ✅
  static async createEvent(calendarId: string, event: CalendarEvent) ✅
  static async updateEvent(calendarId: string, eventId: string, event: CalendarEvent) ✅
  static async deleteEvent(calendarId: string, eventId: string) ✅
  static async getCalendarList(userId: string) ✅
  static getAuthUrl(userId: string): string ✅
  static async exchangeCodeForTokens(code: string, userId: string) ✅
}
```

### **4.2 Outlook Calendar Integration** ✅
```typescript
// lib/calendar/outlook-calendar.ts
export class OutlookCalendarService {
  static async checkAvailability(userId: string, startTime: Date, endTime: Date) ✅
  static async createEvent(userId: string, event: CalendarEvent) ✅
  static async updateEvent(userId: string, eventId: string, event: CalendarEvent) ✅
  static async deleteEvent(userId: string, eventId: string) ✅
  static async getCalendarList(userId: string) ✅
  static getAuthUrl(userId: string): string ✅
  static async exchangeCodeForTokens(code: string, userId: string) ✅
}
```

### **4.3 Calendar Sync API** ✅
```typescript
// app/api/calendar/sync/route.ts
export async function POST(request: NextRequest) {
  // Sync external calendar events with internal availability ✅
  // Update booking availability based on external calendar conflicts ✅
  // Support for check_availability, create_event, update_event, delete_event ✅
}
```

### **4.4 Additional Calendar Features** ✅
- **OAuth Flow**: Complete Google and Microsoft OAuth integration ✅
- **Token Management**: Automatic token refresh and storage ✅
- **Availability Caching**: 1-hour cache for performance ✅
- **Calendar Selection**: Support for multiple Google calendars ✅
- **UI Components**: CalendarIntegration component with connect/disconnect ✅
- **Database Schema**: Complete calendar integration tables ✅

## 🎯 **Phase 5: Group Bookings ✅ COMPLETED**

### **5.1 Group Booking Logic ✅**
- [x] **Capacity Management**: Track remaining spots in group events
- [x] **Waitlist System**: Queue users when events are full
- [x] **Group Pricing**: Bulk discounts and group rates
- [x] **Participant Management**: Add/remove participants from group bookings

### **5.2 Group Booking UI ✅**
- [x] **Group Event Cards**: Show available spots and pricing
- [x] **Participant Selector**: Choose number of participants
- [x] **Group Dashboard**: Manage group bookings and participants

### **5.3 Group Booking Features Implemented ✅**
- **Database Schema**: Added group booking columns and tables
- **Service Layer**: Complete GroupBookingService with all CRUD operations
- **API Routes**: Full REST API for group booking management
- **UI Components**: Comprehensive group booking interface
- **Payment Integration**: Group booking support in Stripe flow
- **Calendar Integration**: Group booking support in calendar sync
- **Invitation System**: Email-based invitations with secure tokens
- **Waitlist Management**: Automatic waitlist when capacity reached

## 🎨 **Phase 6: Advanced Features ✅ COMPLETED**

### **6.1 Admin Interface ✅**
- [x] **Payment Dashboard**: View all payments, refunds, and disputes
- [x] **User Role Management**: Assign roles and permissions
- [x] **Pricing Configuration**: Set role-based pricing rules
- [x] **Analytics**: Booking trends, revenue, and user behavior

### **6.2 Admin Features Implemented ✅**
- **Comprehensive Dashboard**: Complete admin interface with tabbed navigation
- **Booking Management**: View, filter, and manage all bookings
- **Payment Processing**: Process refunds and manage payment disputes
- **User Management**: Assign roles and manage user permissions
- **Pricing Configuration**: Set role-based pricing for each organization
- **Analytics Dashboard**: Real-time analytics and performance metrics
- **API Routes**: Complete REST API for admin operations
- **Real-time Stats**: Live statistics and performance monitoring

### **6.2 Advanced Booking Features**
- [ ] **Recurring Bookings**: Weekly/monthly recurring appointments
- [ ] **Booking Modifications**: Advanced rescheduling with conflict detection
- [ ] **Buffer Times**: Automatic buffer between bookings
- [ ] **Blackout Dates**: Block specific dates/times

## 🔧 **Technical Requirements**

### **Environment Variables Needed**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Calendar API
GOOGLE_CALENDAR_CLIENT_ID=...
GOOGLE_CALENDAR_CLIENT_SECRET=...

# Microsoft Graph API
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Database Migrations**
```sql
-- Run this to add payment fields to existing tables
\i scripts/stripe-integration-schema.sql
```

### **Stripe Webhook Setup**
1. **Create Webhook Endpoint** in Stripe Dashboard
2. **URL**: `https://yourdomain.com/api/webhooks/stripe`
3. **Events to Listen For**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `checkout.session.completed`
   - `charge.dispute.created`

## 🎯 **User Scenarios & Edge Cases**

### **Scenario 1: Public User Books Paid Workshop**
1. User visits `/book` page
2. Selects workshop resource
3. System calculates public pricing ($50)
4. User enters payment details
5. Stripe processes payment
6. Webhook confirms payment
7. Booking status changes to 'confirmed'
8. User receives confirmation email

### **Scenario 2: Resident Artist Books Free Workshop**
1. Resident artist logs in
2. System detects 'resident_artist' role
3. Workshop shows as FREE
4. No payment required
5. Booking immediately confirmed
6. Artist receives confirmation email

### **Scenario 3: Group Booking (10 people)**
1. User selects group workshop
2. Chooses 10 participants
3. System calculates group rate ($400 total)
4. User pays for entire group
5. All 10 participants get confirmation
6. Host sees group booking in calendar

### **Scenario 4: Refund Request**
1. User cancels booking within policy
2. System processes automatic refund
3. Stripe refunds payment
4. Booking status changes to 'cancelled'
5. User receives refund confirmation

## 🚨 **Gotchas & Trade-offs**

### **Payment Processing**
- **Gotcha**: Stripe webhooks can be delayed or fail
- **Solution**: Implement retry logic and manual reconciliation
- **Trade-off**: Real-time vs eventual consistency

### **Calendar Integration**
- **Gotcha**: External calendar APIs have rate limits
- **Solution**: Cache availability data and sync periodically
- **Trade-off**: Real-time accuracy vs performance

### **Group Bookings**
- **Gotcha**: Race conditions when multiple users book simultaneously
- **Solution**: Database transactions and optimistic locking
- **Trade-off**: User experience vs data consistency

### **User Roles**
- **Gotcha**: Role changes don't affect existing bookings
- **Solution**: Apply roles at booking time, not payment time
- **Trade-off**: Flexibility vs consistency

## 🔄 **Fallback Strategies**

### **Payment Failures**
1. **Stripe Down**: Show "Payment temporarily unavailable" message
2. **Webhook Delays**: Manual payment confirmation process
3. **Partial Payments**: Handle partial refunds and credits

### **Calendar Sync Issues**
1. **API Limits**: Queue sync requests and process in batches
2. **Authentication Expired**: Prompt users to reconnect calendars
3. **Sync Conflicts**: Manual resolution interface for admins

### **System Outages**
1. **Database Down**: Read-only mode with cached data
2. **API Down**: Graceful degradation with offline capabilities
3. **Payment System Down**: Manual booking process with offline tracking

## 📊 **Success Metrics**

### **Technical Metrics**
- Payment success rate > 99%
- Webhook processing time < 5 seconds
- Calendar sync accuracy > 95%
- System uptime > 99.9%

### **Business Metrics**
- Booking conversion rate
- Average booking value
- User satisfaction scores
- Refund rate < 5%

## 🎯 **Next Immediate Steps**

1. **Set up Stripe account** and get API keys
2. **Run database migration** to add payment fields
3. **Configure webhook endpoint** in Stripe dashboard
4. **Test payment flow** with test cards
5. **Implement user role assignment** system
6. **Add calendar integration** for availability checking
7. **Create admin interface** for payment management

## 📝 **Documentation Needed**

- [ ] **User Guide**: How to book and pay for workshops
- [ ] **Admin Guide**: How to manage payments and refunds
- [ ] **Developer Guide**: How to extend the payment system
- [ ] **Troubleshooting Guide**: Common issues and solutions
