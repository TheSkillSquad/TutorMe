// Authentication utilities for Netlify Functions
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Initialize Firebase Admin
let firebaseAdmin = null;

const initializeFirebase = () => {
  if (!firebaseAdmin) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  return firebaseAdmin;
};

class AuthHelper {
  static async verifyToken(token) {
    try {
      const admin = initializeFirebase();
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async getUser(uid) {
    try {
      const admin = initializeFirebase();
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      throw new Error('User not found');
    }
  }

  static async createUser(userData) {
    try {
      const admin = initializeFirebase();
      const userRecord = await admin.auth().createUser(userData);
      return userRecord;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  static async updateUser(uid, userData) {
    try {
      const admin = initializeFirebase();
      const userRecord = await admin.auth().updateUser(uid, userData);
      return userRecord;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  static generateJWT(payload) {
    return jwt.sign(payload, process.env.NEXTAUTH_SECRET, { expiresIn: '7d' });
  }

  static verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.NEXTAUTH_SECRET);
    } catch (error) {
      throw new Error('Invalid JWT');
    }
  }

  static extractTokenFromHeader(event) {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  static async authenticateRequest(event) {
    const token = this.extractTokenFromHeader(event);
    if (!token) {
      throw new Error('No token provided');
    }
    
    return await this.verifyToken(token);
  }
}

module.exports = AuthHelper;