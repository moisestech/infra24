# Library Integration Guide: Booking System

## Overview

This guide outlines the specific libraries and tools we'll integrate to build a comprehensive booking system without reinventing the wheel. Each library is chosen for its proven track record, active maintenance, and compatibility with our tech stack.

## Core Libraries

### 1. FullCalendar - Resource Scheduling

**Purpose**: Professional calendar interface for resource management

**Installation**:
```bash
npm install @fullcalendar/core @fullcalendar/react @fullcalendar/resource-timegrid
npm install @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/timegrid
npm install @fullcalendar/moment @fullcalendar/moment-timezone
```

**Key Features**:
- Resource timeline view (rooms as columns)
- Drag & drop booking creation
- Recurring event support
- Time zone handling
- Mobile responsive

**Integration Example**:
```typescript
import FullCalendar from '@fullcalendar/react'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export function ResourceCalendar({ resources, events, onBookingCreate }) {
  return (
    <FullCalendar
      plugins={[resourceTimeGridPlugin, interactionPlugin]}
      initialView="resourceTimeGridDay"
      resources={resources}
      events={events}
      selectable
      editable
      select={(sel) => onBookingCreate({
        resourceId: sel.resource.id,
        start: sel.start,
        end: sel.end
      })}
      height="auto"
    />
  )
}
```

### 2. React Hook Form + Zod - Form Management

**Purpose**: Type-safe form handling with validation

**Installation**:
```bash
npm install react-hook-form @hookform/resolvers zod
```

**Key Features**:
- Type-safe form validation
- Performance optimized
- Easy integration with shadcn/ui
- Built-in error handling

**Integration Example**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const bookingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  resourceId: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date(),
  description: z.string().optional()
})

export function BookingForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: '',
      resourceId: '',
      startTime: new Date(),
      endTime: new Date()
    }
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### 3. TanStack Table - Data Management

**Purpose**: Powerful table component for admin interfaces

**Installation**:
```bash
npm install @tanstack/react-table
```

**Key Features**:
- Sorting, filtering, pagination
- Column resizing and reordering
- Row selection
- Virtual scrolling for large datasets

**Integration Example**:
```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

export function BookingsTable({ data }) {
  const columns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'resource', header: 'Resource' },
    { accessorKey: 'startTime', header: 'Start Time' },
    { accessorKey: 'status', header: 'Status' }
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <table>
      {/* Table implementation */}
    </table>
  )
}
```

### 4. Date-fns - Date Manipulation

**Purpose**: Lightweight date utility library

**Installation**:
```bash
npm install date-fns date-fns-tz
```

**Key Features**:
- Immutable date operations
- Time zone support
- Locale support
- Tree-shakable

**Integration Example**:
```typescript
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

export function formatBookingTime(date: Date, timezone: string) {
  const zonedDate = utcToZonedTime(date, timezone)
  return format(zonedDate, 'MMM dd, yyyy h:mm a')
}
```

### 5. ICS - Calendar File Generation

**Purpose**: Generate iCalendar files for calendar integration

**Installation**:
```bash
npm install ics
```

**Key Features**:
- Generate ICS files
- Event creation with all standard fields
- Recurring event support
- Time zone handling

**Integration Example**:
```typescript
import { createEvents } from 'ics'

export function generateWorkshopICS(workshop) {
  const event = {
    title: workshop.title,
    description: workshop.description,
    start: [2024, 3, 15, 14, 0], // Year, month, day, hour, minute
    duration: { hours: 3 },
    location: workshop.location,
    url: workshop.url
  }

  const { error, value } = createEvents([event])
  if (error) throw error
  
  return value
}
```

## External Service Integrations

### 1. Cal.com - People Scheduling

**Purpose**: Open-source scheduling for studio visits and office hours

**Setup**:
1. Deploy Cal.com instance
2. Configure multi-tenant setup
3. Set up webhook endpoints
4. Create artist profiles

**Integration Flow**:
```typescript
// Webhook handler for Cal.com events
export async function POST(request: NextRequest) {
  const { event, data } = await request.json()
  
  switch (event) {
    case 'booking.created':
      await createBookingFromCalcom(data)
      break
    case 'booking.cancelled':
      await cancelBookingFromCalcom(data)
      break
  }
  
  return NextResponse.json({ success: true })
}
```

