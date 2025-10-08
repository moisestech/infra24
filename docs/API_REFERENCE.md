# Infra24 API Reference

## 🔗 Base URL
```
http://localhost:3000/api
```

## 📅 Availability API

### Get Available Slots
```http
GET /api/availability?resource_id={resource_id}&start_date={date}&end_date={date}
```

**Parameters:**
- `resource_id` (string): Resource identifier (e.g., "remote_visit", "print_room")
- `start_date` (string): Start date in YYYY-MM-DD format
- `end_date` (string): End date in YYYY-MM-DD format

**Response:**
```json
{
  "resource_id": "remote_visit",
  "timezone": "America/New_York",
  "slot_minutes": 30,
  "slots": [
    {
      "start": "2025-10-07T12:00:00-04:00",
      "end": "2025-10-07T12:30:00-04:00",
      "host": "mo@oolite.org"
    }
  ]
}
```

## 📝 Booking API

### Create Booking
```http
POST /api/bookings
Content-Type: application/json
```

**Request Body:**
```json
{
  "org_id": "2133fe94-fb12-41f8-ab37-ea4acd4589f6",
  "resource_id": "remote_visit",
  "start_time": "2025-10-07T12:00:00-04:00",
  "end_time": "2025-10-07T12:30:00-04:00",
  "artist_name": "Ana Gomez",
  "artist_email": "ana@example.com",
  "goal_text": "Portfolio feedback",
  "consent_recording": false
}
```

**Response:**
```json
{
  "booking_id": "550e8400-e29b-41d4-a716-446655440000",
  "confirmation_url": "/bookings/confirmation/550e8400-e29b-41d4-a716-446655440000",
  "reschedule_url": "/api/bookings/550e8400-e29b-41d4-a716-446655440000/reschedule",
  "cancel_url": "/api/bookings/550e8400-e29b-41d4-a716-446655440000/cancel"
}
```

### Get Booking Details
```http
GET /api/bookings/{booking_id}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "org_id": "2133fe94-fb12-41f8-ab37-ea4acd4589f6",
  "resource_id": "remote_visit",
  "title": "Studio Visit — Ana Gomez",
  "start_time": "2025-10-07T12:00:00-04:00",
  "end_time": "2025-10-07T12:30:00-04:00",
  "status": "confirmed",
  "location": "Google Meet link",
  "metadata": {
    "host": "mo@oolite.org",
    "reschedule_token": "abc123"
  }
}
```

## 📅 Calendar Integration

### Get Calendar URLs
```http
GET /api/bookings/{booking_id}/calendar-urls
```

**Response:**
```json
{
  "google": "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Studio%20Visit%20—%20Ana%20Gomez&dates=20251007T160000Z/20251007T163000Z&details=Portfolio%20feedback&location=Google%20Meet%20link",
  "outlook": "https://outlook.live.com/calendar/0/deeplink/compose?subject=Studio%20Visit%20—%20Ana%20Gomez&startdt=2025-10-07T12:00:00-04:00&enddt=2025-10-07T12:30:00-04:00&body=Portfolio%20feedback&location=Google%20Meet%20link",
  "yahoo": "https://calendar.yahoo.com/?v=60&view=d&type=20&title=Studio%20Visit%20—%20Ana%20Gomez&st=20251007T160000Z&et=20251007T163000Z&desc=Portfolio%20feedback&in_loc=Google%20Meet%20link",
  "apple": "data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20251007T160000Z%0ADTEND:20251007T163000Z%0ASUMMARY:Studio%20Visit%20—%20Ana%20Gomez%0ADESCRIPTION:Portfolio%20feedback%0ALOCATION:Google%20Meet%20link%0AEND:VEVENT%0AEND:VCALENDAR"
}
```

### Download ICS File
```http
GET /api/bookings/{booking_id}/ics
```

**Response:** ICS file download

## 🏢 Organization API

### Get Organization by Slug
```http
GET /api/organizations/by-slug/{slug}
```

**Response:**
```json
{
  "id": "2133fe94-fb12-41f8-ab37-ea4acd4589f6",
  "name": "Oolite Arts",
  "slug": "oolite",
  "description": "Miami's leading contemporary arts organization",
  "logo_url": "https://example.com/logo.png",
  "theme": {
    "primary": "#00BCD4",
    "primaryDark": "#0097A7",
    "primaryAlpha": "rgba(0, 188, 212, 0.1)"
  }
}
```

## 🎨 Workshop API

