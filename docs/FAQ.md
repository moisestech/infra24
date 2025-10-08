# Infra24 FAQ

## 🚀 General Questions

### What is Infra24?
Infra24 is a comprehensive multi-tenant platform designed for creative organizations to manage workshops, digital labs, artist profiles, and announcements. It features an integrated booking system with calendar integration.

### Who can use Infra24?
Infra24 is designed for creative organizations, art centers, maker spaces, and educational institutions that need to manage workshops, equipment, and artist communities.

### How do I get started?
1. Set up your development environment
2. Configure database and authentication
3. Deploy to your hosting platform
4. Customize for your organization

## 🏗️ Technical Questions

### What technologies does Infra24 use?
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Styling**: Tailwind CSS with dynamic theming

### How do I set up the database?
```bash
# Start Supabase
npx supabase start

# Setup database schema
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql

# Create booking resources
node scripts/create-booking-resources.js
```

### How do I configure authentication?
1. Create a Clerk account
2. Set up your application
3. Configure environment variables
4. Update middleware settings

### How do I deploy to production?
1. Set up production environment variables
2. Configure production Supabase instance
3. Deploy to Vercel or similar platform
4. Configure domain and SSL

## 🎓 Workshop System

### How does the workshop system work?
The workshop system uses MDX-based content with chapter-based learning progression. Users can track their progress, and administrators can view detailed analytics.

### How do I create workshop content?
1. Create MDX files in the `content/workshops/` directory
2. Use frontmatter for metadata
3. Structure content in chapters
4. Test the content locally

### How do I track workshop progress?
The system automatically tracks progress as users complete chapters. Progress is stored in the `user_workshop_progress` table and can be viewed in analytics.

### How do I add new workshops?
1. Create workshop record in database
2. Add MDX content files
3. Configure learning objectives
4. Set up analytics tracking

## 🏭 Digital Lab

### How does the digital lab system work?
The digital lab system manages equipment, tracks availability, and allows users to book equipment. It includes a voting system for equipment prioritization.

### How do I add new equipment?
1. Add equipment record to `resources` table
2. Configure availability rules
3. Set up booking parameters
4. Add equipment images

### How does equipment booking work?
Users can book equipment through the public booking interface. The system checks availability, assigns hosts, and creates calendar events.

### How do I manage equipment status?
Equipment status is managed through the `is_bookable` flag and `metadata.status` field. Status can be set to available, in use, maintenance, or unavailable.

## 🎨 Artist Profiles

### How do artist profiles work?
Artist profiles allow artists to showcase their work, skills, and contact information. Profiles can be public or private and include portfolio images.

### How do I add artist profiles?
1. Use the artist profile creation form
2. Add profile information and images
3. Set visibility preferences
4. Configure skills and mediums

### How do I manage artist profiles?
Artist profiles can be managed through the admin interface. You can edit profiles, change visibility, and manage featured artists.

## 📅 Booking System

### How does the booking system work?
The booking system allows users to book consultations and equipment. It includes availability checking, host assignment, and calendar integration.

### How do I configure booking resources?
1. Create resource records in the database
2. Set up availability rules
3. Configure host assignments
4. Test booking flow

### How do I manage bookings?
Bookings can be managed through the staff dashboard. You can view, reschedule, and cancel bookings as needed.

### How does calendar integration work?
The system generates ICS files and calendar URLs for various calendar services. Users can add bookings to their calendars directly.

## 🔧 Troubleshooting

### Database connection issues
```bash
# Check Supabase status
npx supabase status

# Restart Supabase
npx supabase stop
npx supabase start
```

### API 404 errors
1. Check API route structure
2. Verify middleware configuration
3. Test with curl commands
4. Check server logs

### Styling issues
1. Check tenant configuration
2. Verify primary color values
3. Use browser dev tools
4. Check component props

### Authentication issues
1. Verify Clerk configuration
2. Check environment variables
3. Test authentication flow
4. Check middleware settings

## 📊 Analytics

### How do I view workshop analytics?
Workshop analytics are available through the analytics dashboard. You can view completion rates, progress tracking, and user engagement.

### How do I track booking metrics?
Booking metrics are tracked automatically. You can view usage patterns, success rates, and user behavior through the analytics system.

### How do I export data?
Data can be exported through the admin interface or directly from the database using SQL queries.

## 🚀 Performance

### How do I optimize performance?
1. Use database indexes
2. Optimize API queries
3. Implement caching
4. Monitor performance metrics

### How do I monitor the system?
1. Use Vercel analytics
2. Monitor Supabase metrics
3. Check application logs
4. Set up alerts

### How do I scale the system?
1. Use Supabase auto-scaling
2. Implement CDN
3. Optimize database queries
4. Monitor resource usage

## 🔐 Security

### How do I secure the system?
1. Use proper authentication
2. Implement rate limiting
3. Validate input data
4. Regular security audits

### How do I manage user access?
1. Configure Clerk roles
2. Set up middleware protection
3. Implement proper permissions
4. Monitor access logs

### How do I backup data?
1. Use Supabase backups
2. Export data regularly
3. Test restore procedures
4. Monitor backup status

## 📞 Support

### Where can I get help?
1. Check documentation in `docs/` directory
2. Review troubleshooting guide
3. Check GitHub issues
4. Contact development team

### How do I report bugs?
1. Check existing issues
2. Create detailed bug report
3. Include steps to reproduce
4. Provide error logs

### How do I request features?
1. Check existing feature requests
2. Create detailed feature request
3. Explain use case
4. Provide mockups if possible

---

*Last updated: September 30, 2025*



