# Database Entity Relationship Diagram (ERD)

## 📊 Visual Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PREMIUM AGENCY DATABASE                         │
│                        PostgreSQL + Prisma ORM                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    Users     │──────────┐
│──────────────│          │
│ id (PK)      │          │ created_by
│ email*       │          │
│ password     │          ├──> Clients
│ name         │          ├──> Leads
│ role         │          ├──> Projects
│ status       │          ├──> BlogPosts
│ avatar       │          └──> ActivityLogs
│ lastLoginAt  │
└──────────────┘

┌──────────────────┐         ┌──────────────────┐
│     Clients      │─────────│   ClientNotes    │
│──────────────────│ 1     * │──────────────────│
│ id (PK)          │─────────│ id (PK)          │
│ name             │         │ clientId (FK)    │
│ email*           │         │ content          │
│ phone            │         │ isPrivate        │
│ company          │         └──────────────────┘
│ website          │
│ source           │         ┌──────────────────┐
│ status           │         │    Bookings      │
│ priority         │ 1     * │──────────────────│
│ budget           │─────────│ id (PK)          │
│ createdById (FK) │         │ clientId (FK)?   │
└──────────┬───────┘         │ name             │
           │                 │ email            │
           │ 1               │ type             │
           │                 │ status           │
           │ *               │ message          │
           │                 └──────────────────┘
           │
           │                 ┌──────────────────┐
           │                 │   Quotations     │
           │ 1             * │──────────────────│
           ├─────────────────│ id (PK)          │
           │                 │ clientId (FK)    │
           │                 │ quotationNumber* │
           │                 │ title            │
           │                 │ items (JSON)     │
           │ 1               │ total            │
           │                 │ status           │
           │ *               │ validUntil       │
           │                 └──────────────────┘
           │
           │                 ┌──────────────────┐
           │                 │    Projects      │
           │ 1             * │──────────────────│
           └─────────────────│ id (PK)          │
                             │ clientId (FK)    │
                             │ title            │
                             │ slug*            │
                             │ description      │
                             │ type             │
                             │ status           │
                             │ budget           │
                             │ published        │
                             │ featured         │
                             │ createdById (FK) │
                             └────────┬─────────┘
                                      │
                                      │ 1
                                      │
                                      │ *
                             ┌────────┴─────────┐
                             │ ProjectImages    │
                             │──────────────────│
                             │ id (PK)          │
                             │ projectId (FK)   │
                             │ url              │
                             │ altText          │
                             │ order            │
                             └──────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────┐
│    Projects      │    *    │ ProjectServices  │    *    │  Services    │
│──────────────────│─────────│──────────────────│─────────│──────────────│
│ id (PK)          │         │ projectId (FK)   │         │ id (PK)      │
│ ...              │         │ serviceId (FK)   │         │ name         │
└──────────────────┘         │ (Composite PK)   │         │ slug*        │
         │                   └──────────────────┘         │ description  │
         │ 1                                              │ icon         │
         │                                                │ startingPrice│
         │ 1?                                             │ published    │
         │                                                │ featured     │
         │                  ┌──────────────────┐         │ order        │
         └──────────────────│  Testimonials    │         └──────────────┘
                            │──────────────────│
                            │ id (PK)          │
                            │ projectId (FK)?  │
                            │ clientName       │
                            │ clientCompany    │
                            │ content          │
                            │ rating           │
                            │ featured         │
                            │ published        │
                            └──────────────────┘

┌──────────────────┐
│      Leads       │
│──────────────────│
│ id (PK)          │
│ name             │
│ email            │
│ phone            │
│ company          │
│ source           │
│ status           │
│ priority         │
│ interestedIn     │
│ message          │
│ convertedToClientId? │
│ createdById (FK) │
└──────────────────┘

┌──────────────────┐         ┌──────────────────┐
│    BlogPosts     │    1    │     Users        │
│──────────────────│─────────│──────────────────│
│ id (PK)          │  author │ ...              │
│ title            │         └──────────────────┘
│ slug*            │
│ content          │
│ excerpt          │
│ featuredImage    │
│ status           │
│ featured         │
│ tags             │
│ category         │
│ views            │
│ authorId (FK)    │
│ publishedAt      │
└──────────────────┘

┌──────────────────┐
│   TeamMembers    │
│──────────────────│
│ id (PK)          │
│ name             │
│ role             │
│ bio              │
│ avatar           │
│ email            │
│ linkedIn         │
│ twitter          │
│ github           │
│ order            │
│ published        │
└──────────────────┘

