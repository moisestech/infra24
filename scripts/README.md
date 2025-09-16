# Scripts Directory

This directory contains all utility scripts for the Infra24 platform, organized by category for better maintainability.

## 📁 Directory Structure

```
scripts/
├── README.md                    # This file
├── database/                    # Database-related scripts
│   ├── migrations/             # SQL migration files
│   ├── setup/                 # Database setup scripts
│   └── maintenance/           # Database maintenance scripts
├── data/                      # Data management scripts
│   ├── seed/                  # Sample data insertion
│   ├── import/                # Data import utilities
│   └── export/                # Data export utilities
├── testing/                   # Testing and validation scripts
│   ├── api/                   # API testing scripts
│   ├── integration/           # Integration tests
│   └── performance/           # Performance testing
└── utilities/                 # General utility scripts
    ├── build/                 # Build and deployment utilities
    ├── monitoring/            # Monitoring and health checks
    └── maintenance/           # General maintenance tasks
```

## 🗄️ Database Scripts (`database/`)

### Migrations (`database/migrations/`)
- **Purpose**: SQL migration files for database schema changes
- **Naming Convention**: `YYYYMMDD_HHMMSS_description.sql`
- **Usage**: Run these in Supabase dashboard or via CLI

### Setup (`database/setup/`)
- **Purpose**: Initial database setup and configuration
- **Files**:
  - `setup-supabase-complete.js` - Complete database setup
  - `setup-tables-simple.js` - Simple table creation
  - `run-migration.js` - Migration runner

### Maintenance (`database/maintenance/`)
- **Purpose**: Database maintenance and optimization scripts
- **Files**:
  - `cleanup-old-data.js` - Clean up old records
  - `optimize-indexes.js` - Database optimization
  - `backup-data.js` - Data backup utilities

## 📊 Data Scripts (`data/`)

### Seed (`data/seed/`)
- **Purpose**: Insert sample/test data
- **Files**:
  - `create-test-announcements.js` - Sample announcements
  - `create-bakehouse-artists.sql` - Artist profiles
  - `create-test-bookings.js` - Sample bookings

### Import (`data/import/`)
- **Purpose**: Import data from external sources
- **Files**:
  - `import-users.js` - User data import
  - `import-organizations.js` - Organization data import

### Export (`data/export/`)
- **Purpose**: Export data for backup or analysis
- **Files**:
  - `export-analytics.js` - Analytics data export
  - `export-bookings.js` - Booking data export

## 🧪 Testing Scripts (`testing/`)

### API (`testing/api/`)
- **Purpose**: API endpoint testing
- **Files**:
  - `test-api.js` - General API testing
  - `test-booking-api.js` - Booking API tests
  - `test-submission-api.js` - Submission API tests

### Integration (`testing/integration/`)
- **Purpose**: End-to-end integration testing
- **Files**:
  - `test-booking-flow.js` - Complete booking flow test
  - `test-submission-flow.js` - Complete submission flow test

### Performance (`testing/performance/`)
- **Purpose**: Performance and load testing
- **Files**:
  - `load-test-bookings.js` - Booking system load test
  - `performance-monitor.js` - Performance monitoring

## 🔧 Utility Scripts (`utilities/`)

### Build (`utilities/build/`)
- **Purpose**: Build and deployment utilities
- **Files**:
  - `test-build-and-dev.sh` - Build and dev server testing
  - `deploy-check.js` - Pre-deployment checks

### Monitoring (`utilities/monitoring/`)
- **Purpose**: System monitoring and health checks
- **Files**:
  - `health-check.js` - System health monitoring
  - `uptime-monitor.js` - Uptime monitoring

### Maintenance (`utilities/maintenance/`)
- **Purpose**: General maintenance tasks
- **Files**:
  - `cleanup-temp-files.js` - Clean temporary files
  - `update-dependencies.js` - Dependency updates

## 🚀 Quick Start

### 1. Database Setup
```bash
# Run the complete database setup
node scripts/database/setup/setup-supabase-complete.js

# Or run a specific migration
node scripts/database/setup/run-migration.js
```

### 2. Seed Sample Data
```bash
# Create test announcements
node scripts/data/seed/create-test-announcements.js

# Create sample bookings
node scripts/data/seed/create-test-bookings.js
```

### 3. Run Tests
```bash
# Test API endpoints
node scripts/testing/api/test-api.js

# Test booking flow
node scripts/testing/integration/test-booking-flow.js
```

### 4. Health Checks
```bash
# Check system health
node scripts/utilities/monitoring/health-check.js

# Monitor uptime
node scripts/utilities/monitoring/uptime-monitor.js
```

## 📋 Environment Variables

All scripts require the following environment variables (from `.env.local`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Configuration (for user management)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## 🔒 Security Notes

- **Never commit** `.env.local` or any files containing secrets
- **Service Role Key** should only be used in server-side scripts
- **Anon Key** can be used in client-side scripts
- Always validate input data before database operations
- Use parameterized queries to prevent SQL injection

## 📝 Adding New Scripts

When adding new scripts:

1. **Choose the right directory** based on the script's purpose
2. **Follow naming conventions** (kebab-case for files)
3. **Add documentation** with comments explaining the script's purpose
4. **Update this README** with the new script's description
5. **Test thoroughly** before committing

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Found**
   - Ensure `.env.local` exists and contains required variables
   - Check that the script is running from the project root

2. **Database Connection Errors**
   - Verify Supabase URL and keys are correct
   - Check if tables exist in the database
   - Ensure RLS policies allow the operation

3. **Permission Errors**
   - Check if the service role key has sufficient permissions
   - Verify user authentication for user-specific operations

### Getting Help

- Check the script's inline documentation
- Review the Supabase logs for database errors
- Test with smaller datasets first
- Use the testing scripts to validate functionality

## 📚 Related Documentation

- [Supabase Setup Guide](../docs/technical/SUPABASE_SETUP.md)
- [API Documentation](../docs/technical/INFRA24_API_SPECIFICATION.md)
- [Database Schema](../docs/technical/INFRA24_DATABASE_SCHEMA.sql)
- [Infra24 Platform Overview](../docs/INFRA24_PLATFORM.md)