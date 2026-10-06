/**
 * @file types.ts
 * @description Type definitions for ProfileMenu component.
 * @module AuraComposite/ProfileMenu/Types
 */

import { ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  isLoggedIn?: boolean;
}

export interface ProfileMenuProps {
  user: UserProfile;
  onOpenProfile?: () => void;
  onOpenPreferences?: () => void;
  onOpenSettings?: () => void;
  onOpenLogin?: () => void;
  onGoogleLogin?: () => void;
  onUploadPfp?: (photoUrl: string) => void;
  onLogout?: () => void;
  customActions?: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  }>;
  className?: string;
}
