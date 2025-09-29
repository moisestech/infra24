# Database Testing Guide

This guide provides comprehensive testing procedures for the Learn Canvas integration database setup.

## 🎯 Overview

The Learn Canvas system requires several database tables and relationships to function properly. This guide helps you verify that everything is set up correctly in both local and production environments.

## 📋 Prerequisites

- Local Supabase instance running (`supabase start`)
- Production Supabase project with service role key
- Node.js environment with required dependencies

## 🧪 Testing Methods

### Method 1: Automated Node.js Script

Run the automated database connection test:

```bash
node scripts/test-database-connection.js
```

This script will:
- ✅ Test connection to both local and production databases
- ✅ Verify Oolite organization exists
- ✅ Check workshops and their Learn Canvas fields
- ✅ Validate workshop chapters
- ✅ Provide a summary report

### Method 2: Manual SQL Queries

Run the comprehensive SQL test queries:

```bash
# In Supabase SQL Editor or psql
psql -f scripts/test-database-queries.sql
```

Or copy and paste the contents of `scripts/test-database-queries.sql` into your Supabase SQL Editor.

## 📊 Expected Results

### Local Database (Development)
- **Organizations**: 1 record (Oolite Arts)
- **Workshops**: 3 records (SEO Workshop, Digital Presence Workshop, Own Your Digital Presence)
- **Workshop Chapters**: 8 records (4 chapters per workshop)
- **User Progress**: 0 records (initially empty)

### Production Database
- **Organizations**: 1+ records (depending on your setup)
- **Workshops**: 3+ records with Learn Canvas fields
- **Workshop Chapters**: 8+ records
- **User Progress**: Variable (depends on user activity)

## 🔍 Key Fields to Verify

### Organizations Table
- `id`: UUID primary key
- `name`: "Oolite Arts"
- `slug`: "oolite"
- `theme_colors`: JSON object with color scheme

### Workshops Table
- `has_learn_content`: `true` for Learn Canvas workshops
- `learning_objectives`: Array of learning objectives
- `estimated_learn_time`: Number in minutes
- `learn_difficulty`: "beginner", "intermediate", or "advanced"
- `syllabus`: Text description
- `syllabus_sections`: JSON array of sections
- `materials_needed`: Array of required materials
- `what_youll_learn`: Array of learning outcomes
- `workshop_outline`: JSON array of workshop structure

### Workshop Chapters Table
- `workshop_id`: Foreign key to workshops
- `title`: Chapter title
- `slug`: URL-friendly identifier
- `order_index`: Chapter sequence number
- `estimated_time`: Time in minutes
- `content`: MDX content (optional)

### User Workshop Progress Table
- `user_id`: Clerk user ID
- `workshop_id`: Foreign key to workshops
- `chapter_id`: Foreign key to workshop_chapters
- `completed`: Boolean completion status
- `progress_percentage`: 0-100 completion percentage
- `last_accessed_at`: Timestamp of last access

## 🚨 Troubleshooting

### Common Issues

1. **"relation does not exist"**
   - Run the database setup script: `scripts/safe-database-setup.sql`
   - Check if Supabase is running locally

2. **"column does not exist"**
   - The Learn Canvas columns might be missing
   - Run the migration script to add missing columns

3. **"foreign key constraint"**
   - Check that organization_id references exist
   - Verify workshop_id references in chapters table

4. **Empty results**
   - Check if sample data was inserted
   - Verify organization slug matches exactly

### Environment Variables

Ensure these are set for production testing:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📈 Performance Considerations

- **Indexes**: Ensure proper indexes on frequently queried columns
- **RLS Policies**: Verify Row Level Security policies are working
- **Connection Pooling**: Monitor database connection usage

## 🔄 Regular Testing Schedule

### Daily (Development)
- Run automated connection test
- Verify new workshop data appears correctly

### Weekly (Production)
- Run comprehensive SQL queries
- Check user progress tracking
- Monitor database performance

### Before Deployments
- Test all database migrations
- Verify Learn Canvas functionality
- Check API endpoint responses

## 📝 Documentation Updates

When making database changes:

1. Update this testing guide
2. Add new test queries to `test-database-queries.sql`
3. Update the automated test script
4. Document any new required fields or relationships

## 🆘 Getting Help

If you encounter issues:

1. Check the terminal logs for specific error messages
2. Verify environment variables are set correctly
3. Ensure Supabase is running and accessible
4. Check the database schema matches expectations
5. Review RLS policies for access issues

## 📚 Related Files

- `scripts/test-database-connection.js` - Automated testing script
- `scripts/test-database-queries.sql` - Manual SQL queries
- `scripts/safe-database-setup.sql` - Database setup script
- `docs/LEARN_CANVAS_INTEGRATION_STRATEGY.md` - Integration overview
