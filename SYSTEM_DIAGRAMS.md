# System Flow Diagrams

## 🔄 Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS                            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐             ┌────────▼────────┐
            │  PUBLIC SITE   │             │  ADMIN PANEL    │
            │                │             │                 │
            │  • Homepage    │             │  • Dashboard    │
            │  • Services    │             │  • Client CRM   │
            │  • Projects    │             │  • Projects     │
            │  • Blog        │             │  • Content      │
            │  • Contact     │             │  • Settings     │
            └───────┬────────┘             └────────┬────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │       NEXT.JS APP ROUTER       │
                    │                                │
                    │  • Server Components           │
                    │  • Server Actions              │
                    │  • API Routes                  │
                    │  • Middleware (Auth)           │
                    └───────────────┬────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │       SERVICE LAYER            │
                    │                                │
                    │  • AuthService                 │
                    │  • ClientService               │
                    │  • ProjectService              │
                    │  • BookingService              │
                    │  • ActivityLogService          │
                    │  • ... (10+ services)          │
                    └───────────────┬────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │       PRISMA ORM               │
                    │                                │
                    │  • Type-safe queries           │
                    │  • Migrations                  │
                    │  • Connection pooling          │
                    └───────────────┬────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │       POSTGRESQL               │
                    │                                │
                    │  • 14 tables                   │
                    │  • Relationships               │
                    │  • Indexes                     │
                    │  • Constraints                 │
                    └────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Navigate to /admin/login
     ▼
┌────────────────────┐
│  Login Page        │
│  (Unauthenticated) │
└────┬───────────────┘
     │
     │ 2. Submit credentials
     ▼
┌────────────────────────────┐
│  POST /api/auth/signin     │
│  NextAuth Handler          │
└────┬───────────────────────┘
     │
     │ 3. Validate credentials
     ▼
┌────────────────────────────┐
│  AuthService               │
│  • Find user by email      │
│  • Verify password (bcrypt)│
│  • Check user status       │
└────┬───────────────────────┘
     │
     │ 4. Create session
     ▼
┌────────────────────────────┐
│  NextAuth JWT              │
│  • Generate token          │
│  • Set HTTP-only cookie    │
└────┬───────────────────────┘
     │
     │ 5. Redirect to dashboard
     ▼
┌────────────────────────────┐
│  /admin (Protected)        │
│  • Check session           │
│  • Load user data          │
│  • Render dashboard        │
└────────────────────────────┘
```

---

## 📊 Lead to Project Conversion Flow

```
┌─────────────────┐
│  Public Website │
└────────┬────────┘
         │
         │ 1. User submits contact form
         ▼
┌─────────────────────────┐
│  POST /api/bookings     │
│  (Public endpoint)      │
└────────┬────────────────┘
         │
         │ 2. Create booking record
         ▼
┌─────────────────────────┐
│  Bookings Table         │
│  status: PENDING        │
└────────┬────────────────┘
         │
         │ 3. Admin reviews
         ▼
┌─────────────────────────┐
│  Admin: View booking    │
│  /admin/bookings/:id    │
└────────┬────────────────┘
         │
         │ 4. Update status
         ▼
┌─────────────────────────┐
│  PATCH /api/bookings/:id│
│  status: CONTACTED      │
└────────┬────────────────┘
         │
         │ 5. Create/link client
         ▼
┌─────────────────────────┐
│  POST /api/clients      │
│  • Create client record │
│  • Link to booking      │
└────────┬────────────────┘
         │
         │ 6. Create quotation
         ▼
┌─────────────────────────┐
│  POST /api/quotations   │
│  • Link to client       │
│  • Add line items       │
│  • Set pricing          │
└────────┬────────────────┘
         │
         │ 7. Client accepts
         ▼
┌─────────────────────────┐
│  PATCH /api/quotations  │
│  status: ACCEPTED       │
└────────┬────────────────┘
         │
         │ 8. Convert to project
         ▼
┌─────────────────────────┐
│  POST /api/projects     │
│  • Create project       │
│  • Link client          │
│  • Set status: PLANNING │
└────────┬────────────────┘
         │
         │ 9. Track in CRM
         ▼
┌─────────────────────────┐
│  ActivityLog            │
│  • Log all steps        │
│  • Track changes        │
│  • Audit trail          │
└─────────────────────────┘
```

---

## 🎨 Content Publishing Flow

```
┌──────────────┐
│  Admin User  │
└──────┬───────┘
       │
       │ 1. Create draft
       ▼
┌──────────────────────┐
│  POST /api/blog      │
│  status: DRAFT       │
└──────┬───────────────┘
       │
       │ 2. Upload images
       ▼
┌──────────────────────┐
│  POST /api/upload    │
│  → Cloudinary        │
└──────┬───────────────┘
       │
       │ 3. Return URL
       ▼
┌──────────────────────┐
│  Update blog post    │
│  featuredImage: URL  │
└──────┬───────────────┘
       │
       │ 4. Preview
       ▼
┌──────────────────────┐
│  GET /blog/:slug     │
│  (if authenticated)  │
└──────┬───────────────┘
       │
       │ 5. Publish
       ▼
┌──────────────────────┐
│  PATCH /api/blog/:id │
│  status: PUBLISHED   │
│  publishedAt: now    │
└──────┬───────────────┘
       │
       │ 6. Revalidate
       ▼
┌──────────────────────┐
│  Next.js ISR         │
│  Regenerate page     │
└──────┬───────────────┘
       │
       │ 7. Live on site
       ▼
