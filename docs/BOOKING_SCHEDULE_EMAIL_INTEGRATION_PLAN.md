# Booking System + Schedule + Email Integration Plan

## 🎯 **Integration Overview**

Create a scalable, integrated system that connects:
- **Booking System** → User reservations and management
- **Schedule Component** → Calendar visualization and availability
- **Resend API** → Automated email communications
- **Announcements** → Event notifications and updates

## 🏗️ **System Architecture**

### **Core Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Booking       │    │   Schedule      │    │   Email         │
│   System        │◄──►│   Component     │◄──►│   Service       │
│                 │    │                 │    │   (Resend)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Calendar      │    │   Templates     │
│   (Bookings)    │    │   Integration   │    │   & Workflows   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📧 **Email Service Architecture**

### **Resend API Integration**
```typescript
// Email Service Structure
interface EmailService {
  // Booking-related emails
  sendBookingConfirmation(booking: Booking): Promise<void>
  sendBookingReminder(booking: Booking): Promise<void>
  sendBookingCancellation(booking: Booking): Promise<void>
  sendBookingUpdate(booking: Booking): Promise<void>
  
  // Schedule-related emails
  sendScheduleReminder(event: CalendarEvent): Promise<void>
  sendScheduleUpdate(event: CalendarEvent): Promise<void>
  sendScheduleCancellation(event: CalendarEvent): Promise<void>
  
  // Announcement emails
  sendAnnouncement(announcement: Announcement, recipients: User[]): Promise<void>
  sendEventInvitation(event: Event, recipients: User[]): Promise<void>
  
  // Workshop-related emails
  sendWorkshopRegistration(workshop: Workshop, user: User): Promise<void>
  sendWorkshopReminder(workshop: Workshop, user: User): Promise<void>
  sendWorkshopCompletion(workshop: Workshop, user: User): Promise<void>
}
```

### **Email Templates**
```
/emails/
├── templates/
│   ├── booking/
│   │   ├── confirmation.html
│   │   ├── reminder.html
│   │   ├── cancellation.html
│   │   └── update.html
│   ├── schedule/
│   │   ├── event-reminder.html
│   │   ├── event-update.html
│   │   └── event-cancellation.html
│   ├── announcements/
│   │   ├── general-announcement.html
│   │   ├── event-invitation.html
│   │   └── newsletter.html
│   └── workshops/
│       ├── registration.html
│       ├── reminder.html
│       └── completion.html
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   └── EventCard.tsx
└── utils/
    ├── emailRenderer.ts
    ├── templateEngine.ts
    └── emailQueue.ts
```

## 🗓️ **Schedule Component Integration**

### **Enhanced Schedule Features**
```typescript
interface ScheduleComponent {
  // Calendar views
  monthView: boolean
  weekView: boolean
  dayView: boolean
  agendaView: boolean
  
  // Booking integration
  showAvailability: boolean
  allowBooking: boolean
  bookingSlots: TimeSlot[]
  
  // Event management
  events: CalendarEvent[]
  workshops: Workshop[]
  announcements: Announcement[]
  
  // Email integration
  sendReminders: boolean
  reminderSettings: ReminderSettings
}
```

### **Booking Flow Integration**
```
1. User views schedule → Available slots highlighted
2. User selects time slot → Booking form appears
3. User fills booking details → System validates
4. Booking created → Email confirmation sent
5. Calendar updated → Reminder scheduled
6. Event approaches → Reminder email sent
7. Event completed → Follow-up email sent
```

## 🔄 **Email Workflow Automation**

### **Booking Workflows**
```typescript
// Booking confirmation workflow
const bookingWorkflow = {
  onBookingCreated: [
    'sendConfirmationEmail',
    'addToCalendar',
    'scheduleReminder',
    'updateAvailability'
  ],
  onBookingUpdated: [
    'sendUpdateEmail',
    'updateCalendar',
    'rescheduleReminder'
  ],
  onBookingCancelled: [
    'sendCancellationEmail',
    'removeFromCalendar',
    'cancelReminder',
    'freeUpSlot'
  ]
}
```

### **Schedule Workflows**
```typescript
// Event reminder workflow
const scheduleWorkflow = {
  onEventCreated: [
    'sendInvitationEmails',
    'addToCalendar',
    'scheduleReminders'
  ],
  onEventUpdated: [
    'sendUpdateEmails',
    'updateCalendar',
    'rescheduleReminders'
  ],
  onEventCancelled: [
    'sendCancellationEmails',
    'removeFromCalendar',
    'cancelReminders'
  ]
}
```

## 📊 **Database Schema Updates**

### **Enhanced Bookings Table**
```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_scheduled_at TIMESTAMP;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS email_preferences JSONB;
```

### **Email Logs Table**
```sql
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  email_type VARCHAR(100) NOT NULL,
  template_name VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Email Templates Table**
```sql
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 **Implementation Phases**

### **Phase 1: Email Service Foundation**
- [ ] Set up Resend API integration
- [ ] Create email service architecture
- [ ] Build email template system
- [ ] Implement basic email sending

### **Phase 2: Booking Email Integration**
- [ ] Booking confirmation emails
- [ ] Booking reminder system
- [ ] Booking update notifications
- [ ] Booking cancellation emails

### **Phase 3: Schedule Integration**
- [ ] Enhanced schedule component
- [ ] Calendar event management
- [ ] Availability tracking
- [ ] Event reminder system

### **Phase 4: Announcement System**
- [ ] Announcement email templates
- [ ] Bulk email sending
- [ ] Email preferences management
- [ ] Newsletter system

### **Phase 5: Advanced Features**
- [ ] Email analytics and tracking
- [ ] A/B testing for emails
- [ ] Automated email sequences
- [ ] Email personalization

## 🎯 **Key Benefits**

### **Scalability**
- Centralized email service
- Reusable email templates
- Queue-based email processing
- Template management system

### **User Experience**
- Automated confirmations
- Proactive reminders
- Consistent branding
- Personalized communications

### **Administrative**
- Email analytics
- Template management
- Bulk operations
- Error handling and logging

## 🔧 **Technical Implementation**

### **Email Service Setup**
```typescript
// lib/email/EmailService.ts
export class EmailService {
  private resend: Resend
  
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }
  
  async sendBookingConfirmation(booking: Booking) {
    const template = await this.getTemplate('booking-confirmation')
    const html = await this.renderTemplate(template, { booking })
    
    return this.resend.emails.send({
      from: 'Oolite Arts <noreply@oolitearts.org>',
      to: booking.user.email,
      subject: template.subject,
      html
    })
  }
}
```

### **Schedule Component Enhancement**
```typescript
// components/schedule/EnhancedSchedule.tsx
export function EnhancedSchedule() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  
  const handleBookingCreate = async (booking: Booking) => {
    // Create booking
    await createBooking(booking)
    
    // Send confirmation email
    await emailService.sendBookingConfirmation(booking)
    
    // Update schedule
    setBookings(prev => [...prev, booking])
  }
  
  return (
    <Calendar
      events={[...bookings, ...events]}
      onEventCreate={handleBookingCreate}
      showAvailability={true}
      allowBooking={true}
    />
  )
}
```

This integration will create a powerful, scalable system that connects all your key features with automated email communications! 🚀
