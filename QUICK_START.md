# 🚀 Quick Start Guide

This guide will help you get the Premium Agency Website up and running in under 30 minutes.

## ⚡ Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** 18 or higher ([Download](https://nodejs.org/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **PostgreSQL** database (local or cloud)
- ✅ **Cloudinary** account ([Sign up free](https://cloudinary.com/))

## 📦 Step 1: Install Dependencies

```bash
cd website-architecture
npm install
```

This will install all required dependencies (~5 minutes).

## 🔐 Step 2: Configure Environment Variables

1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Edit `.env` with your configuration:**

### Database Configuration

**Option A: Local PostgreSQL**
```env
DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/agency_db"
```

**Option B: Supabase (Recommended - Free tier)**
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Replace the password placeholder

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Option C: Neon (Free tier)**
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string

### NextAuth Configuration

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-command-below"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET`.

### Cloudinary Configuration

1. Go to https://cloudinary.com
2. Sign up for a free account
3. Go to Dashboard
4. Copy your credentials:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Email Configuration (Optional - can skip for now)

```env
EMAIL_FROM="noreply@youragency.com"
SENDGRID_API_KEY="optional-for-now"
```

## 🗄️ Step 3: Setup Database

### Push Schema to Database

```bash
npm run db:push
```

This creates all tables in your database.

### Seed Sample Data

```bash
npm run db:seed
```

This adds:
- 2 users (admin & staff)
- Sample clients
- Sample projects
- Sample blog posts
- Sample services
- And more!

**Login Credentials:**
- Admin: `admin@agency.com` / `Admin123!`
- Staff: `staff@agency.com` / `Staff123!`

## 🎉 Step 4: Run Development Server

```bash
npm run dev
```

The application will start at http://localhost:3000

## 🌐 Step 5: Access the Application

### Public Website
**Homepage:** http://localhost:3000

Explore:
- Services: http://localhost:3000/services
- Projects: http://localhost:3000/projects
- Contact: http://localhost:3000/contact

### Admin Dashboard
**Login:** http://localhost:3000/admin/login

Use credentials from seed:
- Email: `admin@agency.com`
- Password: `Admin123!`

After login, you'll see:
- Dashboard with statistics
- Client management
- Project management
- Content management
- And more!

## ✅ Step 6: Verify Everything Works

### Check Database
```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 to view your database.

### Check API Routes

Test the API (requires authentication):
```bash
# Public endpoint (no auth needed)
curl http://localhost:3000/api/projects

# Protected endpoint (requires login)
curl http://localhost:3000/api/clients
```

## 🎨 Step 7: Customize Your Site

### Update Site Information

Edit [src/app/layout.tsx](src/app/layout.tsx#L10-L20):
```typescript
export const metadata: Metadata = {
  title: 'Your Agency Name',
  description: 'Your agency description',
  // ... update other metadata
}
```

### Customize Colors

Edit [tailwind.config.ts](tailwind.config.ts):
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: 'hsl(222.2 47.4% 11.2%)', // Change this
        foreground: 'hsl(210 40% 98%)',
      },
      // ... other colors
    }
  }
}
```

### Add Your Logo

Replace files in `public/`:
- `logo.svg`
- `favicon.ico`
- `og-image.jpg`

## 📊 Database Management Commands

```bash
# View database in browser
npm run db:studio

# Create a migration
npm run db:migrate

# Push schema changes
npm run db:push

# Reset database (WARNING: deletes all data)
npm run db:reset

# Re-seed database
npm run db:seed
```

## 🐛 Common Issues & Solutions

### Issue: "Can't connect to database"

**Solution:**
1. Check DATABASE_URL in `.env`
2. Ensure PostgreSQL is running
3. Test connection:
```bash
psql "postgresql://user:pass@localhost:5432/agency_db"
```

### Issue: "NextAuth configuration error"

**Solution:**
1. Ensure NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your dev server
3. Clear cookies and try again

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
npm run dev
```

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
lsof -ti:3000 | xargs kill
```

## 🔍 Testing the CRM Features

### 1. Create a Client
1. Go to http://localhost:3000/admin/clients
2. Click "Add Client"
3. Fill in the form
4. Submit

### 2. Create a Project
1. Go to http://localhost:3000/admin/projects
2. Click "New Project"
3. Select a client
4. Add project details
5. Upload images
6. Save

### 3. Manage Bookings
1. Submit a booking at http://localhost:3000/contact
2. View it at http://localhost:3000/admin/bookings
3. Update status

### 4. Create Content
1. Go to http://localhost:3000/admin/blog
2. Create a blog post
3. Publish it
4. View at http://localhost:3000/blog

## 📱 Mobile Testing

Test on mobile devices:
1. Find your local IP:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

2. Access from mobile:
```
http://YOUR-IP:3000
```

3. Ensure your phone is on the same network

## 🚀 Next Steps

### Production Deployment

See [README.md](README.md#deployment) for full deployment guide.

**Quick Deploy to Vercel:**
1. Push code to GitHub
2. Import repository on Vercel
3. Add environment variables
4. Deploy!

### Add More Features

- **Email Notifications**: Set up SendGrid
- **Analytics**: Add Google Analytics
- **Payment Processing**: Integrate Stripe
- **Live Chat**: Add Intercom or similar

### Customize Further

- Add more services
- Customize email templates
- Add custom fields to models
- Create custom reports

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DATABASE_ERD.md](DATABASE_ERD.md) - Database design
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) - Project structure

## 🆘 Getting Help

1. **Check Documentation**: Review the docs above
2. **Database Issues**: Run `npm run db:studio` to inspect data
3. **API Issues**: Check browser console and network tab
4. **Build Issues**: Delete `.next` folder and rebuild

## 🎯 Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Schema pushed/migrated
- [ ] Database seeded
- [ ] Dev server running
- [ ] Can access public website
- [ ] Can login to admin
- [ ] Can create a client
- [ ] Can create a project
- [ ] Cloudinary images working

## 🎊 You're Ready!

Congratulations! Your premium agency website is now running locally. Start customizing it to match your brand and needs.

**Pro Tips:**
- Use Prisma Studio (`npm run db:studio`) to explore your database
- Check the Activity Log in admin to see all actions
- Export data as CSV from various admin pages
- Use the provided seed data as examples

---

**Need more help?** Check the main [README.md](README.md) for detailed information.

**Happy building! 🚀**
