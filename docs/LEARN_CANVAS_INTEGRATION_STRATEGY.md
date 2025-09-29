# Learn Canvas Integration Strategy

## Overview

This document outlines the strategy for integrating the Learn Canvas feature into our multi-tenant workshop system, allowing all organizations to create rich, interactive learning content for their workshops.

## Current State Analysis

### What We Have
- ✅ **Learn Canvas Module**: Complete feature module in `src/features/learn-canvas/`
- ✅ **Core Components**: ChapterReader, Quiz, Activity, Poll, and UI components
- ✅ **MDX Processor**: Server-side content processing service
- ✅ **Multi-tenant Workshop System**: Existing workshop pages with organization-specific theming
- ✅ **Database**: Workshops table with basic structure

### What We Need
- 🔄 **Integration Layer**: Bridge between existing workshops and learn content
- 🔄 **Database Schema**: Add learn content fields to workshops
- 🔄 **Content Structure**: Organize MDX content by organization and workshop
- 🔄 **UI Integration**: Add Learn tabs to existing workshop pages
- 🔄 **Admin Interface**: Tools for creating and managing learn content

## Integration Architecture

### 1. Multi-Organization Content Structure

```
content/
├── workshops/
│   ├── oolite/
│   │   ├── seo-workshop/
│   │   │   ├── chapters/
│   │   │   │   ├── 01-introduction.md
│   │   │   │   ├── 02-keywords.md
│   │   │   │   └── 03-analytics.md
│   │   │   └── curriculum.json
│   │   └── digital-presence/
│   │       ├── chapters/
│   │       └── curriculum.json
│   ├── bakehouse/
│   │   └── [workshop-slug]/
│   └── [org-slug]/
│       └── [workshop-slug]/
```

### 2. Database Schema Updates

```sql
-- Add learn content fields to workshops table
ALTER TABLE workshops ADD COLUMN has_learn_content BOOLEAN DEFAULT FALSE;
ALTER TABLE workshops ADD COLUMN learn_syllabus JSONB;
ALTER TABLE workshops ADD COLUMN learn_objectives TEXT[];
ALTER TABLE workshops ADD COLUMN estimated_learn_time INTEGER; -- in minutes
ALTER TABLE workshops ADD COLUMN learn_difficulty VARCHAR(20); -- beginner, intermediate, advanced
ALTER TABLE workshops ADD COLUMN learn_prerequisites TEXT[];
ALTER TABLE workshops ADD COLUMN learn_materials TEXT[];

-- Create workshop chapters table for progress tracking
CREATE TABLE workshop_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workshop_id, chapter_slug)
);

-- Create user progress tracking
CREATE TABLE user_workshop_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES workshop_chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);
```

### 3. Component Integration Strategy

#### A. WorkshopLearnContent Component
Create a wrapper component that integrates with existing workshop pages:

```typescript
// src/features/learn-canvas/components/WorkshopLearnContent.tsx
interface WorkshopLearnContentProps {
  workshop: Workshop
  organizationSlug: string
  userProgress?: UserProgress
  isAuthenticated: boolean
}
```

#### B. Enhanced Workshop Pages
Add Learn tab to existing workshop pages:

```typescript
// In existing workshop page
const tabs = [
  { id: 'overview', label: 'Overview', content: <WorkshopOverview /> },
  { id: 'learn', label: 'Learn', content: <WorkshopLearnContent /> },
  { id: 'booking', label: 'Book Workshop', content: <WorkshopBooking /> }
]
```

## Implementation Phases

### Phase 1: Foundation Setup (Week 1)

#### 1.1 Database Schema Updates
- [ ] Add learn content fields to workshops table
- [ ] Create workshop_chapters table
- [ ] Create user_workshop_progress table
- [ ] Add RLS policies for multi-tenant access

#### 1.2 Content Structure Setup
- [ ] Create content directory structure
- [ ] Set up organization-specific content folders
- [ ] Create sample workshop content for Oolite

#### 1.3 API Enhancements
- [ ] Create workshop chapters API endpoints
- [ ] Create user progress tracking API
- [ ] Update existing workshop API to include learn content

### Phase 2: Core Integration (Week 2)

#### 2.1 WorkshopLearnContent Component
- [ ] Create main integration component
- [ ] Implement chapter navigation
- [ ] Add progress tracking
- [ ] Integrate with organization theming

