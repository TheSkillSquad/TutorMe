# TutorMe Netlify Environment Variables Setup Checklist

This comprehensive checklist will guide you through setting up all required environment variables for deploying your TutorMe application to Netlify.

## 📋 **Quick Overview**
- **Total Variables**: 27 total environment variables
- **Frontend-Safe**: 8 variables (exposed to browser)
- **Backend-Only**: 19 variables (server-side only)
- **Netlify-Specific**: 5 variables
- **Security Level**: 🔴 High (contains sensitive API keys)

---

## 🔐 **SECURITY WARNING - READ FIRST**

### ⚠️ **Critical Security Practices**
- [ ] **NEVER** commit `.env.local` with real values to version control
- [ ] **ALWAYS** use Netlify's environment variables for production
- [ ] **GENERATE** new secrets for production (don't reuse development values)
- [ ] **ROTATE** API keys regularly (every 3-6 months)
- [ ] **MONITOR** API usage for unusual activity
- [ ] **LIMIT** access to API keys to authorized personnel only

### 🔑 **Variable Naming Convention**
- **`NEXT_PUBLIC_*`**: Exposed to browser (frontend-safe)
- **All others**: Server-side only (backend-only)

---

## 🎯 **PART 1: FRONTEND-SAFE VARIABLES (8 variables)**
*These variables are safe to expose to the browser*

### ✅ **Firebase Client Configuration (6 variables)**
- [ ] **`NEXT_PUBLIC_FIREBASE_API_KEY`**
  - **Value**: `AIzaSyB3MKuN4M3f0Pzc6UOythhmErFsFNi-Ssg`
  - **Purpose**: Firebase app initialization
  - **Source**: Firebase Console → Project Settings → General
  - **Security**: Safe to expose (designed for client use)

- [ ] **`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`**
  - **Value**: `tutorme-3570e.firebaseapp.com`
  - **Purpose**: Firebase authentication domain
  - **Source**: Firebase Console → Project Settings → General
  - **Security**: Safe to expose

- [ ] **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`**
  - **Value**: `tutorme-3570e`
  - **Purpose**: Firebase project identification
  - **Source**: Firebase Console → Project Settings → General
  - **Security**: Safe to expose

- [ ] **`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`**
  - **Value**: `tutorme-3570e.firebasestorage.app`
  - **Purpose**: Firebase storage bucket URL
  - **Source**: Firebase Console → Storage
  - **Security**: Safe to expose

- [ ] **`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`**
  - **Value**: `994356507928`
  - **Purpose**: Firebase Cloud Messaging sender ID
  - **Source**: Firebase Console → Project Settings → Cloud Messaging
  - **Security**: Safe to expose

- [ ] **`NEXT_PUBLIC_FIREBASE_APP_ID`**
  - **Value**: `1:994356507928:web:24f17ec54892dd0c179a6d`
  - **Purpose**: Firebase app identification
  - **Source**: Firebase Console → Project Settings → General
  - **Security**: Safe to expose

### ✅ **Application Configuration (2 variables)**
- [ ] **`PAYPAL_ENVIRONMENT`**
  - **Development Value**: `sandbox`
  - **Production Value**: `live`
  - **Purpose**: PayPal environment mode
  - **Security**: Safe to expose (indicates environment only)

- [ ] **`NEXT_PUBLIC_APP_URL`**
  - **Development Value**: `http://localhost:3000`
  - **Production Value**: `https://your-app-name.netlify.app`
  - **Purpose**: Base URL for the application
  - **Security**: Safe to expose (public URL)

---

## 🔒 **PART 2: BACKEND-ONLY VARIABLES (19 variables)**
*These variables are NEVER exposed to the browser*

### 🔐 **Firebase Admin Configuration (3 variables)**
- [ ] **`FIREBASE_ADMIN_CLIENT_EMAIL`**
  - **Value**: `firebase-adminsdk-fbsvc@tutorme-3570e.iam.gserviceaccount.com`
  - **Purpose**: Firebase Admin SDK authentication
  - **Source**: Firebase Console → Project Settings → Service Accounts
  - **Security**: 🔴 HIGH - Keep secret

- [ ] **`FIREBASE_ADMIN_PRIVATE_KEY`**
  - **Value**: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1cE3tZSYKD+6y\nsdLkuHiURvfAcpsOgiZgHek7sIP+XYyqoB041h8NlrJaAue2PWyPrHFnUk35gZRB\nuI/XxB5UYfkIpVtw4UN45JU8uRV1VJH6zk3Ec4+sB4Xx8Ff+BAF2AOIJBYEZELx9\nGQMvpXQ/DPvQT1Z+Gbzkm2t38RYZvl88UhYNyrc6rymC3MLOuQ7LhvLEZodM9Ha7\n1KhWEoc8B7wqn50xcUt6jEmhuNsyMmj+MCZLNIUT/gFhXd6ieRiLSWX4CpdpgDWN\nODLHNW1ZTvZuikAgC+1CI4bUfNikBeIYWxuZpYE1qOVSWYwBkE8l5JUht+1pM4+3\noO5O5rgVAgMBAAECggEAIo7zPNgS/IAn4C/oIinzx5RT3LtHhuYpzo1r7vNSVMj3\nQcmQ/1IjZIhzTJs4jLja3GvFRt+BnBg/B5ySg0+m0j49+5RZXCD/478wILqFGI3E\n509TtysmrqbZL6mubOLQ72vAIeVDP2W1bSNuPK1IPLkpnnX6HLckyCtFNzl7kufi\naVLvpxGQXtZ1Y+ezrB8pQto2NbhI0yrqLyTCCY7rGT8WErKhaiya52lTe1HFL1po\nv+z/gt/cHO33xJxrXRs0VUqST5f+4yI6wWWN0q1NbuwF6UCCoIdUN62Yh8NA5/wH\ncqbs019dW/4bpaOTMpw42/Qf23CoXOSaq/jCuEH0eQKBgQDbZpQV/CWTgC1fc47w\n2vHnJEVgT0TG1ytA/jAXgQT5qAb3o5Kzp3AMQzs+QBczgL2SfT67P2UHoP+u536D\nDf2GT7XVcmDowoPcGC+EWDR9cgDW4krt97QWOwZmXs7k+/jELSOwYUrYjZ4IIIDl\naxEhmedbB9+r/jSGd4aBAexiWQKBgQDTtJK5HX/jMjEa3tNabFmDyV9ML+/b+7SU\n5JrLgqA4Vk4bsodr4jNOXHKANYSgHjMh4AUCjxeH5Gm3CCJ9/17dsB82tn8+7j/r\n45PbQUCP1opf+rJIXoRGwcIu/3LNaKFxzecIKK/gVZGoOMn3CxPvfYAZdJ6LSa5h\new5ESKG0HQKBgHhkL3po5E2uFje8d4FfA0Ksuo0AsmLSC2Acm1Mqbwp302rsDUIb\n7PYtpkKgdJrEWEIcC+JABTZMeEEHsnpDoQykjMjVfKv8oNKTSu+6XwM/HYrMngU6\n2U0hkn92It2wDm/HvT+6A5IVE9St0U0SlVH02+ktxuTgFv56dAoyff3xAoGAFS82\nl2uKRpPZMhUmFSBOfM+Dx73sRJkVYujVTJQPsFOCkWb2AieqdqbtlkLEuLkM6NDf\n73eeJS0IHxajTPRm68wZ84GjjgqNPu+Q9hm7eik/w4b0nCVJG0N8SPOq6z8TGK4/\n9iMMJmipoKm+HAhxwD9QuDthOhLvbjXAIbka5UkCgYEAn10FJdQu86P9pRppJ3XD\n2oQ4xNPfhOvuPuhXxWvEJ7CYPQkO0fHirSf2y77qAFU/XnRgNV+5gIJ9Jhh7Iazh\nEgNShXjnxLsZODPwKcRySY1dxhxw20rZUCIci4Kl6aSGYyOZQ9rdmjEA86GhhO9T\n9iT5tyMRayyC7Dw7hlnGjg4=\n-----END PRIVATE KEY-----`
  - **Purpose**: Firebase Admin SDK private key
  - **Source**: Firebase Console → Project Settings → Service Accounts
  - **Security**: 🔴 CRITICAL - Keep extremely secret

- [ ] **`FIREBASE_ADMIN_PROJECT_ID`**
  - **Value**: `tutorme-3570e`
  - **Purpose**: Firebase Admin SDK project identification
  - **Source**: Firebase Console → Project Settings → Service Accounts
  - **Security**: 🔴 HIGH - Keep secret

### 🔐 **AI Service Configuration (1 variable)**
- [ ] **`OPENROUTER_API_KEY`**
  - **Value**: `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`
  - **Purpose**: OpenRouter AI API access
  - **Source**: [OpenRouter Dashboard](https://openrouter.ai/keys)
  - **Security**: 🔴 HIGH - Keep secret

### 🔐 **Payment Processing Configuration (4 variables)**
- [ ] **`PAYPAL_CLIENT_ID`**
  - **Value**: `AT-LgGtSz2YTpZeusO-GagbGz62StgmJ40WmtW6DmMEnpz7Azh_OIsXkDui314ce7vOK2BEZ2fp7hwRQ`
  - **Purpose**: PayPal API client identification
  - **Source**: PayPal Developer Dashboard → Applications
  - **Security**: 🔴 HIGH - Keep secret

- [ ] **`PAYPAL_CLIENT_SECRET`**
  - **Value**: `EGvt8eSUrOkaKZPrA97M9ewGLrS-b9rlKHugzt1HiFHfTSPIjiztRq884GlHQe6PZJU81uPBjiw4xu5D`
  - **Purpose**: PayPal API client secret
  - **Source**: PayPal Developer Dashboard → Applications
  - **Security**: 🔴 CRITICAL - Keep extremely secret

- [ ] **`PAYPAL_WEBHOOK_ID`** (Optional)
  - **Value**: `your_paypal_webhook_id_here`
  - **Purpose**: PayPal webhook identification
  - **Source**: PayPal Developer Dashboard → Webhooks
  - **Security**: 🔴 HIGH - Keep secret

- [ ] **`PAYPAL_WEBHOOK_URL`** (Optional)
  - **Value**: `https://your-app-name.netlify.app/api/paypal/webhook`
  - **Purpose**: PayPal webhook endpoint URL
  - **Source**: Your application's webhook endpoint
  - **Security**: 🔴 MEDIUM - Keep secret

### 🔐 **Video Communication Configuration (4 variables)**
- [ ] **`TWILIO_ACCOUNT_SID`**
  - **Value**: `XXXXXXXXXXXXXXXXXXXXXX`
  - **Purpose**: Twilio account identification
  - **Source**: Twilio Console → Dashboard
  - **Security**: 🔴 HIGH - Keep secret

- [ ] **`TWILIO_API_KEY`**
  - **Value**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
  - **Purpose**: Twilio API key for video services
  - **Source**: Twilio Console → API Keys
  - **Security**: 🔴 HIGH - Keep secret

- [ ] **`TWILIO_API_SECRET`**
  - **Value**: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
  - **Purpose**: Twilio API secret for video services
  - **Source**: Twilio Console → API Keys
  - **Security**: 🔴 CRITICAL - Keep extremely secret

- [ ] **`TWILIO_AUTH_TOKEN`** (Optional)
  - **Value**: `your_twilio_auth_token_here`
  - **Purpose**: Twilio authentication token
  - **Source**: Twilio Console → Dashboard
  - **Security**: 🔴 CRITICAL - Keep extremely secret

### 🔐 **Authentication Configuration (2 variables)**
- [ ] **`NEXTAUTH_SECRET`**
  - **Development Value**: `a2bfb02c24ea0f075097549e56e0135f`
  - **Production Value**: `GENERATE_NEW_SECURE_STRING`
  - **Purpose**: NextAuth.js session encryption
  - **How to Generate**: `openssl rand -base64 32`
  - **Security**: 🔴 CRITICAL - Generate new for production

- [ ] **`NEXTAUTH_URL`**
  - **Development Value**: `http://localhost:3000`
  - **Production Value**: `https://your-app-name.netlify.app`
  - **Purpose**: NextAuth.js callback URL
  - **Security**: 🔴 MEDIUM - Keep secret (prevents hijacking)

### 🔐 **Database Configuration (1 variable)**
- [ ] **`DATABASE_URL`**
  - **Development Value**: `"file:./dev.db"`
  - **Production Value**: `"postgresql://user:password@host:port/database"`
  - **Purpose**: Database connection string
  - **Source**: Your database provider
  - **Security**: 🔴 CRITICAL - Keep extremely secret

### 🔐 **Application Configuration (4 variables)**
- [ ] **`NODE_ENV`**
  - **Development Value**: `development`
  - **Production Value**: `production`
  - **Purpose**: Node.js environment mode
  - **Security**: 🔴 LOW - But keep secret

- [ ] **`DEBUG`**
  - **Development Value**: `true`
  - **Production Value**: `false`
  - **Purpose**: Debug mode toggle
  - **Security**: 🔴 LOW - But keep secret

- [ ] **`PRISMA_CLI_QUERY_ENGINE_TYPE`**
  - **Value**: `binary`
  - **Purpose**: Prisma CLI engine type
  - **Security**: 🔴 LOW - Configuration only

- [ ] **`PRISMA_CLIENT_ENGINE_TYPE`**
  - **Value**: `binary`
  - **Purpose**: Prisma client engine type
  - **Security**: 🔴 LOW - Configuration only

---

## ⚙️ **PART 3: NETLIFY-SPECIFIC VARIABLES (5 variables)**
*These are required for Netlify deployment*

### ✅ **Build Configuration (5 variables)**
- [ ] **`NETLIFY`**
  - **Value**: `true`
  - **Purpose**: Indicates Netlify environment
  - **Security**: ✅ Safe (configuration only)

- [ ] **`BUILD_ID`**
  - **Value**: `netlify-build`
  - **Purpose**: Build identification for caching
  - **Security**: ✅ Safe (configuration only)

- [ ] **`NODE_VERSION`**
  - **Value**: `20`
  - **Purpose**: Node.js version for build
  - **Security**: ✅ Safe (configuration only)

- [ ] **`NPM_VERSION`**
  - **Value**: `10`
  - **Purpose**: npm version for build
  - **Security**: ✅ Safe (configuration only)

- [ ] **`NEXT_TELEMETRY_DISABLED`**
  - **Value**: `1`
  - **Purpose**: Disable Next.js telemetry
  - **Security**: ✅ Safe (configuration only)

---

## 🚀 **PART 4: HOW TO ADD VARIABLES IN NETLIFY DASHBOARD**

### **Step-by-Step Instructions**

#### **Method 1: Netlify Dashboard UI**
1. **Log in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in to your account

2. **Select Your Site**
   - Choose your TutorMe application
   - Navigate to **Site settings**

3. **Go to Environment Variables**
   - Click **Build & deploy** in the left menu
   - Select **Environment** tab
   - Click **Edit variables**

4. **Add Variables**
   - Click **Add a variable**
   - Enter **Key** (variable name)
   - Enter **Value** (your actual value)
   - Click **Save**

5. **Set Environment Context**
   - Choose variable scope:
     - **All contexts** (development, production, etc.)
     - **Production only**
     - **Deploy previews only**
     - **Branch deploys only**

#### **Method 2: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Add environment variable
netlify env:set VARIABLE_NAME "variable_value"

# Set for specific context
netlify env:set VARIABLE_NAME "variable_value" --context production

# List all variables
netlify env:list

# Delete variable
netlify env:unset VARIABLE_NAME
```

#### **Method 3: netlify.toml (Not Recommended for Secrets)**
```toml
[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"
  
[context.production.environment]
  NODE_ENV = "production"
  
[context.deploy-preview.environment]
  NODE_ENV = "development"
```

---

## 🔄 **PART 5: DEVELOPMENT VS PRODUCTION DIFFERENCES**

### **Development Environment (.env.local)**
```bash
# Application
NODE_ENV=development
DEBUG=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# PayPal (Sandbox)
PAYPAL_ENVIRONMENT=sandbox

# NextAuth (Development Secret)
NEXTAUTH_SECRET=a2bfb02c24ea0f075097549e56e0135f
```

### **Production Environment (Netlify)**
```bash
# Application
NODE_ENV=production
DEBUG=false
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
NEXTAUTH_URL=https://your-app-name.netlify.app

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# PayPal (Live)
PAYPAL_ENVIRONMENT=live

# NextAuth (Production Secret - GENERATE NEW)
NEXTAUTH_SECRET=your_new_secure_secret_here

# Netlify-specific
NETLIFY=true
BUILD_ID=netlify-build
NODE_VERSION=20
NPM_VERSION=10
```

### **Key Differences Summary**
| Variable | Development | Production | Notes |
|----------|-------------|------------|-------|
| `NODE_ENV` | `development` | `production` | Critical for app behavior |
| `DEBUG` | `true` | `false` | Disable debug in production |
| `NEXT_PUBLIC_APP_URL` | `localhost:3000` | Your Netlify URL | Update for production |
| `NEXTAUTH_URL` | `localhost:3000` | Your Netlify URL | Critical for auth |
| `DATABASE_URL` | SQLite file | Production database | Use managed database |
| `PAYPAL_ENVIRONMENT` | `sandbox` | `live` | Switch for real payments |
| `NEXTAUTH_SECRET` | Development secret | **Generate new** | Security critical |

---

## 🔒 **PART 6: SECURITY BEST PRACTICES**

### **🛡️ API Key Security**
- [ ] **Generate new secrets** for production (don't reuse development values)
- [ ] **Use strong secrets** (minimum 32 characters, mix of letters, numbers, symbols)
- [ ] **Rotate keys regularly** (every 3-6 months)
- [ ] **Monitor usage** for unusual activity
- [ ] **Revoke compromised keys** immediately

### **🔍 Access Control**
- [ ] **Limit access** to Netlify dashboard to authorized team members
- [ ] **Use 2FA** on all accounts with access to API keys
- [ ] **Audit access logs** regularly
- [ ] **Document key ownership** and responsibilities

### **📝 Documentation**
- [ ] **Document all variables** and their purposes
- [ ] **Keep backup** of configuration (without actual values)
- [ ] **Update documentation** when variables change
- [ ] **Train team members** on security practices

### **🚨 Monitoring**
- [ ] **Set up alerts** for unusual API usage
- [ ] **Monitor error rates** related to authentication
- [ ] **Check for exposed keys** in browser console
- [ ] **Regular security audits** of environment variables

### **🔄 Backup & Recovery**
- [ ] **Backup configuration** (without secrets)
- [ ] **Document recovery process** for compromised keys
- [ ] **Have emergency contacts** for service providers
- [ ] **Test key rotation** process regularly

---

## 📋 **PART 7: QUICK SETUP CHECKLIST**

### **Pre-Setup Checklist**
- [ ] **Netlify account** created and verified
- [ ] **GitHub repository** connected to Netlify
- [ ] **All API keys** obtained from service providers
- [ ] **Production database** set up and ready
- [ ] **Custom domain** (if using) configured

### **Frontend Variables (8)**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `PAYPAL_ENVIRONMENT`
- [ ] `NEXT_PUBLIC_APP_URL`

### **Backend Variables (19)**
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL`
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY`
- [ ] `FIREBASE_ADMIN_PROJECT_ID`
- [ ] `OPENROUTER_API_KEY`
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_WEBHOOK_ID` (optional)
- [ ] `PAYPAL_WEBHOOK_URL` (optional)
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_API_KEY`
- [ ] `TWILIO_API_SECRET`
- [ ] `TWILIO_AUTH_TOKEN` (optional)
- [ ] `NEXTAUTH_SECRET` (generate new for production)
- [ ] `NEXTAUTH_URL`
- [ ] `DATABASE_URL`
- [ ] `NODE_ENV`
- [ ] `DEBUG`
- [ ] `PRISMA_CLI_QUERY_ENGINE_TYPE`
- [ ] `PRISMA_CLIENT_ENGINE_TYPE`

### **Netlify Variables (5)**
- [ ] `NETLIFY`
- [ ] `BUILD_ID`
- [ ] `NODE_VERSION`
- [ ] `NPM_VERSION`
- [ ] `NEXT_TELEMETRY_DISABLED`

### **Post-Setup Verification**
- [ ] **Deploy application** to Netlify
- [ ] **Test all features** (auth, payments, video, etc.)
- [ ] **Check browser console** for errors
- [ ] **Verify API calls** are working
- [ ] **Test authentication** flow
- [ ] **Verify environment-specific** behavior
- [ ] **Monitor logs** for issues

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

#### **Variables Not Loading**
- **Symptom**: API calls failing, auth not working
- **Solution**: Check variable names match exactly, redeploy after changes

#### **Build Failures**
- **Symptom**: Build process fails
- **Solution**: Check for missing variables, verify syntax

#### **Authentication Issues**
- **Symptom**: Users can't log in
- **Solution**: Verify `NEXTAUTH_URL` matches deployment URL

#### **Payment Processing Issues**
- **Symptom**: PayPal payments not working
- **Solution**: Verify PayPal environment mode, check webhook URLs

#### **Database Connection Issues**
- **Symptom**: Can't connect to database
- **Solution**: Verify `DATABASE_URL`, check database accessibility

### **Debug Commands**
```bash
# Check Netlify environment variables
netlify env:list

# Test build locally
npm run build

# Test with Netlify CLI
netlify dev

# Check deployment logs
netlify logs
```

---

## 📞 **SUPPORT**

If you encounter issues:
- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com/)
- **Netlify Community**: [community.netlify.com](https://community.netlify.com/)
- **Netlify Status**: [www.netlifystatus.com](https://www.netlifystatus.com/)
- **Service Providers**: Check respective documentation for API key issues

---

## ✅ **FINAL VERIFICATION**

After completing this checklist:
- [ ] All 27 environment variables are configured
- [ ] Frontend and backend variables are properly separated
- [ ] Production values are used (not development)
- [ ] Security best practices are followed
- [ ] Application is fully functional on Netlify
- [ ] All features are tested and working
- [ ] Documentation is updated

Your TutorMe application is now ready for production deployment on Netlify! 🎉