/**
 * @file component.tsx
 * @description Profile Trigger component for top navigation and desktop header.
 * @module AuraShell/ProfileTrigger/Component
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';
import { getCurrentUserStub } from '@/lib/firebase';
import { ProfileTriggerProps } from './types';

export const ProfileTrigger: React.FC<ProfileTriggerProps> = ({
  user: customUser,
  variant = 'compact',
  onClick,
  className,
  disabled = false,
}) => {
  const stubUser = getCurrentUserStub();
  const user = {
    name: customUser?.name || stubUser?.displayName || 'Aura User',
    email: customUser?.email || stubUser?.email || 'user@auracore.internal',
    avatarUrl: customUser?.avatarUrl || stubUser?.photoURL || undefined,
    role: customUser?.role || 'Architect',
    status: customUser?.status || 'online',
  };

  if (variant === 'compact') {
    return (
      <Tooltip content={`${user.name} (${user.role || 'Member'})`}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={`Open Profile Menu for ${user.name}`}
          className={cn(
            'group relative p-1 rounded-xl hover:bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
        >
          <Avatar src={user.avatarUrl} name={user.name} size="sm" status={user.status} />
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Open Profile Menu for ${user.name}`}
      className={cn(
        'group flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl bg-[var(--color-surface-elevated)]/40 hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 hover:border-[var(--color-border)] transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        className
      )}
    >
      <Avatar src={user.avatarUrl} name={user.name} size="sm" status={user.status} />
      <div className="flex flex-col min-w-0 pr-1">
        <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate max-w-[120px]">
          {user.name}
        </span>
        {user.role && (
          <span className="text-[10px] text-[var(--color-text-muted)] font-mono truncate max-w-[120px]">
            {user.role}
          </span>
        )}
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-transform shrink-0" />
    </button>
  );
};
