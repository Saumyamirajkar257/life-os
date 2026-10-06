/**
 * @file types.ts
 * @description Types for the ProfileTrigger component.
 * @module AuraShell/ProfileTrigger/Types
 */

export interface ProfileUser {
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface ProfileTriggerProps {
  /** User details */
  user?: ProfileUser;

  /** Display mode */
  variant?: 'compact' | 'full';

  /** Click handler */
  onClick?: () => void;

  /** Additional class names */
  className?: string;

  /** Disabled state */
  disabled?: boolean;
}
