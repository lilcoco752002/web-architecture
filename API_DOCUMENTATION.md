# API Routes Documentation

## 🔐 Authentication

All admin API routes require authentication via NextAuth.js session.

**Headers**:
```
Cookie: next-auth.session-token=<token>
```

## 📋 Common Response Formats

### Success Response
```json
{
  "data": {...},
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "details": [...] // validation errors
}
```

## 🔒 Auth Endpoints

### POST /api/auth/signin
Sign in with credentials.

**Request**:
```json
{
  "email": "admin@agency.com",
  "password": "Admin123!"
}
```

**Response**: Session cookie

---

### POST /api/auth/signout
Sign out current user.

---

### GET /api/auth/session
Get current session.

**Response**:
```json
{
  "user": {
    "id": "...",
    "email": "admin@agency.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

## 👥 Client Endpoints

### GET /api/clients
List all clients with filters.

**Auth**: Required  
**Query Params**:
- `status`: ClientStatus (optional)
- `source`: ClientSource (optional)
- `search`: string (optional)
- `page`: number (default: 1)
- `pageSize`: number (default: 20)

**Example**:
```
GET /api/clients?status=ACTIVE&page=1&pageSize=20
```

**Response**:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Tech Innovations Inc",
      "email": "contact@techinnovations.com",
      "status": "ACTIVE",
      "source": "REFERRAL",
      "createdAt": "2024-01-15T00:00:00Z",
      "_count": {
        "projects": 3,
        "bookings": 1
      }
    }
  ],
  "pagination": {...}
}
```

---

### POST /api/clients
Create a new client.

**Auth**: Required  
**Request**:
```json
{
  "name": "New Client Inc",
  "email": "client@example.com",
  "phone": "(555) 123-4567",
  "company": "New Client Inc",
  "website": "https://example.com",
  "source": "WEBSITE",
  "status": "NEW",
  "priority": 2,
  "budget": 25000
}
```

**Response**: Client object (201)

---

### GET /api/clients/:id
Get single client with full details.

**Auth**: Required  
**Response**:
```json
{
  "id": "...",
  "name": "Tech Innovations Inc",
  "email": "contact@techinnovations.com",
  "projects": [...],
  "bookings": [...],
  "quotations": [...],
  "notes": [...]
}
```

---

### PATCH /api/clients/:id
Update client.

**Auth**: Required  
**Request**: Partial client object

---

### DELETE /api/clients/:id
Delete client (Admin only).

**Auth**: Required (ADMIN)  
**Response**: `{ "success": true }`

---

### POST /api/clients/:id/notes
Add note to client.

**Auth**: Required  
**Request**:
```json
{
  "content": "Called client about project proposal",
  "isPrivate": false
}
```

---

### GET /api/clients/stats
Get client statistics.

**Auth**: Required  
**Response**:
```json
{
  "total": 150,
  "byStatus": [
    { "status": "ACTIVE", "_count": 45 },
    { "status": "NEW", "_count": 30 }
  ],
  "recentClients": 15
}
```

## 📊 Project Endpoints

### GET /api/projects
List projects (public if not authenticated).

**Auth**: Optional  
**Query Params**:
- `published`: boolean (optional, default true for public)
- `featured`: boolean (optional)
- `status`: ProjectStatus (optional, auth required)
- `clientId`: string (optional, auth required)
- `search`: string (optional)
- `page`: number (default: 1)
- `pageSize`: number (default: 12)

**Public Example**:
```
GET /api/projects?featured=true&page=1
```

**Response**:
```json
{
  "data": [
    {
      "id": "...",
      "title": "E-commerce Platform",
      "slug": "ecommerce-platform-x1y2",
      "shortDescription": "...",
      "featuredImage": "https://...",
      "status": "COMPLETED",
      "services": [
        {
          "service": {
            "id": "...",
            "name": "Web Development"
          }
        }
      ]
    }
  ],
  "pagination": {...}
}
```

---

### POST /api/projects
Create project (admin only).

**Auth**: Required  
**Request**:
```json
{
  "title": "New Website Project",
  "description": "Full description...",
  "type": "WEB_DEVELOPMENT",
  "status": "PLANNING",
  "clientId": "...",
  "budget": 40000,
  "serviceIds": ["...", "..."],
  "published": false
}
```

---

### GET /api/projects/:slug
Get single project by slug (public).

**Auth**: Not required  
**Response**: Full project object with services, images, testimonial

---

### GET /api/projects/featured
Get featured projects (public).

**Auth**: Not required  
**Query**: `limit` (default: 6)

---

### PATCH /api/projects/:id
Update project (admin only).

**Auth**: Required

---

### DELETE /api/projects/:id
Delete project (admin only).

**Auth**: Required (ADMIN)

---

### POST /api/projects/:id/images
Add images to project.

**Auth**: Required  
**Request**:
```json
{
  "images": [
    {
      "url": "https://cloudinary.com/...",
      "altText": "Screenshot 1",
      "order": 1
    }
  ]
}
```

## 📝 Lead Endpoints

### GET /api/leads
List all leads.

**Auth**: Required  
**Query Params**:
- `status`: LeadStatus (optional)
- `source`: ClientSource (optional)
- `page`, `pageSize`

---

