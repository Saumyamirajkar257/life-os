/**
 * @file QuickActionsBar.tsx
 * @description Quick Actions bar component providing instant triggers for Command Palette (⌘K) and Notification Center.
 * @module Features/Productivity/Components/QuickActions/QuickActionsBar
 */

import React from 'react';
import { Search, Bell, Sparkles, Command } from 'lucide-react';
import { useProductivityStore } from '../../stores/useProductivityStore';

export const QuickActionsBar: React.FC = () => {
  const { toggleCommandPalette, toggleNotificationCenter, notifications } = useProductivityStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex items-center gap-2" id="quick-actions-bar">
      {/* Command Palette Trigger */}
      <button
        onClick={toggleCommandPalette}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-900/80 border border-neutral-800 rounded-lg hover:text-neutral-200 hover:border-neutral-700 transition-colors shadow-sm"
        title="Search & Command Palette (⌘K)"
        id="quick-action-command-trigger"
      >
        <Search className="w-3.5 h-3.5 text-neutral-400" />
        <span className="hidden sm:inline">Search & Commands</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-neutral-800 border border-neutral-700/60 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Notification Trigger */}
      <button
        onClick={toggleNotificationCenter}
        className="relative p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-900/80 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
        title="Notifications"
        id="quick-action-notification-trigger"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-neutral-950 font-mono">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
