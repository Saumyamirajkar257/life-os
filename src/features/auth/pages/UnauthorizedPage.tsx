/**
 * @file UnauthorizedPage.tsx
 * @description View displayed when attempting to access restricted routes without valid authentication or email verification.
 * @module Features/Auth/Pages/UnauthorizedPage
 */

import React from 'react';
import { ShieldAlert, LogIn, UserPlus, Mail } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '@/components/ui/button';

interface UnauthorizedPageProps {
  reason?: 'unauthenticated' | 'unverified' | 'forbidden';
  onLoginRedirect?: () => void;
  onVerifyRedirect?: () => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  reason = 'unauthenticated',
  onLoginRedirect,
  onVerifyRedirect,
}) => {
  const isUnverified = reason === 'unverified';

  return (
    <AuthLayout
      title={isUnverified ? 'Email Verification Required' : 'Sign In Required'}
      subtitle={
        isUnverified
          ? 'Please verify your email address to continue.'
          : 'Sign in to access your personal workspace and cloud sync.'
      }
      badge={isUnverified ? 'Verification' : 'Authentication'}
    >
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
          {isUnverified
            ? 'Please verify your email address via the link sent to your inbox before proceeding.'
            : 'Please sign in to access this area of your workspace.'}
        </div>

        <div className="space-y-3">
          {isUnverified ? (
            <Button
              type="button"
              variant="primary"
              onClick={onVerifyRedirect}
              className="w-full h-11 gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Verify Email Now</span>
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                type="button"
                variant="primary"
                onClick={onLoginRedirect}
                className="w-full h-11 gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
