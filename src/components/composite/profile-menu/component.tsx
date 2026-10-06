/**
 * @file component.tsx
 * @description Composite ProfileMenu with avatar, account status, quick theme controls, settings, and account actions.
 * @module AuraComposite/ProfileMenu/Component
 */

import React from 'react';
import { Settings, Sliders, LogOut, Sun, Moon, Palette, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dropdown } from '@/components/ui/dropdown';
import { useTheme } from '@/hooks/use-theme';
import { ProfileMenuProps } from './types';

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onOpenPreferences,
  onOpenSettings,
  onLogout,
  customActions = [],
  className,
}) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  const trigger = (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition-all cursor-pointer shadow-2xs',
        className
      )}
    >
      <Avatar
        src={user.avatarUrl}
        name={user.name}
        size="sm"
        status={user.status || 'online'}
      />
      <div className="hidden sm:flex flex-col text-left leading-tight">
        <span className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-[120px]">
          {user.name}
        </span>
        {user.email && (
          <span className="text-[10px] text-[var(--color-text-muted)] font-mono truncate max-w-[120px]">
            {user.email}
          </span>
        )}
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
    </button>
  );

  const menuItems = [
    ...(onOpenPreferences ? [{ id: 'preferences', label: 'Preferences', icon: <Sliders className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />, onClick: onOpenPreferences }] : []),
    ...(onOpenSettings ? [{ id: 'settings', label: 'Account Settings', icon: <Settings className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />, onClick: onOpenSettings }] : []),
    ...customActions.map((act) => ({ id: act.id, label: act.label, icon: act.icon, onClick: act.onClick })),
    ...(onLogout ? [{ id: 'logout', label: 'Log out', icon: <LogOut className="w-3.5 h-3.5" />, isDanger: true, onClick: onLogout }] : []),
  ];

  return (
    <Dropdown
      trigger={trigger}
      align="right"
      items={menuItems}
    />
  );
};
