/**
 * @file VerifyEmailPage.tsx
 * @description Email verification notice and status check page.
 * @module Features/Auth/Pages/VerifyEmailPage
 */

import React, { useState } from 'react';
import { Mail, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';

export const VerifyEmailPage: React.FC = () => {
  const { user, isEmailVerified, reloadUser, navigateToPage, error } = useAuth();
  const { resendVerificationEmail, isSubmitting } = useAuthActions();

  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    await reloadUser();
    setChecking(false);
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Complete your profile initialization by confirming your email address."
    >
      <div className="space-y-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-accent)] mx-auto flex items-center justify-center shadow-inner">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-primary)]">
            A verification message was dispatched to:
          </p>
          <div className="p-2.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-mono text-xs font-semibold text-[var(--color-text-primary)] select-all truncate">
            {user?.email || 'Your registered email address'}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono leading-relaxed text-left">
            {error}
          </div>
        )}

        {isEmailVerified ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Email Verified Successfully!</span>
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={() => navigateToPage('profile')}
              className="w-full"
            >
              Continue to Workspace
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              onClick={handleCheckStatus}
              isLoading={checking}
              className="w-full h-11 gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>I've Verified My Email</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={resendVerificationEmail}
              isLoading={isSubmitting}
              className="w-full h-11 gap-2 text-xs font-mono"
            >
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Resend Verification Email</span>
            </Button>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigateToPage('login')}
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
