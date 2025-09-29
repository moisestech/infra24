# Database Sync Guide

This guide explains how to synchronize data between local and production databases for the Infra24 platform.

## Overview

The database sync system allows you to:
- Export data from production to local development
- Import sample data for testing
- Verify data consistency between environments
- Backup and restore specific tables

## Prerequisites

1. **Environment Variables**: Ensure you have the correct environment variables set up:
   ```bash
   # Local environment (.env.local)
   NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
   
   # Production environment (add to .env.local for sync operations)
   PRODUCTION_SUPABASE_URL=your_production_supabase_url
   PRODUCTION_SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   ```

2. **Database Access**: Ensure you have service role keys for both environments

## Available Commands

### 1. Populate Local Database

Populate your local database with sample data:

```bash
node scripts/database-sync.js populate-local
```

This will:
- Clear existing artist data
- Import all 27 Oolite artists (Studio Residents, Live In Art Residents, Cinematic Residents, Staff)
- Set up proper metadata and relationships

### 2. Sync All Tables

Sync all tables from production to local:

```bash
node scripts/database-sync.js sync-all production local
```

This will sync:
- Organizations
- Artist profiles
- Workshops and chapters
- Surveys and templates
- Announcements
- Resources and bookings
- Equipment options and votes
- User progress data

### 3. Sync Specific Table

Sync a specific table:

```bash
node scripts/database-sync.js sync-table artist_profiles production local
```

### 4. Export Data to File

Export table data to a JSON file:

```bash
node scripts/database-sync.js export artist_profiles production 2133fe94-fb12-41f8-ab37-ea4acd4589f6
```

This creates a file in `scripts/exports/` with the data.

### 5. Import Data from File

Import data from a JSON file:

```bash
node scripts/database-sync.js import artist_profiles local scripts/exports/artist_profiles_production_2024-01-15.json
```

### 6. Verify Sync

Verify that data is consistent between environments:

```bash
node scripts/database-sync.js verify production local 2133fe94-fb12-41f8-ab37-ea4acd4589f6
```

## Common Workflows

### Setting Up Local Development

1. **Fresh Start**: Populate with sample data
   ```bash
   node scripts/database-sync.js populate-local
   ```

2. **Production Data**: Sync from production
   ```bash
   node scripts/database-sync.js sync-all production local
   ```

### Before Production Deployment

1. **Verify Local Changes**: Export local data
   ```bash
   node scripts/database-sync.js export workshops local 2133fe94-fb12-41f8-ab37-ea4acd4589f6
   ```

2. **Test Import**: Import to staging/production
   ```bash
   node scripts/database-sync.js import workshops production scripts/exports/workshops_local_2024-01-15.json
   ```

### Data Backup

1. **Full Backup**: Export all critical tables
   ```bash
   node scripts/database-sync.js export organizations production
   node scripts/database-sync.js export artist_profiles production 2133fe94-fb12-41f8-ab37-ea4acd4589f6
   node scripts/database-sync.js export workshops production 2133fe94-fb12-41f8-ab37-ea4acd4589f6
   ```

## Data Structure

### Artist Profiles

The artist data includes:
- **Studio Residents**: 13 artists with studio numbers
- **Live In Art Residents**: 8 artists with residential studios
- **Cinematic Residents**: 5 artists at Oolite Satellite
- **Staff**: 1 staff member

Each artist has:
- Basic info (name, email, phone)
- Studio information
- Social media links
- Skills and mediums
- Metadata (residency type, year, etc.)

### Workshops

Workshop data includes:
- SEO Workshop with Learn Canvas content
- Own Your Digital Presence Workshop
- Chapter structure and content
- User progress tracking

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify environment variables are correct
   - Check service role key permissions

2. **Missing Data**
   - Run `populate-local` to get sample data
   - Check organization ID matches

3. **Sync Failures**
   - Verify both databases are accessible
   - Check for foreign key constraints
   - Review error logs for specific issues

### Verification Steps

1. **Check Artist Count**:
   ```bash
   psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -c "SELECT COUNT(*) FROM artist_profiles;"
   ```

2. **Test API Endpoints**:
   ```bash
   curl "http://localhost:3001/api/artists?orgId=2133fe94-fb12-41f8-ab37-ea4acd4589f6"
   ```

3. **Verify Frontend**:
   - Visit `http://localhost:3001/o/oolite/artists`
   - Check that artists are displayed correctly

## Security Notes

- Never commit production credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate service role keys
- Limit production access to necessary personnel only

## File Locations

- **Sync Script**: `scripts/database-sync.js`
- **Artist Data**: `scripts/populate-oolite-artists.js`
- **Exports**: `scripts/exports/` (created automatically)
- **Documentation**: `docs/DATABASE_SYNC_GUIDE.md`

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your environment variables
3. Ensure both databases are accessible
4. Review the troubleshooting section above
