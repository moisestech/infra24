# Infra24 Project Bible 📚

> **The definitive guide to Infra24 - Multi-tenant Cultural Infrastructure Platform**

## 🎯 Project Vision

Infra24 is a comprehensive platform for cultural organizations to manage announcements, bookings, workshops, and community engagement. We're building the infrastructure that powers cultural spaces, enabling them to focus on their mission while we handle the technology.

## 🏗️ Architecture Overview

### Core Components
- **Multi-tenant Architecture**: Each organization gets isolated data and branding
- **Booking System**: Equipment, spaces, workshops, and people booking
- **Workshop Management**: MDX-based content with interactive learning
- **Survey System**: Comprehensive feedback and assessment tools
- **Calendar Integration**: Google Calendar sync with conflict detection
- **Email System**: Automated notifications and confirmations

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Email**: Resend
- **Calendar**: Google Calendar API
- **Deployment**: Vercel

## 📊 Current Status (January 2025)

### ✅ Completed Features
- [x] Multi-tenant organization system
- [x] Basic booking system with resources
- [x] Workshop system with MDX content
- [x] Survey system with templates
- [x] Email notifications
- [x] Dark/light theme support
- [x] Responsive design
- [x] Admin interfaces

### 🚧 In Progress
- [ ] Google Calendar integration
- [ ] Advanced booking conflict detection
- [ ] AppSheet integration for external requests
- [ ] AI-powered program digests
- [ ] Advanced reporting and analytics

### 📋 Planned Features
- [ ] Stripe payment integration
- [ ] Advanced user roles and permissions
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Advanced workshop analytics

## 🗂️ Documentation Structure

### Core Documentation
- [PROJECT_BIBLE.md](./PROJECT_BIBLE.md) - This file (main reference)
- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Local development setup

### Feature Documentation
- [BOOKING_SYSTEM_INDEX.md](./BOOKING_SYSTEM_INDEX.md) - Booking system overview
- [SURVEY_SYSTEM_COMPLETE_SUMMARY.md](./SURVEY_SYSTEM_COMPLETE_SUMMARY.md) - Survey system
- [LEARN_CANVAS_IMPLEMENTATION_STATUS.md](./LEARN_CANVAS_IMPLEMENTATION_STATUS.md) - Workshop system

### Technical Documentation
- [DATABASE_SYNC_GUIDE.md](./DATABASE_SYNC_GUIDE.md) - Database management
- [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) - Email configuration
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures

## 🗄️ Database Schema

### Core Tables
- `organizations` - Multi-tenant organization data
- `resources` - Bookable items (equipment, spaces, people, workshops)
- `bookings` - Booking records with status tracking
- `surveys` - Survey instances and responses
- `workshops` - Workshop content and metadata
- `announcements` - Organization announcements

### Key Relationships
- Organizations → Resources (1:many)
- Resources → Bookings (1:many)
- Organizations → Surveys (1:many)
- Organizations → Workshops (1:many)

## 🎨 UI Component Library

### Booking Components
- `ResourceCalendar` - Full calendar view with FullCalendar.js
- `BookingForm` - Comprehensive booking form
- `StreamlinedBookingModal` - Mobile-optimized booking flow
- `BookingTypeSelector` - Service type selection
- `TimeSlotSelector` - Time slot picker

### Common Components
- `PageFooter` - Reusable footer with policies
- `UnifiedNavigation` - Multi-tenant navigation
- `TenantProvider` - Theme and configuration provider

## 🔧 Scripts and Automation

### Database Scripts
- `scripts/setup-database-data.js` - Initial data setup
- `scripts/populate-*-resources.js` - Resource population
- `scripts/test-*.js` - Testing utilities

### Migration Scripts
- `supabase/migrations/` - Database schema migrations
- `scripts/run-migration.js` - Migration runner

## 🚀 Deployment

### Environments
- **Development**: Local with Supabase local instance
- **Staging**: Vercel preview deployments
- **Production**: Vercel production with Supabase cloud

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `RESEND_API_KEY` - Email service
- `GOOGLE_CALENDAR_API_KEY` - Calendar integration

## 📈 Roadmap Phases

### Phase 0: Foundation (✅ Complete)
- Multi-tenant architecture
- Basic booking system
- Core UI components

### Phase 1: Integration (🚧 Current)
- Google Calendar sync
- AppSheet integration
- Advanced conflict detection

### Phase 2: Intelligence (📋 Planned)
- AI-powered digests
- Natural language queries
- Advanced analytics

### Phase 3: Scale (📋 Future)
- Mobile app
- Third-party integrations
- Advanced payment processing

## 🎯 Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- 99.9% uptime
- Zero data loss
- < 5% error rate

### Business Metrics
- User engagement
- Booking completion rate
- Organization satisfaction
- Feature adoption

## 🔒 Security & Compliance

### Data Protection
- Row Level Security (RLS) in Supabase
- Encrypted data transmission
- Regular security audits
- GDPR compliance ready

### Access Control
- Role-based permissions
- Organization isolation
- Audit logging
- Secure API endpoints

## 📞 Support & Maintenance

### Monitoring
- Vercel analytics
- Supabase monitoring
- Error tracking
- Performance monitoring

### Maintenance
- Regular dependency updates
- Security patches
- Database optimization
- Performance tuning

---

## 📚 Quick Reference

### Common Commands
```bash
# Start development
npm run dev

# Run database migrations
npm run db:migrate

# Test the system
npm run test

# Deploy to production
npm run deploy
```

### Key URLs
- **Development**: http://localhost:3000
- **Production**: https://infra24.vercel.app
- **Admin**: https://infra24.vercel.app/admin

### Important Files
- `app/layout.tsx` - Root layout
- `components/tenant/TenantProvider.tsx` - Multi-tenant provider
- `lib/supabase.ts` - Database client
- `middleware.ts` - Request routing

---

*Last updated: January 2025*
*Version: 2.0.0*
