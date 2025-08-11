# TutorMe Environment Configuration Guide

This guide explains how to securely configure environment variables for your TutorMe application. Environment variables are used to store sensitive API keys and configuration that should not be committed to version control.

## 📁 Environment Files

### 1. `.env.local` (Local Development)
- **Purpose**: Contains your actual API keys and sensitive configuration
- **Location**: Root of your project
- **Security**: NEVER commit this file to version control (already in `.gitignore`)
- **Usage**: Automatically loaded by Next.js during development

### 2. `.env.example` (Template)
- **Purpose**: Template file showing all required environment variables
- **Location**: Root of your project
- **Security**: Safe to commit to version control (contains placeholder values)
- **Usage**: Reference for setting up environment variables

## 🔑 Required Environment Variables

### Firebase Configuration

Get these from your [Firebase Console](https://console.firebase.google.com/):

```bash
# Firebase Web App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email_here
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_admin_private_key_here
FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id_here
```

**How to get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Go to Project Settings → General
4. Under "Your apps", find your web app config
5. For Admin SDK: Go to Service Accounts → Generate new private key

### OpenRouter AI Configuration

Get your API key from [OpenRouter](https://openrouter.ai/keys):

```bash
OPENROUTER_API_KEY=your_openrouter_key_here
```

**How to get OpenRouter API key:**
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Go to API Keys section
4. Generate a new API key
5. Copy the key and paste it in your `.env.local`

### PayPal Configuration

Get these from your [PayPal Developer Dashboard](https://developer.paypal.com/):

```bash
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_ENVIRONMENT=sandbox  # Change to 'live' for production

# Optional: Webhook Configuration
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
PAYPAL_WEBHOOK_URL=your_paypal_webhook_url_here
```

**How to get PayPal credentials:**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create or select your app
3. Find your Client ID and Client Secret
4. For production: Create a live app and use those credentials instead

### Twilio Video Configuration

Get these from your [Twilio Console](https://console.twilio.com/):

```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_API_KEY=your_twilio_api_key_here
TWILIO_API_SECRET=your_twilio_api_secret_here

# Optional: Auth Token for additional operations
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
```

**How to get Twilio credentials:**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Find your Account SID on the dashboard
3. Go to API Keys & Tokens → Create API Key
4. Copy the API Key SID and API Secret

### NextAuth.js Configuration

```bash
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL
```

**How to generate NextAuth secret:**
```bash
# Generate a secure secret
openssl rand -base64 32
```

### Database Configuration

```bash
# SQLite for development (default)
DATABASE_URL="file:./dev.db"

# For production (PostgreSQL example)
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Application Configuration

```bash
# Node Environment
NODE_ENV=development  # Change to 'production' for production

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL

# Debug mode
DEBUG=false  # Set to 'true' for development debugging
```

## 🚀 Setup Instructions

### Local Development

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values:**
   Open `.env.local` and replace all placeholder values with your real API keys

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Production Deployment

#### Vercel Deployment

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add each environment variable:**
   - Variable name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `your_actual_firebase_api_key`
   - Environment: Production, Preview, Development (as needed)
5. **Repeat for all required variables**
6. **Redeploy your application**

#### Other Platforms (Netlify, AWS, etc.)

Most platforms have similar environment variable management:

1. **Find the environment variables section** in your deployment platform
2. **Add each variable** with the correct name and value
3. **Ensure you include both client-side** (`NEXT_PUBLIC_*`) **and server-side** variables
4. **Redeploy your application**

## 🔒 Security Best Practices

### Never Commit `.env.local`

Your `.env.local` file should be in `.gitignore`. If it's not, add it:

```bash
# .gitignore
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### Use Different Environments

Consider using separate configurations:

- **Development**: `.env.development`
- **Production**: `.env.production`
- **Testing**: `.env.test`

### Environment-Specific Values

```bash
# Development
NODE_ENV=development
PAYPAL_ENVIRONMENT=sandbox
NEXTAUTH_URL=http://localhost:3000

# Production
NODE_ENV=production
PAYPAL_ENVIRONMENT=live
NEXTAUTH_URL=https://your-domain.com
```

### Secure Your Keys

- **Use strong, randomly generated secrets**
- **Rotate your API keys periodically**
- **Monitor usage and set up alerts**
- **Use the least privilege principle** (only grant necessary permissions)

## 🐛 Troubleshooting

### Common Issues

#### 1. "API key not found" errors
**Solution**: Check that you've added the environment variable to your deployment platform

#### 2. "Invalid credentials" errors
**Solution**: Verify your API keys are correct and haven't expired

#### 3. "CORS" errors
**Solution**: Ensure your domain is whitelisted in the respective service consoles

#### 4. "Module not found" errors
**Solution**: Install required packages: `npm install @paypal/checkout-server-sdk twilio firebase-admin`

### Testing Your Configuration

```bash
# Test if environment variables are loaded
node -e "console.log('Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...')"
```

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [Twilio Documentation](https://www.twilio.com/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)

## 🔄 Environment Variable Reference

| Variable | Required | Client-Side | Description |
|----------|----------|-------------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | ✅ | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | ✅ | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | ✅ | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | ✅ | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | ✅ | Firebase app ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | ✅ | ❌ | Firebase admin client email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | ✅ | ❌ | Firebase admin private key |
| `FIREBASE_ADMIN_PROJECT_ID` | ✅ | ❌ | Firebase admin project ID |
| `OPENROUTER_API_KEY` | ✅ | ❌ | OpenRouter AI API key |
| `PAYPAL_CLIENT_ID` | ✅ | ❌ | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | ✅ | ❌ | PayPal client secret |
| `PAYPAL_ENVIRONMENT` | ✅ | ❌ | PayPal environment (sandbox/live) |
| `TWILIO_ACCOUNT_SID` | ✅ | ❌ | Twilio account SID |
| `TWILIO_API_KEY` | ✅ | ❌ | Twilio API key |
| `TWILIO_API_SECRET` | ✅ | ❌ | Twilio API secret |
| `NEXTAUTH_SECRET` | ✅ | ❌ | NextAuth secret |
| `NEXTAUTH_URL` | ✅ | ❌ | NextAuth URL |
| `DATABASE_URL` | ✅ | ❌ | Database connection URL |
| `NODE_ENV` | ❌ | ❌ | Node environment |
| `NEXT_PUBLIC_APP_URL` | ❌ | ✅ | Application URL |
| `DEBUG` | ❌ | ❌ | Debug mode flag |

---

**Remember**: Always keep your environment variables secure and never expose them in client-side code or commit them to version control.