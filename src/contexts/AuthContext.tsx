'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, getAuthInstance } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminEmail = useCallback((email: string) => {
    return ADMIN_EMAILS.includes(email);
  }, []);

  const createUserFromFirebaseUser = useCallback(async (firebaseUser: FirebaseUser): Promise<User> => {
    const isAdmin = isAdminEmail(firebaseUser.email || '');
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      isAdmin,
    };
  }, [isAdminEmail]);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Check if user is admin
          if (!isAdminEmail(firebaseUser.email || '')) {
            const authInstance = getAuthInstance();
            await firebaseSignOut(authInstance);
            setUser(null);
            setLoading(false);
            return;
          }

          const userData = await createUserFromFirebaseUser(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [createUserFromFirebaseUser, isAdminEmail]);

  const signIn = async (email: string, password: string) => {
    const authInstance = getAuthInstance();
    if (!isAdminEmail(email)) {
      throw new Error('Access denied. Admin privileges required.');
    }
    await signInWithEmailAndPassword(authInstance, email, password);
  };

  const signInWithGoogle = async () => {
    const authInstance = getAuthInstance();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(authInstance, provider);
    
    if (!isAdminEmail(result.user.email || '')) {
      await firebaseSignOut(authInstance);
      throw new Error('Access denied. Admin privileges required.');
    }
  };

  const signOut = async () => {
    const authInstance = getAuthInstance();
    await firebaseSignOut(authInstance);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
