# Infra24 Platform

**The infrastructure that scales digital arts education across cultural organizations.**

## 🎯 Vision

Infra24 is a multi-tenant SaaS platform that powers digital arts education, community management, and cultural infrastructure for organizations like Oolite Arts, Bakehouse Art Complex, Edge Zones, and Locust Projects.

## 🏗️ Platform Architecture

### Core Modules

1. **Infra24 Bookings** - Resource and event booking system
2. **Infra24 Screens** - Digital signage and kiosk management (formerly SmartSign)
3. **Infra24 Submissions** - Community content submission and moderation
4. **Infra24 Learn** - Educational modules and course management
5. **Infra24 Dashboards** - Analytics and reporting system

### Multi-Tenant Structure

- **Platform**: `infra24.digital` (master platform)
- **Tenants**: 
  - `oolite.infra24.digital` (Oolite Arts)
  - `bakehouse.infra24.digital` (Bakehouse Art Complex)
  - `edgezones.infra24.digital` (Edge Zones)
  - `locust.infra24.digital` (Locust Projects)

## 🎓 Educational Framework

### Workshop Tracks

**Beginner/Conceptual**
- Own Your Digital Presence (web, SEO + simple site push)
- AI & the Arts 101 (image, text, ethics + consent checklist)
- Creative Coding 101 on Raspberry Pi (camera, mic, Turtle)

**Technical/Advanced**
- Realtime 3D (Unreal or Unity; choose one stack)
- AI Video in Practice (Runway workflows + rights policy template)
- 3D Print Lab Basics (scan → model → slice → print → finish)
- Automation for Creatives/Nonprofits (n8n flows for publishing & sales)

### Content Model

- **Base Library**: MDX modules (text + screenshots + code + links)
- **V1 Assets**: MDX + image packs (generated with GPT/Flux)
- **V2 Assets**: Loom-style short videos for top 6 modules
- **External Academies**: OpenAI Academy, Runway Academy, n8n courses

## 📊 Reporting & Analytics

### KPIs (Monthly Dashboard)
- Seat fill %; unique learners; return rate; resident vs public mix
- Open-lab utilization; staff trained; number of modules published
- Livestream reach; QR conversions; NPS scores

### Reports
- Monthly PDF export for funders
- CSV export for data analysis
- Real-time admin dashboards
- Quarterly program feedback/NPS

## 🤝 Partnerships

### Miami (Near-term)
- Bakehouse Art Complex
- Locust Projects
- The Bass
- ICA Miami
- PAMM

### Signal-boost (National)
- Gray Area (SF)
- NEW INC/Rhizome (NYC)
- Eyebeam (NYC)

## 📅 Calendar & Booking System

### Space Management
- **Lab capacity**: 4 people max (hands-on)
- **Overflow modes**: Book larger rooms (8-12 people), livestream/record talks
- **Booking system**: 24-hr minimum; residents/staff reserve lab seats, gear, and 1:1 help
- **Access windows**: Weekly morning blocks + 2 evening blocks/month

### Resource Types
- 3D printers, workstations, XR kits, photo printer
- "Open-lab" slots, workshop seats
- Conference areas, streaming equipment

## 🖥️ Smart Sign Integration

### Infra24 Screens Features
- Web app in kiosk mode: rotates playlists (today's schedule, upcoming workshops, calls-to-action, QR)
- Offline-first PWA (service worker caching)
- Device pairing, heartbeat, remote refresh
- Multi-screen support; assign playlists to screens
- Window-facing displays for external visibility

### Device Management
- Raspberry Pi 4/5 or ChromeOS device in kiosk mode
- Device heartbeat monitoring
- Remote refresh and restart capabilities
- Simple device pairing flow

## 💰 Pricing & Business Model

### Founding Tenant Plan
- **Core Suite**: $200-300/mo per org (Screens + Bookings + Submissions + Dashboards)
- **Add-ons**: 
  - Learn embed (+$50/mo)
  - Public registration (+$50/mo)
  - Custom theming (one-time $500)

### Revenue Targets
- **Month 6**: 4 tenants → $600-1,200 MRR
- **Year 1**: 8-10 tenants → $2,000-3,000 MRR

## 🛠️ Technology Stack

### Frontend
- Next.js 15 (SSR + SSG)
- PWA for signage
- Tailwind CSS + Radix UI
- Framer Motion for animations

### Backend
- Next.js API routes
- Supabase (Postgres + RLS, Auth, Storage)
- Row-Level Security for tenant isolation

### Infrastructure
- Vercel (hosting)
- Cloudflare (DNS, SSL, CDN)
- Sentry (error monitoring)

### Devices
- Raspberry Pi 4/5 for kiosks
- ChromeOS devices for signage
- Standard displays and projectors

## 📈 Success Metrics

### Utilization
- ≥60-70% of resident artists book lab time monthly
- ≥75% attendance for workshops
- ≥8 staff complete Sprint A training

### Programming
- 24-30 workshops/year
- 8-10 talks/year
- 2 exhibitions/year

### Documentation
- 100% talks/exhibits photographed/filmed
- ≥12 MDX modules published
- ≥2 automations in production

## 🚀 Implementation Timeline

### Phase 1 (Weeks 1-2)
- Tenant routing, theming, Org/User/RBAC schema
- Bookings MVP (resources, rules, create/cancel)
- One signage screen live; Google Calendar read

### Phase 2 (Weeks 3-4)
- Submissions + moderation
- Window-facing screen (QR)
- Dashboards v1 (utilization)
- ICS export; device heartbeat

### Phase 3 (Weeks 5-6)
- Livestream/recording hooks for talks
- Waitlists/no-show logic
- PDF report export
- Admin analytics, polish + docs

## 🔒 Security & Privacy

- Postgres with Row-Level Security (RLS)
- Email magic link for residents
- SSO (Google/Microsoft) for staff/admin
- Least-privilege RBAC
- Audit tables for changes/publishes
- Nightly DB backups; object storage versioning

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Large-type presets for signage
- Keyboard navigation
- Captions for talk videos
- Alt text for all images

## 📞 Support & Maintenance

- Support windows: M-F, 10-4 ET
- Simple SLA in tenant agreements
- Monthly KPI reviews
- Quarterly program assessments
- Annual platform updates

---

**Infra24** - Building the digital infrastructure that empowers cultural organizations to scale their impact and reach.
