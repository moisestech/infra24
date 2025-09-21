# Cultural Infrastructure Platform - API Specification

## 🔗 **Base URL**
```
Production: https://api.culturalinfra.com/v1
Development: http://localhost:3000/api/v1
```

## 🔐 **Authentication**
All API requests require authentication via Clerk JWT tokens in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

## 📊 **Response Format**
All API responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🏢 **Organizations API**

### **GET /organizations**
Get current user's organization
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Bakehouse Art Complex",
    "slug": "bakehouse",
    "domain": "bakehouse.org",
    "logo_url": "https://...",
    "primary_color": "#ff6b35",
    "secondary_color": "#ffffff",
    "subscription_tier": "community",
    "subscription_status": "active",
    "settings": {},
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### **PUT /organizations**
Update organization settings
```json
{
  "name": "Bakehouse Art Complex",
  "primary_color": "#ff6b35",
  "secondary_color": "#ffffff",
  "settings": {
    "timezone": "America/New_York",
    "date_format": "MM/DD/YYYY"
  }
}
```

## 👥 **Users API**

### **GET /users**
Get organization users
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@bakehouse.org",
      "first_name": "John",
      "last_name": "Doe",
      "avatar_url": "https://...",
      "role": "admin",
      "permissions": {},
      "last_login_at": "2024-01-15T09:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

### **POST /users**
Invite new user
```json
{
  "email": "newuser@bakehouse.org",
  "role": "editor",
  "permissions": {
    "can_manage_forms": true,
    "can_view_analytics": false
  }
}
```

### **PUT /users/{userId}**
Update user role/permissions
```json
{
  "role": "admin",
  "permissions": {
    "can_manage_forms": true,
    "can_view_analytics": true,
    "can_manage_users": true
  }
}
```

## 📝 **Forms API**

### **GET /forms**
Get organization forms
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Artist Residency Application",
      "description": "Apply for our 2024 residency program",
      "form_schema": {
        "fields": [
          {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "validation": {
              "minLength": 2,
              "maxLength": 100
            }
          },
          {
            "id": "portfolio",
            "type": "file",
            "label": "Portfolio",
            "required": true,
            "accept": "image/*,.pdf",
            "maxSize": "10MB"
          }
        ]
      },
      "settings": {
        "notifications": {
          "email_on_submission": true,
          "email_recipients": ["admin@bakehouse.org"]
        },
        "redirect_url": "https://bakehouse.org/thank-you"
      },
      "is_active": true,
      "is_public": true,
      "submission_limit": 100,
      "submission_count": 23,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **POST /forms**
Create new form
```json
{
  "title": "New Artist Application",
  "description": "Application for new artists",
  "form_schema": {
    "fields": [
      {
        "id": "name",
        "type": "text",
        "label": "Full Name",
        "required": true
      },
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true
      },
      {
        "id": "experience",
        "type": "select",
        "label": "Experience Level",
        "required": true,
        "options": [
          {"value": "beginner", "label": "Beginner"},
          {"value": "intermediate", "label": "Intermediate"},
          {"value": "advanced", "label": "Advanced"}
        ]
      }
    ]
  },
  "settings": {
    "notifications": {
      "email_on_submission": true
    }
  }
}
```

### **PUT /forms/{formId}**
Update form
```json
{
  "title": "Updated Artist Application",
  "form_schema": { ... },
  "settings": { ... }
}
```

### **DELETE /forms/{formId}**
Delete form (soft delete)

