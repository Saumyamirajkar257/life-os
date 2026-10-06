/**
 * @file UserProfileCard.tsx
 * @description Comprehensive profile view card displaying active user details, direct photo upload, preset avatars, and details editor.
 * @module Features/Auth/Components/UserProfileCard
 */

import React, { useState, useRef } from 'react';
import { User, Mail, Shield, CheckCircle2, AlertCircle, LogOut, Edit2, RefreshCw, Copy, Check, Camera, Upload, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PRESET_AVATARS = [
  { id: '1', label: 'Cosmic', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces' },
  { id: '2', label: 'Cyber', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces' },
  { id: '3', label: 'Aurora', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=faces' },
  { id: '4', label: 'Studio', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces' },
  { id: '5', label: 'Minimal', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=faces' },
];

export const UserProfileCard: React.FC = () => {
  const { user, isEmailVerified } = useAuth();
  const { updateUserProfile, resendVerificationEmail, logout, isSubmitting } = useAuthActions();

  const [isEditing, setIsEditing] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName || '');
  const [photoURLInput, setPhotoURLInput] = useState(user?.photoURL || '');
  const [copiedUid, setCopiedUid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 256, 256);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoURLInput(compressed);
          await updateUserProfile(displayNameInput || user.displayName || 'Aura Member', compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPreset = async (url: string) => {
    setPhotoURLInput(url);
    await updateUserProfile(displayNameInput || user.displayName || 'Aura Member', url);
  };

  const handleRemovePhoto = async () => {
    setPhotoURLInput('');
    if (user.uid) localStorage.removeItem(`aura_pfp_${user.uid}`);
    await updateUserProfile(displayNameInput || user.displayName || 'Aura Member', '');
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Profile Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative group">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User Avatar'}
              className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-accent)] shadow-md group-hover:opacity-90 transition-opacity"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] font-semibold text-2xl shadow-inner">
              {(user.displayName || user.email || 'A').slice(0, 2).toUpperCase()}
            </div>
          )}

          {/* Camera upload overlay button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title="Upload profile picture"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
              {user.displayName || 'Aura Member'}
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

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline font-mono cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Change PFP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Avatar Fast Switcher */}
      <div className="space-y-2 pt-1 border-t border-[var(--color-border)]/60">
        <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[var(--color-accent)]" /> Choose a Photo or Preset PFP:
          </span>
          {user.photoURL && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Remove PFP
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full border border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-white transition-all shrink-0 cursor-pointer"
            title="Upload custom image"
          >
            <Upload className="w-4 h-4" />
          </button>
          {PRESET_AVATARS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.url)}
              className="relative w-12 h-12 rounded-full overflow-hidden border-2 hover:scale-105 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all shrink-0 cursor-pointer"
              title={preset.label}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
            </button>
          ))}
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
