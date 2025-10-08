# MadArts Organization Setup Guide
*Complete setup for MadArts organization and Video Performance workshop*

## 🎬 **Overview**

MadArts is a new organization created specifically for the Video Performance workshop. This organization demonstrates the multi-tenant architecture of the platform, showing how different organizations can have their own curated workshop collections with proper visibility controls.

## 🏗️ **Architecture**

### **Organization Structure**
- **Name**: MadArts
- **Slug**: `madarts`
- **Domain**: `madarts.org` (configurable)
- **Theme**: Purple color scheme with professional branding
- **Subscription**: Professional tier with full feature access

### **Workshop Visibility System**
The platform uses a sophisticated workshop visibility system:

1. **Organization Ownership**: Each workshop belongs to a specific organization
2. **Sharing Controls**: Workshops can be marked as shareable (`is_shared = true`)
3. **Cross-Organization Access**: Via `workshop_organization_sharing` table
4. **RLS Policies**: Row-level security ensures proper access control

## 📁 **Files Created**

### **SQL Setup Scripts**
- `scripts/create-madarts-organization.sql` - Creates the MadArts organization
- `scripts/create-video-performance-workshop.sql` - Creates the workshop with full metadata
- `scripts/create-video-performance-chapters.sql` - Creates all 7 chapters with progress tracking
- `scripts/setup-madarts-video-performance.js` - Comprehensive setup verification script

### **Workshop Content**
- `content/workshops/video-performance/syllabus.md` - Complete workshop syllabus
- `content/workshops/video-performance/chapters/01-introduction-to-video-performance.md`
- `content/workshops/video-performance/chapters/02-overcoming-camera-anxiety.md`
- `content/workshops/video-performance/chapters/03-basic-acting-techniques-for-video.md`
- `content/workshops/video-performance/chapters/04-voice-and-diction-for-video.md`
- `content/workshops/video-performance/chapters/05-lighting-and-framing.md`
- `content/workshops/video-performance/chapters/06-movement-and-gesture.md`
- `content/workshops/video-performance/chapters/07-creating-emotional-connection.md`

## 🎯 **Workshop Details**

### **Video Performance: Mastering the Camera**
- **Instructor**: Tere Garcia
- **Duration**: 4 hours 15 minutes total
- **Difficulty**: Beginner to Intermediate
- **Price**: $99.00
- **Chapters**: 7 comprehensive chapters
- **Features**: Full MDX content, progress tracking, interactive elements

### **Chapter Breakdown**
1. **Introduction to Video Performance** (30 min) - Fundamentals and expectations
2. **Overcoming Camera Anxiety** (45 min) - Confidence building techniques
3. **Basic Acting Techniques for Video** (60 min) - Authenticity and expression
4. **Voice and Diction for Video** (40 min) - Vocal delivery optimization
5. **Lighting and Framing** (35 min) - Technical setup and composition
6. **Movement and Gesture** (50 min) - Body language and physical expression
7. **Creating Emotional Connection** (55 min) - Audience engagement and trust

## 🗄️ **Database Schema**

### **Organizations Table**
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    theme JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Workshops Table**
```sql
CREATE TABLE workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    -- ... other fields
    is_shared BOOLEAN DEFAULT false, -- Controls cross-org visibility
    has_learn_content BOOLEAN DEFAULT FALSE,
    -- ... learn-specific fields
);
```

### **Workshop Organization Sharing**
```sql
CREATE TABLE workshop_organization_sharing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    source_organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    target_organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    shared_by TEXT, -- Clerk user ID
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(workshop_id, target_organization_id)
);
```

## 🚀 **Setup Instructions**

### **1. Run SQL Scripts**
Execute these scripts in your Supabase SQL editor in order:

```bash
# 1. Create MadArts organization
scripts/create-madarts-organization.sql

# 2. Create Video Performance workshop
scripts/create-video-performance-workshop.sql

# 3. Create workshop chapters
scripts/create-video-performance-chapters.sql
```

