# Ailuminate - Content Creation Platform

A modern, full-stack content creation and community platform built with Next.js, featuring dual authentication systems, real-time messaging, and comprehensive content management.

## 🚀 Features

- **Dual Authentication System** - Separate user and admin portals
- **Email Verification** - Secure account activation with MailerSend
- **Article Management** - Rich content creation with MongoDB storage
- **Real-time Messaging** - PostgreSQL-powered chat system
- **File Sharing** - Integrated file upload and sharing
- **Search Functionality** - Find users and content easily
- **Profile Management** - Customizable user profiles
- **Admin Controls** - Comprehensive admin dashboard
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma, Mongoose
- **Databases**: PostgreSQL (Neon), MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Email**: MailerSend
- **Validation**: Zod
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- MongoDB database
- MailerSend account for email services

## 🔧 Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd ailuminate-app
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Database URLs
DATABASE_URL="your-postgresql-url"
MONGODB_URI="your-mongodb-url"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Email Service (MailerSend)
MAILERSEND_API_KEY="your-mailersend-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-app-domain.com"
\`\`\`

### 4. Database Setup
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Create admin user
npm run create-admin
\`\`\`

### 5. Development
\`\`\`bash
npm run dev
\`\`\`

## 🚀 Netlify Deployment

### Method 1: Netlify Dashboard (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

4. **Add Environment Variables**
   Go to Site Settings → Environment Variables and add all your environment variables.

5. **Install Netlify Next.js Plugin**
   The `netlify.toml` file is already configured with the Next.js plugin.

6. **Deploy**
   Click "Deploy site" and your app will be live!

### Method 2: Netlify CLI

1. **Install Netlify CLI**
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`

2. **Login to Netlify**
   \`\`\`bash
   netlify login
   \`\`\`

3. **Initialize site**
   \`\`\`bash
   netlify init
   \`\`\`

4. **Set environment variables**
   \`\`\`bash
   netlify env:set DATABASE_URL "your-postgresql-url"
   netlify env:set MONGODB_URI "your-mongodb-url"
   netlify env:set JWT_SECRET "your-jwt-secret"
   netlify env:set MAILERSEND_API_KEY "your-mailersend-key"
   netlify env:set FROM_EMAIL "your-email"
   netlify env:set NEXT_PUBLIC_APP_URL "your-app-url"
   \`\`\`

5. **Deploy**
   \`\`\`bash
   netlify deploy --prod
   \`\`\`

## 📁 Project Structure

\`\`\`
ailuminate-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin pages
│   └── ...
├── components/            # Reusable components
├── lib/                   # Utility functions
├── models/                # MongoDB models
├── prisma/                # Prisma schema
├── scripts/               # Utility scripts
└── types/                 # TypeScript types
\`\`\`

## 🔐 Authentication Flow

1. **User Registration** → Email verification → Account activation
2. **User Login** → JWT token → Protected routes access
3. **Admin Login** → Separate admin token → Admin dashboard access

## 📧 Email Services

The app uses MailerSend for:
- Email verification
- Password reset
- Welcome emails
- Notifications

## 🗄 Database Schema

- **PostgreSQL**: Users, admins, messages, follows, file references
- **MongoDB**: Articles, comments, file content

## 🛡 Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Input validation with Zod
- CORS protection
- Environment variable protection

## 🎨 UI Components

Built with Shadcn/ui components:
- Responsive design
- Dark/light mode support
- Accessible components
- Modern design system

## 📱 Features Overview

### For Users:
- Create and publish articles
- Real-time messaging
- Profile customization
- Follow other users
- Search functionality

### For Admins:
- User management
- Content moderation
- Analytics dashboard
- System administration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@ailuminate.com or create an issue in the repository.

---

**Built with ❤️ using Next.js and modern web technologies**
