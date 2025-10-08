# Environment Setup Guide

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

#### Clerk Authentication
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
```

#### Supabase Database
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_supabase_service_role_key_here
```

### Optional Variables

#### Resend API (for email notifications)
```bash
RESEND_API_KEY=re_your_resend_api_key_here
```

#### Google Calendar API (for calendar integration)
```bash
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key_here
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_client_id_here
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_calendar_client_secret_here
```

#### Application Settings
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Infra24
```

#### Database Settings (for local development)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

#### Analytics (optional)
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Error Tracking (optional)
```bash
SENTRY_DSN=https://your_sentry_dsn_here
```

## 🚀 Setup Instructions

### 1. Clerk Setup
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable and secret keys
4. Add them to your `.env.local` file

### 2. Supabase Setup
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the project URL and API keys
4. Add them to your `.env.local` file

### 3. Resend Setup (Optional)
1. Create a Resend account at [resend.com](https://resend.com)
2. Generate an API key
3. Add it to your `.env.local` file

### 4. Google Calendar Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create credentials (API key and OAuth 2.0)
5. Add them to your `.env.local` file

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly
- Use environment-specific prefixes (e.g., `pk_test_` for development)

## 🧪 Testing Environment

For testing, you can use:
- Clerk test keys (prefixed with `pk_test_` and `sk_test_`)
- Supabase local development
- Mock services for external APIs

## 📝 Example .env.local

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51H...
CLERK_SECRET_KEY=sk_test_51H...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Infra24
```

---

*Last updated: September 30, 2025*



