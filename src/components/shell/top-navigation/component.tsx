/**
 * @file component.tsx
 * @description Sticky Desktop Top Navigation header with Breadcrumbs, Global Search, Notifications, Profile, and Quick Actions.
 * @module AuraShell/TopNavigation/Component
 */

import React, { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Breadcrumbs } from '@/components/composite/breadcrumbs';
import { CommandTrigger } from '../command-trigger';
import { NotificationTrigger } from '../notification-trigger';
import { ProfileTrigger } from '../profile-trigger';
import { QuickActions } from '@/components/composite/quick-actions';
import { NotificationCenter } from '@/components/composite/notification-center';
import { ProfileMenu } from '@/components/composite/profile-menu';
import { ThemeSwitcher } from '@/components/composite/theme-switcher';
import { AmbientControlsPopover } from '@/components/ambient/AmbientControlsPopover';
import { Tooltip } from '@/components/ui/tooltip';
import { Popover } from '@/components/ui/popover';
import { getCurrentUserStub } from '@/lib/firebase';
import { TopNavigationProps } from './types';

export const TopNavigation: React.FC<TopNavigationProps> = ({
  breadcrumbs,
  onBreadcrumbClick,
  showSidebarToggle = true,
  showWindowSafeSpacing = false,
  title = 'Aura Core',
  rightActions,
  centerContent,
  quickActions,
  className,
  sticky = true,
}) => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { notifications } = useNotificationStore();
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);

  const stubUser = getCurrentUserStub();
  const userProfile = stubUser ? {
    name: stubUser.displayName || 'Aura User',
    email: stubUser.email || '',
    avatarUrl: stubUser.photoURL || undefined,
    status: 'online' as const,
  } : {
    name: 'Guest Mode',
    email: 'Local session only',
    avatarUrl: undefined,
    status: 'offline' as const,
  };

  const defaultBreadcrumbItems = breadcrumbs || [
    { id: 'home', label: 'Aura OS', onClick: () => onBreadcrumbClick?.({ id: 'home', label: 'Aura OS' }) },
    { id: 'current', label: 'Overview', onClick: () => onBreadcrumbClick?.({ id: 'current', label: 'Overview' }) },
  ];

  const formattedNotifications = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.message,
    time: 'Just now',
    isRead: false,
    type: n.type,
  }));

  return (
    <header
      className={cn(
        'h-14 bg-transparent px-4 sm:px-6 flex items-center justify-between gap-4 z-30 select-none transition-all border-b border-[var(--color-border)]/20',
        sticky ? 'sticky top-0' : 'relative',
        showWindowSafeSpacing ? 'pl-20' : '',
        className
      )}
    >
      {/* Left Section: Sidebar Toggle & Breadcrumbs/Title */}
      <div className="flex items-center gap-3 min-w-0">
        {showSidebarToggle && (
          <Tooltip content={isCollapsed ? 'Expand Sidebar (⌘B)' : 'Collapse Sidebar (⌘B)'}>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[var(--color-accent)]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        )}

        <div className="min-w-0 flex items-center">
          {defaultBreadcrumbItems.length > 0 ? (
            <Breadcrumbs items={defaultBreadcrumbItems} />
          ) : (
            <span className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Center Section: Search / Command Trigger or Custom */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md">
        {centerContent || <CommandTrigger variant="default" placeholder="Search or type a command..." />}
      </div>

      {/* Right Section: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="md:hidden">
          <CommandTrigger variant="compact" />
        </div>

        {quickActions && quickActions.length > 0 && (
          <div className="hidden sm:block">
            <QuickActions actions={quickActions} layout="bar" />
          </div>
        )}

        <ThemeSwitcher variant="dropdown" />

        <AmbientControlsPopover />

        {/* Notification Popover */}
        <Popover
          isOpen={showNotificationsPopover}
          onOpenChange={setShowNotificationsPopover}
          placement="bottom"
          trigger={
            <NotificationTrigger onClick={() => setShowNotificationsPopover(!showNotificationsPopover)} />
          }
          content={
            <div className="w-80 sm:w-96 p-2">
              <NotificationCenter notifications={formattedNotifications} />
            </div>
          }
        />

        {/* Profile Trigger & Menu */}
        <div className="pl-1 border-l border-[var(--color-border)]/60">
          <ProfileMenu user={userProfile} />
        </div>

        {rightActions}
      </div>
    </header>
  );
};
