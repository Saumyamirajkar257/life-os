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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const mapped = mapFirebaseUser(firebaseUser);
        const customPfp = typeof window !== 'undefined' ? localStorage.getItem(`aura_pfp_${firebaseUser.uid}`) : null;
        setUser(mapped ? { ...mapped, photoURL: customPfp || mapped.photoURL } : null);

        // Synchronize all domain stores with authenticated user UID
        try {
          const uid = firebaseUser.uid;
          const [
            { useTaskStore },
            { useHabitStore },
            { useGoalStore },
            { useJournalStore },
            { useCalendarStore },
            { useFinanceStore },
          ] = await Promise.all([
            import('@/features/tasks/stores/useTaskStore'),
            import('@/features/habits/stores/useHabitStore'),
            import('@/features/goals/stores/useGoalStore'),
            import('@/features/journal/stores/useJournalStore'),
            import('@/features/calendar/stores/useCalendarStore'),
            import('@/features/finance/stores/useFinanceStore'),
          ]);

          useTaskStore.getState().initializeStore(uid);
          useHabitStore.getState().initializeHabits(uid);
          useGoalStore.getState().loadGoals(uid);
          useJournalStore.getState().loadModuleData(uid);
          useCalendarStore.getState().loadEvents(uid);
          useFinanceStore.getState().loadModuleData(uid);
        } catch (e) {
          console.warn('[AuthProvider] Error initializing stores for user:', e);
        }
      } else {
        setUser(null);
        // Purge private user data from memory and localStorage upon sign out
        try {
          const [
            { useTaskStore },
            { useHabitStore },
            { useGoalStore },
            { useJournalStore },
            { useCalendarStore },
            { useFinanceStore },
          ] = await Promise.all([
            import('@/features/tasks/stores/useTaskStore'),
            import('@/features/habits/stores/useHabitStore'),
            import('@/features/goals/stores/useGoalStore'),
            import('@/features/journal/stores/useJournalStore'),
            import('@/features/calendar/stores/useCalendarStore'),
            import('@/features/finance/stores/useFinanceStore'),
          ]);

          useTaskStore.setState({ tasks: [], isSyncedWithFirestore: false });
          useHabitStore.setState({ habits: [], logs: [], isSyncedWithFirestore: false });
          useGoalStore.setState({ goals: [], projects: [], milestones: [] });
          useJournalStore.setState({ journals: [], notes: [], folders: [], tags: [] });
          useCalendarStore.setState({ events: [] });
          useFinanceStore.setState({ accounts: [], transactions: [], budgets: [], bills: [], savingsGoals: [] });

          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('aura-goals-storage');
            localStorage.removeItem('aura-journal-storage');
            localStorage.removeItem('aura-calendar-storage');
            localStorage.removeItem('aura-finance-storage');
            localStorage.removeItem('aura-planner-storage');
          }
        } catch (e) {
          console.warn('[AuthProvider] Error clearing stores on signout:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      if (auth.currentUser) {
        const mapped = mapFirebaseUser(auth.currentUser);
        const customPfp = typeof window !== 'undefined' ? localStorage.getItem(`aura_pfp_${auth.currentUser.uid}`) : null;
        setUser(mapped ? { ...mapped, photoURL: customPfp || mapped.photoURL } : null);
      }
    };
    window.addEventListener('aura_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('aura_profile_updated', handleProfileUpdate);
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
      const customPfp = typeof window !== 'undefined' ? localStorage.getItem(`aura_pfp_${auth.currentUser.uid}`) : null;
      setUser(mapped ? { ...mapped, photoURL: customPfp || mapped.photoURL } : null);
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
