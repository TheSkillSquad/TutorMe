// Netlify Function for NextAuth.js authentication
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  try {
    const path = event.path.replace('/.netlify/functions/auth/nextauth', '');
    const method = event.httpMethod;

    // Route handling based on path and method
    if (path === '/signin' && method === 'POST') {
      return await handleSignIn(event);
    } else if (path === '/signup' && method === 'POST') {
      return await handleSignUp(event);
    } else if (path === '/session' && method === 'GET') {
      return await handleGetSession(event);
    } else if (path === '/session' && method === 'DELETE') {
      return await handleSignOut(event);
    } else if (path === '/callback' && method === 'POST') {
      return await handleCallback(event);
    } else if (path === '/csrf' && method === 'GET') {
      return await handleCSRF(event);
    } else if (path === '/providers' && method === 'GET') {
      return await handleProviders(event);
    } else {
      return ResponseHelper.notFound('Authentication endpoint not found');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return ResponseHelper.serverError(error.message);
  }
};

async function handleSignIn(event) {
  try {
    const { email, password } = JSON.parse(event.body);
    
    if (!email || !password) {
      return ResponseHelper.validationError('Email and password are required');
    }

    // Note: This is a simplified implementation
    // In a real application, you'd use Firebase Auth or another auth provider
    const user = await DatabaseHelper.findUserByEmail(email);
    
    if (!user) {
      return ResponseHelper.unauthorized('Invalid credentials');
    }

    // Generate JWT token
    const token = AuthHelper.generateJWT({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });

    return ResponseHelper.success({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      token,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return ResponseHelper.unauthorized('Authentication failed');
  }
}

async function handleSignUp(event) {
  try {
    const { email, password, displayName } = JSON.parse(event.body);
    
    if (!email || !password || !displayName) {
      return ResponseHelper.validationError('Email, password, and display name are required');
    }

    // Check if user already exists
    const existingUser = await DatabaseHelper.findUserByEmail(email);
    if (existingUser) {
      return ResponseHelper.validationError('User already exists');
    }

    // Create user in Firebase (simplified)
    const firebaseUser = await AuthHelper.createUser({
      email,
      password,
      displayName,
    });

    // Create user in database
    const dbUser = await DatabaseHelper.createUser({
      uid: firebaseUser.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
    });

    // Generate JWT token
    const token = AuthHelper.generateJWT({
      uid: dbUser.uid,
      email: dbUser.email,
      displayName: dbUser.displayName,
    });

    return ResponseHelper.success({
      user: {
        uid: dbUser.uid,
        email: dbUser.email,
        displayName: dbUser.displayName,
        createdAt: dbUser.createdAt,
      },
      token,
    }, 201);
  } catch (error) {
    console.error('Sign up error:', error);
    return ResponseHelper.serverError('Failed to create user');
  }
}

async function handleGetSession(event) {
  try {
    const token = AuthHelper.extractTokenFromHeader(event);
    if (!token) {
      return ResponseHelper.unauthorized();
    }

    const decoded = AuthHelper.verifyJWT(token);
    const user = await DatabaseHelper.findUserByUid(decoded.uid);
    
    if (!user) {
      return ResponseHelper.unauthorized('User not found');
    }

    return ResponseHelper.success({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return ResponseHelper.unauthorized('Invalid session');
  }
}

async function handleSignOut(event) {
  try {
    const token = AuthHelper.extractTokenFromHeader(event);
    if (token) {
      // You could add token to a blacklist here if needed
      // For now, we just clear the client-side token
    }

    return ResponseHelper.success({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    return ResponseHelper.serverError('Failed to sign out');
  }
}

async function handleCallback(event) {
  try {
    // Handle OAuth callbacks from providers like Google, GitHub, etc.
    const { provider, code } = JSON.parse(event.body);
    
    // This is a simplified implementation
    // In a real application, you'd handle the OAuth flow properly
    
    return ResponseHelper.success({ 
      message: 'OAuth callback handled',
      provider,
    });
  } catch (error) {
    console.error('Callback error:', error);
    return ResponseHelper.serverError('Failed to handle callback');
  }
}

async function handleCSRF(event) {
  try {
    // Generate CSRF token for form protection
    const csrfToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    return ResponseHelper.success({ csrfToken });
  } catch (error) {
    console.error('CSRF error:', error);
    return ResponseHelper.serverError('Failed to generate CSRF token');
  }
}

async function handleProviders(event) {
  try {
    // Return available authentication providers
    const providers = [
      { id: 'google', name: 'Google', type: 'oauth' },
      { id: 'github', name: 'GitHub', type: 'oauth' },
      { id: 'email', name: 'Email', type: 'credentials' },
    ];

    return ResponseHelper.success({ providers });
  } catch (error) {
    console.error('Providers error:', error);
    return ResponseHelper.serverError('Failed to get providers');
  }
}