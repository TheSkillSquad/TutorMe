# TutorMe Netlify Functions Setup Guide

This comprehensive guide covers the complete setup and configuration of Netlify Functions for your TutorMe application's backend functionality.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Function Categories](#function-categories)
4. [Setup Instructions](#setup-instructions)
5. [Environment Variables](#environment-variables)
6. [Function Details](#function-details)
7. [Real-time Features](#real-time-features)
8. [Security Considerations](#security-considerations)
9. [Testing and Debugging](#testing-and-debugging)
10. [Deployment](#deployment)
11. [Monitoring and Logging](#monitoring-and-logging)
12. [Troubleshooting](#troubleshooting)

## Overview

The TutorMe application uses Netlify Functions to provide a complete serverless backend for all features including authentication, user management, payment processing, video sessions, AI course generation, and real-time communication.

### Key Features
- **Serverless Architecture**: No server management required
- **Auto-scaling**: Scales automatically with traffic
- **Global CDN**: Functions deployed globally
- **Cost-effective**: Pay-per-use pricing
- **Integrated**: Works seamlessly with Netlify hosting

### Function Categories
1. **Authentication**: User registration, login, session management
2. **User Management**: Profile, skills, availability management
3. **Payment Processing**: PayPal orders, subscriptions, captures
4. **Video Sessions**: Twilio room creation, token generation
5. **AI Features**: Course generation, tutor matching, exercises
6. **Database Operations**: Health checks, migrations
7. **Real-time Features**: WebSocket proxy, Pusher integration

## Architecture

```
TutorMe Application
├── Frontend (Next.js)
├── Netlify Functions (Backend)
│   ├── utils/                    # Shared utilities
│   │   ├── response.js          # Response helpers
│   │   ├── auth.js              # Authentication utilities
│   │   ├── database.js          # Database helpers
│   │   └── validation.js        # Input validation
│   ├── auth/                    # Authentication functions
│   │   ├── nextauth.js         # NextAuth.js handler
│   │   ├── register.js         # User registration
│   │   └── create-user.js      # Admin user creation
│   ├── user/                    # User management functions
│   │   ├── profile.js          # User profile CRUD
│   │   ├── skills.js           # Skills management
│   │   └── availability.js     # Availability management
│   ├── payment/                 # Payment processing
│   │   ├── paypal-service.js   # PayPal service utilities
│   │   ├── create-order.js     # Create PayPal orders
│   │   ├── capture-order.js    # Capture PayPal payments
│   │   └── subscription.js    # Subscription management
│   ├── video/                   # Video session functions
│   │   ├── twilio-service.js   # Twilio service utilities
│   │   ├── token.js            # Generate video tokens
│   │   └── room.js             # Room management
│   ├── ai/                      # AI features
│   │   ├── openrouter-service.js # OpenRouter AI service
│   │   ├── generate-course.js   # Course generation
│   │   ├── find-matches.js     # Tutor matching
│   │   └── generate-exercise.js # Exercise generation
│   ├── database/                # Database operations
│   │   ├── health.js           # Health checks
│   │   └── migrate.js          # Database migrations
│   └── websocket/               # Real-time features
│       ├── handler.js          # WebSocket handler
│       ├── pusher-config.js    # Pusher configuration
│       └── pusher-auth.js      # Pusher authentication
└── External Services
    ├── Firebase (Authentication)
    ├── PayPal (Payments)
    ├── Twilio (Video)
    ├── OpenRouter AI (AI features)
    └── Pusher (Real-time)
```

## Function Categories

### 1. Authentication Functions

#### `auth/nextauth.js`
- **Purpose**: NextAuth.js authentication handler
- **Endpoints**: `/signin`, `/signup`, `/session`, `/callback`, `/csrf`, `/providers`
- **Methods**: GET, POST, DELETE
- **Features**: JWT token generation, OAuth callbacks, session management

#### `auth/register.js`
- **Purpose**: User registration
- **Endpoint**: `/register`
- **Method**: POST
- **Features**: Email validation, password hashing, user creation

#### `auth/create-user.js`
- **Purpose**: Admin user creation
- **Endpoint**: `/create-user`
- **Method**: POST
- **Features**: Admin-only access, user role assignment

### 2. User Management Functions

#### `user/profile.js`
- **Purpose**: User profile CRUD operations
- **Endpoint**: `/profile`
- **Methods**: GET, PUT, PATCH
- **Features**: Profile updates, Firebase sync, sensitive data filtering

#### `user/skills.js`
- **Purpose**: User skills management
- **Endpoint**: `/skills`
- **Methods**: GET, POST, PUT, DELETE
- **Features**: Add/remove skills, skill validation, duplicates prevention

#### `user/availability.js`
- **Purpose**: User availability management
- **Endpoint**: `/availability`
- **Methods**: GET, PUT, PATCH
- **Features**: Time slot management, validation, format checking

### 3. Payment Processing Functions

#### `payment/paypal-service.js`
- **Purpose**: PayPal service utilities
- **Features**: Order creation, payment capture, subscription management, payouts
- **Integration**: PayPal Checkout Server SDK

#### `payment/create-order.js`
- **Purpose**: Create PayPal orders
- **Endpoint**: `/create-order`
- **Method**: POST
- **Features**: Order validation, amount checking, database storage

#### `payment/capture-order.js`
- **Purpose**: Capture PayPal payments
- **Endpoint**: `/capture-order`
- **Method**: POST
- **Features**: Payment verification, subscription activation, transaction logging

#### `payment/subscription.js`
- **Purpose**: PayPal subscription management
- **Endpoint**: `/subscription`
- **Methods**: GET, POST, DELETE, PATCH
- **Features**: Subscription creation, cancellation, activation, suspension

### 4. Video Session Functions

#### `video/twilio-service.js`
- **Purpose**: Twilio Video service utilities
- **Features**: Token generation, room management, participant handling, recording
- **Integration**: Twilio Video SDK

#### `video/token.js`
- **Purpose**: Generate Twilio video tokens
- **Endpoint**: `/token`
- **Method**: POST
- **Features**: Token validation, subscription checks, identity verification

#### `video/room.js`
- **Purpose**: Video room management
- **Endpoint**: `/room`
- **Methods**: GET, POST, DELETE
- **Features**: Room creation, participant management, statistics

### 5. AI Features Functions

#### `ai/openrouter-service.js`
- **Purpose**: OpenRouter AI service utilities
- **Features**: Course generation, tutor matching, exercise creation, quiz generation
- **Integration**: ZAI Web Dev SDK

#### `ai/generate-course.js`
- **Purpose**: Generate AI courses
- **Endpoint**: `/generate-course`
- **Method**: POST
- **Features**: Course structure, exercises, quizzes, projects

#### `ai/find-matches.js`
- **Purpose**: Find tutor matches
- **Endpoint**: `/find-matches`
- **Method**: POST
- **Features**: Skill matching, preference filtering, scoring

#### `ai/generate-exercise.js`
- **Purpose**: Generate exercises
- **Endpoint**: `/generate-exercise`
- **Method**: POST
- **Features**: Exercise creation, difficulty levels, type selection

### 6. Database Functions

#### `database/health.js`
- **Purpose**: Database health checks
- **Endpoint**: `/health`
- **Method**: GET
- **Features**: Connection testing, table validation, environment checks

#### `database/migrate.js`
- **Purpose**: Database migrations
- **Endpoint**: `/migrate`
- **Method**: POST
- **Features**: Schema pushing, client generation, database reset

### 7. Real-time Features

#### `websocket/handler.js`
- **Purpose**: WebSocket handler (Edge Function)
- **Features**: WebSocket proxy, service configuration
- **Note**: Netlify doesn't support native WebSockets

#### `websocket/pusher-config.js`
- **Purpose**: Pusher configuration
- **Endpoint**: `/pusher-config`
- **Method**: GET
- **Features**: Channel configuration, event definitions

#### `websocket/pusher-auth.js`
- **Purpose**: Pusher authentication
- **Endpoint**: `/pusher-auth`
- **Method**: POST
- **Features**: Channel access control, user authentication

## Setup Instructions

### 1. Prerequisites

- **Netlify Account**: Free or paid account
- **Node.js**: Version 20+
- **Netlify CLI**: `npm install -g netlify-cli`
- **All API Keys**: From respective service providers

### 2. Project Structure Setup

```bash
# Create functions directory structure
mkdir -p netlify/functions/{auth,user,payment,video,ai,database,websocket,utils}

# Copy all function files from this guide
# Ensure all files are in the correct directories
```

### 3. Install Dependencies

```bash
# Install required packages
npm install @paypal/checkout-server-sdk
npm install @paypal/payouts-sdk
npm install twilio
npm install @prisma/client
npm install prisma
npm install z-ai-web-dev-sdk
npm install joi
npm install jsonwebtoken
npm install firebase-admin
npm install pusher
```

### 4. Configure Environment Variables

Add all required environment variables to your Netlify dashboard:

#### Authentication Variables
```bash
FIREBASE_ADMIN_CLIENT_EMAIL=your_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_PROJECT_ID=your_project_id
NEXTAUTH_SECRET=your_secret
```

#### Payment Variables
```bash
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_ENVIRONMENT=sandbox
```

#### Video Variables
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_API_KEY=your_api_key
TWILIO_API_SECRET=your_api_secret
```

#### AI Variables
```bash
OPENROUTER_API_KEY=your_api_key
```

#### Database Variables
```bash
DATABASE_URL=your_database_url
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
PRISMA_CLIENT_ENGINE_TYPE=binary
```

#### Real-time Variables
```bash
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
```

### 5. Update netlify.toml

Add the following to your `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"
  functions = "netlify/functions"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

  [functions."*"]
    external_node_modules = ["firebase", "firebase-admin", "twilio", "@paypal/checkout-server-sdk", "z-ai-web-dev-sdk"]

# Redirect rules for API routes
[[redirects]]
  from = "/api/auth/*"
  to = "/.netlify/functions/auth/:splat"
  status = 200

[[redirects]]
  from = "/api/user/*"
  to = "/.netlify/functions/user/:splat"
  status = 200

[[redirects]]
  from = "/api/payment/*"
  to = "/.netlify/functions/payment/:splat"
  status = 200

[[redirects]]
  from = "/api/video/*"
  to = "/.netlify/functions/video/:splat"
  status = 200

[[redirects]]
  from = "/api/ai/*"
  to = "/.netlify/functions/ai/:splat"
  status = 200

[[redirects]]
  from = "/api/database/*"
  to = "/.netlify/functions/database/:splat"
  status = 200

[[redirects]]
  from = "/api/websocket/*"
  to = "/.netlify/functions/websocket/:splat"
  status = 200

# Edge functions for WebSocket
[[edge_functions]]
  path = "/api/websocket/*"
  function = "handler"
```

### 6. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations (if using)
npx prisma migrate deploy
```

### 7. Test Functions Locally

```bash
# Start Netlify dev server
netlify dev

# Test individual functions
netlify functions:invoke auth-register --payload '{"email":"test@example.com","password":"password123","displayName":"Test User"}'

# Test health check
netlify functions:invoke database-health
```

## Environment Variables

### Required Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase admin email | Yes | `xxx@xxx.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase private key | Yes | `-----BEGIN PRIVATE KEY-----...` |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase project ID | Yes | `your-project-id` |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes | `your-secret-key` |
| `PAYPAL_CLIENT_ID` | PayPal client ID | Yes | `your-client-id` |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret | Yes | `your-client-secret` |
| `PAYPAL_ENVIRONMENT` | PayPal environment | Yes | `sandbox` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Yes | `ACxxx` |
| `TWILIO_API_KEY` | Twilio API key | Yes | `SKxxx` |
| `TWILIO_API_SECRET` | Twilio API secret | Yes | `your-secret` |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes | `sk-or-v1-xxx` |
| `DATABASE_URL` | Database URL | Yes | `postgresql://...` |
| `PRISMA_CLI_QUERY_ENGINE_TYPE` | Prisma CLI engine | Yes | `binary` |
| `PRISMA_CLIENT_ENGINE_TYPE` | Prisma client engine | Yes | `binary` |

### Optional Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PUSHER_APP_ID` | Pusher app ID | No | `xxx` |
| `PUSHER_KEY` | Pusher key | No | `xxx` |
| `PUSHER_SECRET` | Pusher secret | No | `xxx` |
| `PUSHER_CLUSTER` | Pusher cluster | No | `us2` |
| `PAYPAL_WEBHOOK_ID` | PayPal webhook ID | No | `xxx` |
| `PAYPAL_WEBHOOK_URL` | PayPal webhook URL | No | `https://...` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No | `xxx` |

## Function Details

### Authentication Flow

1. **User Registration**: `POST /auth/register`
   - Validates input
   - Creates Firebase user
   - Creates database record
   - Returns JWT token

2. **User Login**: `POST /auth/nextauth/signin`
   - Validates credentials
   - Generates JWT token
   - Returns user data

3. **Session Management**: `GET /auth/nextauth/session`
   - Validates JWT token
   - Returns user session data
   - Handles token refresh

### Payment Flow

1. **Create Order**: `POST /payment/create-order`
   - Validates user and subscription
   - Creates PayPal order
   - Returns order details

2. **Capture Payment**: `POST /payment/capture-order`
   - Captures PayPal payment
   - Updates database
   - Activates subscription

3. **Subscription Management**: `POST /payment/subscription`
   - Creates PayPal subscription
   - Manages subscription lifecycle
   - Handles cancellations

### Video Session Flow

1. **Generate Token**: `POST /video/token`
   - Validates user subscription
   - Generates Twilio token
   - Returns token and room info

2. **Create Room**: `POST /video/room`
   - Creates Twilio room
   - Sets up recording options
   - Returns room details

3. **Manage Room**: `GET /video/room`
   - Lists active rooms
   - Shows participants
   - Provides statistics

### AI Features Flow

1. **Generate Course**: `POST /ai/generate-course`
   - Validates user subscription
   - Calls OpenRouter API
   - Returns structured course

2. **Find Matches**: `POST /ai/find-matches`
   - Analyzes user requirements
   - Matches with tutors
   - Returns ranked results

3. **Generate Exercise**: `POST /ai/generate-exercise`
   - Creates custom exercises
   - Includes solutions and hints
   - Varies by difficulty

## Real-time Features

### WebSocket Limitations

Netlify Functions don't support native WebSocket connections. Alternatives:

1. **Pusher** (Recommended)
   - Real-time messaging
   - Channel authentication
   - Event broadcasting

2. **Firebase Realtime Database**
   - Real-time data sync
   - Built-in authentication
   - Offline support

3. **Dedicated WebSocket Server**
   - Full WebSocket support
   - Custom protocols
   - Requires separate hosting

### Pusher Integration

1. **Setup Pusher Account**
   - Create app at [pusher.com](https://pusher.com)
   - Get credentials
   - Configure channels

2. **Frontend Integration**
   ```javascript
   import Pusher from 'pusher-js';
   
   const pusher = new Pusher('your-key', {
     cluster: 'your-cluster',
     authEndpoint: '/.netlify/functions/websocket/pusher-auth',
   });
   ```

3. **Channel Types**
   - `private-user-{userId}`: User-specific events
   - `private-session-{sessionId}`: Session events
   - `private-course-{courseId}`: Course events
   - `notifications`: Public notifications

### Event Types

- **User Events**: `user-online`, `user-offline`, `user-updated`
- **Session Events**: `session-started`, `session-ended`, `participant-joined`
- **Notification Events**: `notification-new`, `notification-read`
- **Course Events**: `course-created`, `course-updated`, `course-published`
- **Payment Events**: `payment-completed`, `subscription-activated`

## Security Considerations

### Authentication

1. **JWT Tokens**
   - Use strong secrets
   - Set appropriate expiration
   - Validate on every request

2. **API Key Security**
   - Never expose in frontend
   - Use environment variables
   - Rotate regularly

3. **Input Validation**
   - Validate all inputs
   - Sanitize user data
   - Use schema validation

### Data Protection

1. **Sensitive Data**
   - Never return sensitive data
   - Encrypt stored data
   - Use secure connections

2. **Rate Limiting**
   - Implement rate limiting
   - Monitor API usage
   - Block suspicious requests

3. **CORS Configuration**
   - Restrict origins
   - Use secure headers
   - Enable HTTPS only

### Access Control

1. **Subscription Checks**
   - Verify active subscriptions
   - Check feature access
   - Validate user permissions

2. **Channel Access**
   - Authenticate WebSocket channels
   - Validate channel ownership
   - Implement proper authorization

## Testing and Debugging

### Local Testing

```bash
# Start Netlify dev server
netlify dev

# Test functions with curl
curl -X POST http://localhost:8888/.netlify/functions/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'

# Test with Netlify CLI
netlify functions:invoke auth-register --payload '{"email":"test@example.com","password":"password123","displayName":"Test User"}'
```

### Unit Testing

```javascript
// Example test for auth function
const { handler } = require('./auth/register');
const { createEvent } = require('@netlify/functions');

test('user registration', async () => {
  const event = createEvent({
    httpMethod: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    }),
  });

  const response = await handler(event);
  expect(response.statusCode).toBe(201);
  expect(JSON.parse(response.body).success).toBe(true);
});
```

### Integration Testing

```javascript
// Test complete user flow
describe('User Flow', () => {
  test('register -> login -> get profile', async () => {
    // Register user
    const registerResponse = await registerUser(userData);
    expect(registerResponse.statusCode).toBe(201);

    // Login user
    const loginResponse = await loginUser(credentials);
    expect(loginResponse.statusCode).toBe(200);

    // Get profile
    const profileResponse = await getUserProfile(loginResponse.token);
    expect(profileResponse.statusCode).toBe(200);
  });
});
```

### Debugging Tips

1. **Console Logging**
   ```javascript
   console.log('Function started:', event.path);
   console.log('User:', decodedToken.uid);
   console.log('Data:', validatedData);
   ```

2. **Error Handling**
   ```javascript
   try {
     // Your code
   } catch (error) {
     console.error('Error details:', error);
     return ResponseHelper.serverError(error.message);
   }
   ```

3. **Netlify Logs**
   ```bash
   # View function logs
   netlify logs

   # Stream logs in real-time
   netlify logs --follow
   ```

## Deployment

### Automated Deployment

1. **GitHub Integration**
   - Connect repository to Netlify
   - Configure build settings
   - Set up environment variables

2. **Build Configuration**
   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
     functions = "netlify/functions"
   ```

3. **Deploy Hooks**
   ```bash
   # Trigger deployment
   curl -X POST https://api.netlify.com/build_hooks/your-hook-id
   ```

### Manual Deployment

```bash
# Build and deploy
npm run build
netlify deploy --prod

# Deploy specific functions
netlify deploy --prod --functions=netlify/functions
```

### Environment-specific Deployment

```bash
# Deploy to different environments
netlify deploy --prod --alias=staging
netlify deploy --prod --alias=production
```

## Monitoring and Logging

### Netlify Analytics

1. **Function Metrics**
   - Invocation count
   - Execution duration
   - Error rates
   - Memory usage

2. **Custom Logging**
   ```javascript
   console.log('User action:', { userId, action, timestamp });
   console.warn('Warning:', { message, details });
   console.error('Error:', { error, stack });
   ```

3. **Error Tracking**
   ```javascript
   try {
     // Your code
   } catch (error) {
     console.error('Function error:', {
       error: error.message,
       stack: error.stack,
       user: decodedToken.uid,
       timestamp: new Date().toISOString(),
     });
     throw error;
   }
   ```

### External Monitoring

1. **Sentry Integration**
   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

2. **Custom Metrics**
   ```javascript
   // Track custom metrics
   const metrics = {
     userRegistrations: 0,
     paymentsProcessed: 0,
     videoSessions: 0,
   };
   
   // Increment metrics
   metrics.userRegistrations++;
   console.log('Metrics:', metrics);
   ```

### Performance Monitoring

1. **Response Times**
   ```javascript
   const startTime = Date.now();
   // Your code here
   const duration = Date.now() - startTime;
   console.log('Function duration:', duration + 'ms');
   ```

2. **Database Queries**
   ```javascript
   const queryStartTime = Date.now();
   await prisma.user.findMany();
   const queryDuration = Date.now() - queryStartTime;
   console.log('Database query duration:', queryDuration + 'ms');
   ```

## Troubleshooting

### Common Issues

#### 1. Function Not Found
```
Error: Function not found
```
**Solution**: Check function path in `netlify.toml` and ensure files are in correct directories.

#### 2. Environment Variables Missing
```
Error: Missing environment variable
```
**Solution**: Add required variables to Netlify dashboard and redeploy.

#### 3. Database Connection Failed
```
Error: Failed to connect to database
```
**Solution**: Check `DATABASE_URL`, ensure database is accessible, verify credentials.

#### 4. Authentication Failed
```
Error: Invalid token
```
**Solution**: Check JWT secret, verify token format, ensure proper headers.

#### 5. Payment Processing Failed
```
Error: PayPal API error
```
**Solution**: Check PayPal credentials, verify API permissions, check sandbox vs production.

#### 6. Video Token Generation Failed
```
Error: Twilio API error
```
**Solution**: Check Twilio credentials, verify account permissions, check room configuration.

#### 7. AI Features Not Working
```
Error: OpenRouter API error
```
**Solution**: Check API key, verify subscription status, check rate limits.

### Debug Commands

```bash
# Check function logs
netlify logs

# Test function locally
netlify functions:invoke function-name

# Check environment variables
netlify env:list

# Clear cache
netlify cache:clear

# Redeploy functions
netlify deploy --functions=netlify/functions
```

### Performance Issues

1. **Cold Starts**
   - Use keep-alive requests
   - Optimize function size
   - Minimize dependencies

2. **Memory Limits**
   - Monitor memory usage
   - Optimize database queries
   - Use streaming for large responses

3. **Timeout Issues**
   - Implement async processing
   - Use background jobs
   - Optimize external API calls

### Support Resources

- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com/)
- **Netlify Functions Guide**: [docs.netlify.com/functions/](https://docs.netlify.com/functions/)
- **Community Forum**: [community.netlify.com](https://community.netlify.com/)
- **Status Page**: [www.netlifystatus.com](https://www.netlifystatus.com/)

---

This comprehensive guide provides everything needed to set up and manage Netlify Functions for your TutorMe application. Follow the instructions carefully, test thoroughly, and monitor your functions for optimal performance.