### POST /api/leads
Create lead (public endpoint for forms).

**Auth**: Not required  
**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "company": "Example Inc",
  "source": "WEBSITE",
  "interestedIn": "Web Development",
  "message": "Looking for a website...",
  "budget": "USD 20,000-30,000",
  "timeline": "2-3 months"
}
```

---

### PATCH /api/leads/:id
Update lead status.

**Auth**: Required  
**Request**:
```json
{
  "status": "CONTACTED",
  "priority": 1
}
```

---

### POST /api/leads/:id/convert
Convert lead to client.

**Auth**: Required  
**Response**: New client object

## 📅 Booking Endpoints

### GET /api/bookings
List bookings.

**Auth**: Required  
**Query**: `status`, `page`, `pageSize`

---

### POST /api/bookings
Create booking (public).

**Auth**: Not required  
**Request**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(555) 234-5678",
  "type": "CONSULTATION",
  "message": "I'd like to discuss...",
  "interestedIn": "Branding",
  "budget": "USD 15,000",
  "preferredDate": "2024-06-15"
}
```

**Response**: Success message

---

### PATCH /api/bookings/:id
Update booking.

**Auth**: Required  
**Request**:
```json
{
  "status": "REVIEWED",
  "notes": "Contacted via email"
}
```

## 💰 Quotation Endpoints

### GET /api/quotations
List quotations.

**Auth**: Required  
**Query**: `clientId`, `status`, `page`

---

### POST /api/quotations
Create quotation.

**Auth**: Required  
**Request**:
```json
{
  "clientId": "...",
  "title": "Website Development Quotation",
  "items": [
    {
      "service": "Web Design",
      "description": "Custom UI/UX design",
      "quantity": 1,
      "rate": 5000,
      "amount": 5000
    }
  ],
  "subtotal": 5000,
  "tax": 500,
  "total": 5500,
  "validUntil": "2024-07-01",
  "terms": "50% upfront, 50% on completion"
}
```

---

### PATCH /api/quotations/:id
Update quotation status.

**Request**:
```json
{
  "status": "SENT"
}
```

---

### POST /api/quotations/:id/convert
Convert quotation to project.

**Auth**: Required  
**Response**: New project object

## 📰 Blog Endpoints

### GET /api/blog
List blog posts (public).

**Auth**: Not required  
**Query**: `category`, `tag`, `featured`, `page`

**Response**:
```json
{
  "data": [
    {
      "id": "...",
      "title": "10 Web Design Trends",
      "slug": "10-web-design-trends-2024",
      "excerpt": "...",
      "featuredImage": "...",
      "category": "Design",
      "tags": ["Design", "Trends"],
      "author": {
        "name": "Admin User"
      },
      "publishedAt": "2024-01-15T00:00:00Z",
      "readTime": 5
    }
  ]
}
```

---

### GET /api/blog/:slug
Get single blog post (public).

---

### POST /api/blog
Create blog post (admin only).

**Auth**: Required

---

### PATCH /api/blog/:id
Update blog post.

**Auth**: Required

## 🎨 Service Endpoints

### GET /api/services
List services (public).

**Auth**: Not required  
**Query**: `published`, `featured`

---

### GET /api/services/:slug
Get single service (public).

---

### POST /api/services
Create service (admin only).

**Auth**: Required

## ⭐ Testimonial Endpoints

### GET /api/testimonials
List testimonials (public).

**Query**: `featured`, `published`

---

### POST /api/testimonials
Create testimonial (admin only).

**Auth**: Required

## 👥 Team Endpoints

### GET /api/team
List team members (public).

**Query**: `published`

## 📤 Export Endpoints

### GET /api/export/clients
Export clients to CSV.

**Auth**: Required  
**Response**: CSV file download

---

### GET /api/export/projects
Export projects to CSV.

**Auth**: Required

---

### GET /api/export/bookings
Export bookings to CSV.

**Auth**: Required

## 📈 Analytics Endpoints

### GET /api/analytics/dashboard
Get dashboard statistics.

**Auth**: Required  
**Response**:
```json
{
  "clients": {
    "total": 150,
    "active": 45,
    "new": 30
  },
  "projects": {
    "total": 75,
    "inProgress": 12,
    "completed": 60
  },
  "bookings": {
    "pending": 8,
    "thisMonth": 25
  },
  "revenue": {
    "thisMonth": 125000,
    "lastMonth": 98000
  }
}
```

## 📷 Upload Endpoints

### POST /api/upload
Upload file to Cloudinary.

**Auth**: Required  
**Content-Type**: multipart/form-data  
**Request**: Form data with `file` field

**Response**:
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "...",
  "format": "jpg",
  "width": 1920,
  "height": 1080
}
```

## 📋 Activity Log Endpoints

### GET /api/activity
Get activity logs.

**Auth**: Required  
**Query**: `userId`, `entityType`, `entityId`, `type`, `page`

**Response**:
```json
{
  "data": [
    {
      "id": "...",
      "type": "CLIENT_CREATED",
      "description": "Client 'Tech Inc' was created",
      "user": {
        "name": "Admin User"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🔐 Rate Limiting

All public endpoints (forms, API access) should implement rate limiting:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

**Note**: All timestamps are in ISO 8601 format (UTC).
