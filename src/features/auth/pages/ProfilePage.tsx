/**
 * @file ProfilePage.tsx
 * @description User profile management view displaying security credentials, role, and profile editor.
 * @module Features/Auth/Pages/ProfilePage
 */

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { UserProfileCard } from '../components/UserProfileCard';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';

export const ProfilePage: React.FC = () => {
  const { user, navigateToPage } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg)] p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Bar */}
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateToPage('login')}
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Auth Portal Home</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-accent)]">
          <Shield className="w-3 h-3" />
          <span>{user ? 'Active Session' : 'Guest Mode (Local)'}</span>
        </div>
      </div>

      {user ? (
        <UserProfileCard />
      ) : (
        <div className="w-full max-w-xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-semibold text-2xl shadow-inner">
              GS
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
                Guest User
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Local-first offline session
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Local Storage Active
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 text-xs text-[var(--color-text-secondary)] leading-relaxed space-y-2">
            <p>
              You are currently using Aura Life OS in <strong>Guest Mode</strong>. Your habits, tasks, calendar entries, and notes are saved directly to this browser and device.
            </p>
            <p className="text-[var(--color-text-tertiary)]">
              Sign in or create an account to enable encrypted cloud backup, multi-device synchronization, and remote data recovery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigateToPage('login')}
              className="w-full sm:flex-1 h-10"
            >
              Sign In to Aura
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigateToPage('signup')}
              className="w-full sm:flex-1 h-10"
            >
              Create Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
