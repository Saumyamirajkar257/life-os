/**
 * @file ProfilePage.tsx
 * @description User profile management view displaying security credentials, role, and profile editor.
 * @module Features/Auth/Pages/ProfilePage
 */

import React from 'react';
import { Shield, ArrowLeft, Camera } from 'lucide-react';
import { UserProfileCard } from '../components/UserProfileCard';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/button';

export const ProfilePage: React.FC = () => {
  const { user, navigateToPage } = useAuth();
  const { loginWithGoogle, loginWithApple, isSubmitting } = useAuthActions();

  const [guestPfp, setGuestPfp] = React.useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('aura_pfp_guest') : null
  );
  const [guestName, setGuestName] = React.useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('aura_guest_displayName') : null
  );
  const guestFileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleSync = () => {
      setGuestPfp(localStorage.getItem('aura_pfp_guest'));
      setGuestName(localStorage.getItem('aura_guest_displayName'));
    };
    window.addEventListener('aura_profile_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('aura_profile_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleGuestAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('aura_pfp_guest', dataUrl);
        setGuestPfp(dataUrl);
        window.dispatchEvent(new Event('aura_profile_updated'));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-bg)] p-4 sm:p-6 md:p-8 space-y-6">
      <input
        ref={guestFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleGuestAvatarUpload}
        className="hidden"
      />
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
            <div className="relative group">
              {guestPfp ? (
                <img
                  src={guestPfp}
                  alt="Guest Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-accent)] shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-semibold text-2xl shadow-inner">
                  {(guestName || 'GU').slice(0, 2).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => guestFileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                title="Upload custom avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-xl font-medium text-[var(--color-text-primary)]">
                {guestName || 'Guest User'}
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

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <SocialAuthButton
                provider="google"
                onClick={loginWithGoogle}
                isLoading={isSubmitting}
                label="Sign in with Google"
              />
              <SocialAuthButton
                provider="apple"
                onClick={loginWithApple}
                isLoading={isSubmitting}
                label="Sign in with Apple"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <Button
                type="button"
                variant="primary"
                onClick={() => navigateToPage('login')}
                className="w-full h-10"
              >
                Sign In with Email
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigateToPage('signup')}
                className="w-full h-10"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
