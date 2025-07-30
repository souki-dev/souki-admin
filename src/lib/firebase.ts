import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is valid
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.apiKey !== 'placeholder' &&
    firebaseConfig.authDomain !== 'your_project_id.firebaseapp.com'
  );
};

// Initialize Firebase only if config is valid
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigValid()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    storageInstance = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

// Helper functions with null checks
export const getAuthInstance = (): Auth => {
  if (!authInstance) {
    throw new Error('Firebase Auth not initialized. Please check your Firebase configuration.');
  }
  return authInstance;
};

export const getDbInstance = (): Firestore => {
  if (!dbInstance) {
    throw new Error('Firestore not initialized. Please check your Firebase configuration.');
  }
  return dbInstance;
};

export const getStorageInstance = (): FirebaseStorage => {
  if (!storageInstance) {
    throw new Error('Firebase Storage not initialized. Please check your Firebase configuration.');
  }
  return storageInstance;
};

// Export the instances for backward compatibility (but they can be null)
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export default app;