┌──────────────────────┐
│  GET /blog/:slug     │
│  (Public)            │
└──────────────────────┘
```

---

## 📈 CRM Activity Tracking

```
Every action in the system triggers activity logging:

┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Service Method             │
│  (e.g., ClientService)      │
└────────┬────────────────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌──────────────────────┐
│  Execute Action │   │  Log Activity        │
│  (Create/Update)│   │  ActivityLogService  │
└────────┬────────┘   └──────────┬───────────┘
         │                       │
         │                       ▼
         │            ┌──────────────────────┐
         │            │  ActivityLog Table   │
         │            │  • type              │
         │            │  • description       │
         │            │  • userId            │
         │            │  • entityType/Id     │
         │            │  • metadata          │
         │            │  • createdAt         │
         │            └──────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Return Response    │
└─────────────────────┘

Examples:
• CLIENT_CREATED: "Client 'ABC Corp' was created"
• PROJECT_STATUS_CHANGED: "Project status changed from PLANNING to IN_PROGRESS"
• QUOTATION_SENT: "Quotation Q-2024-001 sent to client"
• LEAD_CONVERTED: "Lead 'John Doe' converted to client"
```

---

## 🔍 Database Query Flow

```
┌─────────────────┐
│  API Request    │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Service Method     │
│  (Business Logic)   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Prisma Query       │
│  • Type-safe        │
│  • Auto-complete    │
│  • Validation       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  SQL Generation     │
│  (by Prisma)        │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  PostgreSQL         │
│  • Execute query    │
│  • Use indexes      │
│  • Return results   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Prisma Result      │
│  • Type-safe object │
│  • Nested relations │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Service Processing │
│  • Transform data   │
│  • Business logic   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  API Response       │
│  (JSON)             │
└─────────────────────┘

Example: Get Client with Projects

prisma.client.findUnique({
  where: { id: clientId },
  include: {
    projects: {
      include: {
        services: true
      }
    },
    bookings: true,
    notes: true
  }
})

→ Single query with all relations
→ N+1 problem avoided
→ Efficient JOIN queries
```

---

## 🎯 Component Hierarchy

```
App
├── Providers (React Query, NextAuth)
│   │
│   ├── Public Site
│   │   ├── Layout
│   │   │   ├── Header
│   │   │   ├── Footer
│   │   │   └── Page Content
│   │   │
│   │   └── Pages
│   │       ├── Home
│   │       ├── Services
│   │       ├── Projects
│   │       ├── Blog
│   │       └── Contact
│   │
│   └── Admin Dashboard
│       ├── AdminLayout
│       │   ├── Sidebar
│       │   │   ├── Navigation
│       │   │   └── User Menu
│       │   │
│       │   └── Main Content
│       │       ├── Breadcrumbs
│       │       └── Page
│       │
│       └── Admin Pages
│           ├── Dashboard
│           │   ├── StatsCards
│           │   ├── Charts
│           │   └── RecentActivity
│           │
│           ├── Clients
│           │   ├── ClientList
│           │   ├── ClientForm
│           │   └── ClientDetail
│           │
│           ├── Projects
│           │   ├── ProjectList
│           │   ├── ProjectForm
│           │   └── ProjectGallery
│           │
│           └── ... (other admin pages)
│
└── UI Components (Shadcn)
    ├── Button
    ├── Input
    ├── Select
    ├── Dialog
    ├── Table
    └── ... (30+ components)
```

---

## 📊 State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                    React Query                          │
│                                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌──────────┐ │
│  │   Queries   │────▶│   Cache     │────▶│  UI      │ │
│  │             │     │             │     │          │ │
│  │ useClients  │     │ • Automatic │     │ • Auto   │ │
│  │ useProjects │     │ • Stale     │     │ • Update │ │
│  │ useBookings │     │ • Background│     │ • Loading│ │
│  └─────────────┘     │ • Refresh   │     │ • Error  │ │
│                      └─────────────┘     └──────────┘ │
│                                                         │
│  ┌─────────────┐     ┌─────────────┐                  │
│  │  Mutations  │────▶│  Invalidate │                  │
│  │             │     │   Queries   │                  │
│  │ createClient│     │             │                  │
│  │ updateProj. │     │ • Refetch   │                  │
│  │ deleteItem  │     │ • Fresh data│                  │
│  └─────────────┘     └─────────────┘                  │
└─────────────────────────────────────────────────────────┘

Server State (React Query) ← API calls → Server
Local State (useState) ← User interactions
Form State (React Hook Form) ← Form inputs
```

---

## 🚀 Deployment Pipeline

```
┌──────────────┐
│  Local Dev   │
└──────┬───────┘
       │
       │ git push
       ▼
┌──────────────┐
│   GitHub     │
└──────┬───────┘
       │
       │ webhook
       ▼
┌──────────────────┐
│   Vercel         │
│                  │
│  1. Install deps │
│  2. Build        │
│  3. Run tests    │
│  4. Deploy       │
└──────┬───────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌────────────┐    ┌─────────────┐
│   Static   │    │   Serverless│
│   Assets   │    │   Functions │
└────────────┘    └─────────────┘
       │                 │
       └────────┬────────┘
                │
                ▼
         ┌──────────────┐
         │  Production  │
         │  Environment │
         └──────────────┘
                │
                ├─────────────────┐
                │                 │
                ▼                 ▼
         ┌──────────┐      ┌──────────┐
         │ Supabase │      │Cloudinary│
         │ Database │      │  Media   │
         └──────────┘      └──────────┘
```

---

These diagrams provide a visual understanding of how the system works end-to-end!
