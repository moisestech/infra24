# 🎯 Survey System Setup Guide

## ✅ Current Status: READY TO USE!

The survey system is **fully implemented** and ready for use. Here's what's already in place:

### 🗄️ Database Schema
- ✅ **Migration**: `supabase/migrations/20241222000001_create_survey_system.sql`
- ✅ **Tables**: All survey tables created with proper RLS policies
- ✅ **Multi-tenant**: Supports multiple organizations (Oolite, Bakehouse, etc.)

### 🔌 API Endpoints
- ✅ `POST /api/surveys` - Create surveys
- ✅ `GET /api/surveys` - List surveys
- ✅ `GET /api/surveys/[id]` - Get survey details
- ✅ `PUT /api/surveys/[id]` - Update survey
- ✅ `DELETE /api/surveys/[id]` - Delete survey
- ✅ `POST /api/surveys/[id]/responses` - Submit responses
- ✅ `GET /api/surveys/[id]/responses` - Get responses
- ✅ `POST /api/surveys/[id]/invitations` - Send invitations
- ✅ `GET /api/surveys/templates` - Get survey templates
- ✅ `GET /api/surveys/[id]/analytics` - Get analytics

### 🎨 User Interface
- ✅ **Admin Panel**: `/o/[slug]/admin/surveys` - Create and manage surveys
- ✅ **Survey List**: `/o/[slug]/surveys` - View available surveys
- ✅ **Survey Form**: `/o/[slug]/surveys/[id]` - Take surveys
- ✅ **Thank You**: `/o/[slug]/surveys/[id]/thank-you` - Post-submission page

---

## 🚀 Quick Start (5 minutes)

### 1. Verify Database Setup
```bash
# Check if Supabase is running
supabase status

# If not running, start it
supabase start

# Verify survey tables exist
supabase db diff
```

### 2. Access Admin Panel
1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/o/oolite/admin/surveys` ✅ **CORRECT URL**
3. Or for Bakehouse: `http://localhost:3000/o/bakehouse/admin/surveys`

### 3. Create Your First Survey
1. Click "Create New Survey"
2. Choose "Staff Digital Skills & Workflow Survey" template
3. Customize sections as needed
4. Set survey dates and settings
5. Upload recipient list (CSV with emails)
6. Send invitations

---

## 📋 Survey Templates Available

### 1. Staff Digital Skills & Workflow Survey
**Perfect for**: Staff training needs assessment
**Languages**: English/Spanish
**Duration**: 10-12 minutes
**Features**:
- Department/team selection
- Tool confidence matrix (1-5 scale)
- Workflow bottleneck identification
- Training preference collection
- Pilot champion opt-in

**Sections**:
- About You (department, role, language)
- Tools & Confidence (Gmail, Canva, Adobe, etc.)
- Workflows & Bottlenecks (RSVPs, documentation, etc.)
- Training Preferences (format, timing)
- Pilot & Follow-up (champion opt-in)

---

## 🎯 Recommended Rollout Plan

### Phase 1: Setup (Today)
```bash
# 1. Verify system is ready
npm run dev
# Visit: http://localhost:3000/o/bakehouse/admin/surveys

# 2. Create staff survey
# - Use "Staff Digital Skills & Workflow Survey" template
# - Set anonymous = true
# - Set EN/ES languages
# - Upload staff email list
```

### Phase 2: Launch (This Week)
1. **Email Invitation**:
   ```
   Subject: Help shape our Digital Arts Lab (10-12 min survey)
   
   Hi team — we're mapping trainings and tools for the new Digital Arts Lab.
   Please take 10-12 minutes to share your workflows and pain points. 
   Anonymous, EN/ES available.
   
   👉 [Take the survey] (magic link)
   Closes [DATE], 6pm.
   
   Thanks! — [Your name]
   ```

2. **Slack Reminders**:
   - Day 1: Initial announcement
   - Day 5: Gentle reminder
   - Day 10: Final reminder

3. **Physical Signage**:
   ```
   Shape the Digital Lab
   Scan QR code for 10-12 min survey
   EN/ES available
   Closes [DATE]
   ```

### Phase 3: Analysis (After Close)
1. **Export Data**: CSV download from admin panel
2. **Generate Report**: Use built-in analytics
3. **Plan Training**: Convert insights to workshop topics
4. **Create SOPs**: Build checklists from bottlenecks

---

## 📊 Built-in Analytics & KPIs

The system automatically tracks:

### 📈 Completion Metrics
- Overall completion rate
- Completion by team/department
- Response timeline

### 🛠️ Tool Confidence Heatmap
- Gmail/Outlook comfort levels
- Canva proficiency
- Adobe suite skills
- Video editing (DaVinci, OBS)
- Automation tools (n8n, Zapier)
- Analytics platforms (GA4, Plausible)
- 3D printing basics

### ⚡ Workflow Bottlenecks
- Top 3 pain points per team
- Time-wasting activities
- "10x easier" suggestions

### 🎓 Training Preferences
- Preferred formats (hands-on, demo, micro-videos)
- Best meeting times
- Pilot champion volunteers

### 🌍 Accessibility
- Language preferences (EN/ES)
- Accommodation needs
- Hardware availability

---

## 🔧 Advanced Features

### Multi-Organization Support
- Each org (Oolite, Bakehouse) has separate surveys
- Admin access per organization
- Cross-org analytics (super admin only)

### Magic Link Authentication
- No login required for respondents
- Secure, time-limited access
- Anonymous option available

### Bilingual Support
- All questions support EN/ES
- Automatic language detection
- Bilingual analytics

### Template System
- Reusable survey templates
- Custom sections per team
- Branching logic support

---

## 🆘 Troubleshooting

### Common Issues

**"Survey not found"**
- Check survey ID in URL
- Verify survey is published
- Check organization slug

**"Access denied"**
- Verify user has admin role
- Check organization membership
- Ensure proper authentication

**"Database error"**
- Check Supabase is running: `supabase status`
- Verify migrations applied: `supabase migration list`
- Check logs: `supabase logs`

### Getting Help
1. Check browser console for errors
2. Verify Supabase connection
3. Check network requests in dev tools
4. Review server logs

---

## 🎉 You're Ready!

The survey system is fully functional and ready for your staff digital skills assessment. The "Staff Digital Skills & Workflow Survey" template is specifically designed to help you:

1. **Identify training needs** across teams
2. **Prioritize tool investments** based on confidence levels
3. **Streamline workflows** by addressing bottlenecks
4. **Plan effective training** with preferred formats and timing
5. **Build a champion network** for pilot programs

Start with the admin panel and create your first survey today! 🚀
