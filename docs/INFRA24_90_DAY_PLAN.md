# Infra24 - 90-Day Implementation Plan

## Overview

This document outlines the 90-day implementation plan for Infra24, focusing on three key workstreams: Oolite Delivery, ArtHub v1 Multitenant, and Cashflow/Debt Management.

## Workstream A: Oolite Delivery (Contract Baseline + Buildout)

### Goal
Establish trust, meet baseline deliverables, and set up space/tools to make future work smoother.

### Timeline & Milestones

| Week | Milestone | Definition of Done |
|------|-----------|-------------------|
| 1-2 | Kickoff & onboarding | ✅ Signed contract; intro w/ staff; first Open-Lab hours published in ArtHub (MVP); workshop calendar draft (Q4) |
| 2-3 | Space audit & buildout plan | ✅ Inventory space needs (lighting, capture, signage, workstations). $80k budget allocation doc drafted. Facilities list locked |
| 3-4 | First workshops delivered | ✅ At least 2 events: one conceptual, one technical. Attendance + feedback logged |
| 5-6 | Open-Lab + booking pilot | ✅ Booking system live via ArtHub; QR check-in; reporting tested |
| 7-8 | Showcase build plan | ✅ Exhibition #1 scope, curation process, event date locked. Vendor POs out for equipment (streaming kit, signage) |
| 9-10 | Hybrid/online pilot | ✅ Deliver 1 online/hybrid workshop; stream/test capture workflows |
| 11-12 | Wrap-up #1 | ✅ Monthly metrics report packaged; funder-ready summary slide deck sent to Oolite leadership |

### Key Deliverables
- **Workshops**: 2-3/month (mix of beginner/conceptual + technical/advanced)
- **Artist Talks**: ~1/month (6-8/year), livestream optional
- **Exhibitions**: 2/year (mid-year showcase + final)
- **Open-Lab**: Weekly hours via booking system
- **Reporting**: Monthly metrics; board/funder-ready wrap-ups

## Workstream B: ArtHub v1 Multitenant

### Goal
Stand up one codebase that works for Oolite now, Bakehouse/Locust soon.

### Timeline & Milestones

| Week | Milestone | Definition of Done |
|------|-----------|-------------------|
| 1-2 | Tenant model + auth | ✅ Multi-tenant schema finalized (org_id everywhere, roles via Clerk + RLS). Test: users from two orgs see scoped data |
| 3-4 | Modules: Bookings + Digital Signage | ✅ Bookings: create/view slots; QR check-in. Signage: schedule content. Both working in Oolite sandbox |
| 5-6 | Content library (AI24 Learn tie-in) | ✅ Upload mdx modules (AI, automation, creative tech). Reusable library scoped by org |
| 7-8 | Reporting dashboards | ✅ Simple org dashboards: attendance, bookings, content views |
| 9-10 | Org theming & roles | ✅ Per-org branding (logo/colors), staff/admin dashboards. Bakehouse tenant stub created |
| 11-12 | Pilot handoff | ✅ Oolite staff onboarded; Bakehouse sees sandbox tenant. Milestone deck w/ screenshots + demo link |

### Key Features
- **Multi-tenant Architecture**: Path-based routing (`/o/[slug]/`)
- **Booking System**: Workshops, equipment, spaces, events
- **Digital Signage**: Smart sign content management
- **Content Library**: Reusable AI24 Learn modules
- **Analytics Dashboard**: KPIs and metrics per organization
- **Survey System**: Feedback collection and analysis

## Workstream C: Cashflow / Debt Plan

### Goal
Use predictable inflows and savings to start deleveraging.

### Timeline & Milestones