┌──────────────────────────┐
│     ActivityLogs         │
│──────────────────────────│
│ id (PK)                  │
│ type                     │
│ description              │
│ metadata (JSON)          │
│ entityType               │
│ entityId                 │
│ userId (FK)              │
│ clientId (FK)?           │
│ leadId (FK)?             │
│ projectId (FK)?          │
│ ipAddress                │
│ createdAt                │
└──────────────────────────┘
         ▲
         │
         │ Logs all activities for:
         ├─ Users
         ├─ Clients
         ├─ Leads
         ├─ Projects
         └─ All entities
```

## 🔑 Primary Keys & Unique Constraints

### Primary Keys (PK)
- All tables use `id` as CUID primary key
- Exception: `ProjectServices` uses composite PK `(projectId, serviceId)`

### Unique Constraints (*)
- `Users.email`
- `Clients.email`
- `Projects.slug`
- `Services.slug`
- `BlogPosts.slug`
- `Quotations.quotationNumber`

## 🔗 Relationships Explained

### One-to-Many Relationships

1. **User → Clients**
   - One user can create many clients
   - `Clients.createdById` → `Users.id`

2. **User → Projects**
   - One user can create many projects
   - `Projects.createdById` → `Users.id`

3. **Client → Projects**
   - One client can have many projects
   - `Projects.clientId` → `Clients.id`

4. **Client → Bookings**
   - One client can have many bookings
   - `Bookings.clientId` → `Clients.id` (optional)

5. **Client → Quotations**
   - One client can have many quotations
   - `Quotations.clientId` → `Clients.id`

6. **Project → ProjectImages**
   - One project can have many images
   - `ProjectImages.projectId` → `Projects.id`

7. **Client → ClientNotes**
   - One client can have many notes
   - `ClientNotes.clientId` → `Clients.id`

### Many-to-Many Relationships

1. **Projects ↔ Services**
   - Projects can have multiple services
   - Services can be used in multiple projects
   - Join table: `ProjectServices`

### One-to-One Relationships

1. **Project → Testimonial** (optional)
   - One project can have one testimonial
   - `Testimonials.projectId` → `Projects.id`
   - Nullable (testimonial can exist without project)

### Polymorphic Relationship

1. **ActivityLogs**
   - Can link to any entity type
   - Uses `entityType` + `entityId` pattern
   - Also has direct FK relationships for convenience

## 📋 Table Details

### Users
**Purpose**: Admin and staff authentication

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| email | String | Unique login email |
| password | String | Bcrypt hashed |
| name | String | Full name |
| role | Enum | ADMIN or STAFF |
| status | Enum | ACTIVE, INACTIVE, SUSPENDED |
| avatar | String? | Profile image URL |
| lastLoginAt | DateTime? | Last login timestamp |

**Indexes**:
- `email` (unique)
- `(role, status)`

---

### Clients
**Purpose**: Customer relationship management

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| name | String | Client name |
| email | String | Unique email |
| phone | String? | Contact number |
| company | String? | Company name |
| source | Enum | Where lead came from |
| status | Enum | NEW → CONTACTED → SIGNED |
| priority | Int | 1=High, 2=Medium, 3=Low |
| budget | Decimal? | Project budget |
| createdById | String | FK to Users |

**Indexes**:
- `email` (unique)
- `status`
- `source`
- `createdById`

---

### Projects
**Purpose**: Portfolio and project tracking

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| title | String | Project title |
| slug | String | URL-friendly unique slug |
| description | Text | Full description |
| type | Enum | WEB_DESIGN, WEB_DEVELOPMENT, etc. |
| status | Enum | PLANNING → IN_PROGRESS → COMPLETED |
| clientId | String | FK to Clients |
| budget | Decimal? | Project budget |
| published | Boolean | Show on public site |
| featured | Boolean | Feature on homepage |

**Indexes**:
- `slug` (unique)
- `clientId`
- `status`
- `(published, featured)`

---

### Services
**Purpose**: Service offerings

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| name | String | Service name |
| slug | String | Unique URL slug |
| description | Text | Full description |
| startingPrice | Decimal? | Base price |
| published | Boolean | Visible on site |
| featured | Boolean | Show prominently |
| order | Int | Display order |

**Indexes**:
- `slug` (unique)
- `(published, featured)`
- `order`

---

### Bookings
**Purpose**: Contact form submissions

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| name | String | Contact name |
| email | String | Contact email |
| type | Enum | CONSULTATION, PROJECT_INQUIRY, etc. |
| status | Enum | PENDING → REVIEWED → CONTACTED |
| message | Text | Inquiry message |
| clientId | String? | FK to Clients (if exists) |

**Indexes**:
- `email`
- `status`
- `clientId`

---

### Quotations
**Purpose**: Project quotations

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| quotationNumber | String | Unique (Q-2024-001) |
| clientId | String | FK to Clients |
| items | JSON | Line items array |
| total | Decimal | Total amount |
| status | Enum | DRAFT → SENT → ACCEPTED |
| validUntil | DateTime | Expiration date |

**Indexes**:
- `quotationNumber` (unique)
- `clientId`
- `status`
- `validUntil`

---

### ActivityLogs
**Purpose**: Audit trail for all actions

| Column | Type | Description |
|--------|------|-------------|
| id | CUID | Primary key |
| type | Enum | Activity type |
| description | String | Human-readable description |
| metadata | JSON | Additional context |
| entityType | String? | Entity type name |
| entityId | String? | Entity ID |
| userId | String | FK to Users (who did it) |
| clientId | String? | FK to Clients (optional) |

**Indexes**:
- `(type, createdAt)`
- `(entityType, entityId)`
- `userId`
- `createdAt`

## 🔄 Data Flow Examples

### Lead → Client → Project Flow
```
1. Lead created (Website form)
   └─> Lead table