### 2. Stripe - Payment Processing

**Purpose**: Handle paid workshops and equipment rentals

**Installation**:
```bash
npm install stripe @stripe/stripe-js
```

**Integration Example**:
```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createPaymentIntent(amount: number, metadata: any) {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    metadata
  })
}
```

### 3. Resend - Email Service

**Purpose**: Send booking confirmations and reminders

**Installation**:
```bash
npm install resend
```

**Integration Example**:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmation(booking: Booking) {
  return await resend.emails.send({
    from: 'bookings@oolite.org',
    to: booking.user.email,
    subject: 'Booking Confirmed',
    html: render(BookingConfirmationEmail, { booking })
  })
}
```

## Database Integration

### 1. Supabase - Database & Auth

**Purpose**: PostgreSQL database with real-time subscriptions

**Key Features**:
- Row Level Security (RLS)
- Real-time subscriptions
- Built-in authentication
- Edge functions

**Integration Example**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createBooking(booking: Booking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()
    
  if (error) throw error
  return data
}
```

### 2. Prisma - Database ORM (Optional)

**Purpose**: Type-safe database access

**Installation**:
```bash
npm install prisma @prisma/client
```

**Benefits**:
- Type-safe database queries
- Automatic migrations
- Query optimization
- Database introspection

## Automation & Workflows

### 1. n8n - Workflow Automation

**Purpose**: Automate CRM syncs, email reminders, and data processing

**Setup**:
1. Deploy n8n instance
2. Create workflow templates
3. Set up webhook triggers
4. Configure error handling

**Example Workflow**:
```json
{
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Process Booking",
      "type": "n8n-nodes-base.function"
    },
    {
      "name": "Send to CRM",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

### 2. Postgres pg_cron - Scheduled Tasks

**Purpose**: Database-level scheduling for reminders and cleanup

**Setup**:
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily reminder emails
SELECT cron.schedule(
  'daily-reminders',
  '0 9 * * *', -- 9 AM daily
  'SELECT send_reminder_emails();'
);
```

## Performance & Monitoring

### 1. Sentry - Error Tracking

**Purpose**: Monitor application errors and performance

**Installation**:
```bash
npm install @sentry/nextjs
```

### 2. Vercel Analytics - Performance Monitoring

**Purpose**: Track page performance and user behavior

**Installation**:
```bash
npm install @vercel/analytics
```

## Development Tools

### 1. Storybook - Component Development

**Purpose**: Develop and test UI components in isolation

**Installation**:
```bash
npx storybook@latest init
```

### 2. Playwright - End-to-End Testing

**Purpose**: Test complete user workflows

**Installation**:
```bash
npm install @playwright/test
```

## Integration Checklist

### Phase 1: Core Libraries
- [ ] Install FullCalendar and configure resource timeline
- [ ] Set up React Hook Form with Zod validation
- [ ] Implement TanStack Table for data management
- [ ] Configure date-fns for date handling
- [ ] Set up ICS generation for calendar files

### Phase 2: External Services
- [ ] Deploy and configure Cal.com instance
- [ ] Set up Stripe for payment processing
- [ ] Configure Resend for email delivery
- [ ] Create webhook endpoints for external services

### Phase 3: Database & Auth
- [ ] Update Supabase schema for booking system
- [ ] Implement RLS policies for multi-tenant security
- [ ] Set up real-time subscriptions for live updates
- [ ] Configure database triggers and functions

### Phase 4: Automation
- [ ] Deploy n8n for workflow automation
- [ ] Set up pg_cron for scheduled tasks
- [ ] Create CRM sync workflows
- [ ] Implement error handling and retry logic

### Phase 5: Monitoring & Testing
- [ ] Configure Sentry for error tracking
- [ ] Set up Vercel Analytics for performance monitoring
- [ ] Create Storybook stories for components
- [ ] Write Playwright tests for critical workflows

This integration guide provides a comprehensive roadmap for building a robust booking system using proven libraries and services, ensuring we deliver maximum value while minimizing development time and maintenance overhead.
