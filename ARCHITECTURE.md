# Premium Agency Website - System Architecture

## 🏗️ System Overview

This is a full-stack Next.js application with a comprehensive CRM system, designed for a premium international agency. The system manages client relationships, projects, content, bookings, and quotations with enterprise-grade scalability.

## 🎯 Core Technologies

### Frontend Stack
- **Next.js 14+** (App Router with Server Components)
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Premium UI components
- **React Hook Form** + Zod - Form validation
- **TanStack Query** - Server state management
- **Framer Motion** - Animations

### Backend Stack
- **Next.js API Routes** (Server Actions + Route Handlers)
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **Zod** - Runtime validation
- **Cloudinary** - Media management

### DevOps & Tools
- **Vercel** - Hosting & CI/CD
- **Supabase/Neon** - Managed PostgreSQL
- **TypeScript** - End-to-end type safety
- **ESLint + Prettier** - Code quality
- **Jest + React Testing Library** - Testing

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Public Website        │        Admin Dashboard (CRM)           │
│  - Home                │        - Client Management             │
│  - Services            │        - Lead Pipeline                 │
│  - Projects/Portfolio  │        - Project Tracking              │
│  - Blog                │        - Content Management            │
│  - Contact/Booking     │        - Booking/Quotation Manager     │
│  - Testimonials        │        - Analytics & Reports           │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router                                             │
│  ┌──────────────────────┐    ┌───────────────────────────┐    │
│  │  Server Components   │    │   Server Actions          │    │
│  │  - SSR/ISR Pages     │    │   - Form Handlers         │    │
│  │  - SEO Optimization  │    │   - CRUD Operations        │    │
│  └──────────────────────┘    └───────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────┐    ┌───────────────────────────┐    │
│  │  API Routes          │    │   Middleware              │    │
│  │  - RESTful Endpoints │    │   - Authentication        │    │
│  │  - Public API        │    │   - Authorization         │    │
│  └──────────────────────┘    └───────────────────────────┘    │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic Services:                                       │
│  - AuthService          - ProjectService                        │
│  - ClientService        - ContentService                        │
│  - LeadService          - BookingService                        │
│  - QuotationService     - ActivityLogService                    │
│  - EmailService         - AnalyticsService                      │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Prisma Client                                                  │
│  - Type-safe queries                                            │
│  - Migrations                                                   │
│  - Connection pooling                                           │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                            │
│  - Relational data                                              │
│  - ACID compliance                                              │
│  - Full-text search                                             │
│  - Indexes & constraints                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  - Cloudinary (Media Storage)                                   │
│  - SendGrid/Resend (Email)                                      │
│  - Stripe (Payments - optional)                                 │
│  - Google Analytics                                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Design Philosophy

### Key Principles:
1. **Normalization** - Minimize data redundancy
2. **Referential Integrity** - Foreign keys with cascade rules
3. **Audit Trail** - CreatedAt, UpdatedAt on all tables
4. **Soft Deletes** - Preserve data history where needed
5. **Indexing** - Optimize frequent queries
6. **Type Safety** - Leverage Prisma's type generation

### Entity Relationships:

```
Users (Admin/Staff)
  ↓ (created_by)
  ├─→ Clients
  ├─→ Leads
  ├─→ Projects
  ├─→ BlogPosts
  ├─→ ActivityLogs

Clients
  ├─→ Projects (one-to-many)
  ├─→ Bookings (one-to-many)
  ├─→ Quotations (one-to-many)
  └─→ ActivityLogs (polymorphic)

Projects
  ├─→ ProjectImages (one-to-many)
  ├─→ Services (many-to-many via ProjectServices)
  └─→ Testimonials (optional one-to-one)

Services
  └─→ Projects (many-to-many)

Leads
  └─→ can convert to → Client

Bookings
  └─→ can convert to → Quotation → Project

ActivityLogs
  └─→ tracks all entity changes (polymorphic)
```

## 🔐 Security Architecture

### Authentication
- NextAuth.js with credential provider
- Secure password hashing (bcrypt)
- Session management with JWT
- HTTP-only cookies

### Authorization
- Role-based access control (RBAC)
  - **ADMIN**: Full system access
  - **STAFF**: Limited CRM access
  - **PUBLIC**: Website viewing only