### **GET /forms/{formId}/public**
Get public form data (no auth required)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Artist Residency Application",
    "description": "Apply for our 2024 residency program",
    "form_schema": { ... },
    "organization": {
      "name": "Bakehouse Art Complex",
      "logo_url": "https://..."
    }
  }
}
```

## 📋 **Submissions API**

### **GET /submissions**
Get form submissions
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "form_id": "uuid",
      "submitter_email": "artist@example.com",
      "submitter_name": "Jane Artist",
      "data": {
        "name": "Jane Artist",
        "email": "artist@example.com",
        "portfolio": "file-uuid"
      },
      "files": [
        {
          "id": "file-uuid",
          "filename": "portfolio.pdf",
          "url": "https://..."
        }
      ],
      "status": "pending",
      "reviewed_by": null,
      "reviewed_at": null,
      "notes": null,
      "tags": ["new-artist", "portfolio-review"],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### **POST /submissions**
Submit form (public endpoint)
```json
{
  "form_id": "uuid",
  "submitter_email": "artist@example.com",
  "submitter_name": "Jane Artist",
  "data": {
    "name": "Jane Artist",
    "email": "artist@example.com",
    "experience": "intermediate"
  }
}
```

### **PUT /submissions/{submissionId}**
Update submission status
```json
{
  "status": "approved",
  "notes": "Excellent portfolio, accepted for residency",
  "tags": ["approved", "residency-2024"]
}
```

### **GET /submissions/export**
Export submissions as CSV/Excel
Query params: `?format=csv&form_id=uuid&date_from=2024-01-01&date_to=2024-01-31`

## 📢 **Announcements API**

### **GET /announcements**
Get organization announcements
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Open Call: Digital Art Exhibition",
      "description": "Submit your digital artwork for our upcoming exhibition",
      "type": "call_for_artists",
      "priority": "high",
      "visibility": "public",
      "start_date": "2024-02-01T00:00:00Z",
      "end_date": "2024-02-28T23:59:59Z",
      "duration_minutes": 60,
      "people": [
        {
          "name": "Sarah Curator",
          "role": "curator",
          "avatar_url": "https://..."
        }
      ],
      "partner_orgs": [
        {
          "name": "Miami Art Museum",
          "logo_url": "https://..."
        }
      ],
      "location": "Bakehouse Art Complex",
      "external_url": "https://bakehouse.org/exhibition",
      "image_url": "https://...",
      "is_featured": true,
      "display_order": 1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **POST /announcements**
Create new announcement
```json
{
  "title": "New Exhibition Opening",
  "description": "Join us for the opening of our new exhibition",
  "type": "event",
  "priority": "normal",
  "visibility": "public",
  "start_date": "2024-02-15T18:00:00Z",
  "end_date": "2024-02-15T21:00:00Z",
  "location": "Bakehouse Art Complex",
  "people": [
    {
      "name": "Featured Artist",
      "role": "artist"
    }
  ]
}
```

### **PUT /announcements/{announcementId}**
Update announcement

### **DELETE /announcements/{announcementId}**
Delete announcement

## 📊 **Analytics API**

### **GET /analytics/overview**
Get organization analytics overview
```json
{
  "success": true,
  "data": {
    "submissions": {
      "total": 150,
      "this_month": 23,
      "last_month": 18,
      "growth_percentage": 27.8
    },
    "forms": {
      "total": 8,
      "active": 6,
      "inactive": 2
    },
    "announcements": {
      "total": 25,
      "featured": 3,
      "this_month": 5
    },
    "users": {
      "total": 12,
      "active_this_month": 8
    }
  }
}
```

### **GET /analytics/submissions**
Get submission analytics
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "date": "2024-01-01",
        "count": 5
      },
      {
        "date": "2024-01-02",
        "count": 3
      }
    ],
    "by_form": [
      {
        "form_id": "uuid",
        "form_title": "Artist Application",
        "count": 45
      }
    ],
    "by_status": [
      {
        "status": "pending",
        "count": 12
      },
      {
        "status": "approved",
        "count": 8
      }
    ]
  }
}
```

## 🔑 **API Keys API**

### **GET /api-keys**
Get organization API keys
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mobile App Integration",
      "permissions": ["read:forms", "read:submissions"],
      "last_used_at": "2024-01-15T09:30:00Z",
      "expires_at": "2024-12-31T23:59:59Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### **POST /api-keys**
