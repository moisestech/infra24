# API Routes Reference

## 🚀 **Complete API Endpoints Overview**

This document provides a comprehensive reference for all API endpoints in the Infra24 platform, including the new Phase 2 features.

---

## 📊 **Event Management APIs**

### **Event Materials Management**
```http
GET /api/events/[eventId]/materials
POST /api/events/[eventId]/materials
DELETE /api/events/[eventId]/materials?materialId=xxx&organizationId=xxx
```

**Purpose**: Manage materials (files, links, documents) associated with events

**GET Parameters**:
- `eventId` (path) - Event ID
- `organizationId` (query) - Organization ID

**POST Body**:
```json
{
  "organizationId": "string",
  "title": "string",
  "description": "string",
  "fileUrl": "string",
  "fileType": "string",
  "isPublic": boolean
}
```

### **Event Feedback Collection**
```http
GET /api/events/[eventId]/feedback
POST /api/events/[eventId]/feedback
```

**Purpose**: Collect and retrieve feedback for events

**GET Parameters**:
- `eventId` (path) - Event ID

**POST Body**:
```json
{
  "organizationId": "string",
  "rating": number,
  "comments": "string"
}
```

---

## 🎓 **Course Management APIs**

### **Course CRUD Operations**
```http
GET /api/courses
POST /api/courses
```

**Purpose**: Manage courses and course catalog

**GET Parameters**:
- `organizationId` (query, required) - Organization ID
- `category` (query) - Filter by category
- `published` (query) - Filter by published status
- `limit` (query) - Pagination limit
- `offset` (query) - Pagination offset

**POST Body**:
```json
{
  "organizationId": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "difficulty": "string",
  "price": number,
  "currency": "string",
  "durationHours": number,
  "imageUrl": "string",
  "isPublished": boolean
}
```

### **Course Lessons Management**
```http
GET /api/courses/[courseId]/lessons
POST /api/courses/[courseId]/lessons
```

**Purpose**: Manage individual lessons within courses

**GET Parameters**:
- `courseId` (path) - Course ID

**POST Body**:
```json
{
  "organizationId": "string",
  "title": "string",
  "content": "string",
  "lessonOrder": number,
  "isPublished": boolean
}
```

### **Course Enrollment Management**
```http
GET /api/courses/[courseId]/enrollments
POST /api/courses/[courseId]/enrollments
```

**Purpose**: Track user enrollments in courses

**GET Parameters**:
- `courseId` (path) - Course ID

**POST Body**:
```json
{
  "organizationId": "string"
}
```

---

## 📝 **Content Management APIs**

### **Content Management System**
```http
GET /api/content
POST /api/content
```

**Purpose**: Manage content items with MDX support

**GET Parameters**:
- `organizationId` (query, required) - Organization ID
- `contentType` (query) - Filter by content type
- `category` (query) - Filter by category
- `published` (query) - Filter by published status
- `slug` (query) - Get specific content by slug
- `limit` (query) - Pagination limit
- `offset` (query) - Pagination offset

**POST Body**:
```json
{
  "organizationId": "string",
  "title": "string",
  "slug": "string",
  "content": "string",
  "contentType": "string",
  "category": "string",
  "published": boolean
}
```

### **Media Upload System**
```http
POST /api/media/upload
```

