# Community Portal - V0

A full-stack community management platform with role-based access control, announcement system, and mentor-student messaging.

## 🚀 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- Axios
- React Router DOM

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt
- Nodemailer
- Rate Limiting

**Deployment:**
- Frontend: Vercel
- Backend: Hostinger VPS (Docker)
- Database: Neon Postgres

## 📁 Project Structure

```
community-portal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand stores
│   │   ├── main.tsx       # App entry point
│   │   └── index.css      # Global styles
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── db/            # Database migrations & seeds
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
└── README.md
```

## 🔧 Local Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL (or use Docker)
- SMTP email service (Gmail, SendGrid, etc.)

### 1. Clone and Install

```bash
cd community-portal

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

**Backend (.env in server/):**

```env
PORT=5000
NODE_ENV=development

# Database (use local PostgreSQL or Neon)
DATABASE_URL=postgresql://user:password@localhost:5432/community_portal

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# SMTP Configuration (example with Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Community Portal <noreply@communityportal.com>
```

**Frontend (.env in client/):**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

**Option A: Using Docker (Recommended for local dev)**

```bash
cd server
docker-compose up -d postgres
```

**Option B: Using Neon Postgres**

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

**Run Migrations:**

```bash
cd server
npm run build
npm run migrate
npm run seed
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the app at `http://localhost:5173`

## 👤 Test Credentials

After seeding, use these credentials:

- **Admin:** admin@portal.com / Admin@123
- **Mentor:** mentor@portal.com / Mentor@123
- **Student (pending):** student1@portal.com / Student@123
- **Student (active):** student2@portal.com / Student@123

## 🐳 Docker Deployment (Local Testing)

```bash
cd server
docker-compose up --build
```

This starts both PostgreSQL and the API server.

## 🌐 Production Deployment

### Deploy Frontend to Vercel

1. **Push code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `client`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-domain.com/api
     ```
   - Deploy

### Deploy Backend to Hostinger VPS

1. **SSH into your VPS:**
```bash
ssh root@your-vps-ip
```

2. **Install Docker & Docker Compose:**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

3. **Clone and Setup:**
```bash
# Clone repository
git clone https://github.com/your-username/community-portal.git
cd community-portal/server

# Create .env file
nano .env
# Add production environment variables (see below)
```

**Production .env:**
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@your-neon-host/dbname?sslmode=require
JWT_SECRET=your-production-secret-min-32-chars
FRONTEND_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Community Portal <noreply@communityportal.com>
```

4. **Build and Run:**
```bash
# Build Docker image
docker build -t community-portal-api .

# Run container
docker run -d \
  --name community-portal \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env \
  community-portal-api

# Run migrations
docker exec community-portal npm run migrate
docker exec community-portal npm run seed
```

5. **Setup Nginx Reverse Proxy:**
```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
nano /etc/nginx/sites-available/community-portal
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/community-portal /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

6. **Setup SSL with Certbot:**
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### Setup Neon Postgres

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your backend `.env`
5. Run migrations from your VPS:
```bash
docker exec community-portal npm run migrate
docker exec community-portal npm run seed
```

## 📧 Email Configuration

### Using Gmail:

1. Enable 2-Factor Authentication
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use in `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=generated-app-password
```

### Using SendGrid:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Configure CORS for your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable firewall on VPS
- [ ] Regular security updates

## 🧪 Testing Workflows

### 1. Signup & Email Verification
1. Go to `/signup`
2. Fill student registration form
3. Check email for verification link
4. Click link to verify
5. Login with credentials

### 2. Password Reset
1. Go to `/forgot-password`
2. Enter email
3. Check email for reset link
4. Set new password
5. Login with new password

### 3. Admin Approval
1. Login as admin
2. View pending students
3. Approve student and assign mentor
4. Student can now access full features

### 4. Announcement Flow
1. Login as verified student
2. Create announcement
3. Login as assigned mentor
4. Approve announcement
5. Announcement appears in feed

### 5. Messaging
1. Login as student
2. Navigate to Messages
3. Send message to mentor
4. Login as mentor
5. View and reply

## 🛠️ Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Docker
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f api        # View API logs
docker exec -it community-portal bash  # Access container
```

## 🐛 Troubleshooting

**Database Connection Issues:**
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify network connectivity to Neon

**Email Not Sending:**
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure app access" for Gmail (or use App Password)

**CORS Errors:**
- Verify `FRONTEND_URL` in backend `.env`
- Check Vercel deployment URL matches

**Build Failures:**
- Clear `node_modules` and reinstall
- Check Node.js version (20+)
- Verify all environment variables are set

## 📝 License

MIT

## 👥 Support

For issues and questions, please open an issue on GitHub.