2. Admin reviews lead
   └─> ActivityLog created

3. Admin converts Lead to Client
   └─> Client created
   └─> Lead.status = CONVERTED
   └─> Lead.convertedToClientId = Client.id
   └─> ActivityLog created

4. Quotation sent to Client
   └─> Quotation created
   └─> ActivityLog created

5. Client accepts quotation
   └─> Project created from Quotation
   └─> ActivityLog created
```

### Booking → Quotation → Project Flow
```
1. Booking submitted
   └─> Booking table

2. Admin reviews booking
   └─> Booking.status = REVIEWED
   └─> ActivityLog created

3. Admin creates quotation
   └─> Quotation created
   └─> Booking.convertedToQuotationId = Quotation.id
   └─> ActivityLog created

4. Client accepts quotation
   └─> Project created
   └─> Quotation.convertedToProjectId = Project.id
   └─> ActivityLog created
```

## 🎯 Query Optimization

### Indexes Strategy

1. **Foreign Keys**: All FKs are indexed
2. **Unique Fields**: email, slug fields
3. **Filter Fields**: status, source, published
4. **Search Fields**: name, email (for contains queries)
5. **Timestamp Fields**: createdAt (for date ranges)

### Example Queries

```sql
-- Find all active clients with pending projects
SELECT c.*, COUNT(p.id) as project_count
FROM clients c
LEFT JOIN projects p ON p.client_id = c.id AND p.status = 'IN_PROGRESS'
WHERE c.status = 'ACTIVE'
GROUP BY c.id;

-- Get project with all related data
SELECT p.*, c.name as client_name,
       array_agg(DISTINCT s.name) as services,
       array_agg(DISTINCT i.url) as images
FROM projects p
JOIN clients c ON c.id = p.client_id
LEFT JOIN project_services ps ON ps.project_id = p.id
LEFT JOIN services s ON s.id = ps.service_id
LEFT JOIN project_images i ON i.project_id = p.id
WHERE p.slug = 'project-slug'
GROUP BY p.id, c.name;
```

## 💾 Data Integrity

### Cascade Rules

- **ON DELETE CASCADE**: ProjectImages, ClientNotes, ProjectServices
- **ON DELETE SET NULL**: Testimonials.projectId, Bookings.clientId
- **ON DELETE RESTRICT**: Cannot delete Client if Projects exist

### Soft Deletes

Not implemented by default, but can be added with:
```prisma
deletedAt DateTime?
```

## 📊 Database Statistics

### Expected Table Sizes (estimates)

| Table | Growth Rate | Estimated Rows/Year |
|-------|-------------|---------------------|
| Clients | Medium | 100-500 |
| Leads | High | 500-2000 |
| Projects | Low | 50-200 |
| Bookings | High | 1000-5000 |
| ActivityLogs | Very High | 10,000-50,000 |
| BlogPosts | Low | 50-200 |

### Performance Considerations

- ActivityLogs will grow fastest → consider archiving old logs
- Implement pagination for all list queries
- Use database connection pooling
- Consider read replicas for scaling

---

This ERD represents a production-ready database design for a premium agency with comprehensive CRM capabilities.
