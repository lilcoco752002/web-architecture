# Premium Agency Website - Complete Implementation

## 🎉 Overview

This is a **production-ready**, premium agency website with a complete CRM system, built with:
- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** + **PostgreSQL**
- **NextAuth.js**
- **Tailwind CSS**
- **Shadcn/ui**

## 📋 Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Admin Dashboard](#admin-dashboard)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Environment Variables](#environment-variables)

## ✨ Features

### Public Website
- ✅ Modern, responsive homepage
- ✅ Services showcase
- ✅ Project portfolio
- ✅ Blog/News section
- ✅ Contact/Booking form
- ✅ Testimonials
- ✅ Team page
- ✅ SEO optimized
- ✅ Open Graph tags

### CRM System
- ✅ Client management
- ✅ Lead tracking
- ✅ Project management
- ✅ Booking management
- ✅ Quotation system
- ✅ Activity logging
- ✅ Status tracking
- ✅ Data export (CSV)

### Content Management
- ✅ Blog post management
- ✅ Project showcase
- ✅ Service management
- ✅ Testimonial management
- ✅ Team member management
- ✅ Media library (Cloudinary)

### Authentication & Security
- ✅ Secure authentication (NextAuth.js)
- ✅ Role-based access (Admin/Staff)
- ✅ Protected API routes
- ✅ Password hashing
- ✅ Session management

## 📁 Project Structure

```
website-architecture/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── clients/
│   │   │   ├── projects/
│   │   │   ├── bookings/
│   │   │   └── ...
│   │   ├── admin/             # Admin dashboard
│   │   ├── projects/          # Public project pages
│   │   ├── blog/              # Blog pages
│   │   ├── contact/           # Contact page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature components
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Auth configuration
│   │   ├── utils.ts           # Utility functions
│   │   ├── validations.ts     # Zod schemas
│   │   └── helpers.ts         # Helper functions
│   └── services/              # Business logic
│       ├── auth.service.ts
│       ├── client.service.ts
│       ├── project.service.ts
│       ├── booking.service.ts
│       └── activity-log.service.ts
├── .env.example               # Environment variables template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
└── next.config.js             # Next.js config
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **PostgreSQL** database (local or cloud)
- **Cloudinary** account (for media storage)

### 1. Clone and Install

```bash
cd website-architecture
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agency_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (optional for now)
EMAIL_FROM="noreply@youragency.com"
SENDGRID_API_KEY="your-sendgrid-api-key"
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin login**: http://localhost:3000/admin/login

**Login credentials** (from seed):
- Admin: `admin@agency.com` / `Admin123!`
- Staff: `staff@agency.com` / `Staff123!`

## 🗄️ Database Setup

### Using Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb agency_db

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://yourusername@localhost:5432/agency_db"
```

### Using Cloud Database (Recommended)

**Option 1: Supabase (Free tier available)**
1. Create account at https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Update `DATABASE_URL` in `.env`

**Option 2: Neon (Free tier available)**
1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in `.env`

## 🎨 Admin Dashboard

The admin dashboard is located at `/admin` and includes:

### Dashboard Home
- Overview statistics
- Recent activities
- Quick actions

### Client Management (`/admin/clients`)
- List all clients
- Add/edit clients
- View client history
- Client notes
- Filter by status/source

### Lead Management (`/admin/leads`)
- Lead pipeline (Kanban view)
- Convert leads to clients
- Status tracking
- Lead scoring

### Project Management (`/admin/projects`)
- All projects
- Project details
- Status tracking
- Image gallery
- Service associations

### Bookings (`/admin/bookings`)
- New booking requests
- Update status
- Contact information
- Convert to quotation

### Quotations (`/admin/quotations`)
- Create quotations
- Send to clients
- Track status
- Convert to projects

### Content Management
- Blog posts (`/admin/blog`)
- Services (`/admin/services`)
- Testimonials (`/admin/testimonials`)
- Team members (`/admin/team`)

### Media Library (`/admin/media`)
- Upload images/files
- Cloudinary integration
- Organize media

## 📡 API Documentation

### Authentication
```
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
```

### Clients (Protected)
```
GET    /api/clients              # List clients
POST   /api/clients              # Create client
GET    /api/clients/:id          # Get client
PATCH  /api/clients/:id          # Update client
DELETE /api/clients/:id          # Delete client
POST   /api/clients/:id/notes    # Add note
GET    /api/clients/stats        # Statistics
```

### Projects (Public + Protected)
```
GET    /api/projects             # List projects
POST   /api/projects             # Create project (protected)
GET    /api/projects/:slug       # Get project (public)
PATCH  /api/projects/:id         # Update project (protected)
DELETE /api/projects/:id         # Delete project (protected)
```

### Bookings
```
POST   /api/bookings             # Create booking (public)
GET    /api/bookings             # List bookings (protected)
PATCH  /api/bookings/:id         # Update booking (protected)
```

### Export
```
GET    /api/export/clients       # Export clients CSV
GET    /api/export/projects      # Export projects CSV
GET    /api/export/bookings      # Export bookings CSV
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your repository
   - Configure environment variables
   - Deploy!

3. **Environment Variables on Vercel**
   - Add all variables from `.env`
   - Use production database URL
   - Set `NEXTAUTH_URL` to your domain

### Database Migration on Production

```bash
# After deployment, run migrations
npx prisma migrate deploy

# Optionally seed production database
npx prisma db seed
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | App URL | ✅ |
| `NEXTAUTH_SECRET` | Secret for sessions | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `SENDGRID_API_KEY` | Email service key | ❌ |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | ❌ |

## 🧪 Testing

```bash
# Run type check
npm run type-check

# Run linter
npm run lint

# Run tests (when configured)
npm test
```

## 📝 Database Backup

```bash
# Backup database
pg_dump -U username agency_db > backup.sql

# Restore database
psql -U username agency_db < backup.sql
```

## 🎯 Performance Optimization

- ✅ Image optimization (Next.js Image + Cloudinary)
- ✅ Code splitting
- ✅ Server components
- ✅ ISR for public pages
- ✅ Database indexing
- ✅ React Query caching

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Check database logs: `npm run db:studio`

## 📄 License

This project is proprietary software for Premium Agency.

---

**Built with ❤️ for premium agencies worldwide**
