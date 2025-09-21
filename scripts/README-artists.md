# Artist Management System

This document explains how to set up and manage artist profiles for organizations in Smart Sign.

## Overview

The artist management system allows organizations to:
- Upload and manage artist photos
- Organize artists by roles (resident, associate, staff, alumni)
- Associate artists with studios
- Display artist profiles with filtering and sorting
- Allow artists to claim their profiles

## Database Schema

The system uses the `artist_profiles` table with the following structure:

```sql
CREATE TABLE artist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  studio VARCHAR,
  role VARCHAR NOT NULL, -- 'resident', 'associate', 'staff', 'alumni', 'artist'
  status VARCHAR DEFAULT 'active', -- 'active', 'inactive'
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  claimed_by_clerk_user_id VARCHAR, -- Links to Clerk user when claimed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Roles

- **resident**: Current artist residents
- **associate**: Associate artists
- **staff**: Staff members
- **alumni**: Former residents/artists
- **artist**: General artist designation

## API Endpoints

### Get Artists
```
GET /api/artists?orgId={orgId}&role={role}&studio={studio}
```

### Create Artist Profile
```
POST /api/artists
{
  "name": "Artist Name",
  "bio": "Artist bio",
  "profile_image_url": "https://...",
  "studio": "Studio Name",
  "role": "resident",
  "org_id": "org-uuid"
}
```

### Update Artist Profile
```
PATCH /api/artists/{id}
{
  "name": "Updated Name",
  "bio": "Updated bio",
  ...
}
```

### Delete Artist Profile
```
DELETE /api/artists/{id}
```

## Setting Up Bakehouse Artists

### 1. Run the SQL Script

Execute the provided SQL script to create all Bakehouse artist profiles:

```bash
# Connect to your Supabase database and run:
psql -h your-db-host -U your-username -d your-database -f scripts/create-bakehouse-artists.sql
```

### 2. Verify the Data

Check that all artists were created successfully:

```sql
-- Count total artists
SELECT COUNT(*) as total_artists FROM artist_profiles WHERE org_id = '2efcebf3-9750-4ea2-85a0-9501eb698b20';

-- Breakdown by role
SELECT role, COUNT(*) as count FROM artist_profiles WHERE org_id = '2efcebf3-9750-4ea2-85a0-9501eb698b20' GROUP BY role ORDER BY count DESC;
```

### 3. Access the Artists Page

Navigate to: `http://localhost:3002/o/bakehouse/artists`

## Features

### Artist Management Page
- **Grid Layout**: Displays artists in a responsive grid
- **Search**: Search by name or bio
- **Filtering**: Filter by role and studio
- **Role Badges**: Color-coded badges for different roles
- **Actions**: View, edit, and delete artist profiles

### Role-Based Access Control
- **Super Admin**: Full access to all artist profiles
- **Org Admin**: Full access to organization's artist profiles
- **Moderator**: Can create and edit artist profiles
- **Regular Users**: Can view artist profiles

### Photo Management
- **Cloudinary Integration**: All photos are hosted on Cloudinary
- **Responsive Images**: Photos scale appropriately for different screen sizes
- **Fallback**: Default user icon when no photo is available

## Customization

### Adding New Roles
1. Update the `roleColors` and `roleIcons` objects in `/app/o/[slug]/artists/page.tsx`
2. Add the new role to the database schema if needed
3. Update any role-based filtering logic

### Studio Management
- Studios are stored as simple strings in the `studio` field
- You can extend this to a separate `studios` table if needed
- Studio filtering is automatically generated from existing data

### Styling
- The page uses Tailwind CSS for styling
- Role badges use predefined color schemes
- Dark mode is fully supported

## Troubleshooting

### Common Issues

1. **Photos not loading**: Check that Cloudinary URLs are accessible
2. **Permission errors**: Verify user roles and organization membership
3. **Missing artists**: Check that the organization ID is correct in the SQL script

### Debugging

Use the browser's developer tools to check:
- Network requests to the API endpoints
- Console errors
- Database queries in Supabase dashboard

## Future Enhancements

- **Artist Claiming**: Allow artists to claim and manage their own profiles
- **Studio Management**: Create a dedicated studios system
- **Portfolio Integration**: Link to artist portfolios or websites
- **Social Media**: Add social media links to artist profiles
- **Exhibition History**: Track artist exhibitions and shows



