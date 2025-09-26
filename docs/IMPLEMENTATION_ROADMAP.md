# Implementation Roadmap: Booking System & CRM Integration

## Current Status Summary

### ✅ Completed Systems
1. **Workshop Management**: Full CRUD operations, registration flow, email confirmations
2. **Calendar Integration**: ICS file generation, calendar button components  
3. **Analytics Dashboard**: Comprehensive workshop performance tracking
4. **Email System**: Professional templates, automated confirmations
5. **Navigation System**: Unified navigation across organizations
6. **Theme System**: Organization-specific branding and theming

### 🔄 In Progress
- **Route Conflicts**: Fixed dynamic route naming conflicts
- **Analytics API**: Authentication issues being resolved

## Phase 1: Foundation & Data Structure (Week 1-2)

### 1.1 Database Schema Unification
- [ ] **Unify Resource Model**: Consolidate `resources` and `org_resources` tables
- [ ] **Add Overlap Prevention**: Implement btree_gist exclusion constraints
- [ ] **Time Zone Support**: Add timezone fields to all booking tables
- [ ] **Metadata Expansion**: JSON fields for complex scheduling rules

### 1.2 Core Libraries Installation
```bash
# Calendar & Scheduling
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/resource-timegrid
npm install @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/timegrid

# Forms & Validation  
npm install react-hook-form @hookform/resolvers zod

# Date Handling
npm install date-fns date-fns-tz

# Calendar File Generation
npm install ics

# Table Management
npm install @tanstack/react-table
```

### 1.3 Basic Resource Management
- [ ] **Resource CRUD API**: Create, read, update, delete resources
- [ ] **Resource Types**: Space, equipment, person, other
- [ ] **Capacity Management**: Set and enforce capacity limits
- [ ] **Availability Rules**: JSON-based scheduling constraints

## Phase 2: Calendar & Booking System (Week 3-4)

### 2.1 FullCalendar Integration
- [ ] **Resource Timeline View**: Rooms as columns, time as rows
- [ ] **Drag & Drop Booking**: Create bookings by dragging on calendar
- [ ] **Booking Status Management**: Hold → Confirmed → Cancelled workflow
- [ ] **Overlap Prevention**: Real-time conflict detection

### 2.2 Booking Management UI
- [ ] **Admin Calendar Page**: `/admin/calendar` with FullCalendar
- [ ] **Booking Form Modal**: Create/edit bookings with validation
- [ ] **Resource Filters**: Filter by type, capacity, availability
- [ ] **Bulk Operations**: Multi-select booking management

## Phase 3: People & Studio Bookings (Week 5-6)

### 3.1 Cal.com Integration
- [ ] **Cal.com Setup**: Multi-tenant Cal.com instance
- [ ] **Artist Profiles**: Link to Cal.com availability
- [ ] **Webhook Processing**: Handle Cal.com booking events
- [ ] **Studio Visit Flow**: End-to-end booking experience

### 3.2 People Resource Management
- [ ] **Artist Availability**: Set working hours and availability
- [ ] **Studio Assignment**: Link artists to studio resources
- [ ] **Visit Types**: Different booking types (studio visit, critique, etc.)
- [ ] **Approval Workflow**: Artist approval for studio visits

## Phase 4: CRM Integration (Week 7-8)

### 4.1 Outbox Pattern Implementation
- [ ] **Integration Outbox Table**: Reliable event delivery
- [ ] **Event Types**: Workshop created, registration completed, etc.
- [ ] **Retry Logic**: Exponential backoff for failed deliveries
- [ ] **Dead Letter Queue**: Handle permanently failed events

### 4.2 Boomerang CRM Integration
- [ ] **API Configuration**: Per-org CRM settings
- [ ] **Webhook Endpoints**: Receive events from Boomerang
- [ ] **Data Mapping**: Map Infra24 data to CRM format
- [ ] **Sync Reconciliation**: Handle data conflicts

## Key Integration Points

### 1. External Service Integrations
```javascript
// Cal.com Webhook Handler
export async function POST(request) {
  const { event, data } = await request.json()
  
  if (event === 'booking.created') {
    await createBookingFromCalcom(data)
  }
}

// CRM Sync Processor
export async function processCRMOutbox() {
  const events = await getPendingEvents()
  for (const event of events) {
    await syncToCRM(event)
  }
}
```

### 2. Internal API Endpoints
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking status
- `GET /api/resources/:id/availability` - Check resource availability
- `POST /api/workshops/:id/sessions` - Create workshop session
- `POST /api/registrations` - Register for workshop
- `GET /api/calendar/events` - Get calendar events for FullCalendar

## Success Metrics & KPIs

### Technical Metrics
- **API Response Time**: < 200ms for booking operations
- **System Uptime**: 99.9% availability
- **Data Sync Accuracy**: 99.95% successful CRM syncs
- **Mobile Performance**: < 3s page load on mobile

### Business Metrics
- **Booking Completion Rate**: 90%+ successful bookings
- **Resource Utilization**: 20% increase in space usage
- **User Satisfaction**: 4.5+ star rating
- **Staff Efficiency**: 50% reduction in manual booking management

## Next Immediate Steps

### Week 1 Priorities
1. **Install Core Libraries**: FullCalendar, React Hook Form, Zod
2. **Database Schema Updates**: Add overlap prevention constraints
3. **Resource Management API**: Basic CRUD operations
4. **FullCalendar Integration**: Basic resource timeline view

### Week 2 Priorities
1. **Booking Creation Flow**: Drag-to-create bookings
2. **Workshop-Booking Integration**: Link workshops to bookings
3. **Calendar UI Polish**: Responsive design and user experience
4. **Testing & Validation**: Unit tests and integration tests

This roadmap provides a clear path from our current state to a comprehensive booking system that addresses Oolite's needs while positioning Infra24 as the essential operational layer for arts organizations.