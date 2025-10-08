# Infra24 - Multi-Tenant Platform

A comprehensive multi-tenant platform for workshops, digital labs, artist profiles, and announcements with integrated booking system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Clerk authentication

### Installation
```bash
npm install
```

### Database Setup
```bash
# Start Supabase
npx supabase start

# Setup database schema
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql

# Create booking resources
node scripts/create-booking-resources.js
```

### Development
```bash
npm run dev
```

## 📚 Documentation

### Core Features
- **Workshops**: MDX-based learning content with analytics
- **Digital Lab**: Equipment management and booking
- **Artist Profiles**: Portfolio and profile management
- **Announcements**: Event and news management
- **Booking System**: Calendar integration with ICS files

### Key Documentation
- [Booking System Documentation](./docs/BOOKING_SYSTEM_INDEX.md) - Complete booking system guide
- [Database Testing Guide](./docs/DATABASE_TESTING_GUIDE.md) - Database testing procedures
- [Scripts Reference](./docs/SCRIPTS_REFERENCE.md) - All available scripts

## 🛠️ Key Scripts

```bash
# Database testing
node scripts/test-database-connection.js

# Populate sample data
node scripts/populate-artists.js

# Database synchronization
node scripts/database-sync.js
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Styling**: Tailwind CSS with dynamic theming

### Key Features
- Multi-tenant architecture with organization-specific theming
- MDX-based content system for workshops
- Real-time booking system with calendar integration
- Unified voting system for workshops and equipment
- Mobile-first responsive design

## 📊 Current Status

### ✅ Completed
- Core booking system with calendar integration
- Workshop learning system with MDX content
- Digital lab equipment management
- Artist profile system
- Announcement management
- Multi-tenant theming system

### 🚧 In Progress
- Email notifications via Resend API
- Advanced booking features

### 📋 Planned
- Google Meet integration
- Booking analytics dashboard
- Advanced workshop features

## 🔧 Development

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Database Schema
- `organizations` - Multi-tenant organization data
- `workshops` - Workshop content and metadata
- `workshop_chapters` - MDX-based learning content
- `bookings` - Booking system data
- `resources` - Available resources for booking
- `artist_profiles` - Artist portfolio data
- `announcements` - Event and news management

## 📞 Support

For detailed documentation, see the [docs](./docs/) directory.

---

*Last updated: September 30, 2025*