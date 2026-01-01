// Firebase configuration
// Replace these values with your Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps > Web app

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type User as FirebaseUser,
  type ConfirmationResult,
  type ApplicationVerifier,
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional: for Analytics
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
}

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Helper to detect mobile devices
const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// ============================================
// Google Auth
// ============================================
export const signInWithGoogle = async () => {
  try {
    // Try popup first (better UX on desktop)
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    // Fallback to redirect on mobile or if popup blocked
    if (firebaseError.code === 'auth/popup-blocked' || isMobile()) {
      await signInWithRedirect(auth, googleProvider);
      return null; // Auth state listener will handle the result
    }
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// ============================================
// Apple Auth
// ============================================
export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'auth/popup-blocked' || isMobile()) {
      await signInWithRedirect(auth, appleProvider);
      return null;
    }
    console.error('Apple sign-in error:', error);
    throw error;
  }
};

// ============================================
// Email/Password Auth
// ============================================
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// ============================================
// Phone Auth
// ============================================
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export const setupRecaptcha = (buttonId: string): ApplicationVerifier => {
  // Clear existing verifier if any
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  
  recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - allow signInWithPhoneNumber
    },
    'expired-callback': () => {
      // Reset reCAPTCHA
      console.log('reCAPTCHA expired');
    },
  });
  
  return recaptchaVerifier;
};

export const sendPhoneVerificationCode = async (
  phoneNumber: string,
  appVerifier: ApplicationVerifier
): Promise<ConfirmationResult> => {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Phone verification error:', error);
    throw error;
  }
};

export const verifyPhoneCode = async (code: string) => {
  if (!confirmationResult) {
    throw new Error('No confirmation result. Please request a new code.');
  }
  
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error('Code verification error:', error);
    throw error;
  }
};

export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  confirmationResult = null;
};

// ============================================
// Redirect Result Handler (for mobile fallback)
// ============================================
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// ============================================
// Sign Out
// ============================================
export const signOut = async () => {
  try {
    clearRecaptcha();
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore helpers
export const createUserDocument = async (user: FirebaseUser) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      hasCompletedOnboarding: false,
      onboarding: null,
      settings: {
        theme: 'light',
        notifications: true,
        reminderTime: '09:00',
      },
    });
  }
  
  return userRef;
};

export const getUserDocument = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Onboarding helpers
export const saveOnboardingData = async (
  userId: string, 
  onboardingData: {
    mindfulnessLevel: number;
    evolutionPath: string | null;
    displayName: string;
    completedAt: Date | null;
  }
) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    onboarding: {
      ...onboardingData,
      completedAt: onboardingData.completedAt ? serverTimestamp() : null,
    },
    hasCompletedOnboarding: true,
    displayName: onboardingData.displayName,
    updatedAt: serverTimestamp(),
  });
};

// Generic Firestore operations
export const firestoreService = {
  // Create
  async create<T extends object>(collectionName: string, data: T, id?: string) {
    const ref = id 
      ? doc(db, collectionName, id)
      : doc(collection(db, collectionName));
    await setDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  // Read one
  async getOne(collectionName: string, id: string) {
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  // Read many by user
  async getByUser(collectionName: string, userId: string) {
    const q = query(
      collection(db, collectionName),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Update
  async update(collectionName: string, id: string, data: object) {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Delete
  async delete(collectionName: string, id: string) {
    const ref = doc(db, collectionName, id);
    await deleteDoc(ref);
  },
};

export default app;
