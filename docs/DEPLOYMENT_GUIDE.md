# Infra24 Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Vercel account (or similar hosting platform)
- Production Supabase instance
- Clerk production environment
- Domain name (optional)

### 1. Environment Setup

#### Production Environment Variables
```bash
# .env.production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Clerk Production Setup
1. Create production Clerk application
2. Configure allowed origins
3. Set up webhooks (if needed)
4. Update environment variables

#### Supabase Production Setup
1. Create production Supabase project
2. Run database schema setup
3. Configure RLS policies
4. Set up backups

### 2. Database Migration

#### Schema Setup
```bash
# Connect to production database
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Run schema setup
\i scripts/setup-complete-database-schema.sql

# Create booking resources
node scripts/create-booking-resources.js
```

#### Data Migration
```bash
# Backup local data
pg_dump postgresql://postgres:postgres@localhost:54322/postgres > local_backup.sql

# Restore to production (if needed)
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" < local_backup.sql
```

### 3. Vercel Deployment

#### Automatic Deployment
```bash
# Connect to Vercel
npx vercel

# Deploy
npx vercel --prod
```

#### Manual Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

#### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 4. Domain Configuration

#### Custom Domain
1. Add domain in Vercel dashboard
2. Configure DNS records
3. Enable SSL certificate
4. Update Clerk allowed origins

#### DNS Records
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 5. Post-Deployment Setup

#### Database Verification
```bash
# Test database connection
node scripts/test-database-connection.js

# Verify resources
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" -c "SELECT * FROM resources;"
```

#### API Testing
```bash
# Test availability API
curl "https://your-domain.com/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"

# Test booking creation
curl -X POST "https://your-domain.com/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"your-org-id","resource_id":"remote_visit","start_time":"2025-10-07T12:00:00-04:00","end_time":"2025-10-07T12:30:00-04:00","artist_name":"Test Artist","artist_email":"test@example.com","goal_text":"Test booking"}'
```

## 🔧 Staging Deployment

### Staging Environment
```bash
# Staging environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Staging Deployment
```bash
# Deploy to staging
npx vercel --target staging
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# API health check
curl "https://your-domain.com/api/health"

# Database health check
curl "https://your-domain.com/api/test-db"
```

### Log Monitoring
- Vercel function logs
- Supabase logs
- Clerk webhook logs

### Performance Monitoring
- Vercel analytics
- Supabase metrics
- Core Web Vitals

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Automated Testing
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run lint
```

## 🛡️ Security Considerations

### Environment Variables
- Never commit secrets to repository
- Use Vercel environment variables
- Rotate keys regularly

### Database Security
- Enable RLS policies
- Use service role key only for server-side
- Regular security audits

### API Security
- Rate limiting
- Input validation
- CORS configuration

## 📈 Scaling Considerations

### Database Scaling
- Supabase auto-scaling
- Connection pooling
- Query optimization

### Application Scaling
- Vercel edge functions
- CDN optimization
- Image optimization

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

## 🔧 Troubleshooting

### Common Issues

#### Deployment Failures
```bash
# Check build logs
npx vercel logs

# Verify environment variables
npx vercel env ls
```

#### Database Connection Issues
```bash
# Test connection
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Check RLS policies
SELECT * FROM pg_policies;
```

#### API Errors
```bash
# Check function logs
npx vercel logs --follow

# Test endpoints
curl "https://your-domain.com/api/health"
```

### Rollback Procedures
```bash
# Rollback to previous deployment
npx vercel rollback

# Restore database backup
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" < backup.sql
```

## 📞 Support

### Deployment Support
- Vercel documentation
- Supabase documentation
- Clerk documentation

### Monitoring
- Vercel dashboard
- Supabase dashboard
- Clerk dashboard

---

*Last updated: September 30, 2025*