| Week | Milestone | Definition of Done |
|------|-----------|-------------------|
| 1-2 | Baseline budget set | ✅ Monthly inflows (Oolite $6.5k + other) vs outflows. Target savings: $1.5-2k/mo toward debt |
| 3-4 | Kill storage cost | ✅ Relocate gear → save $550/mo; document new setup |
| 5-6 | Credit card hit #1 | ✅ Apply first $3k from Oolite advance + storage savings to highest-interest card |
| 7-8 | Track advance buffer | ✅ Keep 1-month cushion in checking; separate debt paydown account opened |
| 9-10 | Tax plan | ✅ Allocate monthly % to taxes so 2026 doesn't repeat |
| 11-12 | Progress review | ✅ Debt reduced by ~$8-10k. Report card vs goals |

### Financial Targets
- **Monthly Savings**: $1.5-2k toward debt
- **Storage Savings**: $550/month
- **Debt Reduction**: $8-10k in 90 days
- **Tax Buffer**: Monthly allocation to avoid 2026 issues

## Technology Stack & Budget Allocation

### Infrastructure ($10k)
- **Supabase**: Database, auth, RLS
- **Vercel**: Frontend deployment
- **Clerk**: Multi-tenant authentication
- **n8n**: Automation workflows
- **PostHog**: Analytics
- **Stripe**: Payments (donations/tipping)

### Hardware & Equipment ($15k)
- **Streaming Kit**: Lights, capture, streaming equipment
- **Digital Signage**: Smart TVs + Raspberry Pi displays
- **Workstations**: High-spec computers for lab
- **VR/AR Equipment**: For workshops and demos

### Content & Development ($20k)
- **Contractor Support**: UI/UX design, curriculum packaging
- **Content Capture**: Professional videographer for key workshops
- **AI Services**: OpenAI, Runway, creative AI tools
- **Development Tools**: Premium subscriptions and credits

### Buffer & Flexibility ($15k)
- **Exhibition Support**: Materials, equipment, setup
- **Emergency Requests**: Unforeseen needs
- **Equipment Upgrades**: Based on feedback and usage

## Weekly Time Budget

### Oolite Work (20 hrs/week combined)
- **Moises**: 12 hrs/week
- **Fabiola**: 8 hrs/week

### Infra24 Development (15-20 hrs/week)
- **Moises**: 15-20 hrs/week
- **Focus Areas**: Multi-tenant development, API integration, content creation

### Do Not Do List
- ❌ Scope creep on Oolite contract
- ❌ Heavy infrastructure that requires maintenance
- ❌ Custom solutions when SaaS alternatives exist
- ❌ Perfectionism over shipping
- ❌ Manual processes that can be automated

## Success Metrics

### Oolite Delivery
- ✅ 2-3 workshops delivered monthly
- ✅ 85%+ workshop completion rate
- ✅ 90%+ participant satisfaction
- ✅ Monthly metrics reports on time

### ArtHub v1 Multitenant
- ✅ Oolite fully onboarded and using system
- ✅ Bakehouse tenant created and functional
- ✅ 3+ organizations expressing interest
- ✅ <2 second page load times

### Cashflow/Debt
- ✅ $8-10k debt reduction
- ✅ $550/month storage savings achieved
- ✅ 1-month advance buffer maintained
- ✅ Tax allocation system in place

## Next 3 Actions

1. **Confirm Budget Categories**: Send Oolite high-level breakdown (infra, streaming, signage, content capture) for sign-off
2. **Spin up ArtHub Tenants**: Oolite first; create placeholder Bakehouse & Locust to show multitenancy
3. **Draft Debt Paydown Schedule**: $3k from advance + storage cut → credit card #1 this month

## Risk Mitigation

### Technical Risks
- **Multi-tenant Complexity**: Start simple, iterate
- **Performance Issues**: Monitor and optimize early
- **Data Security**: Implement RLS from day one

### Business Risks
- **Scope Creep**: Stick to 20 hrs/week Oolite limit
- **Cash Flow**: Maintain 1-month buffer
- **Competition**: Focus on execution over features

### Operational Risks
- **Burnout**: Maintain work-life balance
- **Quality**: Ship early, iterate fast
- **Partnerships**: Document everything, communicate clearly

---

*Last Updated: December 2024*
*Next Review: Weekly during implementation*

