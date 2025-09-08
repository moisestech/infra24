# Christine Cortes Events SQL Script

This script adds all the events and announcements from Christine Cortes' email dated September 4, 2024.

## Events Added

### 1. New World Symphony Orchestra - Recorded Performance
- **Date**: September 8th, 2024
- **Time**: 12:30 PM - 2:30 PM EST
- **Location**: Audrey Love Gallery, Bakehouse Art Complex
- **Type**: Performance/Recording
- **Visibility**: Internal (artists only)

### 2. OPEN STUDIOS
- **Date**: September 9th, 2024
- **Time**: 6:00 PM - 9:00 PM EST
- **Location**: Bakehouse Art Complex
- **Type**: Open Studios Event
- **Visibility**: Both (internal and external)

### 3. BAC BOOKCLUB
- **Date**: September 11th, 2024
- **Time**: 6:00 PM - 8:00 PM EST
- **Location**: ALG Media Room, Bakehouse Art Complex
- **Type**: Book Club Discussion
- **Visibility**: Internal (artists only)

## Announcements Added

### 4. Bakehouse Annual Survey 2025
- **Deadline**: September 22nd, 2024 at 11:59 PM EST
- **Type**: Administrative/Survey
- **Visibility**: Internal (artists only)
- **Priority**: High (required for studio renewals)

### 5. Museum Access Cards Ready
- **Type**: Benefits/Administrative
- **Visibility**: Internal (artists only)
- **Details**: Lists all participating museums with waived admission

## Artist Highlights Added

### 6. Jennifer Printz "Infinite and Transient" Exhibition
- **Location**: Dimensions Variable
- **Dates**: August 24th - October 10th, 2024
- **Type**: Exhibition Highlight
- **Visibility**: Both

### 7. Lujan Candria - (RE)CHARGE to (RE)NEW Exhibition
- **Location**: Doral Contemporary Art Museum
- **Dates**: August 30th - October 5th, 2024
- **Type**: Exhibition Highlight
- **Visibility**: Both

### 8. "CATS!" The Exhibition!
- **Location**: Bridge Red Studios/Project Space
- **Dates**: September 28th - November 9th, 2024
- **Type**: Exhibition Highlight (Benefit for Humane Society)
- **Visibility**: Both

## How to Use This Script

### Prerequisites
1. Make sure you have access to your Supabase database
2. Run the `debug-organization-lookup.sql` script first to verify the Bakehouse organization exists
3. Ensure you have admin/moderator users in the Bakehouse organization

### Running the Script

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor

2. **Run the Script**
   - Copy and paste the entire contents of `create-christine-cortes-events.sql`
   - Click "Run" to execute the script

3. **Verify Results**
   - The script includes verification queries at the end
   - Check that all 8 announcements were created successfully
   - Verify the counts match expected numbers

### Important Notes

- **User ID Handling**: The script automatically finds the first admin/moderator user in the Bakehouse organization to use as the author. If you need to use Christine Cortes' specific user ID, you'll need to:
  1. Find her Clerk user ID from the database
  2. Replace the subquery with her specific ID

- **Survey Link**: The survey link is currently set to a placeholder. Update the `primary_link` field for the survey announcement with the actual survey URL.

- **Museum Links**: Some museum links are placeholders. Update them with actual museum websites if needed.

- **Date Correction**: The "CATS!" exhibition end date in the email shows 2025, which appears to be a typo. The script uses 2024, but you may want to verify this.

### Troubleshooting

If the script fails:

1. **Check Organization Exists**:
   ```sql
   SELECT id, name, slug FROM organizations WHERE slug = 'bakehouse';
   ```

2. **Check User Permissions**:
   ```sql
   SELECT clerk_user_id, role FROM org_memberships om 
   JOIN organizations o ON om.org_id = o.id 
   WHERE o.slug = 'bakehouse' AND om.role IN ('org_admin', 'moderator');
   ```

3. **Check for Duplicate IDs**:
   - The script uses `gen_random_uuid()` to generate unique IDs
   - If you get duplicate key errors, the announcements may already exist

### Customization

To customize the script:

1. **Change Author**: Replace the subquery with a specific user ID
2. **Modify Dates**: Update the `starts_at` and `ends_at` timestamps
3. **Adjust Visibility**: Change `visibility` field between 'internal', 'external', or 'both'
4. **Update Priority**: Modify the `priority` field (1=low, 2=normal, 3=high, 4=urgent)
5. **Add Tags**: Modify the `tags` array to include additional relevant tags

### Post-Execution

After running the script:

1. **Verify in Application**: Check that the announcements appear in your application
2. **Test Permissions**: Ensure users can see the appropriate announcements based on their roles
3. **Update Links**: Replace any placeholder links with actual URLs
4. **Notify Users**: Let Christine Cortes know the events have been added to the system

## File Structure

```
scripts/
├── create-christine-cortes-events.sql    # Main SQL script
├── README-christine-cortes-events.md     # This documentation
├── debug-organization-lookup.sql         # Debug script (run first)
└── check-user-permissions.sql            # User permission checker
```

## Support

If you encounter any issues:

1. Check the Supabase logs for detailed error messages
2. Verify your database connection and permissions
3. Ensure all required tables exist and have the correct schema
4. Contact the development team if you need assistance with user ID lookups or database schema issues
