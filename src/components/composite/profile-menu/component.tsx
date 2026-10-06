/**
 * @file component.tsx
 * @description Composite ProfileMenu with avatar, account status, quick photo upload, settings, and authentication actions.
 * @module AuraComposite/ProfileMenu/Component
 */

import React, { useRef } from 'react';
import { Settings, Sliders, LogOut, LogIn, Camera, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { ProfileMenuProps } from './types';

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onOpenProfile,
  onOpenPreferences,
  onOpenSettings,
  onOpenLogin,
  onGoogleLogin,
  onUploadPfp,
  onLogout,
  customActions = [],
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (dataUrl && onUploadPfp) {
        onUploadPfp(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const trigger = (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center p-1 rounded-full border border-transparent hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] transition-all cursor-pointer group',
        className
      )}
      aria-label={`Open Profile Menu for ${user.name}`}
    >
      <Avatar
        src={user.avatarUrl}
        name={user.name}
        size="sm"
        status={user.status || (user.isLoggedIn ? 'online' : 'away')}
      />
    </button>
  );

  const menuItems = user.isLoggedIn
    ? [
        ...(onOpenProfile
          ? [
              {
                id: 'profile',
                label: 'Profile & Account',
                icon: <User className="w-3.5 h-3.5 text-[var(--color-accent)]" />,
                onClick: onOpenProfile,
              },
            ]
          : []),
        ...(onUploadPfp
          ? [
              {
                id: 'upload-pfp',
                label: 'Change Profile Picture',
                icon: <Camera className="w-3.5 h-3.5 text-emerald-400" />,
                onClick: () => fileInputRef.current?.click(),
              },
            ]
          : []),
        ...(onOpenSettings
          ? [
              {
                id: 'settings',
                label: 'System Settings',
                icon: <Settings className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />,
                onClick: onOpenSettings,
              },
            ]
          : []),
        ...customActions.map((act) => ({ id: act.id, label: act.label, icon: act.icon, onClick: act.onClick })),
        { id: 'divider-1', label: '', isDivider: true, onClick: () => {} },
        ...(onLogout
          ? [
              {
                id: 'logout',
                label: 'Sign Out',
                icon: <LogOut className="w-3.5 h-3.5 text-rose-400" />,
                isDanger: true,
                onClick: onLogout,
              },
            ]
          : []),
      ]
    : [
        ...(onGoogleLogin
          ? [
              {
                id: 'google-login',
                label: 'Sign In with Google',
                icon: <LogIn className="w-3.5 h-3.5 text-[var(--color-accent)]" />,
                onClick: onGoogleLogin,
              },
            ]
          : []),
        ...(onOpenLogin
          ? [
              {
                id: 'open-login',
                label: 'Sign In / Register',
                icon: <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />,
                onClick: onOpenLogin,
              },
            ]
          : []),
        ...(onUploadPfp
          ? [
              {
                id: 'upload-guest-pfp',
                label: 'Set Custom Avatar',
                icon: <Camera className="w-3.5 h-3.5 text-emerald-400" />,
                onClick: () => fileInputRef.current?.click(),
              },
            ]
          : []),
        ...(onOpenSettings
          ? [
              {
                id: 'settings',
                label: 'Preferences',
                icon: <Sliders className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />,
                onClick: onOpenSettings,
              },
            ]
          : []),
        ...customActions.map((act) => ({ id: act.id, label: act.label, icon: act.icon, onClick: act.onClick })),
      ];

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <Dropdown
        trigger={trigger}
        align="right"
        items={menuItems}
      />
    </>
  );
};
