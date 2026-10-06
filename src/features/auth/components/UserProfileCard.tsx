/**
 * @file UserProfileCard.tsx
 * @description Comprehensive profile view card displaying active user details, email verification status, and profile editor modal/form.
 * @module Features/Auth/Components/UserProfileCard
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, CheckCircle2, AlertCircle, LogOut, Edit2, RefreshCw, Copy, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const UserProfileCard: React.FC = () => {
  const { user, isEmailVerified } = useAuth();
  const { updateUserProfile, resendVerificationEmail, logout, isSubmitting } = useAuthActions();

  const [isEditing, setIsEditing] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName || '');
  const [photoURLInput, setPhotoURLInput] = useState(user?.photoURL || '');
  const [copiedUid, setCopiedUid] = useState(false);

  if (!user) return null;

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateUserProfile(displayNameInput, photoURLInput);
    if (ok) {
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Profile Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Avatar'}
              className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-accent)] shadow-md"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] font-semibold text-2xl shadow-inner">
              {(user.displayName || user.email || 'A').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="absolute bottom-0 right-0 p-1 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)]">
            {isEmailVerified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
              {user.displayName || 'Aura User'}
            </h2>
          </div>

          <p className="text-xs font-mono text-[var(--color-text-secondary)] flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span>{user.email || 'No email associated'}</span>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px]">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono ${
                isEmailVerified
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {isEmailVerified ? 'Email Verified' : 'Unverified Email'}
            </span>

            {!isEmailVerified && (
              <button
                type="button"
                onClick={resendVerificationEmail}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline font-mono cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>Resend Link</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unique ID & Meta */}
      <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 flex items-center justify-between gap-2 text-[11px] font-mono">
        <div className="truncate">
          <span className="text-[var(--color-text-muted)]">Firebase UID: </span>
          <span className="text-[var(--color-text-primary)] select-all">{user.uid}</span>
        </div>
        <button
          type="button"
          onClick={handleCopyUid}
          className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors shrink-0 cursor-pointer"
          title="Copy UID"
        >
          {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Edit Profile Form or View Controls */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="space-y-4 pt-2 border-t border-[var(--color-border)]"
        >
          <div className="space-y-3">
            <Input
              label="Display Name"
              value={displayNameInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayNameInput(e.target.value)}
              placeholder="e.g. Alex Vance"
              required
            />
            <Input
              label="Avatar Photo URL (Optional)"
              value={photoURLInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhotoURLInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Profile
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setDisplayNameInput(user.displayName || '');
              setPhotoURLInput(user.photoURL || '');
              setIsEditing(true);
            }}
            className="gap-2"
          >
            <Edit2 className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Edit Details</span>
          </Button>

          <Button type="button" variant="ghost" size="sm" onClick={logout} isLoading={isSubmitting} className="text-rose-400 hover:text-rose-300 gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      )}
    </div>
  );
};
