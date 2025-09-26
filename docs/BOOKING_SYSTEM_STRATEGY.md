# Booking System Strategy & Integration Plan

## Executive Summary

This document outlines our strategy for building a comprehensive booking system that leverages existing tools and libraries while maintaining scalability across multiple organizations (Oolite, Bakehouse, Locust Projects). The system addresses Oolite's migration to Boomerang CRM and their need for a proper calendar system and resident portals.

## Current State Analysis

### Oolite's Pain Points
- **CRM Migration**: Moving to Boomerang CRM but lacks resident-facing portals
- **Calendar System**: No centralized calendar for workshops, labs, space usage
- **Staff Overhead**: Managing bookings via emails and spreadsheets
- **Artist Portals**: Need for residents to manage their own profiles and bookings

### Our Opportunity
Position Infra24 as the "operational layer" that bridges CRM systems with day-to-day operations:
- **CRM**: Boomerang/Blackbaud for donors and contacts (system of record)
- **Infra24**: Resident portals, bookings, communications (operational layer)

## Recommended Tech Stack & Libraries

### 1. Calendar & Scheduling
- **FullCalendar** (React wrapper): Resource timeline, drag+drop, recurring rules
- **React Big Calendar**: Lighter alternative for attendee views
- **TimeGrid + Resource Timeline**: "Rooms as columns" + "Sessions as rows"

### 2. Forms & Validation
- **React Hook Form + Zod**: Type-safe validation
- **shadcn/ui**: Consistent UI components (already in use)

### 3. Search & Filtering
- **TanStack Table**: Admin lists and data grids
- **Downshift/Radix Combobox**: Advanced filtering

### 4. Payments (Optional)
- **Stripe Checkout/Invoices**: For paid workshops
- **Ticket Tailor**: Off-the-shelf ticketing with webhook integration

### 5. Communications
- **Resend**: Email service (already integrated)
- **react-email**: Template system
- **ics npm**: Calendar invite generation

### 6. People Bookings
- **Cal.com**: Open-source scheduling for studio visits/office hours
- **Calendly**: Fast embed for equipment/person bookings

### 7. Automation
- **n8n**: CRM syncs, reminder emails, post-event surveys
- **Postgres pg_cron**: Scheduled tasks and reminders

## Data Architecture

### Core Tables (Unified Resource Model)

```sql
-- Resources (rooms, labs, studios, equipment, people)
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('space', 'equipment', 'person', 'other')),
  capacity integer DEFAULT 1,
  time_zone text DEFAULT 'America/New_York',
  is_bookable boolean DEFAULT true,
  availability_rules jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}', -- map coords, AV needs, etc.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings (unified for all resource types)
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  resource_id uuid NOT NULL REFERENCES resources(id),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  time_range tstzrange GENERATED ALWAYS AS (tstzrange(starts_at, ends_at, '[)')) STORED,
  created_by_clerk_id text NOT NULL,
  approved_by_clerk_id text,
  is_public boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workshop Sessions (links workshops to bookings)
CREATE TABLE workshop_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL REFERENCES workshops(id),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id),
  capacity integer,
  created_at timestamptz DEFAULT now()
);

-- Workshop Registrations
CREATE TABLE workshop_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  workshop_id uuid NOT NULL REFERENCES workshops(id),
  session_id uuid REFERENCES workshop_sessions(id),
  clerk_user_id text NOT NULL,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'cancelled', 'attended', 'no_show')),
  registered_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- CRM Integration Outbox
CREATE TABLE integration_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id),
  topic text NOT NULL, -- 'workshop.created', 'registration.registered'
  payload jsonb NOT NULL,
  deliver_after timestamptz DEFAULT now(),
  delivered_at timestamptz,
  retry_count integer DEFAULT 0,
  last_error text,
  created_at timestamptz DEFAULT now()
);
```

### Overlap Prevention
```sql
-- Prevent double-booking with exclusion constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
ADD CONSTRAINT bookings_no_overlap
EXCLUDE USING gist (
  resource_id WITH =,
  time_range WITH &&
) WHERE (status IN ('pending', 'confirmed'));
```

## System Architecture

### 1. Resource Management
- **Unified Model**: All bookable items (rooms, equipment, people) as resources
- **Type-based Filtering**: Different UI/UX per resource type
- **Availability Rules**: JSON-based rules for complex scheduling

### 2. Booking Flow
- **Hold System**: Create tentative bookings, confirm later
- **Approval Workflow**: Admin approval for certain resource types
- **Capacity Management**: Automatic waitlisting when full

### 3. Workshop Integration
- **Workshop → Sessions → Bookings**: Hierarchical relationship
- **Registration Management**: Capacity tracking, waitlists
- **Calendar Integration**: ICS generation, email confirmations

### 4. CRM Integration
- **Outbox Pattern**: Reliable event delivery to external systems
- **Webhook Support**: Inbound events from Cal.com, Calendly
- **Data Sync**: Bi-directional sync with Boomerang/Blackbaud

## Page Structure & User Flows

