/**
 * @file AuthContext.tsx
 * @description React Context Provider for Firebase Authentication state management, active route view state, and session sync.
 * @module Features/Auth/Context
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { onAuthStateChanged, reload } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { mapFirebaseUser } from '@/lib/firebase/auth';
import { AuthContextType, AuthUser, AuthPageMode } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialPage?: AuthPageMode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialPage = 'login' }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<AuthPageMode>(initialPage);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mapped = mapFirebaseUser(firebaseUser);
        setUser(mapped ? { ...mapped } : null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const navigateToPage = useCallback((page: AuthPageMode) => {
    setError(null);
    setCurrentPage(page);
  }, []);

  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      const mapped = mapFirebaseUser(auth.currentUser);
      setUser(mapped ? { ...mapped } : null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        clearError,
        currentPage,
        navigateToPage,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider.');
  }
  return context;
}
