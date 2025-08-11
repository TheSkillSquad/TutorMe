# TutorMe Netlify Deployment Setup Guide

This guide provides comprehensive instructions for deploying your TutorMe application to Netlify with proper environment configuration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Build Configuration](#build-configuration)
4. [Deployment Process](#deployment-process)
5. [Custom Domain Setup](#custom-domain-setup)
6. [WebSocket Configuration](#websocket-configuration)
7. [Database Setup](#database-setup)
8. [Security Configuration](#security-configuration)
9. [Monitoring and Analytics](#monitoring-and-analytics)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to Netlify, ensure you have:

- Netlify account (free or paid)
- GitHub repository with your TutorMe code
- All API keys and credentials ready
- Domain name (optional, for custom domain)

## Environment Variables Setup

### 1. Firebase Configuration

Add these variables to your Netlify environment settings:

```bash
# Firebase Client-side Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB3MKuN4M3f0Pzc6UOythhmErFsFNi-Ssg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tutorme-3570e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tutorme-3570e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tutorme-3570e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=994356507928
NEXT_PUBLIC_FIREBASE_APP_ID=1:994356507928:web:24f17ec54892dd0c179a6d

# Firebase Admin Configuration
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@tutorme-3570e.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1cE3tZSYKD+6y
sdLkuHiURvfAcpsOgiZgHek7sIP+XYyqoB041h8NlrJaAue2PWyPrHFnUk35gZRB
uI/XxB5UYfkIpVtw4UN45JU8uRV1VJH6zk3Ec4+sB4Xx8Ff+BAF2AOIJBYEZELx9
GQMvpXQ/DPvQT1Z+Gbzkm2t38RYZvl88UhYNyrc6rymC3MLOuQ7LhvLEZodM9Ha7
1KhWEoc8B7wqn50xcUt6jEmhuNsyMmj+MCZLNIUT/gFhXd6ieRiLSWX4CpdpgDWN
ODLHNW1ZTvZuikAgC+1CI4bUfNikBeIYWxuZpYE1qOVSWYwBkE8l5JUht+1pM4+3
oO5O5rgVAgMBAAECggEAIo7zPNgS/IAn4C/oIinzx5RT3LtHhuYpzo1r7vNSVMj3
QcmQ/1IjZIhzTJs4jLja3GvFRt+BnBg/B5ySg0+m0j49+5RZXCD/478wILqFGI3E
509TtysmrqbZL6mubOLQ72vAIeVDP2W1bSNuPK1IPLkpnnX6HLckyCtFNzl7kufi
aVLvpxGQXtZ1Y+ezrB8pQto2NbhI0yrqLyTCCY7rGT8WErKhaiya52lTe1HFL1po
v+z/gt/cHO33xJxrXRs0VUqST5f+4yI6wWWN0q1NbuwF6UCCoIdUN62Yh8NA5/wH
cqbs019dW/4bpaOTMpw42/Qf23CoXOSaq/jCuEH0eQKBgQDbZpQV/CWTgC1fc47w
2vHnJEVgT0TG1ytA/jAXgQT5qAb3o5Kzp3AMQzs+QBczgL2SfT67P2UHoP+u536D
Df2GT7XVcmDowoPcGC+EWDR9cgDW4krt97QWOwZmXs7k+/jELSOwYUrYjZ4IIIDl
axEhmedbB9+r/jSGd4aBAexiWQKBgQDTtJK5HX/jMjEa3tNabFmDyV9ML+/b+7SU
5JrLgqA4Vk4bsodr4jNOXHKANYSgHjMh4AUCjxeH5Gm3CCJ9/17dsB82tn8+7j/r
45PbQUCP1opf+rJIXoRGwcIu/3LNaKFxzecIKK/gVZGoOMn3CxPvfYAZdJ6LSa5h
ew5ESKG0HQKBgHhkL3po5E2uFje8d4FfA0Ksuo0AsmLSC2Acm1Mqbwp302rsDUIb
7PYtpkKgdJrEWEIcC+JABTZMeEEHsnpDoQykjMjVfKv8oNKTSu+6XwM/HYrMngU6
2U0hkn92It2wDm/HvT+6A5IVE9St0U0SlVH02+ktxuTgFv56dAoyff3xAoGAFS82
l2uKRpPZMhUmFSBOfM+Dx73sRJkVYujVTJQPsFOCkWb2AieqdqbtlkLEuLkM6NDf
73eeJS0IHxajTPRm68wZ84GjjgqNPu+Q9hm7eik/w4b0nCVJG0N8SPOq6z8TGK4/
9iMMJmipoKm+HAhxwD9QuDthOhLvbjXAIbka5UkCgYEAn10FJdQu86P9pRppJ3XD
2oQ4xNPfhOvuPuhXxWvEJ7CYPQkO0fHirSf2y77qAFU/XnRgNV+5gIJ9Jhh7Iazh
EgNShXjnxLsZODPwKcRySY1dxhxw20rZUCIci4Kl6aSGYyOZQ9rdmjEA86GhhO9T
9iT5tyMRayyC7Dw7hlnGjg4=
-----END PRIVATE KEY-----
FIREBASE_ADMIN_PROJECT_ID=tutorme-3570e
```

### 2. OpenRouter AI Configuration

```bash
# OpenRouter AI
OPENROUTER_API_KEY=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
```

### 3. PayPal Configuration

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=AT-LgGtSz2YTpZeusO-GagbGz62StgmJ40WmtW6DmMEnpz7Azh_OIsXkDui314ce7vOK2BEZ2fp7hwRQ
PAYPAL_CLIENT_SECRET=EGvt8eSUrOkaKZPrA97M9ewGLrS-b9rlKHugzt1HiFHfTSPIjiztRq884GlHQe6PZJU81uPBjiw4xu5D
PAYPAL_ENVIRONMENT=sandbox  # Change to 'live' for production

# Optional: PayPal Webhook Configuration
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
PAYPAL_WEBHOOK_URL=your_paypal_webhook_url_here
```

### 4. Twilio Configuration

```bash
# Twilio Video Configuration
TWILIO_ACCOUNT_SID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_API_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional: Twilio Auth Token
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
```

### 5. NextAuth.js Configuration

```bash
# NextAuth.js Configuration
NEXTAUTH_SECRET=a2bfb02c24ea0f075097549e56e0135f
NEXTAUTH_URL=https://your-app-name.netlify.app  # Update with your Netlify URL
```

### 6. Database Configuration

```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database"  # Use production database
```

### 7. Application Configuration

```bash
# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
DEBUG=false

# Build Configuration
BUILD_ID=netlify-build
```

### How to Add Environment Variables in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site settings** → **Build & deploy** → **Environment**
4. Click **Edit variables**
5. Add each variable with its corresponding value
6. Click **Save**

## Build Configuration

### 1. Create `netlify.toml` File

Your `netlify.toml` file is already configured with:

- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `netlify/functions`
- Redirect rules for SPA routing
- Security headers
- Plugin configurations

### 2. Update `package.json` Scripts

Ensure your `package.json` has the necessary scripts:

```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "postbuild": "next-sitemap"
  }
}
```

### 3. Install Additional Dependencies

```bash
npm install next-sitemap
```

## Deployment Process

### 1. Connect to GitHub

1. Log in to Netlify
2. Click **New site from Git**
3. Select **GitHub**
4. Authorize Netlify to access your repository
5. Select your TutorMe repository

### 2. Configure Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `20` (or latest LTS)

### 3. Set Environment Variables

Add all the environment variables listed above in the Netlify dashboard.

### 4. Deploy

Click **Deploy site**. Netlify will automatically build and deploy your application.

## Custom Domain Setup

### 1. Add Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain name (e.g., `tutorme.com`)
4. Follow the DNS configuration instructions

### 2. Configure DNS

Update your DNS records with your domain provider:

```dns
A Record: tutorme.com → 104.198.14.52 (Netlify's IP)
CNAME: www → netlify.com
```

### 3. Enable HTTPS

Netlify automatically provisions SSL certificates for custom domains.

## WebSocket Configuration

Netlify doesn't support native WebSocket connections in serverless functions. For real-time features:

### Option 1: Use a Third-Party WebSocket Service

1. **Pusher** or **Ably** for real-time messaging
2. **Socket.IO** with a dedicated server
3. **Firebase Realtime Database** or **Firestore**

### Option 2: Edge Functions

Use Netlify Edge Functions for WebSocket proxy:

```javascript
// netlify/edge-functions/websocket.js
export default async (request, context) => {
  // Handle WebSocket connections
  return new Response('WebSocket proxy', { status: 200 });
};
```

### Option 3: Dedicated WebSocket Server

Deploy a separate WebSocket server on services like:
- Heroku
- DigitalOcean
- AWS EC2
- Vercel Serverless Functions

## Database Setup

### 1. Production Database

For production, use a managed database service:

- **PostgreSQL**: Heroku Postgres, AWS RDS, DigitalOcean Managed Databases
- **MySQL**: PlanetScale, AWS RDS
- **MongoDB**: MongoDB Atlas

### 2. Update Database URL

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 3. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations
npx prisma migrate deploy
```

## Security Configuration

### 1. Security Headers

Your `netlify.toml` already includes comprehensive security headers:

- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `Content-Security-Policy`

### 2. Content Security Policy

Add CSP headers to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebase.com https://*.paypal.com; style-src 'self' 'unsafe-inline' https://*.googleapis.com; img-src 'self' data: https://*.google.com https://*.gstatic.com https://*.firebase.com; font-src 'self' https://*.gstatic.com; connect-src 'self' https://*.firebaseio.com https://*.firebase.com https://*.paypal.com https://*.twilio.com https://*.openrouter.ai; frame-src 'self' https://*.paypal.com https://*.firebase.com;"
```

### 3. Rate Limiting

Implement rate limiting in your API routes:

```javascript
// lib/rate-limit.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export default limiter;
```

## Monitoring and Analytics

### 1. Netlify Analytics

Enable Netlify Analytics in your site settings.

### 2. Error Tracking

Add error tracking services:

- **Sentry**: `npm install @sentry/nextjs`
- **LogRocket**: `npm install logrocket`

### 3. Performance Monitoring

Use Lighthouse plugin (already configured in `netlify.toml`).

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check build logs in Netlify dashboard
# Ensure all dependencies are installed
npm install

# Check TypeScript errors
npm run lint
```

#### 2. Environment Variables Not Loading

- Verify variable names match exactly
- Ensure variables are set in the correct environment (production/development)
- Check that sensitive variables are properly escaped

#### 3. API Routes Not Working

- Verify API routes are in the correct directory structure
- Check serverless function logs in Netlify dashboard
- Ensure proper CORS headers are set

#### 4. Authentication Issues

- Verify NextAuth configuration
- Check that session cookies are properly set
- Ensure callback URLs match your Netlify domain

#### 5. WebSocket Connections

- Netlify doesn't support native WebSockets in serverless functions
- Use third-party services or dedicated WebSocket servers

### Debug Commands

```bash
# Local development with Netlify CLI
netlify dev

# Build locally
npm run build

# Deploy manually
netlify deploy --prod

# Check functions locally
netlify functions:serve
```

## Support

For additional support:

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify Guide](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Community Forum](https://community.netlify.com/)
- [Netlify Status Page](https://www.netlifystatus.com/)

---

This guide provides a comprehensive setup for deploying your TutorMe application to Netlify. Make sure to test all features thoroughly after deployment and monitor your application's performance and security.