#### 2.2 Workshop Page Integration
- [ ] Add Learn tab to existing workshop pages
- [ ] Implement tab navigation
- [ ] Maintain existing booking functionality
- [ ] Add responsive design

#### 2.3 Content Management
- [ ] Create content loading utilities
- [ ] Implement MDX processing for workshops
- [ ] Add error handling and fallbacks

### Phase 3: Advanced Features (Week 3)

#### 3.1 Interactive Components
- [ ] Enhance Quiz component with progress tracking
- [ ] Add Activity completion tracking
- [ ] Implement Poll results persistence
- [ ] Add Timeline progress indicators

#### 3.2 User Experience
- [ ] Add progress indicators
- [ ] Implement bookmarking
- [ ] Add search within workshop content
- [ ] Create completion certificates

#### 3.3 Admin Interface
- [ ] Create workshop content editor
- [ ] Add chapter management interface
- [ ] Implement content preview
- [ ] Add analytics dashboard

### Phase 4: Testing & Optimization (Week 4)

#### 4.1 Testing
- [ ] Unit tests for all components
- [ ] Integration tests for API endpoints
- [ ] End-to-end tests for user flows
- [ ] Performance testing

#### 4.2 Optimization
- [ ] Content caching strategies
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] SEO optimization

## Key Integration Points

### 1. Organization-Specific Theming
- Use existing `useOrganizationTheme` hook
- Apply organization colors to learn components
- Maintain consistent branding across all features

### 2. Authentication & Authorization
- Integrate with existing Clerk authentication
- Use existing user role system
- Implement content access controls

### 3. Multi-tenant Data Isolation
- Ensure content is organization-specific
- Implement proper RLS policies
- Maintain data privacy and security

### 4. Existing Workshop Functionality
- Preserve all current workshop features
- Maintain booking system integration
- Keep existing workshop management tools

## Technical Considerations

### 1. Content Delivery
- **Static Generation**: Pre-build MDX content for performance
- **Dynamic Loading**: Load content on-demand for flexibility
- **Caching**: Implement Redis caching for frequently accessed content

### 2. Performance
- **Code Splitting**: Lazy load learn components
- **Image Optimization**: Use Next.js Image component
- **Bundle Analysis**: Monitor bundle size impact

### 3. SEO & Accessibility
- **Meta Tags**: Add learn content to SEO metadata
- **Structured Data**: Implement schema markup for courses
- **Accessibility**: Ensure WCAG compliance for all components

### 4. Mobile Responsiveness
- **Responsive Design**: Ensure all components work on mobile
- **Touch Interactions**: Optimize for touch devices
- **Offline Support**: Consider PWA features for offline learning

## Migration Strategy

### 1. Existing Workshops
- **Backward Compatibility**: Ensure existing workshops continue to work
- **Gradual Migration**: Add learn content to workshops incrementally
- **Fallback Handling**: Graceful degradation when learn content is unavailable

### 2. Content Migration
- **Manual Migration**: Start with key workshops (SEO, Digital Presence)
- **Template Creation**: Create templates for common workshop types
- **Bulk Import**: Tools for importing existing workshop materials

### 3. User Experience
- **Progressive Enhancement**: Add learn features without breaking existing flows
- **User Education**: Guide users to new learn features
- **Feedback Collection**: Gather user feedback for improvements

## Success Metrics

### 1. User Engagement
- **Learn Content Usage**: Track chapter completion rates
- **Time Spent**: Monitor time spent in learn sections
- **Return Visits**: Measure repeat engagement with learn content

### 2. Workshop Effectiveness
- **Completion Rates**: Compare workshop completion with/without learn content
- **User Satisfaction**: Survey users on learn content quality
- **Booking Conversion**: Measure impact on workshop bookings

### 3. Technical Performance
- **Page Load Times**: Monitor performance impact
- **Error Rates**: Track technical issues
- **Mobile Usage**: Ensure mobile experience quality

## Next Steps

1. **Review & Approve Strategy**: Confirm approach and priorities
2. **Begin Phase 1**: Start with database schema updates
3. **Create Sample Content**: Develop content for SEO Workshop
4. **Build Integration Components**: Create WorkshopLearnContent component
5. **Test Integration**: Ensure seamless integration with existing system

This strategy provides a comprehensive roadmap for integrating the Learn Canvas feature while maintaining all existing functionality and ensuring a smooth user experience across all organizations.
