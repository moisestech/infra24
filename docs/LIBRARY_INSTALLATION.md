# Library Installation Guide

## 🎯 **Installation Strategy**

Install libraries in phases to avoid dependency conflicts and ensure each phase delivers working functionality.

## 📦 **Phase 1: Core Booking Libraries (Week 1)**

### **FullCalendar - Industry Standard Calendar**
```bash
# Core FullCalendar packages
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid

# Resource scheduling (rooms as columns)
npm install @fullcalendar/resource-timegrid @fullcalendar/resource-daygrid

# Interaction features (drag & drop, selection)
npm install @fullcalendar/interaction

# Additional plugins
npm install @fullcalendar/list @fullcalendar/moment
```

**Why FullCalendar?**
- ✅ Industry standard for resource scheduling
- ✅ Battle-tested with millions of users
- ✅ Excellent documentation and community
- ✅ Handles timezones, recurring events, drag & drop
- ✅ Perfect for "rooms as columns" view

### **Date Handling**
```bash
# Date manipulation and formatting
npm install date-fns

# Timezone handling
npm install date-fns-tz
```

### **Form Handling (Already Installed)**
```bash
# Already in your project
npm install react-hook-form zod
```

## 📦 **Phase 2: Communication Libraries (Week 2)**

### **Email & Calendar Invites**
```bash
# Email sending
npm install resend

# Calendar file generation
npm install ics

# Email templates
npm install react-email @react-email/components
```

### **UI Components (Already Installed)**
```bash
# Already in your project
npm install @radix-ui/react-* lucide-react
```

## 📦 **Phase 3: Advanced Features (Week 3-4)**

### **People Bookings (Cal.com Integration)**
```bash
# Cal.com embed
npm install @calcom/embed-react

# Alternative: Calendly (if needed)
npm install react-calendly
```

### **Payments (When Needed)**
```bash
# Stripe integration
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### **Analytics & Charts**
```bash
# Charts for utilization reports
npm install recharts

# Data visualization
npm install d3-scale d3-time-format
```

## 🔧 **Installation Commands**

### **Complete Phase 1 Installation**
```bash
cd /Users/moisessanabria/Documents/website/bakehouse-news

# Core booking libraries
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/resource-timegrid @fullcalendar/resource-daygrid @fullcalendar/interaction @fullcalendar/list @fullcalendar/moment

# Date handling
npm install date-fns date-fns-tz

# Verify installation
npm list @fullcalendar/react @fullcalendar/core date-fns
```

### **Complete Phase 2 Installation**
```bash
# Communication libraries
npm install resend ics react-email @react-email/components

# Verify installation
npm list resend ics react-email
```

### **Complete Phase 3 Installation**
```bash
# Advanced features
npm install @calcom/embed-react stripe @stripe/stripe-js @stripe/react-stripe-js recharts

# Verify installation
npm list @calcom/embed-react stripe recharts
```

## 📋 **Package.json Dependencies**

### **Phase 1 Dependencies**
```json
{
  "dependencies": {
    "@fullcalendar/react": "^6.1.10",
    "@fullcalendar/core": "^6.1.10",
    "@fullcalendar/daygrid": "^6.1.10",
    "@fullcalendar/timegrid": "^6.1.10",
    "@fullcalendar/resource-timegrid": "^6.1.10",
    "@fullcalendar/resource-daygrid": "^6.1.10",
    "@fullcalendar/interaction": "^6.1.10",
    "@fullcalendar/list": "^6.1.10",
    "@fullcalendar/moment": "^6.1.10",
    "date-fns": "^2.30.0",
    "date-fns-tz": "^2.0.0"
  }
}
```

### **Phase 2 Dependencies**
```json
{
  "dependencies": {
    "resend": "^2.0.0",
    "ics": "^2.44.0",
    "react-email": "^2.0.0",
    "@react-email/components": "^0.0.15"
  }
}
```

### **Phase 3 Dependencies**
```json
{
  "dependencies": {
    "@calcom/embed-react": "^1.0.0",
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "recharts": "^2.8.0"
  }
}
```

## 🧪 **Testing Installation**

### **Test FullCalendar Installation**
```typescript
// Create test file: components/test/FullCalendarTest.tsx
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export function FullCalendarTest() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[
        { title: 'Test Event', start: new Date() }
      ]}
    />
  )
}
```

### **Test Date-fns Installation**
```typescript
// Create test file: components/test/DateFnsTest.tsx
import { format, addDays } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

