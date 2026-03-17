# Complete Folder Structure

```
website-architecture/
│
├── 📄 .env.example                    # Environment variables template
├── 📄 .gitignore                      # Git ignore rules
├── 📄 .eslintrc.json                  # ESLint configuration
├── 📄 package.json                    # Dependencies & scripts
├── 📄 tsconfig.json                   # TypeScript configuration
├── 📄 next.config.js                  # Next.js configuration
├── 📄 tailwind.config.ts              # Tailwind CSS config
├── 📄 postcss.config.js               # PostCSS config
├── 📄 README.md                       # Setup & documentation
├── 📄 ARCHITECTURE.md                 # System architecture
├── 📄 DATABASE_ERD.md                 # Database ERD documentation
├── 📄 API_DOCUMENTATION.md            # API routes documentation
│
├── 📁 prisma/
│   ├── schema.prisma                  # ⭐ Prisma database schema
│   └── seed.ts                        # ⭐ Database seed script
│
├── 📁 public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.jpg                   # Open Graph image
│   └── images/
│       ├── hero-bg.jpg
│       └── ...
│
└── 📁 src/
    │
    ├── 📁 app/                        # Next.js App Router
    │   │
    │   ├── layout.tsx                 # ⭐ Root layout
    │   ├── page.tsx                   # ⭐ Homepage
    │   ├── globals.css                # ⭐ Global styles
    │   │
    │   ├── 📁 api/                    # ⭐ API Routes
    │   │   ├── 📁 auth/
    │   │   │   └── 📁 [...nextauth]/
    │   │   │       └── route.ts       # NextAuth handler
    │   │   │
    │   │   ├── 📁 clients/
    │   │   │   ├── route.ts           # ⭐ GET, POST /api/clients
    │   │   │   ├── 📁 [id]/
    │   │   │   │   └── route.ts       # ⭐ GET, PATCH, DELETE
    │   │   │   ├── 📁 stats/
    │   │   │   │   └── route.ts       # GET /api/clients/stats
    │   │   │   └── 📁 [id]/
    │   │   │       └── 📁 notes/
    │   │   │           └── route.ts   # POST notes
    │   │   │
    │   │   ├── 📁 leads/
    │   │   │   ├── route.ts           # GET, POST /api/leads
    │   │   │   └── 📁 [id]/
    │   │   │       ├── route.ts       # GET, PATCH, DELETE
    │   │   │       └── 📁 convert/
    │   │   │           └── route.ts   # POST convert to client
    │   │   │
    │   │   ├── 📁 projects/
    │   │   │   ├── route.ts           # ⭐ GET, POST /api/projects
    │   │   │   ├── 📁 [slug]/
    │   │   │   │   └── route.ts       # ⭐ GET by slug (public)
    │   │   │   ├── 📁 [id]/
    │   │   │   │   ├── route.ts       # PATCH, DELETE
    │   │   │   │   └── 📁 images/
    │   │   │   │       └── route.ts   # POST add images
    │   │   │   └── 📁 featured/
    │   │   │       └── route.ts       # GET featured
    │   │   │
    │   │   ├── 📁 services/
    │   │   │   ├── route.ts           # GET, POST
    │   │   │   └── 📁 [slug]/
    │   │   │       └── route.ts       # GET by slug
    │   │   │
    │   │   ├── 📁 bookings/
    │   │   │   ├── route.ts           # ⭐ GET, POST
    │   │   │   └── 📁 [id]/
    │   │   │       └── route.ts       # PATCH
    │   │   │
    │   │   ├── 📁 quotations/
    │   │   │   ├── route.ts           # GET, POST
    │   │   │   └── 📁 [id]/
    │   │   │       ├── route.ts       # PATCH
    │   │   │       └── 📁 convert/
    │   │   │           └── route.ts   # POST convert to project
    │   │   │
    │   │   ├── 📁 blog/
    │   │   │   ├── route.ts           # GET, POST
    │   │   │   └── 📁 [slug]/
    │   │   │       └── route.ts       # GET by slug
    │   │   │
    │   │   ├── 📁 testimonials/
    │   │   │   └── route.ts           # GET, POST
    │   │   │
    │   │   ├── 📁 team/
    │   │   │   └── route.ts           # GET, POST
    │   │   │
    │   │   ├── 📁 upload/
    │   │   │   └── route.ts           # POST file upload
    │   │   │
    │   │   ├── 📁 export/
    │   │   │   ├── 📁 clients/
    │   │   │   │   └── route.ts       # GET CSV
    │   │   │   ├── 📁 projects/
    │   │   │   │   └── route.ts
    │   │   │   └── 📁 bookings/
    │   │   │       └── route.ts
    │   │   │
    │   │   ├── 📁 analytics/
    │   │   │   └── 📁 dashboard/
    │   │   │       └── route.ts       # Dashboard stats
    │   │   │
    │   │   └── 📁 activity/
    │   │       └── route.ts           # Activity logs
    │   │
    │   ├── 📁 (public)/               # Public pages group
    │   │   ├── layout.tsx             # Public layout with header/footer
    │   │   │
    │   │   ├── 📁 services/
    │   │   │   ├── page.tsx           # Services listing
    │   │   │   └── 📁 [slug]/
    │   │   │       └── page.tsx       # Service detail
    │   │   │
    │   │   ├── 📁 projects/
    │   │   │   ├── page.tsx           # Portfolio listing
    │   │   │   └── 📁 [slug]/
    │   │   │       └── page.tsx       # Project detail
    │   │   │
    │   │   ├── 📁 blog/
    │   │   │   ├── page.tsx           # Blog listing
    │   │   │   └── 📁 [slug]/
    │   │   │       └── page.tsx       # Blog post
    │   │   │
    │   │   ├── 📁 about/
    │   │   │   └── page.tsx           # About/Team page
    │   │   │
    │   │   ├── 📁 contact/
    │   │   │   └── page.tsx           # Contact/Booking form
    │   │   │
    │   │   └── 📁 testimonials/
    │   │       └── page.tsx           # Testimonials page
    │   │
    │   └── 📁 admin/                  # ⭐ Admin Dashboard
    │       ├── layout.tsx             # Admin layout with sidebar
    │       ├── page.tsx               # Dashboard home
    │       │
    │       ├── 📁 login/
    │       │   └── page.tsx           # Login page
    │       │
    │       ├── 📁 clients/
    │       │   ├── page.tsx           # Client list
    │       │   ├── 📁 new/
    │       │   │   └── page.tsx       # Create client
    │       │   └── 📁 [id]/
    │       │       ├── page.tsx       # Client detail
    │       │       └── 📁 edit/
    │       │           └── page.tsx   # Edit client
    │       │
    │       ├── 📁 leads/
    │       │   ├── page.tsx           # Lead pipeline (Kanban)
    │       │   └── 📁 [id]/
    │       │       └── page.tsx       # Lead detail
    │       │
    │       ├── 📁 projects/
    │       │   ├── page.tsx           # Project list
    │       │   ├── 📁 new/
    │       │   │   └── page.tsx       # Create project
    │       │   └── 📁 [id]/
    │       │       ├── page.tsx       # Project detail
    │       │       └── 📁 edit/
    │       │           └── page.tsx
    │       │
    │       ├── 📁 services/
    │       │   ├── page.tsx           # Service management
    │       │   └── 📁 [id]/
    │       │       └── page.tsx
    │       │
    │       ├── 📁 blog/
    │       │   ├── page.tsx           # Blog post list
    │       │   ├── 📁 new/
    │       │   │   └── page.tsx       # Create post
    │       │   └── 📁 [id]/
    │       │       └── 📁 edit/
    │       │           └── page.tsx
    │       │
    │       ├── 📁 testimonials/
    │       │   └── page.tsx           # Testimonial management
    │       │
    │       ├── 📁 bookings/
    │       │   ├── page.tsx           # Booking list
    │       │   └── 📁 [id]/
    │       │       └── page.tsx       # Booking detail
    │       │
    │       ├── 📁 quotations/
    │       │   ├── page.tsx           # Quotation list
    │       │   ├── 📁 new/
    │       │   │   └── page.tsx       # Create quotation
    │       │   └── 📁 [id]/
    │       │       └── page.tsx       # Quotation detail
    │       │
    │       ├── 📁 media/
    │       │   └── page.tsx           # Media library
    │       │
    │       ├── 📁 team/
    │       │   └── page.tsx           # Team management
    │       │
    │       ├── 📁 activity/
    │       │   └── page.tsx           # Activity logs
    │       │
    │       └── 📁 settings/
    │           └── page.tsx           # System settings
    │
    ├── 📁 components/                 # ⭐ React Components
    │   │
    │   ├── providers.tsx              # ⭐ React Query & Auth providers
    │   │
    │   ├── 📁 ui/                     # Base UI components (Shadcn)
    │   │   ├── button.tsx             # ⭐ Button component
    │   │   ├── input.tsx
    │   │   ├── select.tsx
    │   │   ├── textarea.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── label.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── toast.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx
    │   │   ├── avatar.tsx
    │   │   └── ...
    │   │
    │   ├── 📁 layout/                 # Layout components
    │   │   ├── header.tsx             # Public header
    │   │   ├── footer.tsx             # Public footer
    │   │   ├── sidebar.tsx            # Admin sidebar
    │   │   ├── mobile-nav.tsx
    │   │   └── breadcrumbs.tsx
    │   │
    │   ├── 📁 features/               # Feature-specific components
    │   │   │
    │   │   ├── 📁 clients/
    │   │   │   ├── client-list.tsx
    │   │   │   ├── client-form.tsx
    │   │   │   ├── client-card.tsx
    │   │   │   ├── client-stats.tsx
    │   │   │   └── client-notes.tsx
    │   │   │
    │   │   ├── 📁 projects/
    │   │   │   ├── project-list.tsx
    │   │   │   ├── project-form.tsx
    │   │   │   ├── project-card.tsx
    │   │   │   ├── project-gallery.tsx
    │   │   │   └── project-status.tsx
    │   │   │
    │   │   ├── 📁 leads/
    │   │   │   ├── lead-kanban.tsx    # Kanban board
    │   │   │   ├── lead-card.tsx
    │   │   │   └── lead-form.tsx
    │   │   │
    │   │   ├── 📁 bookings/
    │   │   │   ├── booking-list.tsx
    │   │   │   ├── booking-form.tsx
    │   │   │   └── booking-detail.tsx
    │   │   │
    │   │   ├── 📁 quotations/
    │   │   │   ├── quotation-list.tsx
    │   │   │   ├── quotation-form.tsx
    │   │   │   └── quotation-preview.tsx
    │   │   │
    │   │   └── 📁 dashboard/
    │   │       ├── stats-card.tsx
    │   │       ├── recent-activity.tsx
    │   │       ├── quick-actions.tsx
    │   │       └── charts.tsx
    │   │
    │   └── 📁 shared/                 # Shared business components
    │       ├── data-table.tsx         # Reusable table
    │       ├── status-badge.tsx
    │       ├── priority-badge.tsx
    │       ├── search-input.tsx
    │       ├── filters.tsx
    │       ├── pagination.tsx
    │       ├── loading-spinner.tsx
    │       ├── empty-state.tsx
    │       └── error-boundary.tsx
    │
    ├── 📁 lib/                        # ⭐ Utilities & Configuration
    │   ├── prisma.ts                  # ⭐ Prisma client singleton
    │   ├── auth.ts                    # ⭐ NextAuth configuration
    │   ├── utils.ts                   # ⭐ General utilities
    │   ├── helpers.ts                 # ⭐ Helper functions
    │   ├── validations.ts             # ⭐ Zod validation schemas
    │   ├── cloudinary.ts              # Cloudinary config
    │   ├── email.ts                   # Email utilities
    │   └── constants.ts               # App constants
    │
    ├── 📁 services/                   # ⭐ Business Logic Services
    │   ├── auth.service.ts            # ⭐ Authentication service
    │   ├── client.service.ts          # ⭐ Client operations
    │   ├── lead.service.ts            # Lead operations
    │   ├── project.service.ts         # ⭐ Project operations
    │   ├── service.service.ts         # Services CRUD
    │   ├── booking.service.ts         # ⭐ Booking operations
    │   ├── quotation.service.ts       # Quotation operations
    │   ├── blog.service.ts            # Blog operations
    │   ├── testimonial.service.ts     # Testimonial operations
    │   ├── team.service.ts            # Team operations
    │   ├── activity-log.service.ts    # ⭐ Activity logging
    │   ├── upload.service.ts          # File upload
    │   └── analytics.service.ts       # Analytics & stats
    │
    ├── 📁 hooks/                      # Custom React Hooks
    │   ├── use-clients.ts             # Client queries
    │   ├── use-projects.ts            # Project queries
    │   ├── use-bookings.ts            # Booking queries
    │   ├── use-toast.ts               # Toast notifications
    │   ├── use-debounce.ts            # Debounce hook
    │   └── use-media-query.ts         # Responsive hook
    │
    ├── 📁 types/                      # TypeScript Types
    │   ├── index.ts                   # Common types
    │   ├── api.ts                     # API response types
    │   └── database.ts                # Database types
    │
    └── 📁 middleware.ts               # Next.js middleware (auth)
```

