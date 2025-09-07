# Debug Scripts for Announcements

This folder contains SQL scripts to help debug and test announcement functionality.

## Scripts

### 1. `debug-announcements.sql`
Use this script to debug announcement issues in your production Supabase database.

**What it does:**
- Checks if a specific announcement exists
- Lists all announcements for an organization
- Shows organization details
- Displays user memberships
- Counts announcements by status
- Shows recent announcements

**How to use:**
1. Open your Supabase SQL editor
2. Copy and paste the script
3. Modify the announcement ID or organization slug as needed
4. Run the queries to see what's happening

### 2. `create-test-announcements.sql`
Use this script to create test announcements for debugging.

**What it does:**
- Creates sample announcements of different types
- Includes proper organization and user references
- Sets up realistic test data

**How to use:**
1. First run `debug-announcements.sql` to get organization and user IDs
2. Uncomment the announcements you want to create
3. Replace placeholder user IDs with actual clerk user IDs
4. Run the script in Supabase

## Common Issues and Solutions

### Issue: "Announcement not found" error
**Possible causes:**
1. Announcement ID doesn't exist in database
2. Announcement is soft-deleted (`deleted_at` is not null)
3. User doesn't have access to the announcement
4. Organization doesn't exist

**Debug steps:**
1. Run the first query in `debug-announcements.sql` with the specific ID
2. Check if the announcement exists and isn't deleted
3. Verify the user has proper membership in the organization
4. Check if the organization exists

### Issue: API endpoint not working
**Check:**
1. The API route file exists at `/app/api/announcements/[announcementId]/route.ts`
2. The parameter name matches (should be `announcementId`, not `id`)
3. The user is authenticated
4. The user has proper permissions

### Issue: Organization not found
**Check:**
1. The organization slug is correct
2. The organization exists in the database
3. The user has membership in that organization

## Testing Workflow

1. **Check existing data:**
   ```sql
   -- Run this first to see what's in your database
   SELECT * FROM announcements WHERE org_id = (SELECT id FROM organizations WHERE slug = 'bakehouse');
   ```

2. **Create test data:**
   ```sql
   -- Use the create-test-announcements.sql script
   ```

3. **Test the API:**
   - Try accessing the announcement directly via API
   - Check browser network tab for errors
   - Verify authentication is working

4. **Test the UI:**
   - Navigate to the organization announcements page
   - Click on an announcement
   - Check if it loads properly

## Environment Variables

Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Production vs Development

- **Development:** Use your local Supabase instance
- **Production:** Use your production Supabase instance
- Make sure to run these scripts in the correct environment
