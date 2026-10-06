/**
 * @file component.tsx
 * @description Sticky Desktop Top Navigation header with Breadcrumbs, Global Search, Notifications, Profile, and Quick Actions.
 * @module AuraShell/TopNavigation/Component
 */

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
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
  const { isCollapsed, toggleSidebar, setActiveSection } = useSidebarStore();
  const { notifications } = useNotificationStore();
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const { user, navigateToPage } = useAuth();
  const { logout, loginWithGoogle, updateUserProfile } = useAuthActions();

  const [guestPfp, setGuestPfp] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('aura_pfp_guest') : null
  );
  const [guestName, setGuestName] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('aura_guest_displayName') : null
  );

  useEffect(() => {
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

  const userProfile = user
    ? {
        name: user.displayName || user.email?.split('@')[0] || 'Aura Member',
        email: user.email || '',
        avatarUrl: user.photoURL || undefined,
        status: 'online' as const,
        isLoggedIn: true,
      }
    : {
        name: guestName || 'Guest User',
        email: 'Click to Sign In',
        avatarUrl: guestPfp || undefined,
        status: 'away' as const,
        isLoggedIn: false,
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
        'h-14 bg-[var(--color-surface)]/60 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 z-30 select-none transition-shadow border-b border-[var(--color-border)]/20 shadow-[var(--spatial-shadow-ambient)] transform-gpu',
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
          <ProfileMenu
            user={userProfile}
            onOpenProfile={() => {
              setActiveSection('user-profile');
              navigateToPage('profile');
            }}
            onOpenSettings={() => setActiveSection('settings')}
            onOpenLogin={() => {
              setActiveSection('user-profile');
              navigateToPage('login');
            }}
            onGoogleLogin={loginWithGoogle}
            onUploadPfp={async (dataUrl) => {
              await updateUserProfile(user?.displayName || guestName || 'Aura Member', dataUrl);
            }}
            onLogout={user ? logout : undefined}
          />
        </div>

        {rightActions}
      </div>
    </header>
  );
};
