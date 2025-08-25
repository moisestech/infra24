# Smart Sign Documentation

Welcome to the comprehensive documentation for the Smart Sign system - a digital communication infrastructure designed to control and leverage community information flow, built by AI24.

## 🌍 Multi-Organization Support

Smart Sign now supports **multiple art communities** with centralized control:

### Supported Organizations
- 🏢 **Bakehouse Art Complex** - Primary implementation (Miami)
- 🎨 **Oolite Arts** - Secondary implementation (Miami)
- 🏛️ **Additional Communities** - Scalable architecture ready

### Organization Features
- **Multi-Tenant Architecture**: Each organization has isolated data and branding
- **Centralized Control**: Super admin access to all organizations
- **Custom Branding**: Organization-specific colors, logos, and domains
- **Role-Based Access**: Different permission levels per organization
- **Analytics Dashboard**: Organization-specific engagement metrics

### How It Works
1. **Organization Setup**: Super admin creates new organization
2. **User Management**: Organization admins manage their users
3. **Content Control**: Each organization manages their announcements
4. **Analytics**: Track engagement and prove value per organization
5. **Scaling**: Easy onboarding of new art communities

### Technical Implementation
- **Database Isolation**: Row-level security per organization
- **Authentication**: Clerk-based auth with organization context
- **API Routes**: Organization-scoped endpoints
- **Frontend**: Dynamic branding and organization switching
- **Analytics**: Per-organization engagement tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun
- Git
- Clerk account for authentication
- Supabase account for database

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/smart-sign.git
cd smart-sign

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# Other services
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🏗️ Project Structure

```
smart-sign/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Admin dashboard
│   ├── login/            # Authentication
│   ├── create-announcement/ # Content creation
│   └── api/              # API routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # UI components
│   ├── patterns/         # Visual pattern components
│   └── AnnouncementCarousel.tsx # Main display component
├── lib/                  # Utilities and services
│   ├── auth.ts           # Authentication service
│   ├── data.ts           # Data management
│   └── utils.ts          # Utility functions
├── types/                # TypeScript definitions
│   ├── user.ts           # User and organization types
│   ├── announcement.ts   # Announcement types
│   └── analytics.ts      # Analytics types
└── docs/                 # Documentation
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#3b82f6` (Power Blue)
- **Background**: `#000000` (Black)
- **Text**: `#ffffff` (White)
- **Accent**: `#1d4ed8` (Dark Blue)

### Typography
- **Headings**: System fonts with bold weights
- **Body**: System fonts for readability
- **Monospace**: For technical elements

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent formatting
- **Husky**: Pre-commit hooks

## 🧪 Testing

### **Authentication Testing**
- **Clerk Integration**: User authentication and session management
- **Role-Based Access**: Permission testing for different user roles
- **Organization Isolation**: Multi-tenant data separation
- **Webhook Testing**: Real-time user profile creation

### **Quick Start Testing**
```bash
# Test authentication flow
npm run test:auth

# Test announcement creation
npm run test:announcements

# Test analytics tracking
npm run test:analytics
```

## 📚 Documentation Structure

### 🎯 [Strategy & Business](/strategy/)
- **Strategic Leverage Plan** - How to gain power through communication control
- Business models and monetization strategies
- Communication theory applications

### 👥 [LLM Roles](/roles/)
- **UI Engineer** - Frontend development and user experience
- **Backend Engineer** - Data management and system architecture
- **DevOps Engineer** - Deployment and infrastructure
- **Product Manager** - Feature planning and user research
- **Designer** - Visual design and user interface

### 🔧 [Technical Documentation](/technical/)
- Architecture overview
- API documentation
- Database schema
- Component documentation
- Deployment guides

### 📖 [User Guides](/user-guides/)
- **QR Code Setup** - Mobile access implementation
- Content management
- Admin interface usage
- Troubleshooting guides

## 🎭 LLM Role System

This project uses a role-based approach for LLM collaboration:

- **UI Engineer**: Focuses on React components, styling, user experience
- **Backend Engineer**: Handles data, APIs, business logic
- **DevOps Engineer**: Manages deployment, infrastructure, CI/CD
- **Product Manager**: Defines features, user stories, requirements
- **Designer**: Creates visual designs, UI/UX patterns

Each role has specific responsibilities and context to maintain focused, high-quality contributions.

## 📋 Project Overview

The Smart Sign system is more than a digital display—it's a **communication infrastructure** that:

- **Controls Communication**: Becomes the central nervous system of community information
- **Creates Leverage**: Uses communication theory to gain institutional power
- **Generates Revenue**: Multiple monetization streams through attention control
- **Scales**: Replicable system for other art communities

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js 14 App Router
- **Authentication**: Clerk with role-based access control
- **Database**: Supabase with PostgreSQL
- **Styling**: Framer Motion, Custom Patterns
- **Deployment**: Vercel
- **Analytics**: Custom engagement tracking

## 🎯 Success Metrics

### Week 1
- 10+ residents using system
- Basic announcement display working
- Authentication system active

### Month 1
- 50% of residents active
- $500+ monthly revenue
- Formal institutional adoption

### Quarter 1
- 5+ additional communities
- $2,000+ monthly revenue
- Complete dependency creation

### Year 1
- 20+ art communities
- $10,000+ monthly revenue
- Market dominance in art community communication

## 🔑 Key Resources

- **[📖 Main Documentation](/docs/README.md)** - Complete project overview
- **[🎯 Strategy & Business](/docs/strategy/)** - Strategic leverage plans and business models
- **[👥 LLM Roles](/docs/roles/)** - Role-based collaboration framework
- **[🔧 Technical Docs](/docs/technical/)** - Architecture and implementation details
- **[📖 User Guides](/docs/user-guides/)** - Implementation and usage guides

## 🚀 Deployment

### Vercel Deployment
- **Automatic**: Git-based deployments
- **Preview**: Feature branch deployments
- **Production**: Main branch deployment
- **Rollback**: Easy deployment rollback

### Environment Management
- **Development**: Local environment
- **Staging**: Pre-production testing
- **Production**: Live system

---

## 🗺️ Roadmap

### Phase 1: Core Platform ✅
- [x] User authentication with Clerk
- [x] Multi-tenant architecture
- [x] Role-based access control
- [x] Basic announcement display

### Phase 2: Enhanced Features 🚧
- [x] Analytics and engagement tracking
- [x] Content approval workflows
- [x] Mobile QR code access
- [ ] Real-time updates
- [ ] Advanced monetization

### Phase 3: Advanced Capabilities 📋
- [ ] AI-powered content suggestions
- [ ] Advanced automation
- [ ] Mobile applications
- [ ] Enterprise features

---

**Built with ❤️ by AI24**

**Remember**: You're not just building a digital sign—you're building the communication infrastructure that will define how this community operates. Once you own that infrastructure, you own the power to shape the community's future.