## 📊 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| **API Routes** | ~30 | RESTful endpoints |
| **Pages** | ~40 | Public + Admin pages |
| **Components** | ~60 | UI + Feature components |
| **Services** | ~15 | Business logic layers |
| **Config Files** | ~10 | Setup & configuration |
| **Documentation** | ~5 | README, ARCHITECTURE, etc. |

## 🎯 Key Files (⭐)

Files marked with ⭐ are the most important and have been fully implemented in this architecture.

## 📝 Notes

### Route Groups
- `(public)`: Public-facing pages with shared layout
- `admin`: Protected admin area with separate layout

### API Organization
- RESTful conventions
- Resource-based routing
- Nested routes for relationships

### Component Structure
- `ui/`: Reusable base components (Shadcn/ui)
- `layout/`: Layout-specific components
- `features/`: Feature-specific components
- `shared/`: Shared business components

### Service Layer
- Single responsibility
- Database operations
- Business logic
- Activity logging

## 🚀 Extension Points

Easy to add:
- `/admin/analytics` - Advanced analytics
- `/admin/reports` - Custom reports
- `/admin/integrations` - Third-party integrations
- `/api/webhooks` - Webhook handlers
- `/api/public` - Public API for external use

## 📦 Build Output

Production build creates:
```
.next/
├── static/               # Static assets
├── server/               # Server components
└── standalone/           # Standalone deployment
```

## 🔐 Security Layers

1. **Middleware**: Auth checking
2. **API Routes**: Session validation
3. **Services**: Permission checks
4. **Database**: Row-level constraints

---

This structure supports scalability from MVP to enterprise-level usage.