export function DateFnsTest() {
  const now = new Date()
  const tomorrow = addDays(now, 1)
  const formatted = format(tomorrow, 'yyyy-MM-dd HH:mm:ss')
  
  return <div>Tomorrow: {formatted}</div>
}
```

### **Test Resend Installation**
```typescript
// Create test file: lib/test/resendTest.ts
import { Resend } from 'resend'

export async function testResend() {
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'test@yourdomain.com',
      to: ['test@example.com'],
      subject: 'Test Email',
      html: '<p>Test email from Infra24</p>'
    })
    
    if (error) {
      console.error('Resend error:', error)
      return false
    }
    
    console.log('Email sent:', data)
    return true
  } catch (error) {
    console.error('Resend test failed:', error)
    return false
  }
}
```

## 🔧 **Configuration Files**

### **FullCalendar CSS Import**
```typescript
// Add to app/globals.css
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';
@import '@fullcalendar/timegrid/main.css';
@import '@fullcalendar/resource-timegrid/main.css';
@import '@fullcalendar/resource-daygrid/main.css';
@import '@fullcalendar/list/main.css';
```

### **Environment Variables**
```bash
# Add to .env.local
RESEND_API_KEY=your_resend_api_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CALCOM_API_KEY=your_calcom_api_key
```

## 📊 **Library Comparison**

### **Calendar Libraries**
| Library | Pros | Cons | Use Case |
|---------|------|------|----------|
| **FullCalendar** | Industry standard, feature-rich, resource scheduling | Larger bundle size | Admin resource management |
| **React Big Calendar** | Lighter, simpler API | Limited resource scheduling | Attendee calendar views |
| **Custom Solution** | Full control | Time-consuming, bug-prone | Not recommended |

### **Email Libraries**
| Library | Pros | Cons | Use Case |
|---------|------|------|----------|
| **Resend** | Modern API, great DX, React email | Newer service | Primary email provider |
| **Nodemailer** | Mature, flexible | Complex setup | Fallback option |
| **SendGrid** | Enterprise features | Expensive | Enterprise clients |

### **People Booking Libraries**
| Library | Pros | Cons | Use Case |
|---------|------|------|----------|
| **Cal.com** | Open source, embeddable, multi-tenant | Self-hosted complexity | Studio visits, office hours |
| **Calendly** | Easy setup, reliable | Expensive, less control | Quick implementation |
| **Custom Solution** | Full control | Time-consuming | Not recommended |

## 🚀 **Next Steps After Installation**

1. **Test all installations** with the test components above
2. **Configure environment variables** for external services
3. **Build ResourceCalendar component** (see `COMPONENT_DEVELOPMENT.md`)
4. **Create booking API routes** (see `API_DEVELOPMENT.md`)

## ⚠️ **Common Issues & Solutions**

### **FullCalendar Bundle Size**
```typescript
// Use dynamic imports for code splitting
const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
  loading: () => <div>Loading calendar...</div>
})
```

### **Date-fns Tree Shaking**
```typescript
// Import specific functions to reduce bundle size
import { format, addDays, parseISO } from 'date-fns'
// Instead of: import * as dateFns from 'date-fns'
```

### **Resend API Key**
```typescript
// Ensure API key is properly configured
const resend = new Resend(process.env.RESEND_API_KEY)
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}
```

---

*This guide ensures you have all the necessary libraries installed in the right order, with proper testing and configuration.*
