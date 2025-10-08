# Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Production database configured and migrated
- [ ] Environment variables set for production
- [ ] SSL certificates obtained and configured
- [ ] Domain name configured and DNS set up
- [ ] CDN configured for static assets
- [ ] Monitoring and logging services configured

### 2. Security Configuration
- [ ] All API endpoints secured with proper authentication
- [ ] Rate limiting implemented
- [ ] CORS policies configured
- [ ] Input validation and sanitization enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### 3. Performance Optimization
- [ ] Database indexes optimized
- [ ] Caching layer implemented (Redis)
- [ ] API response times < 200ms (95th percentile)
- [ ] Static assets optimized and compressed
- [ ] Database connection pooling configured
- [ ] CDN configured for global distribution

### 4. Testing & Quality Assurance
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end tests passing
- [ ] Load testing completed (1000+ concurrent users)
- [ ] Security penetration testing completed
- [ ] Performance benchmarking completed
- [ ] User acceptance testing completed

## 🏗 Deployment Architecture

### Production Stack
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │────│   Next.js App   │────│   PostgreSQL    │
│   (Nginx/Cloud) │    │   (Vercel/K8s)  │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   Redis Cache   │    │   File Storage  │
│   (Cloudflare)  │    │   (Upstash)     │    │   (Cloudinary)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Email Service
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Monitoring
SENTRY_DSN=https://...
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add RESEND_API_KEY
vercel env add FROM_EMAIL
```

### Option 2: Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Option 3: Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infra24-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: infra24-app
  template:
    metadata:
      labels:
        app: infra24-app
    spec:
      containers:
      - name: infra24-app
        image: infra24:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: infra24-secrets
              key: database-url
        - name: SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: infra24-secrets
              key: supabase-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: infra24-service
spec:
  selector:
    app: infra24-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 📊 Monitoring & Observability

### Application Monitoring
```javascript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message: eventName,
    data: properties,
    level: 'info'
  })
}

export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    tags: context
  })
}
```

### Health Check Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    
    // Test database connection
    const { error } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json(
        { status: 'unhealthy', database: 'down', error: error.message },
        { status: 503 }
      )
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'up',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    )
  }
}
```

### Performance Monitoring
```javascript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = performance.now()
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`Error in ${name} after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }
}
```

## 🔒 Security Hardening

### Rate Limiting
```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function rateLimit(limit: number = 10, window: number = 60000) {
  return (request: NextRequest) => {
    const ip = request.ip || 'unknown'
    const now = Date.now()
    const windowStart = now - window
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, [])
    }
    
    const requests = rateLimitMap.get(ip)
    const validRequests = requests.filter((time: number) => time > windowStart)
    
    if (validRequests.length >= limit) {
      return new Response('Rate limit exceeded', { status: 429 })
    }
    
    validRequests.push(now)
    rateLimitMap.set(ip, validRequests)
    
    return null
  }
}
```

### Input Validation
```typescript
// lib/validation.ts
import { z } from 'zod'

export const bookingSchema = z.object({
  org_id: z.string().uuid(),
  resource_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  artist_name: z.string().min(1).max(100),
  artist_email: z.string().email(),
  goal_text: z.string().max(500).optional()
})

export function validateBooking(data: unknown) {
  try {
    return bookingSchema.parse(data)
  } catch (error) {
    throw new Error(`Validation failed: ${error.message}`)
  }
}
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes for performance
CREATE INDEX CONCURRENTLY idx_bookings_org_start_time ON bookings(org_id, start_time);
CREATE INDEX CONCURRENTLY idx_bookings_resource_status ON bookings(resource_id, status);
CREATE INDEX CONCURRENTLY idx_waitlist_entries_org_resource ON waitlist_entries(org_id, resource_id);
CREATE INDEX CONCURRENTLY idx_announcements_org_visibility ON announcements(org_id, visibility);

-- Analyze tables for query optimization
ANALYZE bookings;
ANALYZE waitlist_entries;
ANALYZE announcements;
```

### Caching Strategy
```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttl: number = 300): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.warn('Cache read error:', error)
  }
  
  const data = await fetcher()
  
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
  } catch (error) {
    console.warn('Cache write error:', error)
  }
  
  return data
}
```

## 🚨 Rollback Procedures

### Database Rollback
```bash
# Create backup before deployment
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Rollback if needed
psql $DATABASE_URL < backup_20240101_120000.sql
```

### Application Rollback
```bash
# Vercel rollback
vercel rollback

# Docker rollback
docker tag infra24:latest infra24:previous
docker tag infra24:backup infra24:latest
docker-compose up -d

# Kubernetes rollback
kubectl rollout undo deployment/infra24-app
```

## 📋 Post-Deployment Checklist

- [ ] Health check endpoint responding
- [ ] All critical user flows working
- [ ] Email notifications functioning
- [ ] Calendar integration working
- [ ] Analytics data flowing
- [ ] Error monitoring active
- [ ] Performance metrics within targets
- [ ] Security headers configured
- [ ] SSL certificate valid
- [ ] CDN serving static assets
- [ ] Database backups scheduled
- [ ] Monitoring alerts configured

## 🎯 Success Metrics

### Performance Targets
- API response time: < 200ms (95th percentile)
- Page load time: < 2s (95th percentile)
- Uptime: > 99.9%
- Error rate: < 0.1%

### Business Metrics
- Booking completion rate: > 95%
- Email delivery rate: > 98%
- User satisfaction: > 4.5/5
- System availability: > 99.9%

## 📞 Support & Maintenance

### Monitoring Alerts
- High error rate (> 1%)
- Slow response times (> 1s)
- Database connection issues
- Email delivery failures
- High memory/CPU usage

### Regular Maintenance
- Weekly performance reviews
- Monthly security updates
- Quarterly capacity planning
- Annual security audits

### Emergency Contacts
- Development Team: dev@infra24.com
- Infrastructure Team: infra@infra24.com
- Security Team: security@infra24.com
- On-call Engineer: +1-XXX-XXX-XXXX