### Admin Pages
1. **Resource Calendar** (`/admin/calendar`)
   - FullCalendar resource timeline
   - Drag-to-create bookings
   - Status management (hold → confirmed)

2. **Workshop Management** (`/admin/workshops`)
   - Create/edit workshops
   - Manage sessions and bookings
   - Registration analytics

3. **Resource Management** (`/admin/resources`)
   - Add/edit rooms, equipment, people
   - Set availability rules
   - Capacity management

### Public Pages
1. **Workshop Catalog** (`/workshops`)
   - Filterable workshop list
   - Registration flow
   - Calendar integration

2. **Studio Visits** (`/studio-visits`)
   - Cal.com embedded booking
   - Artist availability
   - Confirmation flow

3. **Equipment Booking** (`/equipment`)
   - Equipment availability
   - Booking requests
   - Usage tracking

### User Dashboard
1. **My Bookings** (`/dashboard/bookings`)
   - Upcoming bookings
   - Registration history
   - Cancellation options

2. **My Workshops** (`/dashboard/workshops`)
   - Registered workshops
   - Attendance tracking
   - Certificates/completion

## Integration Patterns

### 1. Cal.com Integration
```javascript
// Webhook handler for Cal.com bookings
export async function POST(request) {
  const { event, data } = await request.json()
  
  if (event === 'booking.created') {
    await supabase.from('bookings').insert({
      org_id: orgId,
      resource_id: artistResourceId,
      title: data.title,
      starts_at: data.startTime,
      ends_at: data.endTime,
      status: 'confirmed',
      metadata: { calcom_booking_id: data.id }
    })
  }
}
```

### 2. CRM Sync (Boomerang)
```javascript
// Outbox processor
export async function processOutbox() {
  const { data: events } = await supabase
    .from('integration_outbox')
    .select('*')
    .eq('delivered_at', null)
    .lte('deliver_after', new Date().toISOString())
    .limit(10)

  for (const event of events) {
    try {
      await fetch(`${boomerangApiUrl}/webhooks`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(event.payload)
      })
      
      await supabase
        .from('integration_outbox')
        .update({ delivered_at: new Date().toISOString() })
        .eq('id', event.id)
    } catch (error) {
      // Retry logic
    }
  }
}
```

### 3. Email Automation
```javascript
// Registration confirmation
export async function sendRegistrationConfirmation(registration) {
  const icsContent = generateWorkshopICS(registration)
  
  await resend.emails.send({
    from: 'workshops@oolite.org',
    to: registration.user.email,
    subject: 'Workshop Registration Confirmed',
    html: render(RegistrationEmail, { registration }),
    attachments: [{
      filename: 'workshop.ics',
      content: icsContent,
      contentType: 'text/calendar'
    }]
  })
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Unify resource model in database
- [ ] Add overlap prevention constraints
- [ ] Create basic resource management UI
- [ ] Implement FullCalendar resource timeline

### Phase 2: Workshop System (Week 3-4)
- [ ] Workshop creation and management
- [ ] Session booking integration
- [ ] Registration flow with capacity management
- [ ] Email confirmations and ICS generation

### Phase 3: People Bookings (Week 5-6)
- [ ] Cal.com integration for studio visits
- [ ] Artist availability management
- [ ] Webhook processing for external bookings
- [ ] Unified calendar view

### Phase 4: CRM Integration (Week 7-8)
- [ ] Outbox pattern implementation
- [ ] Boomerang webhook integration
- [ ] Data sync and conflict resolution
- [ ] Analytics and reporting

### Phase 5: Advanced Features (Week 9-10)
- [ ] Equipment booking system
- [ ] Payment integration (Stripe)
- [ ] Advanced analytics dashboard
- [ ] Mobile optimization

## Key Success Metrics

### Operational Efficiency
- **Booking Time**: Reduce from hours to minutes
- **Double-booking Errors**: Eliminate with database constraints
- **Staff Overhead**: 50% reduction in manual booking management

### User Experience
- **Registration Completion**: 90%+ completion rate
- **Calendar Integration**: 80%+ users add to calendar
- **Mobile Usage**: 60%+ of bookings via mobile

### Business Impact
- **Resource Utilization**: 20% increase in space usage
- **Workshop Attendance**: 15% improvement in show-up rates
- **Artist Engagement**: 30% increase in studio visit requests

## Risk Mitigation

### Technical Risks
- **Data Migration**: Gradual migration with rollback capability
- **Integration Failures**: Robust error handling and retry logic
- **Performance**: Database indexing and query optimization

### Business Risks
- **User Adoption**: Comprehensive training and support
- **CRM Conflicts**: Clear data ownership and sync rules
- **Change Management**: Phased rollout with feedback loops

## Conclusion

This booking system positions Infra24 as the essential operational layer that bridges CRM systems with day-to-day operations. By leveraging proven libraries and maintaining a flexible, multi-tenant architecture, we can deliver immediate value while building toward a comprehensive platform.

The key is to start with the most painful use cases (workshop scheduling, room booking) and expand systematically. Each phase delivers standalone value while building toward the complete vision.