### API Security
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention (Prisma)
- XSS protection

## 🎨 Frontend Architecture

### Page Structure
```
/                       → Home (public)
/services               → Services listing (public)
/services/[slug]        → Service detail (public)
/projects               → Portfolio (public)
/projects/[slug]        → Project detail (public)
/blog                   → Blog listing (public)
/blog/[slug]            → Blog post (public)
/about                  → About/Team (public)
/contact                → Contact/Booking form (public)
/testimonials           → Client testimonials (public)

/admin                  → Dashboard (protected)
/admin/clients          → Client CRM (protected)
/admin/leads            → Lead management (protected)
/admin/projects         → Project management (protected)
/admin/services         → Service management (protected)
/admin/blog             → Blog management (protected)
/admin/testimonials     → Testimonial management (protected)
/admin/bookings         → Booking management (protected)
/admin/quotations       → Quotation management (protected)
/admin/media            → Media library (protected)
/admin/settings         → System settings (protected)

/api/auth/[...nextauth] → Authentication
/api/upload             → File upload
/api/export             → Data export
```

### Component Architecture
```
components/
├── ui/                 → Base components (buttons, inputs, etc.)
├── layout/             → Layout components (header, footer, sidebar)
├── features/           → Feature-specific components
│   ├── clients/
│   ├── projects/
│   ├── bookings/
│   └── ...
└── shared/             → Shared business components
```

## 📈 Scalability Considerations

1. **Database Optimization**
   - Proper indexing on foreign keys & search fields
   - Connection pooling
   - Query optimization with Prisma

2. **Caching Strategy**
   - Next.js ISR for public pages
   - React Query for client-side caching
   - Redis for session storage (future)

3. **Image Optimization**
   - Cloudinary transformations
   - Next.js Image component
   - WebP format with fallbacks

4. **Code Splitting**
   - Dynamic imports for admin dashboard
   - Route-based code splitting
   - Component lazy loading

5. **Performance Monitoring**
   - Lighthouse CI integration
   - Web Vitals tracking
   - Error monitoring (Sentry)

## 🔄 Data Flow Examples

### Lead → Client → Project Flow
```
1. Lead submits contact/booking form
   ↓
2. Creates Lead record in database
   ↓
3. Admin reviews in CRM, updates status
   ↓
4. Admin converts Lead → Client
   ↓
5. Client record created, Lead archived
   ↓
6. Quotation generated for Client
   ↓
7. Client accepts quotation
   ↓
8. Project created from Quotation
   ↓
9. Project tracking & updates
   ↓
10. Project completed, testimonial requested
```

### Content Publishing Flow
```
1. Admin creates blog post/project
   ↓
2. Uploads images to Cloudinary
   ↓
3. Saves draft in database
   ↓
4. Previews content
   ↓
5. Publishes (sets status to PUBLISHED)
   ↓
6. Content appears on public site
   ↓
7. Next.js revalidates page (ISR)
   ↓
8. SEO metadata generated
```

## 🎯 Key Features

### CRM Capabilities
- ✅ Lead capture & tracking
- ✅ Client management with history
- ✅ Pipeline visualization (Kanban)
- ✅ Activity logging
- ✅ Status tracking (New → Contacted → Quoted → Signed/Lost)
- ✅ Notes & communication history
- ✅ Data export (CSV)

### Content Management
- ✅ Full CRUD for all content types
- ✅ Image upload & optimization
- ✅ Draft/Published workflow
- ✅ SEO metadata management
- ✅ Media library with search

### Booking & Quotation
- ✅ Public booking form
- ✅ Quotation generation
- ✅ Status tracking
- ✅ Conversion to projects
- ✅ Email notifications

## 🚀 Performance Targets

- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 200KB (initial)
- **SEO Score**: 100/100

## 📝 Code Quality Standards

- **TypeScript Strict Mode**: Enabled
- **ESLint**: Airbnb config with custom rules
- **Prettier**: Consistent formatting
- **Naming Conventions**: 
  - PascalCase for components
  - camelCase for functions/variables
  - UPPER_SNAKE_CASE for constants
- **Comments**: JSDoc for functions
- **Testing**: Unit tests for services, integration tests for API routes

---

This architecture is designed to scale from MVP to enterprise-level usage while maintaining code quality and developer experience.
