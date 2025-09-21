# Infra24 API Specification

**Multi-tenant RESTful API for digital arts education and community management platform.**

## 🏗️ Architecture Overview

- **Base URL**: `https://infra24.digital/api`
- **Authentication**: JWT tokens via Clerk
- **Multi-tenancy**: Tenant resolution via `Host` header
- **Data Isolation**: Row-Level Security (RLS) with `organization_id`
- **Rate Limiting**: 1000 requests/hour per tenant

## 🔐 Authentication

### Headers
```
Authorization: Bearer <jwt_token>
X-Tenant-ID: <organization_slug> (optional, auto-detected from Host)
```

### Tenant Resolution
```javascript
// Auto-detected from Host header
const tenantId = req.headers.host.split('.')[0]; // oolite.infra24.digital -> oolite
```

## 📚 Core Endpoints

### Organizations

#### `GET /api/org`
Get current tenant configuration.

**Response:**
```json
{
  "id": "uuid",
  "slug": "oolite",
  "name": "Oolite Arts",
  "domain_primary": "oolite.infra24.digital",
  "theme": {
    "primary": "#2E86AB",
    "secondary": "#A23B72"
  },
  "settings": {
    "booking_lead_time_hours": 24,
    "max_booking_duration_hours": 8
  }
}
```

### Users & Memberships

#### `GET /api/users/me`
Get current user profile and memberships.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "https://...",
  "memberships": [
    {
      "organization_id": "uuid",
      "organization_slug": "oolite",
      "role": "resident",
      "status": "active"
    }
  ]
}
```

#### `GET /api/organizations/{slug}/users`
Get organization members (admin/staff only).

**Query Parameters:**
- `role`: Filter by role (admin, staff, resident, public)
- `status`: Filter by status (active, inactive, pending)
- `search`: Search by name or email

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "resident",
      "status": "active",
      "joined_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "per_page": 20
}
```

## 📅 Bookings System

### Resources

#### `GET /api/resources`
List available resources.

**Query Parameters:**
- `type`: Filter by type (equipment, room, workshop, event)
- `available`: Filter by availability (true/false)
- `date`: Check availability for specific date

**Response:**
```json
{
  "resources": [
    {
      "id": "uuid",
      "name": "3D Printer A",
      "type": "equipment",
      "capacity": 1,
      "description": "Prusa i3 MK3S+ with PLA/ABS support",
      "rules": {
        "min_booking_hours": 2,
        "max_booking_hours": 8
      },
      "status": "active",
      "availability": {
        "next_available": "2024-01-20T14:00:00Z",
        "slots_today": 3
      }
    }
  ]
}
```

#### `GET /api/resources/{id}/availability`
Get resource availability for date range.

**Query Parameters:**
- `start_date`: Start date (ISO 8601)
- `end_date`: End date (ISO 8601)
- `duration_hours`: Required duration

**Response:**
```json
{
  "resource_id": "uuid",
  "available_slots": [
    {
      "starts_at": "2024-01-20T09:00:00Z",
      "ends_at": "2024-01-20T17:00:00Z",
      "duration_hours": 8
    }
  ],
  "existing_bookings": [
    {
      "id": "uuid",
      "title": "3D Print Project",
      "starts_at": "2024-01-20T10:00:00Z",
      "ends_at": "2024-01-20T12:00:00Z",
      "user_name": "John Doe"
    }
  ]
}
```

### Bookings

#### `POST /api/bookings`
Create a new booking.

**Request:**
```json
{
  "resource_id": "uuid",
  "title": "3D Print Project",
  "description": "Printing prototype for exhibition",
  "starts_at": "2024-01-20T10:00:00Z",
  "ends_at": "2024-01-20T12:00:00Z",
  "notes": "Will bring own filament"
}
```

**Response:**
```json
{
  "id": "uuid",
  "resource_id": "uuid",
  "user_id": "uuid",
  "title": "3D Print Project",
  "starts_at": "2024-01-20T10:00:00Z",
  "ends_at": "2024-01-20T12:00:00Z",
  "status": "confirmed",
  "confirmation_code": "ABC123",
  "created_at": "2024-01-19T15:30:00Z"
}
```

#### `GET /api/bookings`
List user's bookings.

**Query Parameters:**
- `status`: Filter by status
- `resource_id`: Filter by resource
- `start_date`: Filter by start date
- `end_date`: Filter by end date

#### `POST /api/bookings/{id}/checkin`
Check in to a booking (QR code scan).