### **2. Verify Setup**
Run the verification script:
```bash
node scripts/setup-madarts-video-performance.js
```

### **3. Test in Application**
- Visit `/o/madarts/workshops`
- Verify the Video Performance workshop appears
- Test the Learn tab functionality
- Check chapter navigation and MDX rendering

## 🔐 **Security & Access Control**

### **Row Level Security (RLS)**
The system implements comprehensive RLS policies:

- **Workshop Access**: Users can only see workshops from their organization or shared workshops
- **Chapter Access**: Only published chapters are visible to users
- **Progress Tracking**: Users can only access their own progress data
- **Organization Isolation**: Proper multi-tenant isolation

### **Workshop Visibility Rules**
1. **Default**: Workshops are only visible to their owning organization
2. **Sharing**: Workshops marked as `is_shared = true` can be shared with other organizations
3. **Cross-Org Access**: Managed via `workshop_organization_sharing` table
4. **Admin Control**: Super admins can manage workshop sharing

## 🎨 **Theme Configuration**

### **MadArts Theme**
```json
{
    "primary_color": "#8B5CF6",
    "secondary_color": "#A78BFA", 
    "accent_color": "#C4B5FD",
    "background_color": "#1F2937",
    "text_color": "#F9FAFB",
    "border_color": "#374151"
}
```

### **Organization Settings**
```json
{
    "features": {
        "workshops": true,
        "learn_canvas": true,
        "bookings": true,
        "resources": true,
        "artist_profiles": true
    },
    "subscription": {
        "tier": "professional",
        "status": "active"
    }
}
```

## 📊 **Analytics & Tracking**

### **User Progress Tracking**
- **Chapter Progress**: Percentage completion per chapter
- **Workshop Progress**: Overall workshop completion
- **Time Tracking**: Time spent on each chapter
- **Last Accessed**: Timestamp of last activity

### **Workshop Analytics**
- **Enrollment Numbers**: How many users are enrolled
- **Completion Rates**: Chapter and workshop completion statistics
- **Engagement Metrics**: Time spent, repeat visits, etc.

## 🔄 **Future Enhancements**

### **Planned Features**
1. **Workshop Sharing UI**: Admin interface for managing workshop sharing
2. **Cross-Org Analytics**: Analytics across shared workshops
3. **Workshop Templates**: Reusable workshop templates
4. **Bulk Operations**: Bulk workshop management tools

### **Integration Opportunities**
1. **Payment Processing**: Stripe integration for workshop payments
2. **Email Notifications**: Automated enrollment and progress notifications
3. **Certificate Generation**: Completion certificates for workshops
4. **Social Features**: User reviews, ratings, and recommendations

## 🎉 **Success Metrics**

### **Setup Verification Checklist**
- [ ] MadArts organization created successfully
- [ ] Video Performance workshop appears in organization
- [ ] All 7 chapters are accessible
- [ ] MDX content renders correctly
- [ ] Progress tracking works
- [ ] Organization isolation is maintained
- [ ] Workshop sharing functionality works

### **Performance Benchmarks**
- **Page Load Time**: < 2 seconds for workshop listing
- **Chapter Load Time**: < 1 second for MDX content
- **Database Queries**: Optimized with proper indexing
- **User Experience**: Smooth navigation and progress tracking

## 📞 **Support & Maintenance**

### **Troubleshooting**
- **Workshop Not Visible**: Check organization membership and RLS policies
- **Chapter Access Issues**: Verify chapter is published and user has access
- **Progress Not Saving**: Check user authentication and database permissions
- **MDX Rendering Problems**: Verify content files exist and are properly formatted

### **Maintenance Tasks**
- **Regular Backups**: Database and content file backups
- **Performance Monitoring**: Query performance and page load times
- **Content Updates**: Regular updates to workshop content
- **Security Audits**: Regular RLS policy and access control reviews

---

*This setup demonstrates the platform's ability to support multiple organizations with their own curated workshop collections while maintaining proper security and access controls.*
