# TutorMe Netlify Deployment Guide

This comprehensive guide will walk you through deploying your TutorMe application to Netlify with all the necessary configurations.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure Overview](#project-structure-overview)
3. [Before Deployment Checklist](#before-deployment-checklist)
4. [Step-by-Step Deployment Process](#step-by-step-deployment-process)
5. [Custom Domain Configuration](#custom-domain-configuration)
6. [Post-Deployment Setup](#post-deployment-setup)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)
9. [Advanced Configurations](#advanced-configurations)
10. [Backup and Recovery](#backup-and-recovery)

## Prerequisites

Before you begin, ensure you have:

- ✅ **Netlify Account**: Free or paid account at [netlify.com](https://netlify.com)
- ✅ **GitHub Repository**: Your TutorMe code pushed to GitHub
- ✅ **API Keys**: All necessary API keys and credentials
- ✅ **Domain Name**: (Optional) Custom domain for your application
- ✅ **Node.js**: Version 20+ installed locally
- ✅ **Netlify CLI**: Install with `npm install -g netlify-cli`

## Project Structure Overview

Your TutorMe project is optimized for Netlify deployment:

```
tutorme/
├── netlify.toml                 # Main Netlify configuration
├── netlify/
│   ├── functions/              # Serverless functions
│   │   ├── api-handler.js     # API route handler
│   │   ├── auth-handler.js    # Authentication handler
│   │   └── websocket-proxy.js  # WebSocket proxy
│   ├── redirects.conf         # Redirect rules
│   └── headers.conf           # Security headers
├── next.config.netlify.ts      # Next.js config for Netlify
├── next-sitemap.config.js      # Sitemap configuration
├── package.json               # Build scripts and dependencies
├── .env.local                 # Local environment variables
└── NETLIFY_SETUP.md           # Environment setup guide
```

## Before Deployment Checklist

### 1. Environment Variables
- [ ] All API keys are configured in `.env.local`
- [ ] Firebase configuration is complete
- [ ] PayPal sandbox/production mode is set correctly
- [ ] Twilio credentials are valid
- [ ] NextAuth secret is generated
- [ ] Database URL is set for production

### 2. Code Quality
- [ ] Run `npm run lint` to check for code issues
- [ ] Run `npm run type-check` to verify TypeScript
- [ ] All tests are passing (if applicable)
- [ ] No console errors in development

### 3. Dependencies
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run db:generate` to generate Prisma client
- [ ] Run `npm run build` locally to verify build works

### 4. Configuration Files
- [ ] `netlify.toml` is properly configured
- [ ] `next.config.netlify.ts` is ready for production
- [ ] Redirect and header configurations are in place
- [ ] Sitemap configuration is complete

## Step-by-Step Deployment Process

### Step 1: Connect to GitHub

1. **Log in to Netlify Dashboard**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with your account

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Select "GitHub" as the provider

3. **Authorize Netlify**
   - Click "Install Netlify on GitHub"
   - Select your repository or "All repositories"
   - Authorize the installation

4. **Select Repository**
   - Find and select your `tutorme` repository
   - Click "Next"

### Step 2: Configure Build Settings

Netlify will automatically detect your Next.js project. Verify the settings:

```yaml
Build command: npm run build
Publish directory: .next
Node version: 20
```

Click "Deploy site" to continue.

### Step 3: Set Environment Variables

1. **Go to Site Settings**
   - Select your deployed site
   - Navigate to **Site settings** → **Build & deploy** → **Environment**

2. **Add Environment Variables**
   - Click "Edit variables"
   - Add all variables from `NETLIFY_SETUP.md`
   - Use the **production** values, not sandbox

3. **Critical Variables**
   ```bash
   # Application
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
   
   # NextAuth
   NEXTAUTH_URL=https://your-app-name.netlify.app
   
   # Database
   DATABASE_URL=your-production-database-url
   ```

4. **Save Variables**
   - Click "Save"
   - Trigger a new deployment

### Step 4: Configure Build Plugins

Your `netlify.toml` already includes essential plugins:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[[plugins]]
  package = "netlify-plugin-cache-nextjs"

[[plugins]]
  package = "@netlify/plugin-lighthouse"
```

### Step 5: Deploy and Test

1. **Initial Deployment**
   - Netlify will automatically build and deploy
   - Monitor the build process in the deploy log

2. **Test the Application**
   - Visit the deployed URL
   - Test all major features:
     - User registration and login
     - Dashboard functionality
     - Video sessions (if configured)
     - Payment processing
     - API endpoints

3. **Check Console Errors**
   - Open browser developer tools
   - Look for any JavaScript errors
   - Verify all API calls are working

## Custom Domain Configuration

### Option 1: Netlify Subdomain (Free)

1. **Set Site Name**
   - Go to **Site settings** → **General** → **Site details**
   - Click "Change site name"
   - Enter your desired subdomain (e.g., `tutorme`)
   - Your URL will be: `https://tutorme.netlify.app`

### Option 2: Custom Domain

#### Step 1: Add Custom Domain

1. **Navigate to Domain Settings**
   - Go to **Site settings** → **Domain management**
   - Click "Add custom domain"

2. **Enter Domain**
   - Add your domain (e.g., `tutorme.com`)
   - Add both root domain and `www` version

#### Step 2: Configure DNS

**For Root Domain (tutorme.com):**
```
Type: A
Name: @
Value: 104.198.14.52
TTL: 3600
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: netlify.com
TTL: 3600
```

**For Email (Optional):**
```
Type: MX
Name: @
Value: your-email-provider.com
Priority: 10
```

#### Step 3: Verify DNS Propagation

1. **Check DNS Status**
   - Use [DNSChecker.org](https://dnschecker.org)
   - Enter your domain
   - Wait for green checkmarks (usually 24-48 hours)

2. **Enable HTTPS**
   - Netlify automatically provisions SSL certificates
   - Wait for certificate issuance (usually 1-2 hours)

#### Step 4: Update Environment Variables

Update your environment variables with the new domain:

```bash
NEXT_PUBLIC_APP_URL=https://tutorme.com
NEXTAUTH_URL=https://tutorme.com
```

## Post-Deployment Setup

### 1. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Run migrations (if using migrations)
npx prisma migrate deploy
```

### 2. Firebase Configuration

1. **Update Authorized Domains**
   - Go to Firebase Console
   - Select your project
   - Navigate to Authentication → Settings
   - Add your Netlify domain to authorized domains

2. **Configure Storage Rules**
   - Update Firebase Storage security rules
   - Allow access from your Netlify domain

### 3. PayPal Configuration

1. **Update PayPal App**
   - Go to PayPal Developer Dashboard
   - Select your application
   - Update return URLs to your Netlify domain
   - Switch from sandbox to production if ready

### 4. Twilio Configuration

1. **Update Twilio Settings**
   - Go to Twilio Console
   - Update allowed domains for video calls
   - Configure webhook URLs for your Netlify domain

### 5. Search Engine Optimization

1. **Submit Sitemap**
   - Your sitemap is automatically generated at `/sitemap.xml`
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools

2. **Verify Site Ownership**
   - Add verification meta tags or DNS records
   - Complete verification process

## Monitoring and Maintenance

### 1. Netlify Analytics

1. **Enable Analytics**
   - Go to **Site settings** → **Analytics**
   - Enable Netlify Analytics
   - View real-time visitor data

### 2. Error Tracking

1. **Set Up Sentry**
   ```bash
   npm install @sentry/nextjs
   ```
   - Configure Sentry in your Next.js app
   - Monitor errors and performance

2. **LogRocket Integration**
   ```bash
   npm install logrocket
   ```
   - Add LogRocket for session recording
   - Monitor user interactions

### 3. Performance Monitoring

1. **Lighthouse Scores**
   - Your site is automatically scanned with Lighthouse
   - View results in **Deploys** → **Lighthouse**
   - Optimize based on recommendations

2. **Web Vitals**
   - Monitor Core Web Vitals
   - Optimize loading performance

### 4. Uptime Monitoring

1. **Set Up Monitoring**
   - Use services like UptimeRobot or Pingdom
   - Monitor your site's availability
   - Set up alerts for downtime

## Troubleshooting Common Issues

### 1. Build Failures

**Symptoms:** Build process fails with errors

**Solutions:**
```bash
# Check build logs in Netlify dashboard
# Run build locally to reproduce
npm run build

# Check for missing dependencies
npm install

# Check TypeScript errors
npm run type-check

# Check ESLint errors
npm run lint
```

### 2. Environment Variables Not Loading

**Symptoms:** API calls failing, authentication not working

**Solutions:**
- Verify variable names match exactly
- Ensure variables are set in production environment
- Check that sensitive variables are properly escaped
- Redeploy after changing variables

### 3. API Routes Not Working

**Symptoms:** API endpoints returning 404 or 500 errors

**Solutions:**
- Check serverless function logs in Netlify dashboard
- Verify API routes are in correct directory structure
- Ensure proper CORS headers are set
- Check that functions are properly deployed

### 4. Authentication Issues

**Symptoms:** Users cannot log in, sessions not persisting

**Solutions:**
- Verify NextAuth configuration
- Check that session cookies are properly set
- Ensure callback URLs match your Netlify domain
- Check Firebase authentication settings

### 5. WebSocket Connections

**Symptoms:** Real-time features not working

**Solutions:**
- Netlify doesn't support native WebSockets in serverless functions
- Use third-party services like Pusher or Ably
- Configure WebSocket proxy properly
- Check firewall settings

### 6. Custom Domain Issues

**Symptoms:** Domain not resolving, HTTPS not working

**Solutions:**
- Verify DNS records are correct
- Wait for DNS propagation (24-48 hours)
- Check domain registrar settings
- Contact Netlify support if issues persist

## Advanced Configurations

### 1. Edge Functions

Create edge functions for better performance:

```javascript
// netlify/edge-functions/geo.js
export default async (request, context) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const country = request.headers.get('x-country') || 'unknown';
  
  return new Response(JSON.stringify({ ip, country }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### 2. Scheduled Functions

Set up scheduled tasks:

```javascript
// netlify/functions/scheduled-backup.js
exports.handler = async (event, context) => {
  // Run backup operations
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Backup completed' }),
  };
};
```

### 3. Form Handling

Handle form submissions without backend:

```html
<!-- Contact form -->
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

### 4. Large File Handling

Configure for large file uploads:

```javascript
// netlify/functions/upload.js
exports.handler = async (event, context) => {
  // Handle file uploads
  // Use external storage like AWS S3
};
```

## Backup and Recovery

### 1. Database Backups

```bash
# Create database backup
npx prisma db export --schema-only

# Restore database
npx prisma db push
```

### 2. Site Backups

Netlify automatically maintains deploy history:
- View deploy history in **Deploys** section
- Roll back to previous deployments
- Download build artifacts

### 3. Configuration Backups

Keep your configuration files in version control:
- `netlify.toml`
- `next.config.netlify.ts`
- Environment variable templates

### 4. Disaster Recovery Plan

1. **Document Critical Information**
   - API keys and credentials
   - Database connection details
   - Custom domain settings

2. **Automated Backups**
   - Set up regular database backups
   - Backup configuration files
   - Monitor backup success

3. **Recovery Procedures**
   - Document step-by-step recovery process
   - Test recovery procedures regularly
   - Keep contact information for support

## Support Resources

- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com/)
- **Next.js on Netlify**: [docs.netlify.com/integrations/frameworks/next-js/](https://docs.netlify.com/integrations/frameworks/next-js/)
- **Netlify Community**: [community.netlify.com](https://community.netlify.com/)
- **Netlify Status**: [www.netlifystatus.com](https://www.netlifystatus.com/)
- **GitHub Issues**: Report bugs in your repository

---

This guide provides a complete deployment workflow for your TutorMe application on Netlify. Following these steps will ensure a smooth deployment process and a production-ready application with proper monitoring and maintenance procedures.