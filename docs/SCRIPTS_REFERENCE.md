# Scripts Reference Guide

## Overview

This document provides a comprehensive reference for all scripts created during the Infra24 booking system implementation. Scripts are organized by category and include usage instructions, parameters, and expected outcomes.

## 📁 Script Categories

### 1. Database Setup & Migration Scripts

#### `scripts/setup-complete-database-schema.sql`
**Purpose**: Complete database schema setup for the booking system
**Usage**: 
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql
```
**What it does**:
- Creates all necessary tables (bookings, booking_participants, resources, etc.)
- Sets up proper indexes and constraints
- Creates triggers for updated_at timestamps
- Establishes foreign key relationships

#### `scripts/safe-database-setup.sql`
**Purpose**: Safe database setup with error handling and rollback capabilities
**Usage**:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/safe-database-setup.sql
```
**What it does**:
- Creates tables with IF NOT EXISTS clauses
- Handles existing data gracefully
- Provides rollback instructions
- Includes comprehensive error handling

### 2. Resource Management Scripts

#### `scripts/create-booking-resources.js`
**Purpose**: Creates initial booking resources (Remote Studio Visit, Print Room Consult)
**Usage**:
```bash
cd /Users/moisessanabria/Documents/website/infra24
node scripts/create-booking-resources.js
```
**What it does**:
- Creates `remote_visit` resource with availability rules
- Creates `print_room` resource with in-person configuration
- Sets up host windows and blackout dates
- Configures round-robin pooling

**Output**:
```javascript
{
  remote_visit: {
    id: "7d683079-3514-4b60-9155-7e4df4c46a30",
    title: "Remote Studio Visit",
    availability_rules: {
      windows: [
        { host: "mo@oolite.org", days: ["Tuesday", "Wednesday", "Thursday"], start: "12:00", end: "16:00" },
        { host: "fabi@oolite.org", days: ["Tuesday", "Thursday"], start: "12:00", end: "16:00" },
        { host: "matt@oolite.org", days: ["Wednesday"], start: "13:00", end: "17:00" }
      ],
      pooling: "round_robin",
      blackouts: [{"date": "2025-10-21"}, {"range": ["2025-11-25", "2025-11-28"]}]
    }
  },
  print_room: {
    id: "67e52569-d67d-4352-8ca3-c3bcbde8c43f",
    title: "Print Room Consult",
    location: "Print Room - Oolite Arts"
  }
}
```

### 3. Database Testing & Validation Scripts

#### `scripts/test-database-connection.js`
**Purpose**: Tests database connection and validates data existence
**Usage**:
```bash
node scripts/test-database-connection.js
```
**What it does**:
- Tests Supabase connection
- Validates table existence
- Checks data integrity
- Reports connection status

#### `scripts/quick-database-test.sql`
**Purpose**: Quick database validation queries
**Usage**:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/quick-database-test.sql
```
**What it does**:
- Counts records in all tables
- Validates foreign key relationships
- Checks data consistency
- Reports table statistics

#### `scripts/test-database-queries.sql`
**Purpose**: Comprehensive database testing queries
**Usage**:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/test-database-queries.sql
```
**What it does**:
- Tests complex queries
- Validates booking creation flow
- Checks participant relationships
- Tests availability calculations

### 4. Workshop Analytics Scripts

#### `scripts/workshop-analytics-query.sql`
**Purpose**: Comprehensive workshop analytics and reporting
**Usage**:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/workshop-analytics-query.sql
```
**What it does**:
- Calculates completion rates
- Tracks user progress
- Generates engagement metrics
- Provides detailed analytics

#### `scripts/simple-workshop-analytics.sql`
**Purpose**: Simplified workshop analytics for quick insights
**Usage**:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/simple-workshop-analytics.sql
```
**What it does**:
- Basic completion statistics
- User engagement metrics
- Workshop popularity rankings
- Simple progress tracking

