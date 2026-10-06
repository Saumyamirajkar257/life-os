/**
 * @file types.ts
 * @description Types and interfaces for Aura Auth module.
 * @module Features/Auth/Types
 */

import { AuraUserStub } from '@/lib/firebase/auth';

export type AuthPageMode = 'login' | 'signup' | 'forgot-password' | 'verify-email' | 'unauthorized' | 'profile';

export interface AuthUser extends AuraUserStub {
  role?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  emailSent: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  currentPage: AuthPageMode;
  navigateToPage: (page: AuthPageMode) => void;
  reloadUser: () => Promise<void>;
}
