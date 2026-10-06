/**
 * @file ForgotPasswordPage.tsx
 * @description Password recovery page dispatching reset emails via Firebase Auth.
 * @module Features/Auth/Pages/ForgotPasswordPage
 */

import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ForgotPasswordPage: React.FC = () => {
  const { error, navigateToPage } = useAuth();
  const { resetPassword, isSubmitting } = useAuthActions();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = await resetPassword(email);
    if (ok) {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your account email to receive a password recovery link."
    >
      <div className="space-y-5">
        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono leading-relaxed">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                If an account exists for <span className="font-mono font-semibold text-[var(--color-text-primary)]">{email}</span>, you will receive password reset instructions shortly.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigateToPage('login')}
              className="w-full mt-2"
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Account Email"
              placeholder="architect@auracore.io"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-[var(--color-text-muted)]" />}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full h-11 text-sm font-medium gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Recovery Link</span>
            </Button>
          </form>
        )}

        {/* Return Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigateToPage('login')}
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
