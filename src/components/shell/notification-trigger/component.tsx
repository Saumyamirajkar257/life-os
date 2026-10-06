/**
 * @file component.tsx
 * @description Notification Bell trigger for the Aura Desktop Shell with live unread badge.
 * @module AuraShell/NotificationTrigger/Component
 */

import React from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Tooltip } from '@/components/ui/tooltip';
import { NotificationTriggerProps } from './types';

export const NotificationTrigger: React.FC<NotificationTriggerProps> = ({
  unreadCount: customUnreadCount,
  onClick,
  icon,
  hideBadgeOnZero = true,
  className,
  disabled = false,
}) => {
  const { notifications } = useNotificationStore();

  const count = customUnreadCount !== undefined ? customUnreadCount : notifications.length;
  const hasUnread = count > 0;

  return (
    <Tooltip content={hasUnread ? `${count} notification${count > 1 ? 's' : ''}` : 'Notification Center'}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={`Notifications${hasUnread ? `, ${count} unread` : ''}`}
        className={cn(
          'relative p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        {icon || <Bell className="w-4 h-4 text-[var(--color-text-primary)]" />}

        <AnimatePresence>
          {hasUnread && (!hideBadgeOnZero || count > 0) && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[var(--color-accent)] text-[var(--color-accent-contrast,white)] text-[10px] font-bold font-mono rounded-full flex items-center justify-center shadow-xs border-2 border-[var(--color-surface)] leading-none"
            >
              {count > 99 ? '99+' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </Tooltip>
  );
};
