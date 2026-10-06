/**
 * @file useAuth.ts
 * @description Hook to access current authentication state, active user profile, and page navigation.
 * @module Features/Auth/Hooks/UseAuth
 */

import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { user, loading, error, setError, clearError, currentPage, navigateToPage, reloadUser } = useAuthContext();

  return {
    user,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.emailVerified,
    loading,
    error,
    setError,
    clearError,
    currentPage,
    navigateToPage,
    reloadUser,
  };
}
