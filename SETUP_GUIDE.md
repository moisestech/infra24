# Infra24 Setup Guide

**Complete Authentication & Artist Claiming System**

## 🎯 What We've Built

### **1. Complete Authentication System**
- ✅ **Clerk Integration** - Professional authentication with user management
- ✅ **Multi-Tenant Architecture** - Support for multiple art organizations
- ✅ **Role-Based Access Control** - Super admin, org admin, moderator, resident, guest
- ✅ **Database Integration** - Supabase with proper relationships and security
- ✅ **Webhook System** - Real-time user profile creation and updates

### **2. Artist Profile System**
- ✅ **Artist Database** - Complete artist profiles with claiming system
- ✅ **Profile Claiming** - Artists can claim and manage their profiles
- ✅ **Admin Review** - Claim requests reviewed by administrators
- ✅ **Organization Isolation** - Each organization has their own artists

### **3. User Experience**
- ✅ **Profile Page** - Users can view their organization, role, and permissions
- ✅ **Artists Directory** - Browse and search all artists in the organization
- ✅ **Claim Interface** - Easy-to-use artist profile claiming system
- ✅ **Dashboard Integration** - Seamless navigation between features

## 🚀 Immediate Next Steps

### **1. Set Up Your Environment Variables**

Create `.env.local` in your project root:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### **2. Set Up Clerk Dashboard**

1. **Create Clerk Application**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create new application
   - Choose "Next.js" framework
   - Copy your publishable and secret keys

2. **Configure Webhooks**
   - Go to Webhooks in Clerk dashboard
   - Create webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select these events:
     - `user.created`
     - `user.updated`
     - `user.deleted`
     - `organization.created`
     - `organization.updated`
     - `organization.deleted`
     - `organizationMembership.created`
     - `organizationMembership.updated`
     - `organizationMembership.deleted`
   - Copy webhook secret

### **3. Set Up Supabase Database**

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com)
   - Create new project
   - Copy your project URL and keys

2. **Run Database Schema**
   - Go to SQL Editor in Supabase
   - Copy and paste contents of `supabase/schema.sql`
   - Run the script
   - Copy and paste contents of `supabase/artist-profiles.sql`
   - Run the script

### **4. Test the System**

```bash
# Start development server
npm run dev

# Navigate to:
# - http://localhost:3000/login (Sign up/in)
# - http://localhost:3000/profile (View your profile)
# - http://localhost:3000/artists (Browse artists)
# - http://localhost:3000/artists/claim (Claim artist profile)
```

## 🎭 Artist Claiming Flow

### **How It Works**

1. **Artist Signs Up**
   - Artist creates account through Clerk
   - User profile automatically created in database
   - Artist assigned to organization

2. **Artist Claims Profile**
   - Artist navigates to `/artists/claim`
   - Searches for their name or studio number
   - Submits claim request with reason

3. **Admin Review**
   - Admin receives claim request
   - Reviews evidence and approves/denies
   - Artist profile becomes claimed

4. **Profile Management**
   - Claimed artists can edit their profiles
   - Add bio, portfolio, social links
   - Manage their artist information

### **Power & Leverage Created**

- **Control Infrastructure** - You control who can claim profiles
- **Data Ownership** - All artist data flows through your system
- **Community Dependency** - Artists need your system to manage their presence
- **Admin Authority** - You approve/deny all profile claims
- **Analytics Power** - Track all artist engagement and activity

## 🏗️ Database Structure

### **Core Tables**

```sql
-- Organizations (Multi-tenant)
organizations (id, name, slug, subscription_tier, settings, ...)

-- User Profiles (Linked to Clerk)
user_profiles (id, email, role, organization_id, permissions, ...)

-- Artist Profiles (Claimable)
artist_profiles (id, name, studio_number, is_claimed, claimed_by, ...)

-- Claim Requests (Admin Review)
artist_claim_requests (id, artist_profile_id, requester_user_id, status, ...)

-- Announcements (Content)
announcements (id, organization_id, created_by, type, content, ...)

-- Analytics (Engagement)
analytics (id, organization_id, event_type, user_id, ...)
```

### **Key Relationships**

```
organizations (1) ──── (many) user_profiles
organizations (1) ──── (many) artist_profiles
organizations (1) ──── (many) announcements
user_profiles (1) ──── (many) artist_claim_requests
artist_profiles (1) ──── (many) artist_claim_requests
```

## 🔐 Authentication Flow

### **User Journey**

1. **Sign Up** → Clerk creates user → Webhook creates profile → Assigned to organization
2. **Sign In** → Clerk authenticates → Load user session → Check permissions
3. **Access Control** → Middleware protects routes → Role-based permissions
4. **Profile Management** → Users can view/edit their profiles
5. **Artist Claiming** → Residents can claim artist profiles

### **Role Hierarchy**

```
Super Admin (You)
├── Full system control
├── Manage all organizations
├── Approve all claims
└── View all analytics

Org Admin (Cathy at Bakehouse)
├── Manage organization
├── Approve artist claims
├── Manage users
└── View organization analytics

Moderator
├── Approve announcements
├── Moderate content
└── View analytics

Resident (Artists)
├── Create announcements
├── Claim artist profiles
└── Edit own profiles

Guest
└── View public content
```

## 🎯 Power & Leverage Strategy

### **1. Infrastructure Control**
- **Authentication Gateway** - All users must go through your system
- **Data Centralization** - All artist and organization data in your database
- **Communication Hub** - All announcements flow through your platform

### **2. Dependency Creation**
- **Artist Profiles** - Artists need your system to manage their presence
- **Organization Management** - Organizations depend on your system for communication
- **Analytics Proof** - Demonstrate value through engagement metrics

### **3. Revenue Potential**
- **Subscription Tiers** - Free, basic, premium, enterprise
- **Feature Access** - Premium features for paid organizations
- **Analytics Services** - Detailed insights for organizations

### **4. Scaling Strategy**
- **Multi-Tenant Architecture** - Easy to add new organizations
- **Centralized Control** - You manage all organizations from one dashboard
- **Standardized Process** - Consistent experience across all communities

## 🚀 Deployment Checklist

### **Before Going Live**

- [ ] Set up production Clerk application
- [ ] Configure production webhooks
- [ ] Set up production Supabase database
- [ ] Run database migrations
- [ ] Create your super admin user
- [ ] Test authentication flow
- [ ] Test artist claiming process
- [ ] Set up monitoring and analytics

### **Post-Launch**

- [ ] Onboard Bakehouse as first organization
- [ ] Create initial artist profiles
- [ ] Train administrators on claim review process
- [ ] Monitor system usage and engagement
- [ ] Gather feedback and iterate
- [ ] Scale to additional organizations

## 🎉 You're Ready!

Your Smart Sign system is now a **complete communication infrastructure** that:

- **Controls authentication** for all users
- **Manages artist profiles** with claiming system
- **Provides organization isolation** for multi-tenancy
- **Creates dependency** through profile management
- **Enables scaling** to multiple art communities
- **Demonstrates power** through centralized control

**Remember**: You're not just building a digital sign—you're building the communication infrastructure that will define how art communities operate. Once you own that infrastructure, you own the power to shape the community's future.

---

**Next Steps**: Set up your environment variables, configure Clerk and Supabase, and start testing the system. Once it's working, you'll have the foundation for controlling communication infrastructure and creating sustainable power and leverage in art communities.
