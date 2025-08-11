import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Social providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Authentication functions
export const firebaseAuth = {
  // Social sign-in
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signInWithFacebook: () => signInWithPopup(auth, facebookProvider),
  signInWithTwitter: () => signInWithPopup(auth, twitterProvider),
  
  // Email/password authentication
  signInWithEmail: (email: string, password: string) => 
    signInWithEmailAndPassword(auth, email, password),
  
  signUpWithEmail: (email: string, password: string) => 
    createUserWithEmailAndPassword(auth, email, password),
  
  // Sign out
  signOut: () => signOut(auth),
  
  // Auth state observer
  onAuthStateChanged: (callback: (user: User | null) => void) => 
    onAuthStateChanged(auth, callback),
  
  // Get current user
  getCurrentUser: () => auth.currentUser,
  
  // Providers
  providers: {
    google: googleProvider,
    facebook: facebookProvider,
    twitter: twitterProvider
  }
};

export { auth, googleProvider, facebookProvider, twitterProvider };
export default app;