### Get Workshop Details
```http
GET /api/workshops/{workshop_id}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "SEO Workshop",
  "description": "Learn the fundamentals of search engine optimization",
  "instructor": "Digital Marketing Expert",
  "duration_minutes": 120,
  "max_participants": 20,
  "price": 150.00,
  "status": "published",
  "featured": true,
  "has_learn_content": true,
  "learning_objectives": [
    "Understand the fundamentals of SEO",
    "Learn keyword research techniques"
  ],
  "estimated_learn_time": 120,
  "learn_difficulty": "beginner",
  "prerequisites": [
    "Basic understanding of websites"
  ],
  "materials_needed": [
    "Computer with internet access"
  ]
}
```

### Get Workshop Chapter Content
```http
GET /api/workshops/{workshop_id}/chapters/{chapter_slug}/content
```

**Response:**
```json
{
  "chapter": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "workshop_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Introduction to SEO",
    "chapter_slug": "introduction-to-seo",
    "order_index": 1,
    "estimated_read_time": 15
  },
  "content": "# Introduction to SEO\n\nSearch engine optimization (SEO) is the practice of optimizing your website to rank higher in search engine results...",
  "frontmatter": {
    "title": "Introduction to SEO",
    "description": "Learn the basics of search engine optimization",
    "estimatedReadTime": 15
  }
}
```

## 🎯 Interest Tracking API

### Track Workshop Interest
```http
POST /api/workshops/{workshop_id}/interest
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "user_31hTFxON7Q1iRCUkksjOylq26s7"
}
```

**Response:**
```json
{
  "success": true,
  "interest_count": 15
}
```

## 🏭 Resources API

### Get Resources
```http
GET /api/organizations/{org_id}/resources
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "org_id": "2133fe94-fb12-41f8-ab37-ea4acd4589f6",
    "name": "Remote Studio Visit",
    "type": "space",
    "capacity": 1,
    "is_bookable": true,
    "metadata": {
      "description": "30-minute remote studio visit",
      "duration_minutes": 30,
      "availability_rules": {
        "timezone": "America/New_York",
        "slot_minutes": 30,
        "buffer_before": 10,
        "buffer_after": 10,
        "max_per_day_per_host": 4,
        "windows": [
          {
            "by": "host",
            "host": "mo@oolite.org",
            "days": ["Tue", "Wed", "Thu"],
            "start": "12:00",
            "end": "16:00"
          }
        ]
      }
    }
  }
]
```

## 🎨 Artist Profiles API

### Get Artists
```http
GET /api/artists
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ana Gomez",
    "bio": "Contemporary artist specializing in digital media",
    "avatar_url": "https://example.com/avatar.jpg",
    "cover_image_url": "https://example.com/cover.jpg",
    "website": "https://anagomez.com",
    "instagram": "@anagomez",
    "location": "Miami, FL",
    "skills": ["Digital Art", "Photography"],
    "mediums": ["Digital", "Mixed Media"],
    "is_public": true,
    "is_featured": false
  }
]
```

## 📊 Analytics API

### Get Workshop Analytics
```http
GET /api/organizations/{org_id}/workshops/analytics
```

**Response:**
```json
{
  "total_workshops": 3,
  "total_participants": 45,
  "completion_rate": 0.78,
  "workshops": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "SEO Workshop",
      "total_participants": 20,
      "completed_participants": 15,
      "completion_rate": 0.75,
      "average_progress": 0.68
    }
  ]
}
```

## 🔐 Authentication

### Clerk Integration
All API endpoints (except public booking) require Clerk authentication:

```http
Authorization: Bearer {clerk_session_token}
```

### Public Endpoints
- `/api/availability`
- `/api/bookings` (POST only)
- `/api/bookings/{id}/calendar-urls`
- `/api/bookings/{id}/ics`

## 📝 Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### Example cURL Commands

```bash
# Get available slots
curl "http://localhost:3000/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"

# Create booking
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"2133fe94-fb12-41f8-ab37-ea4acd4589f6","resource_id":"remote_visit","start_time":"2025-10-07T12:00:00-04:00","end_time":"2025-10-07T12:30:00-04:00","artist_name":"Test Artist","artist_email":"test@example.com","goal_text":"Test booking"}'

# Get calendar URLs
curl "http://localhost:3000/api/bookings/{booking_id}/calendar-urls"

# Download ICS file
curl "http://localhost:3000/api/bookings/{booking_id}/ics" -o booking.ics
```

---

*Last updated: September 30, 2025*



