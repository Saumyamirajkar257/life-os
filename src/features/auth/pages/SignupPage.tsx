/**
 * @file SignupPage.tsx
 * @description User registration page with display name, email, password validation, and terms agreement check.
 * @module Features/Auth/Pages/SignupPage
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SignupPage: React.FC = () => {
  const { error, navigateToPage, setError } = useAuth();
  const { signupWithEmail, loginWithGoogle, isSubmitting } = useAuthActions();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    await signupWithEmail(email, password, displayName);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register your identity to initialize personalized Aura Life OS workspace."
    >
      <div className="space-y-5">
        {/* Social Registration */}
        <SocialAuthButton
          onClick={loginWithGoogle}
          isLoading={isSubmitting}
          label="Sign up with Google"
        />

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative px-3 bg-[var(--color-surface)] text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
            or register with email
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
            type="text"
            label="Full Name / Display Name"
            placeholder="Alex Vance"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-[var(--color-text-muted)]" />}
            required
          />

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

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password (min 6 characters)"
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
            autoComplete="new-password"
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-[var(--color-text-muted)]" />}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full h-11 text-sm font-medium gap-2 mt-2"
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-2 text-xs text-[var(--color-text-secondary)]">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => navigateToPage('login')}
            className="font-medium text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