**Response:**
```json
{
  "id": "uuid",
  "status": "checked_in",
  "checked_in_at": "2024-01-20T10:05:00Z"
}
```

#### `DELETE /api/bookings/{id}`
Cancel a booking.

## 🎓 Events & Workshops

### Events

#### `GET /api/events`
List upcoming events.

**Query Parameters:**
- `type`: Filter by type (workshop, talk, exhibition, open_lab)
- `status`: Filter by status (published, draft)
- `start_date`: Filter by start date
- `end_date`: Filter by end date

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "type": "workshop",
      "title": "AI & the Arts 101",
      "description": "Introduction to AI tools for artists",
      "starts_at": "2024-01-25T18:00:00Z",
      "ends_at": "2024-01-25T20:00:00Z",
      "location": "Digital Lab",
      "capacity": 12,
      "price": 0,
      "status": "published",
      "registered_count": 8,
      "livestream_url": "https://...",
      "instructor": {
        "name": "Jane Smith",
        "bio": "AI artist and educator"
      }
    }
  ]
}
```

#### `POST /api/events/{id}/register`
Register for an event.

**Response:**
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "user_id": "uuid",
  "status": "registered",
  "confirmation_code": "EVT456",
  "registered_at": "2024-01-19T16:00:00Z"
}
```

#### `POST /api/events/{id}/checkin`
Check in to an event.

## 🖥️ Screens & Signage

### Screens

#### `GET /api/screens`
List organization screens (admin/staff only).

**Response:**
```json
{
  "screens": [
    {
      "id": "uuid",
      "name": "Lobby Display",
      "location": "Main Entrance",
      "device_key": "screen_001",
      "device_type": "raspberry_pi",
      "status": "active",
      "last_heartbeat_at": "2024-01-19T15:45:00Z",
      "assigned_playlists": [
        {
          "id": "uuid",
          "name": "Daily Schedule",
          "priority": 1
        }
      ]
    }
  ]
}
```

#### `POST /api/screens/{id}/heartbeat`
Device heartbeat (called by kiosk devices).

**Request:**
```json
{
  "device_key": "screen_001",
  "status": "active",
  "current_content": "playlist_daily_schedule",
  "uptime_seconds": 86400
}
```

### Content & Playlists

#### `GET /api/content`
List content items.

**Query Parameters:**
- `kind`: Filter by kind (announcement, event, image, video, qr_code)
- `status`: Filter by status (published, draft)
- `playlist_id`: Filter by playlist

#### `POST /api/content`
Create content item (admin/staff only).

**Request:**
```json
{
  "kind": "announcement",
  "title": "New Workshop Series",
  "body": {
    "text": "Join us for our new AI & Arts workshop series",
    "background_color": "#2E86AB",
    "text_color": "#FFFFFF"
  },
  "publish_at": "2024-01-20T09:00:00Z",
  "expire_at": "2024-01-27T23:59:59Z"
}
```

#### `GET /api/playlists`
List playlists.

#### `POST /api/playlists`
Create playlist (admin/staff only).

#### `POST /api/playlists/{id}/items`
Add content to playlist.

**Request:**
```json
{
  "content_item_id": "uuid",
  "order_index": 1,
  "duration_seconds": 15
}
```

## 📝 Submissions

#### `GET /api/submissions`
List submissions (admin/staff only).

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected)
- `type`: Filter by type
- `submitter_id`: Filter by submitter

#### `POST /api/submissions`
Submit content for review.

**Request:**
```json
{
  "type": "announcement",
  "title": "Community Art Show",
  "content": {
    "description": "Showcase of local artists",
    "date": "2024-02-15",
    "location": "Gallery Space"
  },
  "media_urls": ["https://..."]
}
```

#### `POST /api/submissions/{id}/review`
Review submission (admin/staff only).

**Request:**
```json
{
  "status": "approved",
  "review_notes": "Great event, approved for publication"
}
```

## 🎓 Learning System

### Courses

#### `GET /api/courses`
List available courses.

**Query Parameters:**
- `level`: Filter by level (beginner, intermediate, advanced)
- `category`: Filter by category
- `organization_id`: Filter by organization (null for global)