Create new API key
```json
{
  "name": "New Integration",
  "permissions": ["read:forms", "write:submissions"],
  "expires_at": "2024-12-31T23:59:59Z"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Integration",
    "key": "sk_live_1234567890abcdef", // Only shown once
    "permissions": ["read:forms", "write:submissions"],
    "expires_at": "2024-12-31T23:59:59Z"
  }
}
```

## 🔔 **Webhooks API**

### **GET /webhooks**
Get organization webhooks
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Submission Notifications",
      "url": "https://myapp.com/webhooks/submissions",
      "events": ["submission.created", "submission.updated"],
      "is_active": true,
      "last_triggered_at": "2024-01-15T10:30:00Z",
      "failure_count": 0,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### **POST /webhooks**
Create new webhook
```json
{
  "name": "Form Analytics",
  "url": "https://analytics.myapp.com/webhook",
  "events": ["form.created", "form.updated", "submission.created"],
  "secret": "webhook_secret_key"
}
```

## 📁 **Files API**

### **POST /files/upload**
Upload file
```json
{
  "form_id": "uuid", // Optional, for form submissions
  "submission_id": "uuid" // Optional, for existing submissions
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "portfolio.pdf",
    "url": "https://storage.supabase.co/object/public/files/uuid/portfolio.pdf",
    "size": 2048576,
    "mime_type": "application/pdf"
  }
}
```

### **GET /files/{fileId}**
Get file metadata

### **DELETE /files/{fileId}**
Delete file

## 💳 **Billing API**

### **GET /billing/usage**
Get current usage and limits
```json
{
  "success": true,
  "data": {
    "subscription": {
      "tier": "community",
      "status": "active",
      "current_period_end": "2024-02-15T00:00:00Z"
    },
    "usage": {
      "forms": {
        "used": 3,
        "limit": 5,
        "percentage": 60
      },
      "submissions": {
        "used": 23,
        "limit": 100,
        "percentage": 23
      },
      "storage": {
        "used": 52428800, // bytes
        "limit": 1073741824, // 1GB
        "percentage": 4.9
      }
    }
  }
}
```

### **GET /billing/invoices**
Get billing history
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_1234567890",
      "amount": 20000, // cents
      "currency": "usd",
      "status": "paid",
      "created_at": "2024-01-15T00:00:00Z",
      "download_url": "https://..."
    }
  ]
}
```

## 🚨 **Error Codes**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `SUBSCRIPTION_LIMIT` | 402 | Subscription limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

## 📈 **Rate Limits**

| Tier | Requests/minute | Burst limit |
|------|----------------|-------------|
| Community | 100 | 200 |
| Professional | 500 | 1000 |
| Enterprise | 2000 | 5000 |

## 🔄 **Webhook Events**

### **Form Events**
- `form.created` - New form created
- `form.updated` - Form updated
- `form.deleted` - Form deleted
- `form.published` - Form made public

### **Submission Events**
- `submission.created` - New submission received
- `submission.updated` - Submission status changed
- `submission.deleted` - Submission deleted

### **User Events**
- `user.invited` - New user invited
- `user.joined` - User accepted invitation
- `user.removed` - User removed from organization

### **Webhook Payload Example**
```json
{
  "id": "evt_1234567890",
  "type": "submission.created",
  "data": {
    "id": "uuid",
    "form_id": "uuid",
    "submitter_email": "artist@example.com",
    "data": { ... }
  },
  "organization_id": "uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 🧪 **Testing**

### **Test Environment**
```
Base URL: https://api-staging.culturalinfra.com/v1
Test API Key: sk_test_1234567890abcdef
```

### **Test Data**
Use the test organization with slug `test-org` for development and testing.

---

This API specification provides a comprehensive foundation for building the cultural infrastructure platform, supporting all the features needed for the three pricing tiers while maintaining security and scalability.

