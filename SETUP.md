# Quick Setup Guide

## ✅ Completed Steps

1. ✅ Backend dependencies installed
2. ✅ Frontend dependencies installed  
3. ✅ Environment files created (.env)

## 🔧 Next Steps - Configure Environment Variables

### Backend Environment (`server/.env`)

You need to configure these variables:

**Required for Local Development:**

```env
# Database - Choose one option:

# Option 1: Use Docker PostgreSQL (Recommended for local dev)
DATABASE_URL=postgresql://portal_user:portal_pass@localhost:5432/community_portal

# Option 2: Use Neon Postgres (Cloud)
# DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars

# Email Configuration (Choose your provider)
# Gmail Example:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=Community Portal <noreply@communityportal.com>

# URLs (keep these for local dev)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

### Frontend Environment (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Database Setup Options

### Option A: Docker PostgreSQL (Easiest for local dev)

```bash
cd server
docker-compose up -d postgres
```

This will start PostgreSQL on port 5432 with credentials:
- User: portal_user
- Password: portal_pass
- Database: community_portal

### Option B: Neon Postgres (Cloud)

1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Paste into DATABASE_URL in server/.env

## 📧 Email Setup

### Gmail (Recommended for testing):

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an "App Password" for Mail
4. Use this password in SMTP_PASS (not your regular password)

### Alternative: Use Ethereal Email (Testing only)

Visit https://ethereal.email/ to get free test SMTP credentials.

## 🚀 Running the Application

After configuring environment variables:

**Terminal 1 - Start Backend:**
```bash
cd server

# If using Docker PostgreSQL, start it first:
docker-compose up -d postgres

# Run migrations and seed data:
npm run build
npm run migrate
npm run seed

# Start backend server:
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

Access the app at: http://localhost:5173

## 🧪 Test Credentials

After seeding:
- **Admin:** admin@portal.com / Admin@123
- **Mentor:** mentor@portal.com / Mentor@123
- **Student (pending):** student1@portal.com / Student@123
- **Student (active):** student2@portal.com / Student@123

## ⚠️ Important Notes

1. **JWT_SECRET**: Generate a secure random string (min 32 characters)
2. **Email**: Without valid SMTP, email verification won't work
3. **Database**: Must be running before starting the backend
4. **Migrations**: Must run migrations before seeding

## 🆘 Troubleshooting

**"Connection refused" error:**
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct

**Email not sending:**
- Verify SMTP credentials
- For Gmail, use App Password, not regular password
- Check spam folder

**"Module not found" errors:**
- Run `npm install` again in the affected directory

## 📝 What to Configure Now

Please update these files with your credentials:

1. **`server/.env`** - Add your database URL and email credentials
2. **`client/.env`** - Already configured for local dev

Let me know when you've added the environment variables and I'll help you start the servers!
