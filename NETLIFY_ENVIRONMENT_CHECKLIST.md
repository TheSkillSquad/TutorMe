# ===========================================
# TutorMe Application Environment Variables Template
# ===========================================
# Copy this file to .env.local and fill in your actual values
# DO NOT commit this file with real values to version control

# ===========================================
# Firebase Configuration
# ===========================================
# Client-side variables (safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# Server-side variables (KEEP SECRET)
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email_here
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_admin_private_key_here
FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id_here

# ===========================================
# OpenRouter AI Configuration
# ===========================================
# Server-side variable (KEEP SECRET)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# ===========================================
# PayPal Configuration
# ===========================================
# Server-side variables (KEEP SECRET)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Client-side variable (safe to expose)
PAYPAL_ENVIRONMENT=sandbox  # Change to 'live' for production

# Optional server-side variables (KEEP SECRET)
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
PAYPAL_WEBHOOK_URL=your_paypal_webhook_url_here

# ===========================================
# Twilio Video Configuration
# ===========================================
# Server-side variables (KEEP SECRET)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_API_KEY=your_twilio_api_key_here
TWILIO_API_SECRET=your_twilio_api_secret_here

# Optional server-side variable (KEEP SECRET)
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

# ===========================================
# NextAuth.js Configuration
# ===========================================
# Server-side variable (KEEP SECRET)
NEXTAUTH_SECRET=generate_a_secure_random_string_here

# Client-side variable (safe to expose)
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL

# ===========================================
# Database Configuration (Prisma)
# ===========================================
# Server-side variable (KEEP SECRET)
DATABASE_URL="file:./dev.db"  # SQLite for development
# For production: "postgresql://user:password@host:port/database"

# ===========================================
# Application Configuration
# ===========================================
# Server-side variables
NODE_ENV=development
DEBUG=false

# Client-side variable (safe to expose)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# Netlify Configuration
# ===========================================
# Netlify-specific variables
NETLIFY=true
BUILD_ID=netlify-build
NODE_VERSION=20
NPM_VERSION=10
NEXT_TELEMETRY_DISABLED=1

# ===========================================
# Prisma Configuration
# ===========================================
# Server-side variables
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
PRISMA_CLIENT_ENGINE_TYPE=binary

# ===========================================
# Security Notes
# ===========================================
# 1. Variables starting with NEXT_PUBLIC_ are exposed to the browser
# 2. All other variables are server-side only
# 3. Never commit .env.local with real values to git
# 4. Generate new NEXTAUTH_SECRET for production
# 5. Use different values for development and production
# 6. Regularly rotate API keys and secrets
# 7. Monitor API usage for unusual activity