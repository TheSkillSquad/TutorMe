// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

/**
 * Robust Firebase Admin initializer that:
 * - Tries GOOGLE_APPLICATION_CREDENTIALS (service account JSON path) if set
 * - Tries env vars (FIREBASE_ADMIN_* or FIREBASE_*), with \n normalization for private key
 * - In development, tries a local JSON at ./.keys/firebase-service-account.json (optional)
 * - Avoids throwing during module import; initializes lazily when you first call a method
 */

let initialized = false;

/** Normalize PEM private key from env (handles Windows-style \n) */
function normalizePrivateKey(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  // Remove surrounding quotes if present and convert literal \n to real newlines
  const trimmed = raw.trim().replace(/^"(.*)"$/, '$1');
  return trimmed.replace(/\\n/g, '\n');
}

function tryInit(): void {
  if (initialized || admin.apps.length) {
    initialized = true;
    return;
  }

  // 1) Prefer GOOGLE_APPLICATION_CREDENTIALS if provided
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      initialized = true;
      return;
    }
  } catch {
    // fall through to next method
  }

  // 2) Try env var certificate (supports FIREBASE_ADMIN_* and FIREBASE_* names)
  try {
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

    const clientEmail =
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;

    const privateKey = normalizePrivateKey(
      process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY
    );

    if (projectId && clientEmail && privateKey?.includes('BEGIN PRIVATE KEY')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      initialized = true;
      return;
    }
  } catch {
    // fall through to next method
  }

  // 3) Dev convenience: local JSON file at ./.keys/firebase-service-account.json
  try {
    if (process.env.NODE_ENV !== 'production') {
      const localPath = path.join(process.cwd(), '.keys', 'firebase-service-account.json');
      if (fs.existsSync(localPath)) {
        const raw = fs.readFileSync(localPath, 'utf8');
        const serviceAccount = JSON.parse(raw);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        initialized = true;
        return;
      }
    }
  } catch {
    // ignore; we'll throw on first method use if nothing worked
  }

  // If we get here, we are NOT initialized. We will throw helpful errors when methods are called.
}

function ensureInitialized(): void {
  if (!initialized && !admin.apps.length) {
    tryInit();
  }
  if (!initialized && !admin.apps.length) {
    const why = [
      'Firebase Admin failed to initialize.',
      'Tried: GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_ADMIN_* (or FIREBASE_*) envs, and ./.keys/firebase-service-account.json (in dev).',
      'Fix one of these:',
      '- Set GOOGLE_APPLICATION_CREDENTIALS to a valid service account JSON path, OR',
      '- Provide FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY (with \\n), OR',
      '- In development, place a JSON key at ./.keys/firebase-service-account.json',
    ].join('\n');
    throw new Error(why);
  }
}

function getAuth() {
  ensureInitialized();
  return admin.auth();
}

function getFirestore() {
  ensureInitialized();
  return admin.firestore();
}

// ========== Public helpers (same surface as before, but safer) ==========
export const firebaseAdmin = {
  // Verify Firebase ID token
  verifyToken: async (token: string) => {
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      return decodedToken;
    } catch {
      throw new Error('Invalid token');
    }
  },

  // Get user by UID
  getUser: async (uid: string) => {
    try {
      const userRecord = await getAuth().getUser(uid);
      return userRecord;
    } catch {
      throw new Error('User not found');
    }
  },

  // Create user profile in Firestore
  createUserProfile: async (uid: string, profileData: any) => {
    try {
      const firestore = getFirestore();
      const userRef = firestore.collection('users').doc(uid);
      const now = admin.firestore.FieldValue.serverTimestamp();
      await userRef.set({
        uid,
        ...profileData,
        createdAt: now,
        updatedAt: now,
      });
      return userRef.id;
    } catch {
      throw new Error('Failed to create user profile');
    }
  },

  // Update user profile
  updateUserProfile: async (uid: string, updateData: any) => {
    try {
      const firestore = getFirestore();
      const userRef = firestore.collection('users').doc(uid);
      await userRef.update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    } catch {
      throw new Error('Failed to update user profile');
    }
  },

  // Get user profile
  getUserProfile: async (uid: string) => {
    try {
      const firestore = getFirestore();
      const userRef = firestore.collection('users').doc(uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        throw new Error('User profile not found');
      }
      return doc.data();
    } catch {
      throw new Error('Failed to get user profile');
    }
  },

  // Express-style middleware (if you ever use API routes with an express wrapper)
  authMiddleware: async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const decodedToken = await firebaseAdmin.verifyToken(token);
      req.user = decodedToken;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  },
};

// Optional named exports if you need direct handles
export const auth = {
  get: () => getAuth(),
};
export const firestore = {
  get: () => getFirestore(),
};

export default admin;