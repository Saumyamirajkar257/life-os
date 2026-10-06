/**
 * @file ProtectedRoute.tsx
 * @description Guard component checking authentication status and email verification before rendering protected children.
 * @module Features/Auth/Components/ProtectedRoute
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerification = false,
}) => {
  const { user, loading, isEmailVerified, navigateToPage } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[var(--color-text-muted)]">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <UnauthorizedPage reason="unauthenticated" onLoginRedirect={() => navigateToPage('login')} />;
  }

  if (requireEmailVerification && !isEmailVerified) {
    return <UnauthorizedPage reason="unverified" onVerifyRedirect={() => navigateToPage('verify-email')} />;
  }

  return <>{children}</>;
};