**Response:**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "AI & the Arts 101",
      "description": "Introduction to AI tools for artists",
      "level": "beginner",
      "category": "digital_arts",
      "thumbnail_url": "https://...",
      "lesson_count": 8,
      "duration_minutes": 240,
      "enrollment_count": 45,
      "is_enrolled": true,
      "progress": {
        "completed_lessons": 3,
        "total_lessons": 8,
        "completion_percentage": 37.5
      }
    }
  ]
}
```

#### `POST /api/courses/{id}/enroll`
Enroll in a course.

#### `GET /api/courses/{id}/lessons`
Get course lessons.

#### `POST /api/courses/{id}/lessons/{lesson_id}/complete`
Mark lesson as complete.

## 📊 Analytics & Reporting

### Analytics

#### `GET /api/analytics/summary`
Get analytics summary.

**Query Parameters:**
- `range`: Time range (last_7d, last_30d, last_90d, last_year)
- `metric`: Specific metric (bookings, events, screens, courses)

**Response:**
```json
{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "metrics": {
    "bookings": {
      "total": 156,
      "unique_users": 45,
      "utilization_rate": 0.73,
      "no_show_rate": 0.12
    },
    "events": {
      "total": 12,
      "total_attendees": 89,
      "average_attendance": 7.4,
      "completion_rate": 0.85
    },
    "screens": {
      "total_views": 2847,
      "unique_viewers": 234,
      "average_session_duration": 45
    },
    "courses": {
      "total_enrollments": 67,
      "completion_rate": 0.68,
      "average_rating": 4.2
    }
  }
}
```

### Reports

#### `GET /api/reports/monthly.pdf`
Generate monthly PDF report.

**Query Parameters:**
- `month`: Month (YYYY-MM format)
- `include_details`: Include detailed breakdowns

#### `GET /api/reports/export.csv`
Export data as CSV.

**Query Parameters:**
- `type`: Data type (bookings, events, users, analytics)
- `start_date`: Start date
- `end_date`: End date

## 🔧 Admin & Management

### System Health

#### `GET /api/health`
System health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-19T16:00:00Z",
  "services": {
    "database": "healthy",
    "storage": "healthy",
    "auth": "healthy"
  },
  "metrics": {
    "response_time_ms": 45,
    "active_connections": 12
  }
}
```

### Audit Log

#### `GET /api/audit`
Get audit log (admin only).

**Query Parameters:**
- `action`: Filter by action
- `actor_id`: Filter by actor
- `start_date`: Filter by start date
- `end_date`: Filter by end date

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid booking duration",
    "details": {
      "field": "duration_hours",
      "constraint": "max_booking_hours",
      "value": 12,
      "max_allowed": 8
    }
  },
  "timestamp": "2024-01-19T16:00:00Z",
  "request_id": "req_123456"
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid request data
- `AUTHENTICATION_REQUIRED`: Missing or invalid token
- `AUTHORIZATION_DENIED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Resource doesn't exist
- `CONFLICT`: Resource conflict (e.g., double booking)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `TENANT_NOT_FOUND`: Invalid tenant

## 📱 Webhook System

### Webhook Events
- `booking.created`
- `booking.cancelled`
- `event.registered`
- `submission.approved`
- `screen.offline`
- `course.completed`

### Webhook Payload
```json
{
  "event": "booking.created",
  "organization_id": "uuid",
  "data": {
    "booking_id": "uuid",
    "resource_name": "3D Printer A",
    "user_name": "John Doe",
    "starts_at": "2024-01-20T10:00:00Z"
  },
  "timestamp": "2024-01-19T16:00:00Z"
}
```

## 🔄 Rate Limiting

- **General API**: 1000 requests/hour per tenant
- **Authentication**: 10 requests/minute per IP
- **File Uploads**: 100 requests/hour per user
- **Webhooks**: 1000 requests/hour per endpoint

## 📋 SDK Examples

### JavaScript/TypeScript
```typescript
import { Infra24Client } from '@infra24/sdk';

const client = new Infra24Client({
  apiKey: 'your_api_key',
  tenant: 'oolite'
});

// Create a booking
const booking = await client.bookings.create({
  resource_id: 'uuid',
  title: '3D Print Project',
  starts_at: '2024-01-20T10:00:00Z',
  ends_at: '2024-01-20T12:00:00Z'
});

// Get analytics
const analytics = await client.analytics.getSummary({
  range: 'last_30d'
});
```

### Python
```python
from infra24 import Infra24Client

client = Infra24Client(
    api_key='your_api_key',
    tenant='oolite'
)

# Create a booking
booking = client.bookings.create(
    resource_id='uuid',
    title='3D Print Project',
    starts_at='2024-01-20T10:00:00Z',
    ends_at='2024-01-20T12:00:00Z'
)

# Get analytics
analytics = client.analytics.get_summary(range='last_30d')
```

---

**Infra24 API** - Powering the future of digital arts education and community management.

