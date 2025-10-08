# Infra24 Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Clerk authentication account

### Installation
```bash
# Clone repository
git clone <repository-url>
cd infra24

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🗄️ Database Setup

### 1. Start Supabase
```bash
npx supabase start
```

### 2. Setup Database Schema
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql
```

### 3. Create Booking Resources
```bash
node scripts/create-booking-resources.js
```

### 4. Populate Sample Data
```bash
node scripts/populate-artists.js
```

## 🛠️ Development Workflow

### Start Development Server
```bash
npm run dev
```

### Database Testing
```bash
# Test database connection
node scripts/test-database-connection.js

# Test specific features
node scripts/test-user-progress-structure.sql
```

### Database Synchronization
```bash
# Sync with production
node scripts/database-sync.js
```

## 📁 Project Structure

```
infra24/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── o/[slug]/          # Organization pages
│   ├── book/              # Public booking page
│   └── bookings/          # Staff booking dashboard
├── components/            # React components
│   ├── navigation/        # Navigation components
│   ├── booking/           # Booking components
│   ├── voting/            # Voting components
│   └── workshops/         # Workshop components
├── lib/                   # Utility libraries
├── scripts/               # Database and utility scripts
├── docs/                  # Documentation
└── content/               # MDX content files
```

## 🔧 Key Development Areas

### 1. Multi-Tenant Theming
- Organization-specific primary colors
- Dynamic component styling
- Consistent UI across tenants

### 2. Booking System
- Resource management
- Availability calculation
- Calendar integration
- Email notifications

### 3. Workshop System
- MDX content processing
- Chapter-based learning
- Progress tracking
- Analytics

### 4. Digital Lab
- Equipment management
- Status tracking
- Voting system
- Booking integration

## 🧪 Testing

### Database Testing
```bash
# Test database connection
node scripts/test-database-connection.js

# Test specific queries
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/test-user-progress-structure.sql
```

### API Testing
```bash
# Test availability API
curl "http://localhost:3000/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"

# Test booking creation
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"2133fe94-fb12-41f8-ab37-ea4acd4589f6","resource_id":"remote_visit","start_time":"2025-10-07T12:00:00-04:00","end_time":"2025-10-07T12:30:00-04:00","artist_name":"Test Artist","artist_email":"test@example.com","goal_text":"Test booking"}'
```

## 🐛 Common Issues

### Database Connection Issues
```bash
# Check Supabase status
npx supabase status

# Restart Supabase
npx supabase stop
npx supabase start
```

### Authentication Issues
- Verify Clerk keys in `.env.local`
- Check middleware configuration
- Ensure proper route protection

### Styling Issues
- Check tenant configuration
- Verify primary color values
- Use browser dev tools for debugging

## 📚 Documentation

### Core Documentation
- [Booking System Implementation](./BOOKING_SYSTEM_IMPLEMENTATION.md)
- [Scripts Reference](./SCRIPTS_REFERENCE.md)
- [Database Testing Guide](./DATABASE_TESTING_GUIDE.md)

### API Documentation
- [Availability API](./BOOKING_SYSTEM_IMPLEMENTATION.md#availability-api)
- [Booking API](./BOOKING_SYSTEM_IMPLEMENTATION.md#booking-api)
- [Calendar Integration](./BOOKING_SYSTEM_IMPLEMENTATION.md#calendar-integration)

## 🚀 Deployment

### Production Setup
1. Configure production environment variables
2. Setup production Supabase instance
3. Deploy to Vercel or similar platform
4. Configure domain and SSL

### Database Migration
```bash
# Backup production data
pg_dump production_db > backup.sql

# Apply schema changes
psql production_db -f scripts/setup-complete-database-schema.sql

# Restore data if needed
psql production_db < backup.sql
```

## 📞 Support

### Getting Help
1. Check documentation in `docs/` directory
2. Review common issues above
3. Check GitHub issues
4. Contact development team

### Contributing
1. Follow established code patterns
2. Update documentation for new features
3. Test thoroughly before submitting
4. Follow commit message conventions

---

*Last updated: September 30, 2025*



