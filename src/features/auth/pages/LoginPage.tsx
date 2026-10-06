/**
 * @file LoginPage.tsx
 * @description Email/Password and Google OAuth authentication login view with accessible form fields and error alerts.
 * @module Features/Auth/Pages/LoginPage
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LoginPage: React.FC = () => {
  const { error, navigateToPage } = useAuth();
  const { loginWithEmail, loginWithGoogle, isSubmitting } = useAuthActions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await loginWithEmail(email, password);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Aura Life OS account to access system controls."
    >
      <div className="space-y-5">
        {/* Social Authentication */}
        <SocialAuthButton
          onClick={loginWithGoogle}
          isLoading={isSubmitting}
          label="Sign in with Google"
        />

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative px-3 bg-[var(--color-surface)] text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
            or continue with email
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono leading-relaxed">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="architect@auracore.io"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-[var(--color-text-muted)]" />}
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-[var(--color-text-muted)]" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => navigateToPage('forgot-password')}
                className="text-xs font-mono text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full h-11 text-sm font-medium gap-2 mt-2"
          >
            <span>Authenticate</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-2 text-xs text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigateToPage('signup')}
            className="font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