#### `scripts/test-user-progress-structure.sql`
**Purpose**: Tests user workshop progress data structure
**Usage**:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/test-user-progress-structure.sql
```
**What it does**:
- Validates progress table structure
- Tests progress tracking queries
- Checks completion status logic
- Validates data integrity

### 5. Data Population Scripts

#### `scripts/populate-artists.js`
**Purpose**: Populates artist profiles with sample data
**Usage**:
```bash
node scripts/populate-artists.js
```
**What it does**:
- Creates sample artist profiles
- Populates with realistic data
- Sets up profile images and metadata
- Configures public/private settings

#### `scripts/update-digital-lab-resources.js`
**Purpose**: Updates digital lab equipment with proper images and metadata
**Usage**:
```bash
node scripts/update-digital-lab-resources.js
```
**What it does**:
- Updates equipment images to Cloudinary URLs
- Sets proper metadata for equipment
- Configures booking availability
- Updates equipment status

### 6. Database Synchronization Scripts

#### `scripts/database-sync.js`
**Purpose**: Synchronizes data between local and production databases
**Usage**:
```bash
node scripts/database-sync.js [source] [target]
```
**Parameters**:
- `source`: Source database (local/production)
- `target`: Target database (local/production)

**What it does**:
- Compares database schemas
- Identifies data differences
- Generates migration scripts
- Provides sync recommendations

## 🚀 Quick Start Commands

### Initial Setup
```bash
# 1. Start Supabase
npx supabase start

# 2. Setup database schema
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql

# 3. Create booking resources
node scripts/create-booking-resources.js

# 4. Test database connection
node scripts/test-database-connection.js
```

### Development Testing
```bash
# Test database integrity
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/quick-database-test.sql

# Run comprehensive tests
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/test-database-queries.sql

# Test workshop analytics
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/simple-workshop-analytics.sql
```

### Data Management
```bash
# Populate sample data
node scripts/populate-artists.js
node scripts/update-digital-lab-resources.js

# Sync databases
node scripts/database-sync.js local production
```

## 🔧 Script Development Guidelines

### Node.js Scripts
- Use ES6 modules with `import/export`
- Include proper error handling with try/catch
- Add console logging for debugging
- Use environment variables for configuration
- Include JSDoc comments for functions

### SQL Scripts
- Use `IF NOT EXISTS` for table creation
- Include proper constraints and indexes
- Add comments explaining complex queries
- Use transactions for multi-step operations
- Include rollback instructions

### Error Handling
```javascript
// Node.js script template
import { getSupabaseAdmin } from '../lib/supabase.js';

async function main() {
  try {
    const supabase = getSupabaseAdmin();
    console.log('✅ Script started successfully');
    
    // Your script logic here
    
    console.log('✅ Script completed successfully');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
```

## 📊 Script Output Examples

### Database Connection Test
```
🔍 Testing database connection...
✅ Supabase connection successful
✅ Organizations table exists (1 records)
✅ Resources table exists (4 records)
✅ Bookings table exists (2 records)
✅ Booking participants table exists (4 records)
✅ Database test completed successfully
```

### Resource Creation
```
🚀 Creating booking resources...
✅ Remote Studio Visit resource created: 7d683079-3514-4b60-9155-7e4df4c46a30
✅ Print Room Consult resource created: 67e52569-d67d-4352-8ca3-c3bcbde8c43f
✅ Resources created successfully
```

### Analytics Query
```
📊 Workshop Analytics Results:
- Total workshops: 3
- Total users: 15
- Completion rate: 67.5%
- Average progress: 45.2%
- Most popular workshop: SEO Workshop (8 users)
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check Supabase status
npx supabase status

# Restart Supabase
npx supabase stop
npx supabase start
```

#### Script Execution Errors
```bash
# Check Node.js version
node --version

# Install dependencies
npm install

# Run with debug output
DEBUG=* node scripts/script-name.js
```

#### SQL Execution Errors
```bash
# Check PostgreSQL connection
psql postgresql://postgres:postgres@localhost:54322/postgres -c "SELECT version();"

# Run with verbose output
psql postgresql://postgres:postgres@localhost:54322/postgres -v ON_ERROR_STOP=1 -f scripts/script-name.sql
```

## 📝 Script Maintenance

### Regular Tasks
- [ ] Update script documentation monthly
- [ ] Test scripts after database schema changes
- [ ] Validate script outputs quarterly
- [ ] Review and update error handling
- [ ] Optimize slow-running queries

### Version Control
- All scripts are version controlled in Git
- Include commit messages describing changes
- Tag releases for major script updates
- Maintain backward compatibility when possible

---

*Last updated: September 30, 2025*
*Version: 1.0.0*