**Purpose**: Upload and manage media files

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file` (required) - File to upload
- `organizationId` (required) - Organization ID
- `description` (optional) - File description
- `altText` (optional) - Alt text for images
- `isPublic` (optional) - Public visibility
- `tags` (optional) - File tags
- `metadata` (optional) - Additional metadata

---

## 📊 **Analytics APIs**

### **Event Analytics**
```http
GET /api/analytics/events
```

**Purpose**: Get comprehensive event analytics data

**Parameters**:
- `organizationId` (query, required) - Organization ID
- `dateFrom` (query) - Start date filter
- `dateTo` (query) - End date filter
- `eventType` (query) - Filter by event type

### **Workshop Analytics**
```http
GET /api/analytics/workshops
```

**Purpose**: Get workshop-specific analytics

**Parameters**:
- `organizationId` (query, required) - Organization ID
- `dateFrom` (query) - Start date filter
- `dateTo` (query) - End date filter
- `category` (query) - Filter by category

---

## 🗓️ **Booking System APIs**

### **Resource Management**
```http
GET /api/resources
POST /api/resources
PUT /api/resources/[id]
DELETE /api/resources/[id]
```

**Purpose**: Manage bookable resources (rooms, equipment, etc.)

**GET Parameters**:
- `organizationId` (query, required) - Organization ID
- `type` (query) - Filter by resource type
- `available` (query) - Filter by availability

**POST Body**:
```json
{
  "organizationId": "string",
  "name": "string",
  "type": "string",
  "description": "string",
  "capacity": number,
  "location": "string",
  "features": ["string"],
  "isActive": boolean
}
```

### **Booking Management**
```http
GET /api/bookings
POST /api/bookings
PUT /api/bookings/[id]
DELETE /api/bookings/[id]
```

**Purpose**: Manage resource bookings

**GET Parameters**:
- `organizationId` (query, required) - Organization ID
- `resourceId` (query) - Filter by resource
- `userId` (query) - Filter by user
- `dateFrom` (query) - Start date filter
- `dateTo` (query) - End date filter

**POST Body**:
```json
{
  "organizationId": "string",
  "resourceId": "string",
  "userId": "string",
  "startTime": "string",
  "endTime": "string",
  "title": "string",
  "description": "string",
  "status": "string"
}
```

---

## 🎓 **Workshop Management APIs**

### **Workshop Sessions**
```http
GET /api/workshops/[id]/sessions
POST /api/workshops/[id]/sessions
```

**Purpose**: Manage workshop sessions and scheduling

**GET Parameters**:
- `id` (path) - Workshop ID

**POST Body**:
```json
{
  "organizationId": "string",
  "title": "string",
  "description": "string",
  "startTime": "string",
  "endTime": "string",
  "location": "string",
  "maxParticipants": number,
  "instructorId": "string"
}
```

### **Workshop Registrations**
```http
GET /api/workshop-registrations
POST /api/workshop-registrations
```

**Purpose**: Manage workshop registrations

**GET Parameters**:
- `organizationId` (query, required) - Organization ID
- `workshopId` (query) - Filter by workshop
- `userId` (query) - Filter by user
- `status` (query) - Filter by registration status

**POST Body**:
```json
{
  "organizationId": "string",
  "workshopId": "string",
  "userId": "string",
  "registrationData": {}
}
```

### **Workshop Reminders**
```http
POST /api/workshop-reminders
```

**Purpose**: Send automated workshop reminders

**POST Body**:
```json
{
  "organizationId": "string",
  "workshopId": "string",
  "reminderType": "string",
  "scheduledTime": "string"
}
```

---

## 🔐 **Authentication & Authorization**

All API endpoints require authentication via Clerk. The following headers are required:

```http
Authorization: Bearer <clerk_token>
```

### **Role-Based Access Control**

- **Public Endpoints**: No authentication required
- **Member Endpoints**: Requires organization membership
- **Admin Endpoints**: Requires admin role (`org_admin`, `super_admin`, `moderator`)

### **Organization Context**

Most endpoints require an `organizationId` parameter to ensure proper multi-tenant isolation.

---

## 📝 **Response Formats**

### **Success Response**
```json
{
  "success": true,
  "data": {},
  "message": "string"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "string",
  "details": {}
}
```

### **Pagination Response**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "limit": number,
    "offset": number,
    "total": number,
    "hasMore": boolean
  }
}
```

---

## 🚀 **Rate Limiting**

- **Standard Endpoints**: 100 requests per minute
- **Upload Endpoints**: 10 requests per minute
- **Analytics Endpoints**: 50 requests per minute

---

## 📊 **Status Codes**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🔧 **Testing Endpoints**

### **Test Workshop Email**
```http
POST /api/test-workshop-email
```

**Purpose**: Test workshop email functionality

**POST Body**:
```json
{
  "organizationId": "string",
  "workshopId": "string",
  "testEmail": "string"
}
```

---

## 📚 **Additional Resources**

- **Database Schema**: See `docs/PHASE_2_PROGRESS_SUMMARY.md`
- **Component Reference**: See component documentation
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Phase 2 Implementation**: See `docs/PHASE_2_IMPLEMENTATION_PLAN.md`

---

**Last Updated**: Phase 2 Complete - All endpoints implemented and tested
